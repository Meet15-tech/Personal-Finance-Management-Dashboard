import { useState } from "react";

function SavingsCard({ goal, onDelete, onUpdate }) {
    const [contribAmount, setContribAmount] = useState("");
    const [error, setError] = useState("");

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    const targetDateFormatted = new Date(goal.targetDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const handleContributionSubmit = (e) => {
        e.preventDefault();
        setError("");

        const amount = Number(contribAmount);
        if (isNaN(amount) || amount <= 0) {
            setError("Enter a positive amount");
            return;
        }

        const newSavedAmount = (goal.savedAmount || 0) + amount;
        
        // Let's call the update handler with the new savedAmount
        onUpdate(goal._id, { savedAmount: newSavedAmount });
        setContribAmount("");
    };

    return (
        <article className={`savings-card ${goal.status === "Completed" ? "completed-goal" : ""}`}>
            <div className="savings-card-header">
                <div>
                    <span className="goal-category">{goal.category}</span>
                    <h3>{goal.name}</h3>
                    <p className="goal-date">Target Date: {targetDateFormatted}</p>
                </div>

                <div className="header-actions">
                    <span className={`status-badge ${goal.status === "Completed" ? "status-success" : "status-progress"}`}>
                        {goal.status}
                    </span>
                    <button
                        type="button"
                        className="delete-goal-btn"
                        onClick={() => onDelete(goal._id)}
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="savings-progress-section">
                <div className="progress-info">
                    <span>{goal.percentageCompleted}% Saved</span>
                    <span>{formatCurrency(goal.savedAmount)} of {formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="savings-progress-bar">
                    <div
                        className={`savings-progress-bar-value ${goal.status === "Completed" ? "bg-green" : "bg-blue"}`}
                        style={{ width: `${goal.percentageCompleted}%` }}
                    />
                </div>
            </div>

            <div className="savings-details">
                <p>
                    Remaining Amount:{" "}
                    <strong>{formatCurrency(goal.remainingAmount)}</strong>
                </p>
                {goal.notes && <p className="goal-notes">“{goal.notes}”</p>}
            </div>

            {goal.status !== "Completed" ? (
                <form className="contribution-form" onSubmit={handleContributionSubmit}>
                    <input
                        type="number"
                        min="1"
                        placeholder="Amount"
                        value={contribAmount}
                        onChange={(e) => setContribAmount(e.target.value)}
                        required
                    />
                    <button type="submit">+ Contribute</button>
                    {error && <span className="error-text">{error}</span>}
                </form>
            ) : (
                <div className="goal-celebration">
                    🎉 Goal Achieved!
                </div>
            )}
        </article>
    );
}

export default SavingsCard;
