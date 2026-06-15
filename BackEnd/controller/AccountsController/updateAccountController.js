import { updateAccountQuery } from "../../database/AccountQueries/updateAccountQuery.js";

export async function updateAccountController(req, res) {
    try {
        const { user_Id } = req.params;
        const { name, fullname, email, email_address, phone, address, birthday } = req.body;

        const finalName  = name || fullname;
        const finalEmail = email || email_address;

        if (!user_Id) {
            return res.status(400).json({ message: "Failed to locate user ID" });
        }
        if (!finalName || !finalEmail) {
            return res.status(400).json({ message: "Full name and email address are required" });
        }

        const result = await updateAccountQuery(user_Id, finalName, finalEmail, phone, address, birthday);
        res.status(200).json({ message: "Account updated successfully", result });
    } catch (error) {
        console.error("Error in updateAccountController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}