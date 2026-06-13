import express from "express";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const GOOGLE_CLIENT_ID = "189171075155-39pcjumfbj2io861gg8o28e54jas55e0.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// POST /api/auth/google
router.post("/google", async (req, res) => {
  const { credential, access_token } = req.body;

  try {
    let email, name;

    if (credential) {
      // ── Student flow: Google ID token ──
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name  = payload.name;

    } else if (access_token) {
      // ── Instructor flow: access token ──
      const googleRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      email = googleRes.data.email;
      name  = googleRes.data.name;

    } else {
      return res.status(400).json({ message: "No credential provided." });
    }

    // Check if user exists
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email_address = ?",
      [email]
    );

    let user;

    if (credential) {
      // ── Student flow: must be registered first ──
      if (rows.length === 0) {
        return res.status(403).json({
          message: "No account found. Please register first before using Google login.",
        });
      }

      user = rows[0];

      if (user.status === 'unverified') {
        return res.status(403).json({
          message: "Please verify your email first before logging in.",
        });
      }

    } else {
      // ── Instructor flow: dapat naka-register na ──
      if (rows.length === 0) {
        return res.status(403).json({
          message: "No account found. Please register first using your invite code.",
        });
      }

      user = rows[0];

      if (user.role !== 'instructor') {
        return res.status(403).json({
          message: "Access denied. This portal is for instructors only.",
        });
      }

      // Check kung pending pa
      if (user.status === 'pending') {
        return res.status(200).json({
          success: true,
          status: 'pending',
          user: {
            id: user.id,
            name: user.fullname,
            email: user.email_address,
            role: user.role,
            status: user.status,
          },
        });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email_address, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.fullname,
        email: user.email_address,
        role: user.role,
        status: user.status,
      },
    });

  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(401).json({ message: "Invalid Google token." });
  }
});

export default router;