import { pool } from '../../config/db.js';

export async function getStudentCertificatesQuery(studentId){
    const [rows] = await pool.query(
        `SELECT cert.certificate_id, cert.certificate_code, cert.issued_at, c.title AS course_title
        FROM certificates cert
        JOIN courses c ON cert.course_id = c.course_id
        WHERE cert.student_id = ?
        ORDER BY cert.issued_at DESC`,
        [studentId]
    );
    return rows;
}
