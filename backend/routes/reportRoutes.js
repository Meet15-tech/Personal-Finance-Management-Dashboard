const express = require("express");

const {
    getFinancialSummaryReport,
    getCategoryReport,
    getMonthlyReport,
    getPaymentMethodReport,
} = require("../controllers/reportController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Financial Summary
router.get("/summary", protect, getFinancialSummaryReport);

// Category Breakdown
router.get("/category-breakdown", protect, getCategoryReport);

// Monthly Trend
router.get("/monthly-trend", protect, getMonthlyReport);

// Payment Method Breakdown
router.get("/payment-methods", protect, getPaymentMethodReport);

module.exports = router;