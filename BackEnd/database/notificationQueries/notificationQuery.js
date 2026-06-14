import { pool } from '../../config/db.js';

/**
 * Builds a unified notifications feed for a student by combining
 * multiple real data sources: announcements, quiz results,
 * assignment grades, and certificates.
 */
export async function getStudentNotificationsQuery(studentId) {
    // 1. Announcements targeted to this student directly, or to 'all' students
    const [announcements] = await pool.query(
        `SELECT
            'announcement' AS type,
            id AS ref_id,
            title,
            content AS message,
            created_at
        FROM announcements
        WHERE (target_type = 'student' AND target_id = ?)
           OR (target_type = 'course' AND target_id = 'all')
        ORDER BY created_at DESC
        LIMIT 20`,
        [String(studentId)]
    );

    // 2. Quiz results — recent quiz attempts by this student
    const [quizResults] = await pool.query(
        `SELECT
            'quiz_result' AS type,
            qs.score_id AS ref_id,
            CONCAT('Quiz Result: ', qs.topic) AS title,
            CONCAT('You scored ', qs.score, '/', qs.total_question,
                   ' on the "', qs.topic, '" quiz.') AS message,
            qs.created_at
        FROM quiz_scores qs
        WHERE qs.student_id = ?
        ORDER BY qs.created_at DESC
        LIMIT 10`,
        [studentId]
    );

    // 3. Assignment grades — graded submissions
    const [assignmentGrades] = await pool.query(
        `SELECT
            'assignment_grade' AS type,
            sa.assignment_id AS ref_id,
            CONCAT('Assignment Graded: ', COALESCE(sa.assignment, 'Assignment')) AS title,
            CONCAT('Your assignment "', COALESCE(sa.assignment, 'Assignment'),
                   '" was graded: ', sa.grade, '/100.') AS message,
            sa.updated_at AS created_at
        FROM student_assignment sa
        WHERE sa.user_id = ? AND sa.grade IS NOT NULL
        ORDER BY sa.updated_at DESC
        LIMIT 10`,
        [studentId]
    );

    // 4. Certificates earned
    const [certificates] = await pool.query(
        `SELECT
            'certificate' AS type,
            c.certificate_id AS ref_id,
            'Certificate Earned!' AS title,
            CONCAT('You earned a certificate for "', co.title, '". Congratulations!') AS message,
            c.issued_at AS created_at
        FROM certificates c
        JOIN courses co ON co.course_Id = c.course_id
        WHERE c.student_id = ?
        ORDER BY c.issued_at DESC
        LIMIT 10`,
        [studentId]
    );

    // Merge all sources and sort by date (most recent first)
    const all = [
        ...announcements,
        ...quizResults,
        ...assignmentGrades,
        ...certificates,
    ];

    all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return all;
}