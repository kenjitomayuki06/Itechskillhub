import {
    getAllQuizzesQuery,
    getQuizAnswersQuery,
    saveQuizSubmissionQuery
} from '../../database/quizQueries/quizQuery,js';

// Get Handler: load the master list of quizzes for the student
export async function getAllQuizzes(res, req) {
    try {
        const quizzes = await getAllQuizzesQuery();
        return res.status(200).json({
            success: true,
            quizzes
        });
    } catch (error){
        console.error("Error fetching quizzes list:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load quizzes."
        });
    }
}

// POST Handler: Grade the submitted choices securely against database answer key
export async function submitQuiz(res, req) {
    try {
        const studentId = req.user.user_id;
        const quizId = req.params.id;
        const { studentAnswers, topic, difficulty} = req.body;

        const correctAnswers = await getQuizAnswersQuery(quizId);

        if (correctAnswers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Quiz structure or answer sheet keys not found."
            });
        } 
        let calculatedScore = 0;

        //to secure evaluation loop
        correctAnswers.forEach((item) => {
            const studentChoice = studentAnswers[item.question_id];
            if (studentChoice && studentChoice === item.correct_option.toUpperCase()) {
                calculatedScore++;
            }
        });

        //determine if the student passed
        const passingScore = Math.ceil(correctAnswers.length * 0.5);
        const isPassed = calculatedScore >= passingScore ? 1 : 0; 

        // Persist the entry directly to quiz_scores using clean columns
        await saveQuizSubmissionQuery (
            studentId,
            quizId,
            calculatedScore,
            correctAnswers.length,
            topic,
            difficulty,
            isPassed
        ); 
        return res.status(200).json({
            success: true,
            message: "Quiz evaluated and logged successfuly.",
            result: {
            totalQuestions: correctAnswers.length,
            score: calculatedScore,
            isPassed: isPassed === 1
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
