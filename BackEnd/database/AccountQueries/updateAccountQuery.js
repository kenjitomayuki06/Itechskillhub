import { pool } from "../../config/db.js";

export async function updateAccountQuery(user_Id, fullname, email_address, phone, address, bio, birthday) {
    try {
        const [result] = await pool.query(
            `UPDATE users 
             SET fullname = ?, email_address = ?, phone = ?, address = ?, bio = ?, birthday = ?
             WHERE user_id = ?`,
            [fullname, email_address, phone, address, bio, birthday, user_Id]
        );
        console.log("Successfully updated user with ID:", user_Id);
        return result;
    } catch (error) {
        console.error("Error executing update user query:", error);
        throw error;
    }
}