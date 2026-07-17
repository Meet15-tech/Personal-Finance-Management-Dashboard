const jwt = require("jsonwebtoken");

/**
 * Generate a signed JWT for an authenticated user.
 *
 * @param {string} userId - MongoDB user document ID
 * @returns {string} Signed JWT
 */
const generateToken = (userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        {
            userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        }
    );
};

module.exports = generateToken;