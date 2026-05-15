// BackEnd/controller/AssignmentController/submissionController.js
import { getSubmissionsQuery } from "../../database/assignmentQueries/getSubmissionQueries.js";

export const getSubmissionsController = async (req, res) => {
    try {
        // 1. Get search and pagination params from query string
        const { search, page = 1, limit = 5 } = req.query;

        // 2. Call your database query 
        // This should join 'assignments' with 'users' and 'modules'
        const data = await getSubmissionsQuery({ search, page, limit });

        if (!data || data.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No submissions found",
                data: [],
                pagination: { total: 0, page: parseInt(page) }
            });
        }

        // 3. Map the data to match your UI requirements in image_9fc318.png
        const formattedSubmissions = data.submissions.map(item => ({
            assignment_id: item.assignment_id,
            student_name: item.full_name, // From Users table
            assignment_name: item.assignment, // From image_9fbff5.png
            module_tag: item.module_name, // From Modules table
            submitted_at: item.created_at, // From image_9fbff5.png
            status: item.grade !== null ? "Graded" : "Pending", // Logic for UI badges
            score: item.grade !== null ? `${item.grade}%` : "—",
            can_grade: item.grade === null // Boolean to toggle "Grade Now" button
        }));

        return res.status(200).json({
            success: true,
            data: formattedSubmissions,
            pagination: data.pagination // Total count for the "1 to 5 of 6" text
        });

    } catch (error) {
        console.error("Error fetching submissions:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error" 
        });
    }
}