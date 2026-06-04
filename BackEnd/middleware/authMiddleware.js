import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check if the token arrives via the Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // Extract token after "Bearer "
        }

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "Not authorized, no token provided" 
            });
        }

        // 2. Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');

        // 3. Attach the decrypted payload variables to the request object
        req.user = {
            id: decoded.id,     // This will extract the userData.user_id you signed
            role: decoded.role   // This will extract the userData.role you signed
        };

        next(); // Move forward to your controller
    } catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({ 
            success: false, 
            message: "Not authorized, token invalid or expired" 
        });
    }
};