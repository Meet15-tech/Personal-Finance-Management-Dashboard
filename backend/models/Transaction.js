const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: [true, "Transaction title is required"],
            trim: true,
            minlength: [2, "Title must contain at least 2 characters"],
            maxlength: [100, "Title cannot exceed 100 characters"],
        },

        amount: {
            type: Number,
            required: [true, "Transaction amount is required"],
            min: [0.01, "Transaction amount must be greater than zero"],
        },

        type: {
            type: String,
            required: [true, "Transaction type is required"],
            enum: {
                values: ["income", "expense"],
                message: "Transaction type must be income or expense",
            },
            lowercase: true,
        },

        category: {
            type: String,
            required: [true, "Transaction category is required"],
            trim: true,
            maxlength: [50, "Category cannot exceed 50 characters"],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [500, "Description cannot exceed 500 characters"],
            default: "",
        },

        date: {
            type: Date,
            default: Date.now,
        },

        paymentMethod: {
            type: String,
            enum: [
                "cash",
                "credit-card",
                "debit-card",
                "bank-transfer",
                "upi",
                "other",
            ],
            default: "cash",
        },
    },
    {
        timestamps: true,
    }
);

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);