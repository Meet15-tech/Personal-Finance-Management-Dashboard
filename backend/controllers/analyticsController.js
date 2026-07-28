const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const getAuthenticatedUserId = (req) => {
    return req.user?._id || req.user?.id;
};

// @desc    Get overall financial summary (income, expense, balance, savings rate, recent transactions)
// @route   GET /api/analytics/summary
// @access  Private
const getFinancialSummary = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId.toString());

        const summaryAggregation = await Transaction.aggregate([
            { $match: { user: userObjectId } },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
        ]);

        let totalIncome = 0;
        let totalExpenses = 0;
        let incomeCount = 0;
        let expenseCount = 0;

        summaryAggregation.forEach((item) => {
            if (item._id === "income") {
                totalIncome = item.totalAmount;
                incomeCount = item.count;
            } else if (item._id === "expense") {
                totalExpenses = item.totalAmount;
                expenseCount = item.count;
            }
        });

        const netBalance = totalIncome - totalExpenses;
        const totalTransactions = incomeCount + expenseCount;
        const savingsRate =
            totalIncome > 0
                ? Number((((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(2))
                : 0;

        // Fetch recent 5 transactions for dashboard overview
        const recentTransactions = await Transaction.find({ user: userObjectId })
            .sort({ date: -1, createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            data: {
                totalIncome,
                totalExpenses,
                netBalance,
                savingsRate,
                totalTransactions,
                incomeCount,
                expenseCount,
                recentTransactions,
            },
        });
    } catch (error) {
        console.error("Get financial summary error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve financial summary",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Get category-wise breakdown for expenses or income
// @route   GET /api/analytics/category-breakdown
// @access  Private
const getCategoryBreakdown = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const { type = "expense", startDate, endDate } = req.query;

        const normalizedType = type.toLowerCase();
        if (!["income", "expense"].includes(normalizedType)) {
            return res.status(400).json({
                success: false,
                message: "Type must be either income or expense",
            });
        }

        const matchFilter = {
            user: new mongoose.Types.ObjectId(userId.toString()),
            type: normalizedType,
        };

        if (startDate || endDate) {
            matchFilter.date = {};
            if (startDate) matchFilter.date.$gte = new Date(startDate);
            if (endDate) {
                const parsedEnd = new Date(endDate);
                parsedEnd.setHours(23, 59, 59, 999);
                matchFilter.date.$lte = parsedEnd;
            }
        }

        const categoryStats = await Transaction.aggregate([
            { $match: matchFilter },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { totalAmount: -1 } },
        ]);

        const overallTotal = categoryStats.reduce(
            (acc, curr) => acc + curr.totalAmount,
            0
        );

        const formattedCategories = categoryStats.map((item) => ({
            category: item._id,
            totalAmount: item.totalAmount,
            count: item.count,
            percentage:
                overallTotal > 0
                    ? Number(((item.totalAmount / overallTotal) * 100).toFixed(2))
                    : 0,
        }));

        return res.status(200).json({
            success: true,
            type: normalizedType,
            overallTotal,
            data: formattedCategories,
        });
    } catch (error) {
        console.error("Get category breakdown error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve category breakdown",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Get monthly income vs expense trend for a given year
// @route   GET /api/analytics/monthly-trend
// @access  Private
const getMonthlyTrend = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const reqYear = parseInt(req.query.year, 10) || new Date().getFullYear();

        const startOfYear = new Date(reqYear, 0, 1);
        const endOfYear = new Date(reqYear, 11, 31, 23, 59, 59, 999);

        const trendAggregation = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId.toString()),
                    date: { $gte: startOfYear, $lte: endOfYear },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        type: "$type",
                    },
                    totalAmount: { $sum: "$amount" },
                },
            },
        ]);

        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];

        const monthlyData = months.map((monthName, index) => {
            const monthNum = index + 1;
            const incomeItem = trendAggregation.find(
                (item) => item._id.month === monthNum && item._id.type === "income"
            );
            const expenseItem = trendAggregation.find(
                (item) => item._id.month === monthNum && item._id.type === "expense"
            );

            const income = incomeItem ? incomeItem.totalAmount : 0;
            const expense = expenseItem ? expenseItem.totalAmount : 0;

            return {
                month: monthName,
                monthNumber: monthNum,
                income,
                expense,
                netBalance: income - expense,
            };
        });

        return res.status(200).json({
            success: true,
            year: reqYear,
            data: monthlyData,
        });
    } catch (error) {
        console.error("Get monthly trend error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve monthly trend",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Get breakdown by payment method
// @route   GET /api/analytics/payment-methods
// @access  Private
const getPaymentMethodBreakdown = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const methodStats = await Transaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId.toString()),
                },
            },
            {
                $group: {
                    _id: "$paymentMethod",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { totalAmount: -1 } },
        ]);

        const formattedStats = methodStats.map((item) => ({
            paymentMethod: item._id,
            totalAmount: item.totalAmount,
            count: item.count,
        }));

        return res.status(200).json({
            success: true,
            data: formattedStats,
        });
    } catch (error) {
        console.error("Get payment method breakdown error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve payment method stats",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

module.exports = {
    getFinancialSummary,
    getCategoryBreakdown,
    getMonthlyTrend,
    getPaymentMethodBreakdown,
};
