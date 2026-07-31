const plaidClient = require("../config/plaid");
const PlaidItem = require("../models/PlaidItem");
const Transaction = require("../models/Transaction");

const createLinkToken = async (req, res) => {
    try {
        const request = {
            user: {
                client_user_id: req.user.id,
            },
            client_name: "Personal Finance Management Dashboard",
            products: process.env.PLAID_PRODUCTS.split(","),
            country_codes: process.env.PLAID_COUNTRY_CODES.split(","),
            language: "en",
        };

        const response = await plaidClient.linkTokenCreate(request);

        res.status(200).json({
            success: true,
            linkToken: response.data.link_token,
        });
    } catch (error) {
        console.error("Plaid Error:", error.response?.data || error);

        res.status(500).json({
            success: false,
            message: "Failed to create Plaid Link Token",
            error: error.response?.data || error.message,
        });
    }
};

const exchangePublicToken = async (req, res) => {
    try {
        const {
            publicToken,
            institutionId = "",
            institutionName = "",
        } = req.body;

        if (!publicToken) {
            return res.status(400).json({
                success: false,
                message: "Public token is required",
            });
        }

        const response =
            await plaidClient.itemPublicTokenExchange({
                public_token: publicToken,
            });

        const {
            access_token: accessToken,
            item_id: itemId,
        } = response.data;

        const plaidItem = await PlaidItem.findOneAndUpdate(
            {
                user: req.user._id,
                itemId,
            },
            {
                user: req.user._id,
                itemId,
                accessToken,
                institutionId,
                institutionName,
                status: "active",
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Bank account connected successfully",
            data: {
                id: plaidItem._id,
                itemId: plaidItem.itemId,
                institutionId: plaidItem.institutionId,
                institutionName: plaidItem.institutionName,
                status: plaidItem.status,
            },
        });
    } catch (error) {
        console.error(
            "Plaid token exchange error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to connect bank account",
            error:
                process.env.NODE_ENV === "development"
                    ? error.response?.data || error.message
                    : "Internal server error",
        });
    }
};

const getConnectedAccounts = async (req, res) => {
    try {
        const plaidItems = await PlaidItem.find({
            user: req.user._id,
            status: "active",
        }).select("+accessToken");

        if (plaidItems.length === 0) {
            return res.status(200).json({
                success: true,
                count: 0,
                data: [],
            });
        }

        const accountGroups = await Promise.all(
            plaidItems.map(async (plaidItem) => {
                const response = await plaidClient.accountsGet({
                    access_token: plaidItem.accessToken,
                });

                return response.data.accounts.map((account) => ({
                    plaidItemId: plaidItem._id,
                    itemId: plaidItem.itemId,
                    institutionId: plaidItem.institutionId,
                    institutionName:
                        plaidItem.institutionName || "Connected Bank",
                    accountId: account.account_id,
                    name: account.name,
                    officialName: account.official_name || "",
                    mask: account.mask || "",
                    type: account.type,
                    subtype: account.subtype,
                    balances: {
                        available:
                            account.balances.available ?? null,
                        current:
                            account.balances.current ?? 0,
                        limit:
                            account.balances.limit ?? null,
                        isoCurrencyCode:
                            account.balances.iso_currency_code || "USD",
                    },
                }));
            })
        );

        const accounts = accountGroups.flat();

        return res.status(200).json({
            success: true,
            count: accounts.length,
            data: accounts,
        });
    } catch (error) {
        console.error(
            "Plaid accounts error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to retrieve connected accounts",
            error:
                process.env.NODE_ENV === "development"
                    ? error.response?.data || error.message
                    : "Internal server error",
        });
    }
};

