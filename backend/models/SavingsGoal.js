const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        name: {
            type: String,
            required: [true, "Savings goal name is required"],
            trim: true,
        },

        targetAmount: {
            type: Number,
            required: [true, "Target amount is required"],
            min: [1, "Target amount must be greater than zero"],
        },

        savedAmount: {
            type: Number,
            required: true,
            min: [0, "Saved amount cannot be negative"],
            default: 0,
        },

        targetDate: {
            type: Date,
            required: [true, "Target date is required"],
        },

        category: {
            type: String,
            trim: true,
            default: "General",
        },

        notes: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);
