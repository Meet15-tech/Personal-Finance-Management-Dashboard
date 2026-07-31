function BudgetCard({
    budget,
    onDelete,
    deletingId = "",
}) {
    const budgetId = budget._id || budget.id;

    const limit = Number(budget.limit) || 0;
    const spent = Number(budget.spent) || 0;

    const remaining =
        budget.remaining !== undefined
            ? Number(budget.remaining)
            : limit - spent;

    const percentageUsed =
        budget.percentageUsed !== undefined
            ? Number(budget.percentageUsed)
            : limit > 0
                ? Math.min((spent / limit) * 100, 100)
                : 0;

    const exceeded =
        budget.exceeded !== undefined
            ? Boolean(budget.exceeded)
            : spent > limit;

    const monthName = new Date(
        Number(budget.year) || new Date().getFullYear(),
        (Number(budget.month) || 1) - 1
    ).toLocaleString("en-US", {
        month: "long",
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);
    };

    const isDeleting = deletingId === budgetId;

    return (
        <article
            className={`budget-card ${exceeded ? "budget-card-exceeded" : ""
                }`}
        >
            <div className="budget-card-header">
                <div>
                    <h3>
                        {budget.category || "Uncategorized"}
                    </h3>

                    <p>
                        {monthName} {budget.year}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => onDelete(budgetId)}
                    disabled={isDeleting}
                >
                    {isDeleting
                        ? "Deleting..."
                        : "Delete"}
                </button>
            </div>

            {budget.description && (
                <p className="budget-description">
                    {budget.description}
                </p>
            )}

            <div className="budget-progress">
                <div
                    className={`budget-progress-value ${exceeded
                            ? "budget-progress-exceeded"
                            : ""
                        }`}
                    style={{
                        width: `${Math.min(
                            Math.max(percentageUsed, 0),
                            100
                        )}%`,
                    }}
                />
            </div>

            <div className="budget-percentage-row">
                <span>Budget usage</span>

                <strong>
                    {percentageUsed.toFixed(2)}%
                </strong>
            </div>

            <div className="budget-details">
                <span>
                    Spent: {formatCurrency(spent)}
                </span>

                <span>
                    Limit: {formatCurrency(limit)}
                </span>
            </div>

            <p className="budget-remaining">
                Remaining:{" "}
                <strong>
                    {formatCurrency(
                        Math.max(remaining, 0)
                    )}
                </strong>
            </p>

            {exceeded && (
                <p className="budget-warning">
                    Budget exceeded by{" "}
                    {formatCurrency(
                        Math.abs(remaining)
                    )}
                </p>
            )}
        </article>
    );
}

export default BudgetCard;