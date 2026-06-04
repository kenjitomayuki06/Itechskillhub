import { pool } from '../../config/db.js';

//Query for students total count
export async function getTotalStudentQuery() {
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS totalStudents FROM users WHERE role = 'student'`
    );
    return rows[0].totalStudents;
}

//Query for instructors total count
export async function getTotalInstructorQuery() {
    const [rows] = await pool.query(
        `SELECT COUNT (*) AS totalInstructors FROM users WHERE role = 'instructor'`
    );
    return rows[0].totalInstructors;
}


//Query for all active or available courses
export async function getActiveCoursesQuery(){
    const [rows] = await pool.query(
        `SELECT COUNT(*) AS activeCourses FROM courses`
    );
    return rows[0].activeCourses;
    }
    