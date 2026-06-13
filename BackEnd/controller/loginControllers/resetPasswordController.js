import { pool } from '../../config/db.js';
import bcrypt from 'bcrypt';

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required.' });
  }

  try {
    // Check if token exists and not expired
    const [rows] = await pool.query(
      `SELECT * FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }

    const { user_id } = rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password
    await pool.query(
      `UPDATE users SET password_hash = ? WHERE id = ?`,
      [hashedPassword, user_id]
    );

    // Delete token after use
    await pool.query(
      `DELETE FROM password_reset_tokens WHERE token = ?`,
      [token]
    );

    return res.status(200).json({ message: 'Password reset successfully.' });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};