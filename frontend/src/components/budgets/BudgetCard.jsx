function BudgetCard({ budget, onDelete }) {
    const remaining = budget.limit - budget.spent;

    const percentageUsed =
        budget.limit > 0
            ? Math.min((budget.spent / budget.limit) * 100, 100)
            : 0;

    const monthName = new Date(2026, budget.month - 1).toLocaleString(
        "en-US",
        {
            month: "long",
        }
    );

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    return (
        <article className="budget-card">
            <div className="budget-card-header">
                <div>
                    <h3>{budget.category}</h3>
                    <p>
                        {monthName} {budget.year}
                    </p>
                </div>

                <button type="button" onClick={() => onDelete(budget.id)}>
                    Delete
                </button>
            </div>

            <div className="budget-progress">
                <div
                    className="budget-progress-value"
                    style={{ width: `${percentageUsed}%` }}
                />
            </div>

            <div className="budget-details">
                <span>Spent: {formatCurrency(budget.spent)}</span>
                <span>Limit: {formatCurrency(budget.limit)}</span>
            </div>

            <p>
                Remaining:{" "}
                <strong>{formatCurrency(Math.max(remaining, 0))}</strong>
            </p>

            {remaining < 0 && (
                <p className="budget-warning">
                    Budget exceeded by {formatCurrency(Math.abs(remaining))}
                </p>
            )}
        </article>
    );
}

export default BudgetCard;