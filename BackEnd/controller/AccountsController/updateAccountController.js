import { updateAccountQuery } from "../../database/AccountQueries/updateAccountQuery.js";
export async function updateAccountController(req,res)  {
    try{
        const { user_Id } = req.params;
        const { fullname, email_address, password_hash } = req.body;
        
        if (!user_Id) {
            return res.status(400).json({ Message: "Failed to locate user ID" });
        }
        if (!fullname || !email_address) {
            return res.status(400).json({ Message: "Full name and email address are required" });
        }
        const result = await updateAccountQuery(user_Id, fullname, email_address, password_hash);
        res.status(200).json({ Message: "Account updated successfully", result });
    } catch (error) {
        console.error("Error in updateAccountController:", error);
        res.status(500).json({ Message: "Internal server error" });
    }
}