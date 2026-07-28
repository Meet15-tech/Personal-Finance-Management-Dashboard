const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        category: {
            type: String,
            required: [true, "Budget category is required"],
            trim: true,
        },

        limit: {
            type: Number,
            required: [true, "Budget limit is required"],
            min: [1, "Budget limit must be greater than zero"],
        },

        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12,
        },

        year: {
            type: Number,
            required: true,
            min: 2000,
            max: 2100,
        },

        description: {
            type: String,
            trim: true,
            maxlength: [250, "Description cannot exceed 250 characters"],
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate budgets for the same category and month.
budgetSchema.index(
    {
        user: 1,
        category: 1,
        month: 1,
        year: 1,
    },
    {
        unique: true,
    }
);

module.exports = mongoose.model("Budget", budgetSchema);