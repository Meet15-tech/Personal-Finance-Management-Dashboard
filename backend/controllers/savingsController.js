const mongoose = require("mongoose");
const SavingsGoal = require("../models/SavingsGoal");

// Helper to calculate progress metrics
const calculateGoalProgress = (goal) => {
    const targetAmount = goal.targetAmount;
    const savedAmount = goal.savedAmount || 0;
    
    const percentageCompleted = targetAmount > 0
        ? Math.min((savedAmount / targetAmount) * 100, 100)
        : 0;
        
    const remainingAmount = Math.max(targetAmount - savedAmount, 0);
    
    const status = savedAmount >= targetAmount ? "Completed" : "In Progress";
    
    return {
        ...goal.toObject(),
        percentageCompleted: Number(percentageCompleted.toFixed(2)),
        remainingAmount: Number(remainingAmount.toFixed(2)),
        status,
    };
};

// Create a new Savings Goal
const createGoal = async (req, res) => {
    try {
        const { name, targetAmount, savedAmount, targetDate, category, notes } = req.body;

        if (!name || targetAmount === undefined || !targetDate) {
            return res.status(400).json({
                success: false,
                message: "Goal name, target amount, and target date are required",
            });
        }

        const numericTarget = Number(targetAmount);
        const numericSaved = savedAmount !== undefined ? Number(savedAmount) : 0;

        if (numericTarget <= 0) {
            return res.status(400).json({
                success: false,
                message: "Target amount must be greater than zero",
            });
        }

        if (numericSaved < 0) {
            return res.status(400).json({
                success: false,
                message: "Saved amount cannot be negative",
            });
        }

        const dateTarget = new Date(targetDate);
        if (isNaN(dateTarget.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid target date format",
            });
        }

        // targetDate must be in the future relative to the current local date-time
        if (dateTarget <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Target date must be in the future",
            });
        }

        const goal = await SavingsGoal.create({
            user: req.user._id,
            name: name.trim(),
            targetAmount: numericTarget,
            savedAmount: numericSaved,
            targetDate: dateTarget,
            category: category?.trim() || "General",
            notes: notes?.trim() || "",
        });

        const progressGoal = calculateGoalProgress(goal);

        return res.status(201).json({
            success: true,
            message: "Savings goal created successfully",
            data: progressGoal,
        });
    } catch (error) {
        console.error("Create savings goal error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to create savings goal",
        });
    }
};

// Get all Savings Goals for the logged-in user
const getGoals = async (req, res) => {
    try {
        const filter = { user: req.user._id };

        const goals = await SavingsGoal.find(filter).sort({ targetDate: 1, createdAt: -1 });
        
        const goalsWithProgress = goals.map(calculateGoalProgress);

        return res.status(200).json({
            success: true,
            count: goalsWithProgress.length,
            data: goalsWithProgress,
        });
    } catch (error) {
        console.error("Get savings goals error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve savings goals",
        });
    }
};

// Get a single Savings Goal by ID
const getGoalById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid savings goal ID",
            });
        }

        const goal = await SavingsGoal.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        const progressGoal = calculateGoalProgress(goal);

        return res.status(200).json({
            success: true,
            data: progressGoal,
        });
    } catch (error) {
        console.error("Get savings goal by ID error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to retrieve savings goal",
        });
    }
};

// Update a Savings Goal
const updateGoal = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid savings goal ID",
            });
        }

        const goal = await SavingsGoal.findOne({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        const { name, targetAmount, savedAmount, targetDate, category, notes } = req.body;

        if (name !== undefined) {
            goal.name = name.trim();
        }

        if (targetAmount !== undefined) {
            const numericTarget = Number(targetAmount);
            if (numericTarget <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Target amount must be greater than zero",
                });
            }
            goal.targetAmount = numericTarget;
        }

        if (savedAmount !== undefined) {
            const numericSaved = Number(savedAmount);
            if (numericSaved < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Saved amount cannot be negative",
                });
            }
            goal.savedAmount = numericSaved;
        }

        if (targetDate !== undefined) {
            const dateTarget = new Date(targetDate);
            if (isNaN(dateTarget.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid target date format",
                });
            }
            // targetDate must be in the future relative to when updated
            if (dateTarget <= new Date()) {
                return res.status(400).json({
                    success: false,
                    message: "Target date must be in the future",
                });
            }
            goal.targetDate = dateTarget;
        }

        if (category !== undefined) {
            goal.category = category.trim();
        }

        if (notes !== undefined) {
            goal.notes = notes.trim();
        }

        await goal.save();

        const progressGoal = calculateGoalProgress(goal);

        return res.status(200).json({
            success: true,
            message: "Savings goal updated successfully",
            data: progressGoal,
        });
    } catch (error) {
        console.error("Update savings goal error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to update savings goal",
        });
    }
};

// Delete a Savings Goal
const deleteGoal = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid savings goal ID",
            });
        }

        const goal = await SavingsGoal.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Savings goal not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Savings goal deleted successfully",
        });
    } catch (error) {
        console.error("Delete savings goal error:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to delete savings goal",
        });
    }
};

module.exports = {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
};
