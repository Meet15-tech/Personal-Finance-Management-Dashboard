const express = require("express");

const {
    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
} = require("../controllers/budgetController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").post(createBudget).get(getBudgets);

router
    .route("/:id")
    .get(getBudgetById)
    .put(updateBudget)
    .delete(deleteBudget);

module.exports = router;