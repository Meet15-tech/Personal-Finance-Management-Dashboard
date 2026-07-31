import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

import {
    getTransactions,
    createTransaction as apiCreateTransaction,
    deleteTransaction as apiDeleteTransaction,
} from "../services/transactionService";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const notifyFinancialDataUpdated = () => {
        const updatedAt = Date.now().toString();

        localStorage.setItem("financialDataUpdatedAt", updatedAt);

        window.dispatchEvent(
            new CustomEvent("financialDataUpdated", {
                detail: {
                    updatedAt,
                },
            })
        );
    };

    const fetchTransactionsData = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const response = await getTransactions({
                limit: 100,
            });

            if (response?.success) {
                setTransactions(response.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch transactions:", err);

            setError(
                err.response?.data?.message ||
                "Could not load transactions from the server."
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchTransactionsData(true);

        const handleWindowFocus = () => {
            fetchTransactionsData(false);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchTransactionsData(false);
            }
        };

        window.addEventListener("focus", handleWindowFocus);
        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            window.removeEventListener("focus", handleWindowFocus);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    const summary = useMemo(() => {
        return transactions.reduce(
            (totals, transaction) => {
                const amount = Number(transaction.amount) || 0;

                if (transaction.type === "income") {
                    totals.income += amount;
                }

                if (transaction.type === "expense") {
                    totals.expense += amount;
                }

                totals.balance =
                    totals.income - totals.expense;

                return totals;
            },
            {
                income: 0,
                expense: 0,
                balance: 0,
            }
        );
    }, [transactions]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount) || 0);
    };

    const handleAddTransaction = async (formData) => {
        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            const response =
                await apiCreateTransaction(formData);

            if (response?.success && response.data) {
                setTransactions((previousTransactions) => [
                    response.data,
                    ...previousTransactions,
                ]);

                setSuccessMessage(
                    "Transaction added successfully."
                );

                notifyFinancialDataUpdated();
            }
        } catch (err) {
            console.error("Failed to add transaction:", err);

            setError(
                err.response?.data?.message ||
                "Failed to save the transaction to the database."
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteTransaction = async (
        transactionId
    ) => {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingId(transactionId);
            setError("");
            setSuccessMessage("");

            const response =
                await apiDeleteTransaction(transactionId);

            if (response?.success) {
                setTransactions((previousTransactions) =>
                    previousTransactions.filter(
                        (transaction) =>
                            (transaction._id ||
                                transaction.id) !==
                            transactionId
                    )
                );

                setSuccessMessage(
                    "Transaction deleted successfully."
                );

                notifyFinancialDataUpdated();
            }
        } catch (err) {
            console.error(
                "Failed to delete transaction:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Failed to delete the transaction from the database."
            );
        } finally {
            setDeletingId("");
        }
    };

    return (
        <main className="transactions-page">
            <header className="transactions-header">
                <div>
                    <p className="page-label">
                        Personal Finance Dashboard
                    </p>

                    <h1>Transaction Management</h1>

                    <p>
                        Record and review your income and
                        expenses stored securely in your
                        MongoDB database.
                    </p>
                </div>

                <Link
                    className="secondary-button"
                    to="/dashboard"
                >
                    Back to Dashboard
                </Link>
            </header>

            {error && (
                <div className="form-error">
                    {error}

                    <button
                        type="button"
                        className="dashboard-retry-button"
                        onClick={() =>
                            fetchTransactionsData(true)
                        }
                    >
                        Retry
                    </button>
                </div>
            )}

            {successMessage && (
                <div className="form-success">
                    {successMessage}
                </div>
            )}

            <section className="summary-grid">
                <article className="summary-card">
                    <p>Total Income</p>

                    <h2>
                        {formatCurrency(summary.income)}
                    </h2>

                    <span className="income-text">
                        Money received
                    </span>
                </article>

                <article className="summary-card">
                    <p>Total Expenses</p>

                    <h2>
                        {formatCurrency(summary.expense)}
                    </h2>

                    <span className="expense-text">
                        Money spent
                    </span>
                </article>

                <article className="summary-card">
                    <p>Current Balance</p>

                    <h2>
                        {formatCurrency(summary.balance)}
                    </h2>

                    <span>Income minus expenses</span>
                </article>
            </section>

            <section className="transactions-layout">
                <TransactionForm
                    onAddTransaction={
                        handleAddTransaction
                    }
                    submitting={submitting}
                />

                {loading ? (
                    <div className="loading-spinner">
                        Loading transactions...
                    </div>
                ) : (
                    <TransactionList
                        transactions={transactions}
                        onDeleteTransaction={
                            handleDeleteTransaction
                        }
                        deletingId={deletingId}
                    />
                )}
            </section>
        </main>
    );
}

export default Transactions;