import { pool } from "../../config/db.js";

export async function getAllCoursesQuery() {
    try {
        const [result] = await pool.query("SELECT * FROM courses");
        return result;
    } catch (error) {
        console.error("Error fetching all courses:", error);
        throw error;
    }
}