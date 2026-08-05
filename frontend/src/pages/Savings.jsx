import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import SavingsForm from "../components/savings/SavingsForm";
import SavingsList from "../components/savings/SavingsList";

import {
    getSavingsGoals,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
} from "../services/savingsService";


function Savings() {
    const { user } = useAuth();

    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [updatingId, setUpdatingId] = useState("");
    const [deletingId, setDeletingId] = useState("");

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const fetchGoals = async (showLoader = true) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const response = await getSavingsGoals();

            if (response?.success) {
                setGoals(response.data || []);
            } else {
                setError(
                    response?.message ||
                    "Failed to retrieve savings goals."
                );
            }
        } catch (err) {
            console.error("Fetch savings goals error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load savings goals."
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchGoals(true);

        const refreshGoals = () => {
            fetchGoals(false);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchGoals(false);
            }
        };

        const refreshInterval = window.setInterval(
            refreshGoals,
            30000
        );

        window.addEventListener("focus", refreshGoals);

        window.addEventListener(
            "financialDataUpdated",
            refreshGoals
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            window.clearInterval(refreshInterval);

            window.removeEventListener(
                "focus",
                refreshGoals
            );

            window.removeEventListener(
                "financialDataUpdated",
                refreshGoals
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, []);

    const notifyFinancialDataUpdated = () => {
        const updatedAt = new Date().toISOString();

        localStorage.setItem(
            "financialDataUpdatedAt",
            updatedAt
        );

        window.dispatchEvent(
            new CustomEvent("financialDataUpdated", {
                detail: {
                    source: "savings",
                    updatedAt,
                },
            })
        );
    };

    const totalGoals = goals.length;

    const totalTargetAmount = useMemo(() => {
        return goals.reduce(
            (sum, goal) =>
                sum + (Number(goal.targetAmount) || 0),
            0
        );
    }, [goals]);

    const totalSaved = useMemo(() => {
        return goals.reduce(
            (sum, goal) =>
                sum + (Number(goal.savedAmount) || 0),
            0
        );
    }, [goals]);

    const remainingAmount = useMemo(() => {
        return goals.reduce((sum, goal) => {
            const remaining =
                goal.remainingAmount !== undefined
                    ? Number(goal.remainingAmount)
                    : (Number(goal.targetAmount) || 0) -
                    (Number(goal.savedAmount) || 0);

            return sum + Math.max(remaining || 0, 0);
        }, 0);
    }, [goals]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: user?.currency || "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);
    };

    const handleAddGoal = async (newGoalData) => {
        try {
            setSubmitting(true);
            setError("");
            setSuccessMessage("");

            const response =
                await createSavingsGoal(newGoalData);

            if (response?.success && response.data) {
                setGoals((previousGoals) => [
                    response.data,
                    ...previousGoals,
                ]);

                setSuccessMessage(
                    "Savings goal created successfully."
                );

                notifyFinancialDataUpdated();

                return response.data;
            }

            throw new Error(
                response?.message ||
                "Could not create savings goal."
            );
        } catch (err) {
            console.error("Create savings goal error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to create savings goal."
            );

            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdateGoal = async (
        id,
        updatedFields
    ) => {
        try {
            setUpdatingId(id);
            setError("");
            setSuccessMessage("");

            const response = await updateSavingsGoal(
                id,
                updatedFields
            );

            if (response?.success && response.data) {
                setGoals((previousGoals) =>
                    previousGoals.map((goal) =>
                        goal._id === id
                            ? response.data
                            : goal
                    )
                );

                setSuccessMessage(
                    "Savings contribution updated successfully."
                );

                notifyFinancialDataUpdated();

                return response.data;
            }

            throw new Error(
                response?.message ||
                "Could not update savings goal."
            );
        } catch (err) {
            console.error("Update savings goal error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to update savings contribution."
            );

            throw err;
        } finally {
            setUpdatingId("");
        }
    };

    const handleDeleteGoal = async (id) => {
        const shouldDelete = window.confirm(
            "Are you sure you want to delete this savings goal?"
        );

        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingId(id);
            setError("");
            setSuccessMessage("");

            const response =
                await deleteSavingsGoal(id);

            if (response?.success) {
                setGoals((previousGoals) =>
                    previousGoals.filter(
                        (goal) => goal._id !== id
                    )
                );

                setSuccessMessage(
                    "Savings goal deleted successfully."
                );

                notifyFinancialDataUpdated();

                return;
            }

            throw new Error(
                response?.message ||
                "Could not delete savings goal."
            );
        } catch (err) {
            console.error("Delete savings goal error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to delete savings goal."
            );
        } finally {
            setDeletingId("");
        }
    };

    return (
        <main className="savings-page">
            <header className="savings-header">
                <div>
                    <p className="page-label">
                        Goal-Based Savings
                    </p>

                    <h1>Savings Goals</h1>

                    <p>
                        Plan your dreams, track your
                        milestones, and contribute regularly
                        toward your financial goals.
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
                    <span>{error}</span>

                    <button
                        type="button"
                        className="dashboard-retry-button"
                        onClick={() => fetchGoals(true)}
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

            <section className="savings-summary">
                <article>
                    <span>Total Goals</span>
                    <strong>{totalGoals}</strong>
                </article>

                <article>
                    <span>Total Target Amount</span>

                    <strong>
                        {formatCurrency(
                            totalTargetAmount
                        )}
                    </strong>
                </article>

                <article>
                    <span>Total Saved</span>

                    <strong>
                        {formatCurrency(totalSaved)}
                    </strong>
                </article>

                <article>
                    <span>Remaining Amount</span>

                    <strong>
                        {formatCurrency(
                            remainingAmount
                        )}
                    </strong>
                </article>
            </section>

            <SavingsForm
                onAddGoal={handleAddGoal}
                submitting={submitting}
            />

            <section className="savings-section">
                <div className="savings-section-header">
                    <h2>My Goals</h2>

                    <button
                        type="button"
                        className="refresh-savings-button"
                        onClick={() => fetchGoals(true)}
                        disabled={loading}
                    >
                        {loading
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <h3>
                            Loading savings goals...
                        </h3>
                    </div>
                ) : (
                    <SavingsList
                        goals={goals}
                        onDelete={handleDeleteGoal}
                        onUpdate={handleUpdateGoal}
                        updatingId={updatingId}
                        deletingId={deletingId}
                        currency={
                            user?.currency || "INR"
                        }
                    />
                )}
            </section>
        </main>
    );
}

export default Savings;