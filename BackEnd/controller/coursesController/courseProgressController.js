import { getCourseProgressQuery } from "../../database/coursesQueries/courseProgressQuery.js";

export async function getCourseProgressController(req, res) {
    try {
        const { student_id, course_id } = req.params;

        const rows = await getCourseProgressQuery(student_id, course_id);
        
        if (rows.length === 0) { 
            return res.status(404).json({ 
                success: false, 
                message: "No course progress found."
            });
        }
        
        const data = rows[0];
        const completed = data.completed_lesson || 0;
        const totalLessons = 16;
        const completionPct = Math.round((completed / totalLessons) * 100);

        const responseData = {
            courseCompletion: `${completionPct}%`,
            lessonsDone: `${completed}/${totalLessons}`,
            totalModules: 4,
            certificationStatus: data.certificate_earned === 1 ? "Earned" : "Not Earned",
        };

        return res.status(200).json({
            success: true,
            data: responseData,
        });

    } catch (error) {
        console.error("Error in getCourseProgress controller:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching course progress.",
        });
    }
}