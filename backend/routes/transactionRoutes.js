const express = require("express");

const {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").post(createTransaction).get(getTransactions);

router
    .route("/:id")
    .get(getTransactionById)
    .put(updateTransaction)
    .delete(deleteTransaction);

module.exports = router;