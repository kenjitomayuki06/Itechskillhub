import { pool } from "../../config/db.js";

export async function getCourseProgressQuery(student_id, course_id) {
    try {
        // Fetches the student's progress AND the course totals needed for the UI
        const [result] = await pool.query(
            `SELECT 
                p.prog_id, 
                p.student_id, 
                p.course_id, 
                p.completed_lesson, 
                p.current_lesson_id, 
                p.certificate_earned, 
                p.certificate_date, 
                p.created_at,
                c.total_lessons, 
                c.total_modules, 
                c.duration_minutes 
            FROM course_progress p
            JOIN courses c ON p.course_id = c.course_id
            WHERE p.student_id = ? AND p.course_id = ?`,
            [student_id, course_id]
        );
        
        return result;
    } catch (error) {
        console.error("Error executing get course progress query:", error);
        throw error;
    }
}