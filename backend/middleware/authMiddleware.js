const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Middleware to protect routes by verifying the JWT token.
 * Extracted token is decoded to find the user in the database.
 * The user object (excluding the password) is attached to `req.user`.
 */
const protect = async (req, res, next) => {
    let token;

    // Check for token in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token from bearer token string
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from database, exclude password
            req.user = await User.findById(decoded.userId);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found with this token",
                });
            }

            next();
        } catch (error) {
            console.error("Token verification failed:", error.message);
            return res.status(401).json({
                success: false,
                message: "Not authorized, token failed or expired",
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided",
        });
    }
};

module.exports = { protect };
