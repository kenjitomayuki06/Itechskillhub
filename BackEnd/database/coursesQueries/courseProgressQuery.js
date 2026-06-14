import { pool } from "../../config/db.js";

export async function getCourseProgressQuery(student_id, course_id) {
    try {
        const [result] = await pool.query(
            `SELECT 
                p.prog_id, 
                p.student_id, 
                p.course_id, 
                p.completed_lesson, 
                p.current_lesson_id, 
                p.certificate_earned, 
                p.certificate_date, 
                p.created_at
            FROM course_progress p
            WHERE p.student_id = ? AND p.course_id = ?`,
            [student_id, course_id]
        );
        
        return result;
    } catch (error) {
        console.error("Error executing get course progress query:", error);
        throw error;
    }
}