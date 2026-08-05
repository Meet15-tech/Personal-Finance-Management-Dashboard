import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

import {
    getTransactions,
    createTransaction as apiCreateTransaction,
    updateTransaction as apiUpdateTransaction,
    deleteTransaction as apiDeleteTransaction,
} from "../services/transactionService";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const notifyFinancialDataUpdated = () => {
        const updatedAt = Date.now().toString();

        localStorage.setItem(
            "financialDataUpdatedAt",
            updatedAt
        );

        window.dispatchEvent(
            new CustomEvent("financialDataUpdated", {
                detail: {
                    updatedAt,
                },
            })
        );
    };

    const fetchTransactionsData = async (
        showLoader = true
    ) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const response = await getTransactions({
                limit: 100,
                search,
                type: typeFilter,
                category: categoryFilter,
                sort: sortBy,
            });

            if (response?.success) {
                setTransactions(response.data || []);
            }
        } catch (err) {
            console.error(
                "Failed to fetch transactions:",
                err
            );

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

        const handleFinancialDataUpdated = () => {
            fetchTransactionsData(false);
        };

        const handleVisibilityChange = () => {
            if (
                document.visibilityState ===
                "visible"
            ) {
                fetchTransactionsData(false);
            }
        };

        window.addEventListener(
            "focus",
            handleWindowFocus
        );

        window.addEventListener(
            "financialDataUpdated",
            handleFinancialDataUpdated
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            window.removeEventListener(
                "focus",
                handleWindowFocus
            );

            window.removeEventListener(
                "financialDataUpdated",
                handleFinancialDataUpdated
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [
        search,
        typeFilter,
        categoryFilter,
        sortBy,
    ]);

    const summary = useMemo(() => {
        return transactions.reduce(
            (totals, transaction) => {
                const amount =
                    Number(transaction.amount) || 0;

                if (
                    transaction.type ===
                    "income"
                ) {
                    totals.income += amount;
                }

                if (
                    transaction.type ===
                    "expense"
                ) {
                    totals.expense += amount;
                }

                totals.balance =
                    totals.income -
                    totals.expense;

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

    const handleAddTransaction = async (
        formData
    ) => {
        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            const response =
                await apiCreateTransaction(
                    formData
                );

            if (
                response?.success &&
                response.data
            ) {
                setTransactions(
                    (previousTransactions) => [
                        response.data,
                        ...previousTransactions,
                    ]
                );

                setSuccessMessage(
                    "Transaction added successfully."
                );

                notifyFinancialDataUpdated();

                return response.data;
            }

            throw new Error(
                response?.message ||
                "Failed to create transaction."
            );
        } catch (err) {
            console.error(
                "Failed to add transaction:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to save the transaction to the database."
            );

            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditTransaction = (
        transaction
    ) => {
        setEditingTransaction(transaction);
        setError("");
        setSuccessMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleUpdateTransaction = async (
        transactionId,
        formData
    ) => {
        try {
            setUpdating(true);
            setError("");
            setSuccessMessage("");

            const response =
                await apiUpdateTransaction(
                    transactionId,
                    formData
                );

            if (
                response?.success &&
                response.data
            ) {
                setTransactions(
                    (previousTransactions) =>
                        previousTransactions.map(
                            (transaction) =>
                                (transaction._id ||
                                    transaction.id) ===
                                    transactionId
                                    ? response.data
                                    : transaction
                        )
                );

                setEditingTransaction(null);

                setSuccessMessage(
                    "Transaction updated successfully."
                );

                notifyFinancialDataUpdated();

                return response.data;
            }

            throw new Error(
                response?.message ||
                "Failed to update transaction."
            );
        } catch (err) {
            console.error(
                "Failed to update transaction:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update the transaction."
            );

            throw err;
        } finally {
            setUpdating(false);
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
                await apiDeleteTransaction(
                    transactionId
                );

            if (response?.success) {
                setTransactions(
                    (previousTransactions) =>
                        previousTransactions.filter(
                            (transaction) =>
                                (transaction._id ||
                                    transaction.id) !==
                                transactionId
                        )
                );

                const editingId =
                    editingTransaction?._id ||
                    editingTransaction?.id;

                if (
                    editingId ===
                    transactionId
                ) {
                    setEditingTransaction(null);
                }

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

                    <h1>
                        Transaction Management
                    </h1>

                    <p>
                        Record, edit and review your
                        income and expenses stored
                        securely in your MongoDB
                        database.
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
                    <span>{error}</span>

                    <button
                        type="button"
                        className="dashboard-retry-button"
                        onClick={() =>
                            fetchTransactionsData(
                                true
                            )
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
                        {formatCurrency(
                            summary.income
                        )}
                    </h2>

                    <span className="income-text">
                        Money received
                    </span>
                </article>

                <article className="summary-card">
                    <p>Total Expenses</p>

                    <h2>
                        {formatCurrency(
                            summary.expense
                        )}
                    </h2>

                    <span className="expense-text">
                        Money spent
                    </span>
                </article>

                <article className="summary-card">
                    <p>Current Balance</p>

                    <h2>
                        {formatCurrency(
                            summary.balance
                        )}
                    </h2>

                    <span>
                        Income minus expenses
                    </span>
                </article>
            </section>

            <section className="transaction-filter-card">
                <div className="transaction-filter-header">
                    <div>
                        <p className="section-label">
                            Search & Filters
                        </p>

                        <h2>Filter Transactions</h2>
                    </div>

                    <button
                        type="button"
                        className="clear-filters-button"
                        onClick={() => {
                            setSearch("");
                            setTypeFilter("");
                            setCategoryFilter("");
                            setSortBy("newest");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>

                <div className="transaction-filter-grid">
                    <div className="form-group">
                        <label htmlFor="transaction-search">
                            Search
                        </label>

                        <input
                            id="transaction-search"
                            type="search"
                            placeholder="Search title, category or description"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="type-filter">
                            Type
                        </label>

                        <select
                            id="type-filter"
                            value={typeFilter}
                            onChange={(event) =>
                                setTypeFilter(event.target.value)
                            }
                        >
                            <option value="">
                                All Types
                            </option>

                            <option value="income">
                                Income
                            </option>

                            <option value="expense">
                                Expense
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category-filter">
                            Category
                        </label>

                        <input
                            id="category-filter"
                            type="text"
                            placeholder="Example: Food"
                            value={categoryFilter}
                            onChange={(event) =>
                                setCategoryFilter(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sort-filter">
                            Sort By
                        </label>

                        <select
                            id="sort-filter"
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(event.target.value)
                            }
                        >
                            <option value="newest">
                                Newest First
                            </option>

                            <option value="oldest">
                                Oldest First
                            </option>

                            <option value="highest">
                                Highest Amount
                            </option>

                            <option value="lowest">
                                Lowest Amount
                            </option>
                        </select>
                    </div>
                </div>
            </section>

            <section className="transactions-layout">
                <TransactionForm
                    onAddTransaction={
                        handleAddTransaction
                    }
                    onUpdateTransaction={
                        handleUpdateTransaction
                    }
                    editingTransaction={
                        editingTransaction
                    }
                    submitting={submitting}
                    updating={updating}
                    onCancelEdit={() =>
                        setEditingTransaction(null)
                    }
                />

                {loading ? (
                    <div className="loading-spinner">
                        Loading transactions...
                    </div>
                ) : (
                    <TransactionList
                        transactions={
                            transactions
                        }
                        onDeleteTransaction={
                            handleDeleteTransaction
                        }
                        onEditTransaction={
                            handleEditTransaction
                        }
                        deletingId={deletingId}
                        editingId={
                            editingTransaction?._id ||
                            editingTransaction?.id ||
                            ""
                        }
                    />
                )}
            </section>
        </main>
    );
}

export default Transactions;