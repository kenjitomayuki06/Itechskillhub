import { pool } from '../../config/db.js';

export async function getEnrolledCoursesQuery(studentId) {
    const [rows] = await pool.query(
        `SELECT c.course_Id as id, c.title, c.description, c.difficulty,
                cp.completed_lesson, cp.current_lesson_id, cp.certificate_earned
         FROM courses c
         LEFT JOIN course_progress cp ON c.course_Id = cp.course_id AND cp.student_id = ?
         WHERE cp.student_id = ?`,
        [studentId, studentId]
    );
    return rows;
}

export async function getUpcomingDeadlinesQuery(studentId) {
    const [rows] = await pool.query(
        `SELECT sa.assignment_id, sa.assignment as title, sa.due_date, sa.grade,
                m.title AS course_title
         FROM student_assignment sa
         JOIN modules m ON sa.module_id = m.module_id
         WHERE sa.user_id = ? AND sa.due_date >= NOW()
         ORDER BY sa.due_date ASC
         LIMIT 5`,
        [studentId]
    );
    return rows;
}