const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const allowedTypes = ["income", "expense"];

const allowedPaymentMethods = [
    "cash",
    "credit-card",
    "debit-card",
    "bank-transfer",
    "upi",
    "other",
];

const getAuthenticatedUserId = (req) => {
    return req.user?._id || req.user?.id;
};

const validateTransactionData = (data, isUpdate = false) => {
    const errors = [];

    if (!isUpdate || data.title !== undefined) {
        if (!data.title || !data.title.trim()) {
            errors.push("Title is required");
        } else if (data.title.trim().length < 2) {
            errors.push("Title must contain at least 2 characters");
        } else if (data.title.trim().length > 100) {
            errors.push("Title cannot exceed 100 characters");
        }
    }

    if (!isUpdate || data.amount !== undefined) {
        const amount = Number(data.amount);

        if (
            data.amount === undefined ||
            data.amount === null ||
            data.amount === ""
        ) {
            errors.push("Amount is required");
        } else if (Number.isNaN(amount)) {
            errors.push("Amount must be a valid number");
        } else if (amount <= 0) {
            errors.push("Amount must be greater than zero");
        }
    }

    if (!isUpdate || data.type !== undefined) {
        const normalizedType = data.type?.toLowerCase();

        if (!normalizedType) {
            errors.push("Transaction type is required");
        } else if (!allowedTypes.includes(normalizedType)) {
            errors.push("Transaction type must be income or expense");
        }
    }

    if (!isUpdate || data.category !== undefined) {
        if (!data.category || !data.category.trim()) {
            errors.push("Category is required");
        } else if (data.category.trim().length > 50) {
            errors.push("Category cannot exceed 50 characters");
        }
    }

    if (
        data.description !== undefined &&
        data.description.trim().length > 500
    ) {
        errors.push("Description cannot exceed 500 characters");
    }

    if (
        data.paymentMethod !== undefined &&
        !allowedPaymentMethods.includes(data.paymentMethod)
    ) {
        errors.push("Invalid payment method");
    }

    if (data.date !== undefined && Number.isNaN(Date.parse(data.date))) {
        errors.push("Invalid transaction date");
    }

    return errors;
};

// @desc    Create a transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const validationErrors = validateTransactionData(req.body);

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            });
        }

        const transaction = await Transaction.create({
            user: userId,
            title: req.body.title.trim(),
            amount: Number(req.body.amount),
            type: req.body.type.toLowerCase(),
            category: req.body.category.trim(),
            description: req.body.description?.trim() || "",
            date: req.body.date || new Date(),
            paymentMethod: req.body.paymentMethod || "cash",
        });

        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            data: transaction,
        });
    } catch (error) {
        console.error("Create transaction error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create transaction",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Get logged-in user's transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);

        const {
            type,
            category,
            paymentMethod,
            startDate,
            endDate,
            search,
            sort = "newest",
            page = 1,
            limit = 20,
        } = req.query;

        const filter = {
            user: userId,
        };

        if (type) {
            if (!allowedTypes.includes(type.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    message: "Type must be income or expense",
                });
            }

            filter.type = type.toLowerCase();
        }

        if (category) {
            filter.category = {
                $regex: category.trim(),
                $options: "i",
            };
        }

        if (paymentMethod) {
            if (!allowedPaymentMethods.includes(paymentMethod)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid payment method",
                });
            }

            filter.paymentMethod = paymentMethod;
        }

        if (startDate || endDate) {
            filter.date = {};

            if (startDate) {
                const parsedStartDate = new Date(startDate);

                if (Number.isNaN(parsedStartDate.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid start date",
                    });
                }

                filter.date.$gte = parsedStartDate;
            }

            if (endDate) {
                const parsedEndDate = new Date(endDate);

                if (Number.isNaN(parsedEndDate.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid end date",
                    });
                }

                parsedEndDate.setHours(23, 59, 59, 999);
                filter.date.$lte = parsedEndDate;
            }
        }

        if (search?.trim()) {
            filter.$or = [
                {
                    title: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
                {
                    description: {
                        $regex: search.trim(),
                        $options: "i",
                    },
                },
            ];
        }

        const sortOptions = {
            newest: { date: -1, createdAt: -1 },
            oldest: { date: 1, createdAt: 1 },
            highest: { amount: -1 },
            lowest: { amount: 1 },
        };

        const selectedSort = sortOptions[sort] || sortOptions.newest;

        const parsedPage = Math.max(Number.parseInt(page, 10) || 1, 1);
        const parsedLimit = Math.min(
            Math.max(Number.parseInt(limit, 10) || 20, 1),
            100
        );

        const skip = (parsedPage - 1) * parsedLimit;

        const [transactions, totalTransactions] = await Promise.all([
            Transaction.find(filter)
                .sort(selectedSort)
                .skip(skip)
                .limit(parsedLimit),
            Transaction.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            count: transactions.length,
            total: totalTransactions,
            currentPage: parsedPage,
            totalPages: Math.ceil(totalTransactions / parsedLimit),
            data: transactions,
        });
    } catch (error) {
        console.error("Get transactions error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve transactions",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Get one transaction
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const transactionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID",
            });
        }

        const transaction = await Transaction.findOne({
            _id: transactionId,
            user: userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: transaction,
        });
    } catch (error) {
        console.error("Get transaction error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve transaction",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Update a transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const transactionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID",
            });
        }

        const validationErrors = validateTransactionData(req.body, true);

        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            });
        }

        const allowedUpdates = [
            "title",
            "amount",
            "type",
            "category",
            "description",
            "date",
            "paymentMethod",
        ];

        const updates = {};

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        if (updates.title !== undefined) {
            updates.title = updates.title.trim();
        }

        if (updates.amount !== undefined) {
            updates.amount = Number(updates.amount);
        }

        if (updates.type !== undefined) {
            updates.type = updates.type.toLowerCase();
        }

        if (updates.category !== undefined) {
            updates.category = updates.category.trim();
        }

        if (updates.description !== undefined) {
            updates.description = updates.description.trim();
        }

        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: transactionId,
                user: userId,
            },
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully",
            data: transaction,
        });
    } catch (error) {
        console.error("Update transaction error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to update transaction",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
    try {
        const userId = getAuthenticatedUserId(req);
        const transactionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid transaction ID",
            });
        }

        const transaction = await Transaction.findOneAndDelete({
            _id: transactionId,
            user: userId,
        });

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully",
        });
    } catch (error) {
        console.error("Delete transaction error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to delete transaction",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : "Internal server error",
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
};