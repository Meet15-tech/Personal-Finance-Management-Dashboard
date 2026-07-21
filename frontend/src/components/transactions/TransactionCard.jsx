function TransactionCard({ transaction, onDeleteTransaction }) {
    const isIncome = transaction.type === "income";

    const formattedAmount = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(transaction.amount);

    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(transaction.date));

    return (
        <article className="transaction-card">
            <div
                className={`transaction-icon ${isIncome ? "income-icon" : "expense-icon"
                    }`}
            >
                {isIncome ? "↑" : "↓"}
            </div>

            <div className="transaction-information">
                <div className="transaction-title-row">
                    <h3>{transaction.title}</h3>

                    <span
                        className={`transaction-type ${isIncome ? "income-badge" : "expense-badge"
                            }`}
                    >
                        {transaction.type}
                    </span>
                </div>

                <div className="transaction-meta">
                    <span>{transaction.category}</span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                    <span>•</span>
                    <span>{transaction.paymentMethod}</span>
                </div>

                {transaction.description && (
                    <p className="transaction-description">
                        {transaction.description}
                    </p>
                )}
            </div>

            <div className="transaction-actions">
                <strong
                    className={`transaction-amount ${isIncome ? "income-amount" : "expense-amount"
                        }`}
                >
                    {isIncome ? "+" : "-"}
                    {formattedAmount}
                </strong>

                <button
                    className="delete-button"
                    type="button"
                    onClick={() => onDeleteTransaction(transaction._id || transaction.id)}
                >
                    Delete
                </button>
            </div>
        </article>
    );
}

export default TransactionCard;