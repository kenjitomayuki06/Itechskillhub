import bcrypt from 'bcryptjs';
import { getUserbyEmailPass } from "../../database/loginQuery/getUserbyEmailPass.js";
import jwt from 'jsonwebtoken';

export async function getUserbyEmailPassController(req, res) {
    try {
        const { email, password } = req.body; 
        const userData = await getUserbyEmailPass(email);

        if (!userData) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, userData.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: userData.user_id, role: userData.role },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            token: token, 
            user: {
                id: userData.user_id,          
                email: userData.email_address, 
                role: userData.role,    
                fullname: userData.fullname            
            }
        });

    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}