    import { pool } from "../../config/db.js";

    export async function addAccountQuery(fullname, email_address, password_hash, role) {
        try {
            // Updated to use your actual database column names
            const [result] = await pool.query(
                `INSERT INTO users (fullname, email_address, password_hash, role) VALUES (?, ?, ?, ?)`,
                [fullname, email_address, password_hash, role]
            );
            return result;
        } catch (error) {
            console.error("Error executing add account query:", error);
            throw error;
        }
    }