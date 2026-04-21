import { pool} from "../../config/db.js"; // Adjust based on your actual db import

export async function getCourseLearningQuery(courseId) {
    const sql = `
        SELECT 
        course_Id,
        title, 
        description, 
        difficulty, 
        thumbnail_url, 
        is_free, 
        created_at 
        FROM courses WHERE course_id = ?;
    `;
    
    const [rows] = await pool.execute(sql, [courseId]);
    return rows;
}