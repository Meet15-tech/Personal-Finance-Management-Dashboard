const express = require("express");

const {
    getFinancialSummary,
    getCategoryBreakdown,
    getMonthlyTrend,
    getPaymentMethodBreakdown,
} = require("../controllers/analyticsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/summary", getFinancialSummary);
router.get("/category-breakdown", getCategoryBreakdown);
router.get("/monthly-trend", getMonthlyTrend);
router.get("/payment-methods", getPaymentMethodBreakdown);

module.exports = router;
