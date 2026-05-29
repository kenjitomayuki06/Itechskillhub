import { pool } from '../../config/db.js';

// 1. Remove password_hash from the function arguments
export async function getUserbyEmailPass(email_address) {
    try {
        // 2. Remove "AND password_hash = ?" from your SQL string entirely
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE email_address = ?`, 
            [email_address]
        );

        // 3. Return the first user found or null if nothing matches
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Error executing login query:", error);
        throw error;
    }
}