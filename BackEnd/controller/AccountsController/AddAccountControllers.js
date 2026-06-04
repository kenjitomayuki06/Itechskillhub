import bcrypt from 'bcryptjs';
import { addAccountQuery } from "../../database/AccountQueries/AddAccountQuery.js";

export async function addAccountController(req, res) {
    try {
        // 1. Destructure the data sent from your frontend
        const { name, email, password, role } = req.body;

        // 2. Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 3. Hash the plain text password securely
        // Salt rounds = 10 is the industry standard sweet spot for performance vs security
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Mapping variables
        const fullname = name;
        const email_address = email;
        const password_hash = hashedPassword; // Now passing the secure hash instead of plain text!
        const userRole = role || "student"; 

        // 5. Pass the role and hashed password to your query function
        const result = await addAccountQuery(fullname, email_address, password_hash, userRole);
        
        return res.status(201).json({ 
            message: "Account created successfully", 
            user: { 
                id: result.insertId, 
                name: fullname, 
                email: email_address,
                role: userRole 
            } 
        });

    } catch (error) {
        console.error("Error in add account controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}