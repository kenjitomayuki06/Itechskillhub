import { pool } from '../../config/db.js';

// Query for getting enrolled courses
export async function getEnrolledCoursesQuery(studentId){
    const [rows] = await pool.query(
        `Select c.course_id, c.title, c.description
        FROM courses c
        JOIN enrollments e ON c.course_id = e.course_id
        WHERE e.user_id = ?`,
        [studentId]
    );
    return rows;
}

// Get upcoming deadlines
export async function getUpcomingDeadlinesQuery(studentId) {
    const [rows] = await pool.query(
        `SELECT a.assignment_id, a.title, a.deadline, c.title AS course_title
        FROM assignments a
        JOIN courses c ON a.course_id = c.course_id
        JOIN enrollments e ON c.course_id = e.course_id
        WHERE e.user_id = ? AND a.deadline >= NOW()
        ORDER BY a.deadline ASC`,
        [studentId]
    );
    return rows;
}