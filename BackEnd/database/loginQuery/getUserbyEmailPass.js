    import { pool } from '../../config/db.js';

    export async function getUserbyEmailPass(email_address, password_hash) {
        try {
            // Updated to use your actual database column names
            // Inside getUserbyEmailPass.js, change the query to match your database schema
            const [rows] = await pool.query(
                `SELECT * FROM users WHERE email_address = ? AND password_hash = ?`, 
                [email_address, password_hash]
            );

    // CHANGE THIS: Return only the first item (rows[0]) instead of the whole list
    return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error executing login query:", error);
            throw error;
        }
    }