import { addAccountQuery } from "../../database/AccountQueries/AddAccountQuery.js";

export async function addAccountController(req, res) {
    try {
        // 1. Destructure the data sent from your frontend
        // Note: 'role' is passed here from your registerUser function
        const { name, email, password, role } = req.body;

        // 2. Basic Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 3. Mapping variables
        // We use 'role || "student"' as a fallback so it never remains empty
        const fullname = name;
        const email_address = email;
        const password_hash = password; 
        const userRole = role || "student"; 

        // 4. Pass the role to your query function
        // IMPORTANT: Ensure your addAccountQuery function accepts 4 arguments now!
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