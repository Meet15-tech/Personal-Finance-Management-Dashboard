const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

/**
 * Register a new user.
 *
 * Route: POST /api/auth/register
 * Access: Public
 */
const registerUser = async (req, res) => {
    try {
        const {
            fullName,
            email,
            password,
            currency,
            monthlyIncome,
        } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Full name, email, and password are required",
            });
        }

        if (typeof fullName !== "string" || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "Full name and email must be valid text values",
            });
        }

        if (typeof password !== "string" || password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            currency: currency || "INR",
            monthlyIncome:
                monthlyIncome === undefined || monthlyIncome === ""
                    ? 0
                    : Number(monthlyIncome),
        });

        const token = generateToken(user._id.toString());

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profileImage: user.profileImage,
                    currency: user.currency,
                    monthlyIncome: user.monthlyIncome,
                    role: user.role,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "A user with this email already exists",
            });
        }

        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map(
                (validationError) => validationError.message
            );

            return res.status(400).json({
                success: false,
                message: "User validation failed",
                errors: validationErrors,
            });
        }

        console.error("User registration failed:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Login an existing user.
 *
 * Route: POST /api/auth/login
 * Access: Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Find user and explicitly select password field
        const user = await User.findOne({ email: normalizedEmail }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate JWT
        const token = generateToken(user._id.toString());

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    profileImage: user.profileImage,
                    currency: user.currency,
                    monthlyIncome: user.monthlyIncome,
                    role: user.role,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                },
            },
        });
    } catch (error) {
        console.error("User login failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

/**
 * Get user profile (Protected route).
 *
 * Route: GET /api/auth/profile
 * Access: Private
 */
const getUserProfile = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "User profile retrieved successfully",
            data: {
                user: {
                    id: req.user._id,
                    fullName: req.user.fullName,
                    email: req.user.email,
                    profileImage: req.user.profileImage,
                    currency: req.user.currency,
                    monthlyIncome: req.user.monthlyIncome,
                    role: req.user.role,
                    isVerified: req.user.isVerified,
                    createdAt: req.user.createdAt,
                    updatedAt: req.user.updatedAt,
                },
            },
        });
    } catch (error) {
        console.error("Profile retrieval failed:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};