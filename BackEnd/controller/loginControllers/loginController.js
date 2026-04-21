import { loginQuery } from "../../database/loginQuery/login.js";

export async function loginController(req, res) {
    try {
        // Just take the data as it is returned (which is the array of rows)
        const loginData = await loginQuery(); 
        
        res.status(200).json({
            success: true,
            accounts: loginData 
        });
        
    } catch (error) { 
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}