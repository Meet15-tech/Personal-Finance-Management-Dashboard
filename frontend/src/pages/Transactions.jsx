import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";

const sampleTransactions = [
    {
        id: "sample-1",
        title: "Monthly Salary",
        amount: 50000,
        type: "income",
        category: "Salary",
        description: "Monthly salary payment",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "bank-transfer",
    },
    {
        id: "sample-2",
        title: "Grocery Shopping",
        amount: 1800,
        type: "expense",
        category: "Groceries",
        description: "Weekly grocery purchase",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "upi",
    },
];

function Transactions() {
    const [transactions, setTransactions] = useState(sampleTransactions);

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

    const handleAddTransaction = (transaction) => {
        setTransactions((previousTransactions) => [
            transaction,
            ...previousTransactions,
        ]);
    };

    const handleDeleteTransaction = (transactionId) => {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!shouldDelete) {
            return;
        }

        setTransactions((previousTransactions) =>
            previousTransactions.filter(
                (transaction) => transaction.id !== transactionId
            )
        );
    };

    return (
        <main className="transactions-page">
            <header className="transactions-header">
                <div>
                    <p className="page-label">Personal Finance Dashboard</p>
                    <h1>Transaction Management</h1>
                    <p>
                        Record and review your income and expenses from one place.
                    </p>
                </div>

                <Link className="secondary-button" to="/dashboard">
                    Back to Dashboard
                </Link>
            </header>

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

                <TransactionList
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                />
            </section>
        </main>
    );
}

export default Transactions;