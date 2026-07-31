const mongoose = require("mongoose");

const plaidItemSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        itemId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        accessToken: {
            type: String,
            required: true,
            select: false,
        },

        institutionId: {
            type: String,
            trim: true,
            default: "",
        },

        institutionName: {
            type: String,
            trim: true,
            default: "",
        },

        transactionCursor: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["active", "error", "disconnected"],
            default: "active",
        },

        lastSyncedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

plaidItemSchema.index({
    user: 1,
    itemId: 1,
});

module.exports = mongoose.model(
    "PlaidItem",
    plaidItemSchema
);