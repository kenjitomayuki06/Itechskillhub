import { pool } from '../../config/db.js';

export async function updateLessonProgressController(req, res) {
    try {
        const { student_id, course_id, lesson_id } = req.body;

        const [existing] = await pool.query(
            `SELECT * FROM course_progress WHERE student_id = ? AND course_id = ?`,
            [student_id, course_id]
        );

        if (existing.length === 0) {
            await pool.query(
                `INSERT INTO course_progress (student_id, course_id, completed_lesson, current_lesson_id)
                 VALUES (?, ?, 1, ?)`,
                [student_id, course_id, lesson_id]
            );
        } else {
            await pool.query(
                `UPDATE course_progress 
                 SET completed_lesson = completed_lesson + 1,
                     current_lesson_id = ?
                 WHERE student_id = ? AND course_id = ?`,
                [lesson_id, student_id, course_id]
            );
        }

        return res.status(200).json({ success: true, message: 'Progress updated.' });
    } catch (error) {
        console.error('Error updating progress:', error);
        return res.status(500).json({ success: false, message: 'Failed to update progress.' });
    }
}