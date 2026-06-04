export async function authMeController(req, res) {
    try {
     // req.user was already fetched the database by your protect middleware
        if(!req.user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
    }
    //return the authenticated user's current data back to the react app
    return res.status(200).json({
        success: true,
        user: {
            id: req.user.user_id,
            fullname: req.user.fullname,
            email: req.user.email_address,
            role: req.user.role
        }
    })
} catch (error) {
    console.error("Error in Get /api/auth/me controller:", error);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error."
    })
}
}
