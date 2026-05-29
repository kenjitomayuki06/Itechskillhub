import {pool} from '../../config/db.js';

export async function getAllQuizzesQuery() {
    const [rows] = await pool.query(
        `SELECT quiz_id, topic, difficulty, total_question
        FROM quizzes
        ORDER BY quiz_id ASC`
    );
    return rows;
}


//Query for getting the correct answer key sheet
export async function getQuizAnswersQuery(quizID){
    const [rows] = await pool.query(
        `SELECT question_id, correction_option FROM quiz_questions WHERE quiz_id = ?`,
        [quizID]
    ); 
    return rows;
}


//Query for student's scores
export async function saveQuizSubmissionQuery(studentId, quizId, score, totalQuestion, topic, difficulty, isPassed){
    const [result] = await pool.query(
        `INSERT INTO quiz_scores (student_id, quiz_id, score, total_question, topic, difficulty, is_passed, created_at)
        Values (?,?,?,?,?,?,?,NOW())`,
        [studentId, quizId, score, totalQuestion, topic, difficulty, isPassed]
    );
    return result;
}