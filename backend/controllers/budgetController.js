const mongoose = require("mongoose");
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// Create a new budget
const createBudget = async (req, res) => {
    try {
        const { category, limit, month, year, description } = req.body;

        if (!category || limit === undefined || !month || !year) {
            return res.status(400).json({
                success: false,
                message: "Category, limit, month, and year are required",
            });
        }

        const numericLimit = Number(limit);
        const numericMonth = Number(month);
        const numericYear = Number(year);

        if (numericLimit <= 0) {
            return res.status(400).json({
                success: false,
                message: "Budget limit must be greater than zero",
            });
        }

        if (numericMonth < 1 || numericMonth > 12) {
            return res.status(400).json({
                success: false,
                message: "Month must be between 1 and 12",
            });
        }

        const existingBudget = await Budget.findOne({
            user: req.user._id,
            category: category.trim(),
            month: numericMonth,
            year: numericYear,
        });

        if (existingBudget) {
            return res.status(409).json({
                success: false,
                message:
                    "A budget already exists for this category, month, and year",
            });
        }

        const budget = await Budget.create({
            user: req.user._id,
            category: category.trim(),
            limit: numericLimit,
            month: numericMonth,
            year: numericYear,
            description: description?.trim() || "",
        });

        return res.status(201).json({
            success: true,
            message: "Budget created successfully",
            data: budget,
        });
    } catch (error) {
        console.error("Create budget error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "A budget already exists for this category, month, and year",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create budget",
        });
    }
};

// Get all budgets for the logged-in user
const getBudgets = async (req, res) => {
    try {
        const filter = {
            user: req.user._id,
        };

        if (req.query.month) {
            filter.month = Number(req.query.month);
        }

        if (req.query.year) {
            filter.year = Number(req.query.year);
        }

        if (req.query.category) {
            filter.category = req.query.category;
        }

        const budgets = await Budget.find(filter).sort({
            year: -1,
            month: -1,
            createdAt: -1,
        });

        const budgetsWithProgress = await Promise.all(
            budgets.map(async (budget) => {
                const startDate = new Date(budget.year, budget.month - 1, 1);
                const endDate = new Date(budget.year, budget.month, 1);

                const spendingResult = await Transaction.aggregate([
                    {
                        $match: {
                            user: new mongoose.Types.ObjectId(req.user._id),
                            type: "expense",
                            category: budget.category,
                            date: {
                                $gte: startDate,
                                $lt: endDate,
                            },
                        },
                    },
                    {
                        $group: {
                            _id: null,
                            totalSpent: {
                                $sum: "$amount",
                            },
                        },
                    },
                ]);

                const spent =
                    spendingResult.length > 0 ? spendingResult[0].totalSpent : 0;

                const remaining = budget.limit - spent;

                const percentageUsed =
                    budget.limit > 0
                        ? Math.min((spent / budget.limit) * 100, 100)
                        : 0;

                return {
                    ...budget.toObject(),
                    spent,
                    remaining,
                    percentageUsed: Number(percentageUsed.toFixed(2)),
                    exceeded: spent > budget.limit,
                };
            })
        );

        return res.status(200).json({
            success: true,
            count: budgetsWithProgress.length,
            data: budgetsWithProgress,
        });
    } catch (error) {
        console.error("Get budgets error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve budgets",
        });
    }
};

// Get one budget
const getBudgetById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid budget ID",
            });
        }

        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: budget,
        });
    } catch (error) {
        console.error("Get budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve budget",
        });
    }
};

// Update a budget
const updateBudget = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid budget ID",
            });
        }

        const budget = await Budget.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        const { category, limit, month, year, description } = req.body;

        if (category !== undefined) {
            budget.category = category.trim();
        }

        if (limit !== undefined) {
            const numericLimit = Number(limit);

            if (numericLimit <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Budget limit must be greater than zero",
                });
            }

            budget.limit = numericLimit;
        }

        if (month !== undefined) {
            const numericMonth = Number(month);

            if (numericMonth < 1 || numericMonth > 12) {
                return res.status(400).json({
                    success: false,
                    message: "Month must be between 1 and 12",
                });
            }

            budget.month = numericMonth;
        }

        if (year !== undefined) {
            budget.year = Number(year);
        }

        if (description !== undefined) {
            budget.description = description.trim();
        }

        const duplicateBudget = await Budget.findOne({
            _id: {
                $ne: budget._id,
            },
            user: req.user._id,
            category: budget.category,
            month: budget.month,
            year: budget.year,
        });

        if (duplicateBudget) {
            return res.status(409).json({
                success: false,
                message:
                    "Another budget already exists for this category, month, and year",
            });
        }

        await budget.save();

        return res.status(200).json({
            success: true,
            message: "Budget updated successfully",
            data: budget,
        });
    } catch (error) {
        console.error("Update budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update budget",
        });
    }
};

// Delete a budget
const deleteBudget = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid budget ID",
            });
        }

        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!budget) {
            return res.status(404).json({
                success: false,
                message: "Budget not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Budget deleted successfully",
        });
    } catch (error) {
        console.error("Delete budget error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete budget",
        });
    }
};

module.exports = {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
};