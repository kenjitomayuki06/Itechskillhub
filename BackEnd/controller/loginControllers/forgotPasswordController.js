import { pool } from '../../config/db.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const [rows] = await pool.query(
  'SELECT id FROM users WHERE email_address = ?',
  [email.toLowerCase()]
);

    // Always return success — don't reveal if email exists (security)
    if (rows.length === 0) {
      return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const user = rows[0];
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await pool.query(
  `INSERT INTO password_reset_tokens (user_id, token, expires_at)
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE token = VALUES(token), expires_at = VALUES(expires_at)`,
  [user.id, token, expiresAt]
);

    const resetLink = `http://localhost:5173/auth/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"ITechSkillsHub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset your ITechSkillsHub password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f9f9fb; border-radius: 16px;">
          <h2 style="color: #1a1a2e;">Reset your password</h2>
          <p style="color: #6b7280;">Click the button below to reset your ITechSkillsHub password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetLink}"
             style="display:inline-block; margin-top:16px; padding:12px 24px; background:#ff7a18; color:#fff; border-radius:8px; text-decoration:none; font-weight:600;">
            Reset Password
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
};