import { pool } from "../../config/db.js";
export default async function deleteAccountQuery(user_Id) {
    try {
        // Corrected: Table name is 'users', Column name is 'user_id'
        const [result] = await pool.query(
            "DELETE FROM users WHERE user_id = ?", 
            [user_Id]
        );

        console.log("Successfully deleted user with ID:", user_Id);
        return result;
    } catch (error) {
        console.error("Error executing delete user query:", error);
        throw error;
    }
}