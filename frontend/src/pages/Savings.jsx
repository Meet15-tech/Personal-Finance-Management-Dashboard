import { useEffect, useMemo, useState } from "react";
import useAuth from "../hooks/useAuth";
import SavingsForm from "../components/savings/SavingsForm";
import SavingsList from "../components/savings/SavingsList";
import {
    getSavingsGoals,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
} from "../services/savingsService";
import "./Savings.css";

function Savings() {
    const { user } = useAuth();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchGoals = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getSavingsGoals();
            if (response.success) {
                setGoals(response.data);
            } else {
                setError(response.message || "Failed to retrieve savings goals");
            }
        } catch (err) {
            console.error("Fetch goals error:", err);
            setError("Unable to connect to the server. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const totalGoals = goals.length;

    const totalTargetAmount = useMemo(
        () => goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0),
        [goals]
    );

    const totalSaved = useMemo(
        () => goals.reduce((sum, goal) => sum + (goal.savedAmount || 0), 0),
        [goals]
    );

    const remainingAmount = useMemo(
        () => goals.reduce((sum, goal) => sum + (goal.remainingAmount || 0), 0),
        [goals]
    );

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: user?.currency || "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    const handleAddGoal = async (newGoalData) => {
        try {
            setError("");
            const response = await createSavingsGoal(newGoalData);
            if (response.success) {
                setGoals((prev) => [response.data, ...prev]);
            } else {
                setError(response.message || "Could not create savings goal");
            }
        } catch (err) {
            console.error("Add goal error:", err);
            setError(err.response?.data?.message || "Failed to add goal.");
        }
    };

    const handleUpdateGoal = async (id, updatedFields) => {
        try {
            setError("");
            const response = await updateSavingsGoal(id, updatedFields);
            if (response.success) {
                setGoals((prev) =>
                    prev.map((g) => (g._id === id ? response.data : g))
                );
            } else {
                setError(response.message || "Could not update savings goal");
            }
        } catch (err) {
            console.error("Update goal error:", err);
            setError(err.response?.data?.message || "Failed to update contribution.");
        }
    };

    const handleDeleteGoal = async (id) => {
        if (!window.confirm("Are you sure you want to delete this savings goal?")) {
            return;
        }

        try {
            setError("");
            const response = await deleteSavingsGoal(id);
            if (response.success) {
                setGoals((prev) => prev.filter((g) => g._id !== id));
            } else {
                setError(response.message || "Could not delete savings goal");
            }
        } catch (err) {
            console.error("Delete goal error:", err);
            setError("Failed to delete goal.");
        }
    };

    if (loading) {
        return (
            <main className="savings-page">
                <div className="loading-container">
                    <h3>Loading savings goals...</h3>
                </div>
            </main>
        );
    }

    return (
        <main className="savings-page">
            <header className="savings-header">
                <div>
                    <p className="page-label">Goal-Based Savings</p>
                    <h1>Savings Goals</h1>
                    <p>
                        Plan your dreams, track your milestones, and contribute regularly toward your financial goals.
                    </p>
                </div>
            </header>

            {error && <div className="form-error mb-4 text-red-500 font-semibold">{error}</div>}

            <section className="savings-summary">
                <article>
                    <span>Total Goals</span>
                    <strong>{totalGoals}</strong>
                </article>

                <article>
                    <span>Total Target Amount</span>
                    <strong>{formatCurrency(totalTargetAmount)}</strong>
                </article>

                <article>
                    <span>Total Saved</span>
                    <strong>{formatCurrency(totalSaved)}</strong>
                </article>

                <article>
                    <span>Remaining Amount</span>
                    <strong>{formatCurrency(remainingAmount)}</strong>
                </article>
            </section>

            <SavingsForm onAddGoal={handleAddGoal} />

            <section className="savings-section">
                <h2 className="mb-4">My Goals</h2>
                <SavingsList
                    goals={goals}
                    onDelete={handleDeleteGoal}
                    onUpdate={handleUpdateGoal}
                />
            </section>
        </main>
    );
}

export default Savings;
