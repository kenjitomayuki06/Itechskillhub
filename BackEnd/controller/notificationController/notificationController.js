import { getStudentNotificationsQuery } from '../../database/notificationQueries/notificationQuery.js';

// GET Handler: build the student's notification feed from real activity
export async function getStudentNotifications(req, res) {
    try {
        const studentId = req.user.user_id;
        const notifications = await getStudentNotificationsQuery(studentId);

        return res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to load notifications."
        });
    }
}