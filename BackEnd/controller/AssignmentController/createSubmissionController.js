import { createSubmissionsQuery } from "../../database/assignmentQueries/createSubmissionQueries.js";
export const createSubmissionController = async (req, res) => {
    try {
        const { module_id, assignment, description, dueDate, url, role} = req.body;
        const result = await createSubmissionsQuery ({
            user_id: 3,
            module_id: module_id,
            assignment,
             description,
             due_date: dueDate,
             url,
             role: 'instructor'
        });
        return res.status(201).json({
            success: true,
            message: role === 'instructor' ? ' Assignment created!' : ' Assignment submitted!',
            data: result
        });
    } catch (error) {
     console.error("SQL Error", error);
     return res.status(500).json({
        success: false,
        message: "Failed to process assignment action.",
        error: error.message
     });
     }
    };