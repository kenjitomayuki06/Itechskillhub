import { pool } from "../../config/db.js";

export async function getUserbyIDQuery(user_id) {
    try {
        // [rows] extracts the actual data array from the result
        const [rows] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [user_id]);
        return rows; 
    } catch (error) { 
        console.error("Error executing login query:", error);
        throw error;
    }
}