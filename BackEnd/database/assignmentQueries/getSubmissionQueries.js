import { pool } from "../../config/db.js";

export async function getSubmissionsQuery({ search, page, limit }) {
    try {
        const offset = (page - 1) * limit;
        let queryParams = [];
        

        let sql = `
            SELECT 
                a.assignment_id, 
                a.assignment, 
                a.grade, 
                a.created_at,
                u.full_name, 
                m.module_name
            FROM assignment a
            LEFT JOIN users u ON a.user_id = u.user_id
            LEFT JOIN modules m ON a.module_id = m.module_id
        `;

        // Handle Search Logic
        if (search) {
            sql += ` WHERE u.full_name LIKE ? OR a.assignment LIKE ? `;
            const searchTerm = `%${search}%`;
            queryParams.push(searchTerm, searchTerm);
        }

        // Add Ordering and Pagination
        sql += ` ORDER BY a.created_at DESC LIMIT ? OFFSET ?`;
        queryParams.push(parseInt(limit), parseInt(offset));

        // Execute main query
        const [rows] = await pool.execute(sql, queryParams);

        // Get Total Count for Pagination (The "1 to 5 of 6" text in image_9fc318.png)
        let countSql = `SELECT COUNT(*) as total FROM assignment`;
        if (search) {
            countSql += ` a JOIN users u ON a.user_id = u.user_id WHERE u.full_name LIKE ? OR a.assignment LIKE ?`;
        }
        const [countResult] = await pool.execute(countSql, search ? [`%${search}%`, `%${search}%`] : []);
        const total = countResult[0].total;

        return {
            submissions: rows,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };

    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    }
}