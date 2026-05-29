import { createSubmissionsQuery } from "../../database/assignmentQueries/createSubmissionQueries.js";
export const createSubmissionController = async (req, res) => {
    try {
        const { module_id, assignment, description, dueDate, url, role } = req.body;
        const user_id = req.user.id; 

        const result = await createSubmissionsQuery({
            user_id: user_id, // Sent securely to your database execution query
            module_id,
            assignment,
            description,
            due_date: dueDate,
            url,
            role: 'instructor' // to force the role to be instructor
        });

        return res.status(201).json({
            success: true,
            message: 'Assignment managed successfully!',
            data: result
        });
    } catch (error) {
        console.error("SQL Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};