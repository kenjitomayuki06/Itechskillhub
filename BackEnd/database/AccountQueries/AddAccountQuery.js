import { pool } from "../../config/db.js";

export async function addAccountQuery(fullname, email_address, password_hash, role, gender, age, contact_number, status) {
    try {
        const [result] = await pool.query(
            `INSERT INTO users (fullname, email_address, password_hash, role, gender, age, contact_number, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [fullname, email_address, password_hash, role, gender, age, contact_number, status]
        );
        return result;
    } catch (error) {
        console.error("Error executing add account query:", error);
        throw error;
    }
}