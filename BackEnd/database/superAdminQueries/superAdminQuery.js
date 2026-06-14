import { pool } from '../../config/db.js';

/* ════════════════════════ SYSTEM SETTINGS ════════════════════════ */

export async function getSettingQuery(key) {
    const [rows] = await pool.query(
        `SELECT setting_value FROM system_settings WHERE setting_key = ?`,
        [key]
    );
    return rows[0]?.setting_value ?? null;
}

export async function setSettingQuery(key, value) {
    await pool.query(
        `INSERT INTO system_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, value, value]
    );
}

/* ════════════════════════ OVERVIEW STATS ════════════════════════ */

export async function getOverviewStatsQuery() {
    const [[{ totalStudents }]] = await pool.query(
        `SELECT COUNT(*) AS totalStudents FROM users WHERE role = 'student'`
    );
    const [[{ totalInstructors }]] = await pool.query(
        `SELECT COUNT(*) AS totalInstructors FROM users WHERE role = 'instructor'`
    );
    const [[{ totalAdmins }]] = await pool.query(
        `SELECT COUNT(*) AS totalAdmins FROM admins`
    );
    const [[{ totalCourses }]] = await pool.query(
        `SELECT COUNT(*) AS totalCourses FROM courses`
    );
    const [[{ totalQuizzes }]] = await pool.query(
        `SELECT COUNT(*) AS totalQuizzes FROM quizzes`
    );
    const [[{ totalQuizAttempts }]] = await pool.query(
        `SELECT COUNT(*) AS totalQuizAttempts FROM quiz_scores`
    );
    const [[{ totalCertificates }]] = await pool.query(
        `SELECT COUNT(*) AS totalCertificates FROM certificates`
    );

    return {
        totalStudents,
        totalInstructors,
        totalAdmins,
        totalCourses,
        totalQuizzes,
        totalQuizAttempts,
        totalCertificates,
    };
}

/* ════════════════════════ MANAGE ADMINS ════════════════════════ */

export async function getAllAdminsQuery() {
    const [rows] = await pool.query(
        `SELECT id, full_name, email, role, is_active, created_at
         FROM admins ORDER BY created_at DESC`
    );
    return rows;
}

export async function createAdminQuery(fullName, email, hashedPassword, role) {
    const [result] = await pool.query(
        `INSERT INTO admins (full_name, email, password, role, is_active)
         VALUES (?, ?, ?, ?, 1)`,
        [fullName, email, hashedPassword, role]
    );
    return result;
}

export async function updateAdminStatusQuery(adminId, isActive) {
    const [result] = await pool.query(
        `UPDATE admins SET is_active = ? WHERE id = ?`,
        [isActive, adminId]
    );
    return result;
}

export async function deleteAdminQuery(adminId) {
    const [result] = await pool.query(
        `DELETE FROM admins WHERE id = ? AND role != 'super_admin'`,
        [adminId]
    );
    return result;
}

export async function getAdminByEmailQuery(email) {
    const [rows] = await pool.query(
        `SELECT id FROM admins WHERE email = ?`,
        [email]
    );
    return rows[0] ?? null;
}

/* ════════════════════════ MANAGE USERS (Instructors/Students) ════════════════════════ */

export async function getAllUsersQuery(role = null) {
    let query = `SELECT id, fullname, email_address, role, status, gender, age, contact_number, created_at
                  FROM users`;
    const params = [];
    if (role) {
        query += ` WHERE role = ?`;
        params.push(role);
    }
    query += ` ORDER BY created_at DESC`;
    const [rows] = await pool.query(query, params);
    return rows;
}

export async function updateUserStatusQuery(userId, status) {
    const [result] = await pool.query(
        `UPDATE users SET status = ? WHERE id = ?`,
        [status, userId]
    );
    return result;
}

export async function deleteUserQuery(userId) {
    const [result] = await pool.query(
        `DELETE FROM users WHERE id = ?`,
        [userId]
    );
    return result;
}