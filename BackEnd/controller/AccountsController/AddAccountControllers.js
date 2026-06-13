import bcrypt from 'bcryptjs';
import { addAccountQuery } from "../../database/AccountQueries/AddAccountQuery.js";
import { pool } from "../../config/db.js";
import { sendVerificationEmail, generateVerificationCode } from "../../services/emailService.js";

export async function addAccountController(req, res) {
    try {
        const { name, email, password, role, gender, age, contact_number, invite_code } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character." 
            });
        }

        if (role === 'instructor') {
            if (!invite_code) {
                return res.status(400).json({ message: "Invite code is required for instructor registration." });
            }
            const [codeRows] = await pool.query(
                `SELECT * FROM invite_codes WHERE code = ? AND is_used = FALSE AND (expires_at IS NULL OR expires_at > NOW())`,
                [invite_code]
            );
            if (codeRows.length === 0) {
                return res.status(400).json({ message: "Invalid or expired invite code." });
            }
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const fullname = name;
        const email_address = email;
        const password_hash = hashedPassword;
        const userRole = role || "student";
        const userGender = gender || "Prefer not to say";
        const userAge = age || null;
        const userContact = contact_number || null;

        const userStatus = userRole === 'instructor' ? 'pending' : 'unverified';

        const result = await addAccountQuery(
            fullname, 
            email_address, 
            password_hash, 
            userRole,
            userGender,
            userAge,
            userContact,
            userStatus
        );

        if (userRole === 'instructor' && invite_code) {
            await pool.query(
                `UPDATE invite_codes SET is_used = TRUE, used_by = ? WHERE code = ?`,
                [result.insertId, invite_code]
            );
        }

        if (userRole === 'student') {
            const code = generateVerificationCode();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            await pool.query(
                `INSERT INTO email_verifications (user_id, token, expires_at) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE token = ?, expires_at = ?`,
                [result.insertId, code, expiresAt, code, expiresAt]
            );

            await sendVerificationEmail(email_address, code);
        }
        
        return res.status(201).json({ 
            message: userRole === 'instructor' 
                ? "Account created! Please wait for admin approval before logging in."
                : "Account created! Please check your email for the verification code.",
            user: { 
                id: result.insertId, 
                name: fullname, 
                email: email_address,
                role: userRole,
                status: userStatus
            } 
        });
    } catch (error) {
        console.error("Error in add account controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}