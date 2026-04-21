import { getUserbyEmailPass } from "../../database/loginQuery/getUserbyEmailPass.js";
import jwt from 'jsonwebtoken';

export async function getUserbyEmailPassController(req, res) {
    try {
        // 1. Get credentials from body
        const { email, password } = req.body; 

        // 2. Call your database query
        const userData = await getUserbyEmailPass(email, password);

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // 3. Generate the token
        // Note: Using userData.user_id to match your phpMyAdmin screenshot
        const token = jwt.sign(
            { id: userData.user_id, role: userData.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' }
        );

       // BackEnd/controller/loginControllers/UserbyEmailPassController.js

        return res.status(200).json({
        success: true,
        token: token, 
        user: {  // <--- THIS IS THE "RESPONSE KEY". It must be "user"
        id: userData.user_id,          
        email: userData.email_address, 
        role: userData.role            
    }
});

    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}