const express = require("express");

const {
    createGoal,
    getGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
} = require("../controllers/savingsController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Protect all routes with JWT middleware
router.use(protect);

router.route("/").post(createGoal).get(getGoals);

router
    .route("/:id")
    .get(getGoalById)
    .put(updateGoal)
    .delete(deleteGoal);

module.exports = router;
