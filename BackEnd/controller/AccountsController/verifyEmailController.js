import { pool } from "../../config/db.js";

export async function verifyEmailController(req, res) {
    try {
        const { user_id, code } = req.body;

        if (!user_id || !code) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        const [rows] = await pool.query(
            `SELECT * FROM email_verifications 
             WHERE user_id = ? AND token = ? AND expires_at > NOW()`,
            [user_id, code]
        );

        if (rows.length === 0) {
            return res.status(400).json({ 
                message: "Invalid or expired verification code." 
            });
        }

        await pool.query(
            `UPDATE users SET status = 'active' WHERE id = ?`,
            [user_id]
        );

        await pool.query(
            `DELETE FROM email_verifications WHERE user_id = ?`,
            [user_id]
        );

        return res.status(200).json({ 
            message: "Email verified successfully! You can now login.",
            success: true
        });

    } catch (error) {
        console.error("Error in verify email controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}