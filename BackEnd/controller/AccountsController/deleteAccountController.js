
import deleteAccountService from "../../services/deleteAccount.Services.js";
export async function deleteAccountController(req, res) {
    try {
        const { user_Id } = req.params;
        const result = await deleteAccountService(user_Id);
        res.status(200).json({ message: "Account deleted successfully", result });
    } catch (error) {
        console.error("Error in delete account controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}