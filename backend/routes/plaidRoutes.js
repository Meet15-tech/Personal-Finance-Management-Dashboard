const express = require("express");
const router = express.Router();

const {
    createLinkToken,
    exchangePublicToken,
    getConnectedAccounts,
    syncPlaidTransactions,
} = require("../controllers/plaidController");

const {
    protect,
} = require("../middleware/authMiddleware");

router.post(
    "/create-link-token",
    protect,
    createLinkToken
);

router.post(
    "/exchange-public-token",
    protect,
    exchangePublicToken
);

router.get(
    "/accounts",
    protect,
    getConnectedAccounts
);

router.post(
    "/sync-transactions",
    protect,
    syncPlaidTransactions
);

module.exports = router;