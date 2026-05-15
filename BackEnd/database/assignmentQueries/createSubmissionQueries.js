import { pool } from "../../config/db.js";

export async function createSubmissionsQuery({ user_id, module_id, assignment, url, description, due_date, role }) {
    let sql = ``;
    let params = [];
    if (role === 'instructor') {
        sql = `
            INSERT INTO student_assignment (user_id, module_id, assignment, description, due_date, created_at)
            VALUES (?, ?, ?, ?, ?, NOW())`;
            params = [user_id, module_id, assignment, description, due_date];
    } else if (role === 'student') {
        sql = `
            INSERT INTO student_assignment (user_id, module_id, assignment, url, grade, created_at)
            VALUES (?, ?, ?, ?, NULL, NOW())
        `;
        params = [user_id, module_id, assignment, url];
    } else {
        throw new Error('Invalid role specified');
    }
    const [result] = await pool.execute(sql, params);
    return result;
}