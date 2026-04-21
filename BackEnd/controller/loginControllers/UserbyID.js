    import { getUserbyIDQuery } from "../../database/loginQuery/getUserbyID.js";
    export async function getUserbyIDController(req, res) {
        try { 
            const id = req.params
            // Just take the data as it is returne.d (which is the array of rows)
            const userData = await getUserbyIDQuery(id); 
            
        // Inside your controller
   // Replace your current IF check with this:
    if (!userData || userData.length === 0) {
         return res.status(400).json({
        status: false,
        message: "User not found"
    });
}

    // Now this line only runs if userData WAS found
    return res.status(200).json({ // Added 'return' here for safety
        success: true,
        accounts: userData
    });
        } catch (error) { 
            console.error("Error in login controller:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }