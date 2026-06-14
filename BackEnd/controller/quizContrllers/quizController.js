import {
    getAllQuizzesQuery,
    getQuizByIdQuery,
    getQuizAnswersQuery,
    saveQuizSubmissionQuery
} from '../../database/quizQueries/quizQuery.js';

// GET Handler: load the master list of quizzes for the student
export async function getAllQuizzes(req, res) {
    try {
        const quizzes = await getAllQuizzesQuery();
        return res.status(200).json({
            success: true,
            quizzes
        });
    } catch (error) {
        console.error("Error fetching quizzes list:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load quizzes."
        });
    }
}

// GET Handler: load a single quiz with its questions
export async function getQuizById(req, res) {
    try {
        const quizId = req.params.id;
        const quiz = await getQuizByIdQuery(quizId);
        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found."
            });
        }
        return res.status(200).json({
            success: true,
            quiz
        });
    } catch (error) {
        console.error("Error fetching quiz:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load quiz."
        });
    }
}

// POST Handler: Grade the submitted choices securely against database answer key
export async function submitQuiz(req, res) {
    try {
        const studentId = req.user.user_id;
        const quizId = req.params.id;
        const { studentAnswers, topic, difficulty } = req.body;

        const correctAnswers = await getQuizAnswersQuery(quizId);

        if (correctAnswers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Quiz structure or answer sheet keys not found."
            });
        }

        let calculatedScore = 0;

        // Secure evaluation loop
        correctAnswers.forEach((item) => {
            const studentChoice = studentAnswers[item.question_id];
            if (studentChoice && studentChoice === item.correct_option.toUpperCase()) {
                calculatedScore++;
            }
        });

        // Determine if the student passed (for response only — DB computes its own is_passed)
        const passingScore = Math.ceil(correctAnswers.length * 0.5);
        const isPassed = calculatedScore >= passingScore;

        // Persist to quiz_scores
        await saveQuizSubmissionQuery(
            studentId,
            quizId,
            calculatedScore,
            correctAnswers.length,
            topic,
            difficulty
        );

        return res.status(200).json({
            success: true,
            message: "Quiz evaluated and logged successfully.",
            result: {
                totalQuestions: correctAnswers.length,
                score: calculatedScore,
                isPassed: isPassed
            }
        });
    } catch (error) {
        console.error("Error evaluating quiz submission:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to process quiz and grade submission."
        });
    }
}