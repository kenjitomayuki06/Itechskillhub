import { getEnrolledCoursesQuery, getUpcomingDeadlinesQuery } from '../../database/studentDashboardQuery.js';

export async function getStudentDashboardData(req, res) {
    try {
        const StudentId = req.user.user_id;

        const enrolledCourses = await getEnrolledCoursesQuery(studentId);
        const deadlines = await getUpcomingDeadlinesQuery(studentId);

        return res.status(200).json({
            success: true,
            dashboardData: {
                enrolledCourses: enrolledCourses,
                deadlines: deadlines,
                activityFeed: [],
                weeklyProgress: {}
            }
        });
    } catch (error) {
        console.error("Error fetching student dashboard data:", error);
        return res.status(500).json({
            success: false,
            message: "An error occured while compiling your dashboard data."
        });
    }

}
