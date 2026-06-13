import { pool } from "../../config/db.js";
import { sendVerificationEmail, generateVerificationCode } from "../../services/emailService.js";

export async function resendVerificationController(req, res) {
  try {
    const { user_id } = req.body;

    const [users] = await pool.query(
      `SELECT * FROM users WHERE id = ? AND status = 'unverified'`,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found or already verified." });
    }

    const user = users[0];
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO email_verifications (user_id, code, expires_at) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE code = ?, expires_at = ?`,
      [user_id, code, expiresAt, code, expiresAt]
    );

    await sendVerificationEmail(user.email_address, code);

    return res.status(200).json({ message: "Verification code resent successfully." });

  } catch (error) {
    console.error("Error in resend verification controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}