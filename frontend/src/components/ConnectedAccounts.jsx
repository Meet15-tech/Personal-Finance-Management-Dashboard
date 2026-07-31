import { useCallback, useEffect, useMemo, useState } from "react";

import {
    getConnectedAccounts,
    syncPlaidTransactions,
} from "../services/plaidService";

function ConnectedAccounts({ refreshKey = 0 }) {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [syncing, setSyncing] = useState(false);
    const [syncMessage, setSyncMessage] = useState("");

    const fetchAccounts = useCallback(
        async (showLoader = true) => {
            try {
                if (showLoader) {
                    setLoading(true);
                }

                setError("");

                const response =
                    await getConnectedAccounts();

                if (!response?.success) {
                    throw new Error(
                        response?.message ||
                        "Unable to retrieve connected accounts."
                    );
                }

                setAccounts(response.data || []);
            } catch (requestError) {
                console.error(
                    "Connected accounts error:",
                    requestError
                );

                setError(
                    requestError.response?.data?.message ||
                    requestError.message ||
                    "Unable to load connected accounts."
                );
            } finally {
                if (showLoader) {
                    setLoading(false);
                }
            }
        },
        []
    );

    const handleSyncTransactions = async () => {
        try {
            setSyncing(true);
            setError("");
            setSyncMessage("");

            const response =
                await syncPlaidTransactions();

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to synchronize transactions."
                );
            }

            setSyncMessage(
                `Sync completed: ${response.added || 0} added, ${response.modified || 0
                } modified, ${response.removed || 0} removed.`
            );

            window.dispatchEvent(
                new CustomEvent("financialDataUpdated", {
                    detail: {
                        source: "plaid-sync",
                        updatedAt: Date.now(),
                    },
                })
            );

            await fetchAccounts(false);
        } catch (requestError) {
            console.error(
                "Plaid transaction sync error:",
                requestError
            );

            setError(
                requestError.response?.data?.message ||
                requestError.message ||
                "Unable to synchronize transactions."
            );
        } finally {
            setSyncing(false);
        }
    };

    useEffect(() => {
        fetchAccounts(true);
    }, [fetchAccounts, refreshKey]);

    const totalCurrentBalance = useMemo(() => {
        return accounts.reduce(
            (total, account) =>
                total +
                (Number(
                    account.balances?.current
                ) || 0),
            0
        );
    }, [accounts]);

    const formatCurrency = (
        amount,
        currencyCode = "USD"
    ) => {
        try {
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: currencyCode,
                maximumFractionDigits: 2,
            }).format(Number(amount) || 0);
        } catch {
            return `${currencyCode} ${Number(amount) || 0
                }`;
        }
    };

    if (loading) {
        return (
            <section className="connected-accounts-card">
                <div className="connected-accounts-loading">
                    Loading connected accounts...
                </div>
            </section>
        );
    }

    return (
        <section className="connected-accounts-card">
            <div className="connected-accounts-header">
                <div>
                    <p className="section-label">
                        Bank Connections
                    </p>

                    <h2>Connected Accounts</h2>

                    <p>
                        View Sandbox bank accounts and
                        their latest available balances.
                    </p>
                </div>

                <div className="connected-accounts-actions">
                    <button
                        type="button"
                        className="sync-transactions-button"
                        onClick={handleSyncTransactions}
                        disabled={syncing}
                    >
                        {syncing
                            ? "Syncing Transactions..."
                            : "Sync Bank Transactions"}
                    </button>

                    <button
                        type="button"
                        className="refresh-accounts-button"
                        onClick={() => fetchAccounts(true)}
                        disabled={syncing}
                    >
                        Refresh Accounts
                    </button>
                </div>
            </div>

            {syncMessage && (
                <div className="plaid-sync-message">
                    {syncMessage}
                </div>
            )}

            {error && (
                <div className="plaid-error-message">
                    <span>{error}</span>

                    <button
                        type="button"
                        onClick={() =>
                            fetchAccounts(true)
                        }
                    >
                        Try Again
                    </button>
                </div>
            )}

            {!error && accounts.length === 0 ? (
                <div className="connected-accounts-empty">
                    <h3>No bank accounts connected</h3>

                    <p>
                        Connect a Sandbox institution to
                        display account balances here.
                    </p>
                </div>
            ) : (
                <>
                    <div className="connected-accounts-summary">
                        <span>
                            Total current balance
                        </span>

                        <strong>
                            {formatCurrency(
                                totalCurrentBalance,
                                accounts[0]?.balances
                                    ?.isoCurrencyCode ||
                                "USD"
                            )}
                        </strong>
                    </div>

                    <div className="connected-accounts-grid">
                        {accounts.map((account) => {
                            const currencyCode =
                                account.balances
                                    ?.isoCurrencyCode ||
                                "USD";

                            return (
                                <article
                                    className="connected-account-item"
                                    key={account.accountId}
                                >
                                    <div className="connected-account-heading">
                                        <div>
                                            <span className="account-institution">
                                                {account.institutionName ||
                                                    "Connected Bank"}
                                            </span>

                                            <h3>
                                                {account.name ||
                                                    "Bank Account"}
                                            </h3>

                                            <p>
                                                {account.type} •{" "}
                                                {account.subtype ||
                                                    "account"}
                                                {account.mask
                                                    ? ` •••• ${account.mask}`
                                                    : ""}
                                            </p>
                                        </div>

                                        <span className="account-status-badge">
                                            Connected
                                        </span>
                                    </div>

                                    <div className="account-balance-row">
                                        <span>
                                            Current Balance
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                account
                                                    .balances
                                                    ?.current,
                                                currencyCode
                                            )}
                                        </strong>
                                    </div>

                                    <div className="account-balance-row">
                                        <span>
                                            Available Balance
                                        </span>

                                        <strong>
                                            {account.balances
                                                ?.available ===
                                                null
                                                ? "Not available"
                                                : formatCurrency(
                                                    account
                                                        .balances
                                                        ?.available,
                                                    currencyCode
                                                )}
                                        </strong>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
}

export default ConnectedAccounts;