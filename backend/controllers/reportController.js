const Transaction = require("../models/Transaction");

// ========================================
// Financial Summary Report
// ========================================
const getFinancialSummaryReport = async (req, res) => {
    try {
        const userId = req.user.id;

        const summary = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                },
            },
            {
                $group: {
                    _id: "$type",
                    total: {
                        $sum: "$amount",
                    },
                },
            },
        ]);

        let totalIncome = 0;
        let totalExpenses = 0;

        summary.forEach((item) => {
            if (item._id === "income") {
                totalIncome = item.total;
            } else {
                totalExpenses = item.total;
            }
        });

        const netBalance = totalIncome - totalExpenses;

        const savingsRate =
            totalIncome > 0
                ? Number(((netBalance / totalIncome) * 100).toFixed(2))
                : 0;

        return res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                netBalance,
                savingsRate,
            },
        });
    } catch (error) {
        console.error("Report Summary Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate financial summary.",
        });
    }
};

// ========================================
// Expense Category Breakdown
// ========================================
const getCategoryReport = async (req, res) => {
    try {
        const type = req.query.type || "expense";

        const categories = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    type,
                },
            },
            {
                $group: {
                    _id: "$category",
                    total: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $sort: {
                    total: -1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error("Category Report Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate category report.",
        });
    }
};

// ========================================
// Monthly Trend Report
// ========================================
const getMonthlyReport = async (req, res) => {
    try {
        const year = Number(req.query.year) || new Date().getFullYear();

        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year + 1, 0, 1);

        const report = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                    date: {
                        $gte: startDate,
                        $lt: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: {
                        month: {
                            $month: "$date",
                        },
                        type: "$type",
                    },
                    total: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $sort: {
                    "_id.month": 1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error("Monthly Report Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate monthly report.",
        });
    }
};

// ========================================
// Payment Method Report
// ========================================
const getPaymentMethodReport = async (req, res) => {
    try {
        const report = await Transaction.aggregate([
            {
                $match: {
                    user: req.user._id,
                },
            },
            {
                $group: {
                    _id: "$paymentMethod",
                    total: {
                        $sum: "$amount",
                    },
                },
            },
            {
                $sort: {
                    total: -1,
                },
            },
        ]);

        return res.status(200).json({
            success: true,
            data: report,
        });
    } catch (error) {
        console.error("Payment Method Report Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate payment method report.",
        });
    }
};

module.exports = {
    getFinancialSummaryReport,
    getCategoryReport,
    getMonthlyReport,
    getPaymentMethodReport,
};