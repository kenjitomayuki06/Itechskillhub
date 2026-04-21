import { getCourseProgressQuery } from "../../database/coursesQueries/courseProgressQuery"; // Adjust based on your actual db import

export async function getCourseProgressController(req,res) {
    try {
        const {student_id, course_id} = req.params;

        const rows = await getCourseProgressQuery(student_id, course_id);
        if (rows.length === 0) { 
            return res.status(404).json({ 
                success: false , 
                message: "No course progress found."
            });
        } const data = rows[0];
          
            let progressPercentage = 0;
            if (data.total_lessons > 0) {
                progressPercentage = Math.floor((data.completed_lesson / data.total_lessons) * 100);
            }

            const hours = Math.floor(data.duration_minutes / 60);
            const minutes = data.duration_minutes % 60;
            const formattedDuration = `${hours}h ${minutes}min`;

            const certStatus = data.certificate_earned === 1 ? "Earned" : "Not Earned";

            const responseData = {
                courseCompletion: `${percentage}%`,
                lessonsDone: `${data.completed_lesson}/${data.total_lessons}`,
                duration: formattedDuration,
                totalModules: data.total_modules,
                certificationStatus: certStatus,
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