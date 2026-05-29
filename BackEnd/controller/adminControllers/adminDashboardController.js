import {
    getTotalStudentQuery,
    getTotalInstructorQuery,
    getActiveCoursesQuery
} from '../../database/adminQueries/adminDashboardQuery.js';

export async function getAdminDashboardStats(res, req) {
    try {
        if (req.user.role !== 'admin'){
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin authorization required."
            });
        }

        // fetch counts from the database queries
        const totalStudents = await getTotalStudentQuery();
        const totalInstructors = await getTotalInstructorQuery();
        const activeCourses = await getActiveCoursesQuery();

        //send statistical bundle to the frontend dashboard
        return res.status(200).json({
            success: true,
            stats: {
                totalStudents,
                totalInstructors,
                activeCourses,
                systemStatus: "Healthy" 
            }
        });
    } catch (error) {
        console.error("Error fetching admin dashboard statistics:", error);
        return res.status(500).json({
            success: false, 
            message: "An error occured while compiling system-wide statistics."
        });
    }
}
