import { Router } from "express";
import { pool } from "../config/db.js";
import crypto from "crypto";

const instructorRouter = Router();

// ── Generate Invite Code (Admin only) ──
instructorRouter.post('/instructor/generate-code', async (req, res) => {
    try {
        const { admin_id } = req.body;
        
        // Generate random code
        const code = 'ITECH-' + crypto.randomBytes(4).toString('hex').toUpperCase();
        
        // Set expiry to 7 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        
        await pool.query(
            `INSERT INTO invite_codes (code, created_by, expires_at) VALUES (?, ?, ?)`,
            [code, admin_id, expiresAt]
        );
        
        return res.status(201).json({ 
            message: "Invite code generated successfully",
            code,
            expires_at: expiresAt
        });
    } catch (error) {
        console.error("Error generating invite code:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ── Validate Invite Code ──
instructorRouter.post('/instructor/validate-code', async (req, res) => {
    try {
        const { code } = req.body;
        
        const [rows] = await pool.query(
            `SELECT * FROM invite_codes WHERE code = ? AND is_used = FALSE AND (expires_at IS NULL OR expires_at > NOW())`,
            [code]
        );
        
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired invite code." });
        }
        
        return res.status(200).json({ message: "Valid invite code.", valid: true });
    } catch (error) {
        console.error("Error validating invite code:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ── Get Pending Instructors ──
instructorRouter.get('/instructor/pending', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, fullname, email_address, created_at FROM users WHERE role = 'instructor' AND status = 'pending'`
        );
        return res.status(200).json({ instructors: rows });
    } catch (error) {
        console.error("Error fetching pending instructors:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ── Approve Instructor ──
instructorRouter.put('/instructor/approve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(
            `UPDATE users SET status = 'active' WHERE id = ? AND role = 'instructor'`,
            [id]
        );
        return res.status(200).json({ message: "Instructor approved successfully." });
    } catch (error) {
        console.error("Error approving instructor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ── Reject Instructor ──
instructorRouter.put('/instructor/reject/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(
            `UPDATE users SET status = 'rejected' WHERE id = ? AND role = 'instructor'`,
            [id]
        );
        return res.status(200).json({ message: "Instructor rejected." });
    } catch (error) {
        console.error("Error rejecting instructor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default instructorRouter;