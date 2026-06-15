import { pool } from "../../config/db.js";

export async function getSubmissionsQuery({ search, page, limit }) {
    try {
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const offset = (pageNum - 1) * limitNum;
        
        const queryParams = [];
        
        let sql = `
            SELECT 
                a.assignment_id, 
                a.assignment, 
                a.grade, 
                a.created_at,
                u.full_name, 
                m.module_name
            FROM student_assignment a
            LEFT JOIN users u ON a.user_id = u.user_id
            LEFT JOIN modules m ON a.module_id = m.module_id
        `;

        if (search) {
            sql += ` WHERE u.full_name LIKE ? OR a.assignment LIKE ? OR m.module_name LIKE ? `;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm, searchTerm);
        }

        sql += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(limitNum, offset);

        const [rows] = await pool.execute(sql, queryParams);

        let countSql = `SELECT COUNT(*) as total FROM student_assignment a`;
        if (search) {
            countSql += ` LEFT JOIN users u ON a.user_id = u.user_id LEFT JOIN modules m ON a.module_id = m.module_id WHERE u.full_name LIKE ? OR a.assignment LIKE ? OR m.module_name LIKE ?`;
        }
        const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [];
        const [countResult] = await pool.execute(countSql, countParams);
        const total = countResult[0].total;

        return {
            submissions: rows,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        };

    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}