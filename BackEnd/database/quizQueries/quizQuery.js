import { pool } from '../../config/db.js';

// Get all quizzes list
export async function getAllQuizzesQuery() {
    const [rows] = await pool.query(
        `SELECT quiz_id, topic, difficulty, total_question
        FROM quizzes
        ORDER BY quiz_id ASC`
    );
    return rows;
}

// Get a single quiz with its questions (no correct_option — frontend doesn't need answer key)
export async function getQuizByIdQuery(quizId) {
    const [[quiz]] = await pool.query(
        `SELECT quiz_id, topic, difficulty, total_question
        FROM quizzes WHERE quiz_id = ?`,
        [quizId]
    );
    if (!quiz) return null;

    const [questions] = await pool.query(
        `SELECT question_id, question_text, option_a, option_b, option_c, option_d
        FROM quiz_questions WHERE quiz_id = ?
        ORDER BY question_id ASC`,
        [quizId]
    );

    return { ...quiz, questions };
}

// Get correct answer key (used server-side only for grading)
export async function getQuizAnswersQuery(quizId) {
    const [rows] = await pool.query(
        `SELECT question_id, correct_option FROM quiz_questions WHERE quiz_id = ?`,
        [quizId]
    );
    return rows;
}

// Save student's quiz score
// NOTE: is_passed is a VIRTUAL/GENERATED column (score/total_question >= 0.75)
// — do NOT insert it manually, MySQL computes it automatically.
export async function saveQuizSubmissionQuery(studentId, quizId, score, totalQuestion, topic, difficulty) {
    const [result] = await pool.query(
        `INSERT INTO quiz_scores (student_id, quiz_id, score, total_question, topic, difficulty, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [studentId, quizId, score, totalQuestion, topic, difficulty]
    );
    return result;
}