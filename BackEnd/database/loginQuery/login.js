import { pool } from "../../config/db.js";

export async function loginQuery() {
    try {
        // [rows] extracts the actual data array from the result
        const [rows] = await pool.query(`SELECT * FROM users`);
        return rows; 
    } catch (error) { 
        console.error("Error executing login query:", error);
        throw error;
    }
}