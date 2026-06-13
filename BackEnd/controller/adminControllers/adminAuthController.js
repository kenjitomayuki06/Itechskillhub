import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { pool } from '../../config/db.js';

export const adminLoginController = async (req, res) => {
  try {
    const { email, password, secretCode } = req.body;

    if (!email || !password || !secretCode) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and secret code are required.'
      });
    }

    // Find admin by email
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE email = ? AND is_active = 1',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    const admin = rows[0];

    // Check secret code based on role
    const expectedCode = admin.role === 'super_admin'
      ? process.env.SUPER_ADMIN_SECRET_CODE
      : process.env.ADMIN_SECRET_CODE;

    if (secretCode !== expectedCode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid secret code.'
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.ADMIN_JWT_SECRET || 'admin_secret_key',
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      success: true,
      token,
      admin: {
        id: admin.id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};