const syncPlaidTransactions = async (req, res) => {
    try {
        const plaidItems = await PlaidItem.find({
            user: req.user._id,
            status: "active",
        }).select("+accessToken");

        if (plaidItems.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No connected Plaid accounts found",
                added: 0,
                modified: 0,
                removed: 0,
            });
        }

        let totalAdded = 0;
        let totalModified = 0;
        let totalRemoved = 0;

        for (const plaidItem of plaidItems) {
            let cursor =
                plaidItem.transactionCursor || null;

            let hasMore = true;

            while (hasMore) {
                const request = {
                    access_token:
                        plaidItem.accessToken,
                };

                if (cursor) {
                    request.cursor = cursor;
                }

                const response =
                    await plaidClient.transactionsSync(
                        request
                    );

                const {
                    added = [],
                    modified = [],
                    removed = [],
                    next_cursor: nextCursor,
                    has_more: responseHasMore,
                } = response.data;

                for (const plaidTransaction of added) {
                    const isIncome =
                        Number(plaidTransaction.amount) < 0;

                    const amount = Math.abs(
                        Number(
                            plaidTransaction.amount
                        ) || 0
                    );

                    await Transaction.findOneAndUpdate(
                        {
                            user: req.user._id,
                            plaidTransactionId:
                                plaidTransaction.transaction_id,
                        },
                        {
                            user: req.user._id,
                            title:
                                plaidTransaction.merchant_name ||
                                plaidTransaction.name ||
                                "Plaid Transaction",
                            amount,
                            type: isIncome
                                ? "income"
                                : "expense",
                            category:
                                plaidTransaction
                                    .personal_finance_category
                                    ?.primary ||
                                plaidTransaction.category?.[0] ||
                                "Other",
                            description:
                                plaidTransaction.name || "",
                            date: new Date(
                                plaidTransaction.date
                            ),
                            paymentMethod: "bank-transfer",
                            source: "plaid",
                            plaidTransactionId:
                                plaidTransaction.transaction_id,
                            plaidAccountId:
                                plaidTransaction.account_id,
                            merchantName:
                                plaidTransaction.merchant_name ||
                                "",
                        },
                        {
                            upsert: true,
                            new: true,
                            runValidators: true,
                        }
                    );

                    totalAdded += 1;
                }

                for (const plaidTransaction of modified) {
                    const isIncome =
                        Number(plaidTransaction.amount) < 0;

                    const amount = Math.abs(
                        Number(
                            plaidTransaction.amount
                        ) || 0
                    );

                    await Transaction.findOneAndUpdate(
                        {
                            user: req.user._id,
                            plaidTransactionId:
                                plaidTransaction.transaction_id,
                        },
                        {
                            title:
                                plaidTransaction.merchant_name ||
                                plaidTransaction.name ||
                                "Plaid Transaction",
                            amount,
                            type: isIncome
                                ? "income"
                                : "expense",
                            category:
                                plaidTransaction
                                    .personal_finance_category
                                    ?.primary ||
                                plaidTransaction.category?.[0] ||
                                "Other",
                            description:
                                plaidTransaction.name || "",
                            date: new Date(
                                plaidTransaction.date
                            ),
                            paymentMethod: "bank-transfer",
                            source: "plaid",
                            plaidAccountId:
                                plaidTransaction.account_id,
                            merchantName:
                                plaidTransaction.merchant_name ||
                                "",
                        },
                        {
                            new: true,
                            runValidators: true,
                        }
                    );

                    totalModified += 1;
                }

                for (const removedTransaction of removed) {
                    await Transaction.findOneAndDelete({
                        user: req.user._id,
                        plaidTransactionId:
                            removedTransaction.transaction_id,
                    });

                    totalRemoved += 1;
                }

                cursor = nextCursor;
                hasMore = Boolean(responseHasMore);
            }

            plaidItem.transactionCursor = cursor;
            plaidItem.lastSyncedAt = new Date();

            await plaidItem.save();
        }

        return res.status(200).json({
            success: true,
            message:
                "Plaid transactions synchronized successfully",
            added: totalAdded,
            modified: totalModified,
            removed: totalRemoved,
        });
    } catch (error) {
        console.error(
            "Plaid transaction sync error:",
            error.response?.data ||
            error.message
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to synchronize Plaid transactions",
            error:
                process.env.NODE_ENV ===
                    "development"
                    ? error.response?.data ||
                    error.message
                    : "Internal server error",
        });
    }
};

module.exports = {
    createLinkToken,
    exchangePublicToken,
    getConnectedAccounts,
    syncPlaidTransactions
};