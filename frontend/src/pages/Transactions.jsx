import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import { useNotifications } from "../context/NotificationContext";
import {
    getTransactions,
    createTransaction as apiCreateTransaction,
    deleteTransaction as apiDeleteTransaction,
} from "../services/transactionService";
import { exportCsv, buildTransactionExportRows } from "../utils/exportUtils";

function Transactions() {
    const { addNotification } = useNotifications();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactionsData = async () => {
        try {
            setLoading(true);
            const response = await getTransactions({ limit: 100 });
            if (response.success) {
                setTransactions(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
            setError("Could not load transactions from server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactionsData();
    }, []);

    const summary = useMemo(() => {
        return transactions.reduce(
            (totals, transaction) => {
                if (transaction.type === "income") {
                    totals.income += transaction.amount;
                } else {
                    totals.expense += transaction.amount;
                }

                totals.balance = totals.income - totals.expense;

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
        }).format(amount);
    };

    const handleExportTransactions = () => {
        exportCsv(
            `transactions-${new Date().toISOString().slice(0, 10)}.csv`,
            buildTransactionExportRows(transactions, "INR")
        );
        addNotification({
            type: "success",
            title: "Export ready",
            message: "Your transaction list has been downloaded as a CSV file.",
        });
    };

    const handleAddTransaction = async (formData) => {
        try {
            setError("");
            const response = await apiCreateTransaction(formData);
            if (response.success && response.data) {
                setTransactions((prev) => [response.data, ...prev]);
                addNotification({
                    type: "success",
                    title: "Transaction added",
                    message: "Your new transaction is now visible in your activity feed.",
                });
            }
        } catch (err) {
            console.error("Failed to add transaction:", err);
            setError(
                err.response?.data?.message || "Failed to save transaction to database."
            );
            addNotification({
                type: "error",
                title: "Unable to save transaction",
                message: err.response?.data?.message || "Please try again in a moment.",
            });
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!shouldDelete) {
            return;
        }

        try {
            setError("");
            const response = await apiDeleteTransaction(transactionId);
            if (response.success) {
                setTransactions((prev) =>
                    prev.filter(
                        (t) => (t._id || t.id) !== transactionId
                    )
                );
                addNotification({
                    type: "warning",
                    title: "Transaction removed",
                    message: "The selected transaction has been deleted from your records.",
                });
            }
        } catch (err) {
            console.error("Failed to delete transaction:", err);
            setError(
                err.response?.data?.message || "Failed to delete transaction from database."
            );
            addNotification({
                type: "error",
                title: "Delete failed",
                message: err.response?.data?.message || "Please try again in a moment.",
            });
        }
    };

    return (
        <main className="transactions-page">
            <header className="transactions-header">
                <div>
                    <p className="page-label">Personal Finance Dashboard</p>
                    <h1>Transaction Management</h1>
                    <p>
                        Record and review your income and expenses stored securely in your MongoDB database.
                    </p>
                </div>

                <div className="transactions-header-actions">
                    <button type="button" className="secondary-button" onClick={handleExportTransactions}>
                        Export CSV
                    </button>
                    <Link className="secondary-button" to="/dashboard">
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            {error && <div className="form-error mb-4">{error}</div>}

            <section className="summary-grid">
                <article className="summary-card">
                    <p>Total Income</p>
                    <h2>{formatCurrency(summary.income)}</h2>
                    <span className="income-text">Money received</span>
                </article>

                <article className="summary-card">
                    <p>Total Expenses</p>
                    <h2>{formatCurrency(summary.expense)}</h2>
                    <span className="expense-text">Money spent</span>
                </article>

                <article className="summary-card">
                    <p>Current Balance</p>
                    <h2>{formatCurrency(summary.balance)}</h2>
                    <span>Income minus expenses</span>
                </article>
            </section>

            <section className="transactions-layout">
                <TransactionForm onAddTransaction={handleAddTransaction} />

                {loading ? (
                    <div className="loading-spinner">Loading transactions...</div>
                ) : (
                    <TransactionList
                        transactions={transactions}
                        onDeleteTransaction={handleDeleteTransaction}
                    />
                )}
            </section>
        </main>
    );
}

export default Transactions;