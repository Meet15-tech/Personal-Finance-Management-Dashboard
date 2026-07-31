import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import BudgetForm from "../components/budgets/BudgetForm";
import BudgetList from "../components/budgets/BudgetList";

import {
    getBudgets,
    createBudget as apiCreateBudget,
    deleteBudget as apiDeleteBudget,
} from "../services/budgetService";

import "./Budgets.css";

function Budgets() {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchBudgetsData = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const response = await getBudgets();

            if (response?.success) {
                setBudgets(response.data || []);
            }
        } catch (err) {
            console.error("Failed to load budgets:", err);

            setError(
                err.response?.data?.message ||
                "Could not load budgets from the server."
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchBudgetsData(true);

        const handleWindowFocus = () => {
            fetchBudgetsData(false);
        };

        const handleFinancialDataUpdated = () => {
            fetchBudgetsData(false);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchBudgetsData(false);
            }
        };

        window.addEventListener("focus", handleWindowFocus);

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
    }, []);

    const totalBudget = useMemo(() => {
        return budgets.reduce(
            (total, budget) =>
                total + (Number(budget.limit) || 0),
            0
        );
    }, [budgets]);

    const totalSpent = useMemo(() => {
        return budgets.reduce(
            (total, budget) =>
                total + (Number(budget.spent) || 0),
            0
        );
    }, [budgets]);

    const totalRemaining = useMemo(() => {
        return budgets.reduce(
            (total, budget) =>
                total + (Number(budget.remaining) || 0),
            0
        );
    }, [budgets]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);
    };

    const handleAddBudget = async (budgetData) => {
        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            const response =
                await apiCreateBudget(budgetData);

            if (response?.success && response.data) {
                setSuccessMessage(
                    "Budget created successfully."
                );

                await fetchBudgetsData(false);
            }
        } catch (err) {
            console.error("Failed to create budget:", err);

            setError(
                err.response?.data?.message ||
                "Failed to create budget."
            );

            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteBudget = async (budgetId) => {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this budget?"
        );

        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingId(budgetId);
            setError("");
            setSuccessMessage("");

            const response =
                await apiDeleteBudget(budgetId);

            if (response?.success) {
                setBudgets((previousBudgets) =>
                    previousBudgets.filter(
                        (budget) =>
                            (budget._id || budget.id) !==
                            budgetId
                    )
                );

                setSuccessMessage(
                    "Budget deleted successfully."
                );
            }
        } catch (err) {
            console.error("Failed to delete budget:", err);

            setError(
                err.response?.data?.message ||
                "Failed to delete budget."
            );
        } finally {
            setDeletingId("");
        }
    };

    return (
        <main className="budgets-page">
            <header className="budgets-header">
                <div>
                    <p className="page-label">
                        Financial Planning
                    </p>

                    <h1>Budget Management</h1>

                    <p>
                        Create monthly spending limits and track
                        your financial progress using live
                        transaction data.
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="secondary-button"
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
                            fetchBudgetsData(true)
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

            <section className="budget-summary">
                <article>
                    <span>Total Budget</span>

                    <strong>
                        {formatCurrency(totalBudget)}
                    </strong>
                </article>

                <article>
                    <span>Total Spent</span>

                    <strong>
                        {formatCurrency(totalSpent)}
                    </strong>
                </article>

                <article>
                    <span>Remaining</span>

                    <strong>
                        {formatCurrency(totalRemaining)}
                    </strong>
                </article>
            </section>

            <BudgetForm
                onAddBudget={handleAddBudget}
                submitting={submitting}
            />

            <section className="budgets-section">
                <h2>Monthly Budgets</h2>

                {loading ? (
                    <div className="loading-spinner">
                        Loading budgets...
                    </div>
                ) : (
                    <BudgetList
                        budgets={budgets}
                        onDelete={handleDeleteBudget}
                        deletingId={deletingId}
                    />
                )}
            </section>
        </main>
    );
}

export default Budgets;