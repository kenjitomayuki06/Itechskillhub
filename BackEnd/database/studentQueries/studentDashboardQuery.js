import { pool } from '../../config/db.js';

const COURSE_META = {
    1: { color: '#5B4A9E', icon: '🖥️', path: '/course/css-ncii', totalLessons: 16 },
    2: { color: '#3b82f6', icon: '🔌', path: '/course/network-setup', totalLessons: 6 },
    3: { color: '#10b981', icon: '⚙️', path: '/course/pc-hardware', totalLessons: 8 },
    4: { color: '#f59e0b', icon: '💿', path: '/course/os-installation', totalLessons: 6 },
};

export async function getEnrolledCoursesQuery(studentId) {
    const [rows] = await pool.query(
        `SELECT c.course_Id as id, c.title,
                cp.completed_lesson, cp.certificate_earned
         FROM courses c
         LEFT JOIN course_progress cp ON c.course_Id = cp.course_id AND cp.student_id = ?
         WHERE cp.student_id = ?`,
        [studentId, studentId]
    );

    return rows.map(row => {
        const meta = COURSE_META[row.id] || { color: '#5B4A9E', icon: '📚', path: '/course', totalLessons: 16 };
        const completed = row.completed_lesson || 0;
        const pct = Math.round((completed / meta.totalLessons) * 100);

        return {
            id: row.id,
            title: row.title,
            category: 'TESDA',
            modulesTotal: meta.totalLessons,
            modulesCompleted: completed,
            lastActivity: pct === 100 ? 'Completed' : `${pct}% complete`,
            color: meta.color,
            icon: meta.icon,
            path: meta.path,
        };
    });
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