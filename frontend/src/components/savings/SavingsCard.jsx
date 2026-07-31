import { useState } from "react";

function SavingsCard({
    goal,
    onDelete,
    onUpdate,
    updatingId = "",
    deletingId = "",
    currency = "INR",
}) {
    const [contributionAmount, setContributionAmount] =
        useState("");
    const [validationError, setValidationError] =
        useState("");

    const goalId = goal._id || goal.id;

    const targetAmount =
        Number(goal.targetAmount) || 0;

    const savedAmount =
        Number(goal.savedAmount) || 0;

    const remainingAmount =
        goal.remainingAmount !== undefined
            ? Number(goal.remainingAmount)
            : Math.max(
                targetAmount - savedAmount,
                0
            );

    const percentageCompleted =
        goal.percentageCompleted !== undefined
            ? Number(goal.percentageCompleted)
            : targetAmount > 0
                ? (savedAmount / targetAmount) * 100
                : 0;

    const normalizedPercentage = Math.min(
        Math.max(percentageCompleted, 0),
        100
    );

    const isCompleted =
        goal.status === "Completed" ||
        savedAmount >= targetAmount;

    const isUpdating = updatingId === goalId;
    const isDeleting = deletingId === goalId;
    const isBusy = isUpdating || isDeleting;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);
    };

    const formatTargetDate = () => {
        if (!goal.targetDate) {
            return "No target date";
        }

        const date = new Date(goal.targetDate);

        if (Number.isNaN(date.getTime())) {
            return "Invalid date";
        }

        return date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleContributionSubmit = async (
        event
    ) => {
        event.preventDefault();

        setValidationError("");

        const amount = Number(
            contributionAmount
        );

        if (
            Number.isNaN(amount) ||
            amount <= 0
        ) {
            setValidationError(
                "Contribution must be greater than zero."
            );
            return;
        }

        if (isCompleted) {
            setValidationError(
                "This savings goal is already completed."
            );
            return;
        }

        const updatedSavedAmount =
            savedAmount + amount;

        try {
            await onUpdate(goalId, {
                savedAmount:
                    updatedSavedAmount,
            });

            setContributionAmount("");
            setValidationError("");
        } catch {
            // The parent page displays the API error.
            // Keep the amount so the user can retry.
        }
    };

    return (
        <article
            className={`savings-card ${isCompleted
                    ? "completed-goal"
                    : ""
                }`}
        >
            <div className="savings-card-header">
                <div>
                    <span className="goal-category">
                        {goal.category ||
                            "Other"}
                    </span>

                    <h3>
                        {goal.name ||
                            "Unnamed Goal"}
                    </h3>

                    <p className="goal-date">
                        Target Date:{" "}
                        {formatTargetDate()}
                    </p>
                </div>

                <div className="header-actions">
                    <span
                        className={`status-badge ${isCompleted
                                ? "status-success"
                                : "status-progress"
                            }`}
                    >
                        {isCompleted
                            ? "Completed"
                            : goal.status ||
                            "In Progress"}
                    </span>

                    <button
                        type="button"
                        className="delete-goal-btn"
                        onClick={() =>
                            onDelete(goalId)
                        }
                        disabled={isBusy}
                    >
                        {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </div>

            <div className="savings-progress-section">
                <div className="progress-info">
                    <span>
                        {normalizedPercentage.toFixed(
                            2
                        )}
                        % Saved
                    </span>

                    <span>
                        {formatCurrency(
                            savedAmount
                        )}{" "}
                        of{" "}
                        {formatCurrency(
                            targetAmount
                        )}
                    </span>
                </div>

                <div className="savings-progress-bar">
                    <div
                        className={`savings-progress-bar-value ${isCompleted
                                ? "bg-green"
                                : "bg-blue"
                            }`}
                        style={{
                            width: `${normalizedPercentage}%`,
                        }}
                    />
                </div>
            </div>

            <div className="savings-details">
                <p>
                    Remaining Amount:{" "}
                    <strong>
                        {formatCurrency(
                            Math.max(
                                remainingAmount,
                                0
                            )
                        )}
                    </strong>
                </p>

                {goal.notes && (
                    <p className="goal-notes">
                        {goal.notes}
                    </p>
                )}
            </div>

            {!isCompleted ? (
                <form
                    className="contribution-form"
                    onSubmit={
                        handleContributionSubmit
                    }
                >
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Contribution amount"
                        value={
                            contributionAmount
                        }
                        onChange={(event) => {
                            setContributionAmount(
                                event.target.value
                            );

                            if (
                                validationError
                            ) {
                                setValidationError(
                                    ""
                                );
                            }
                        }}
                        disabled={isBusy}
                        required
                    />

                    <button
                        type="submit"
                        disabled={isBusy}
                    >
                        {isUpdating
                            ? "Updating..."
                            : "+ Contribute"}
                    </button>

                    {validationError && (
                        <span className="error-text">
                            {validationError}
                        </span>
                    )}
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