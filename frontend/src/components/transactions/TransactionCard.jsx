function TransactionCard({
    transaction,
    onDeleteTransaction,
    onEditTransaction,
    deletingId = "",
    editingId = "",
}) {
    const transactionId =
        transaction._id || transaction.id;

    const isIncome =
        transaction.type === "income";

    const isDeleting =
        deletingId === transactionId;

    const isEditing =
        editingId === transactionId;

    const isPlaidTransaction =
        transaction.source === "plaid";

    const formattedAmount =
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(
            Number(transaction.amount) || 0
        );

    const transactionDate =
        new Date(transaction.date);

    const formattedDate =
        Number.isNaN(transactionDate.getTime())
            ? "Invalid date"
            : new Intl.DateTimeFormat("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(transactionDate);

    return (
        <article
            className={`transaction-card ${isEditing
                    ? "transaction-card-editing"
                    : ""
                }`}
        >
            <div
                className={`transaction-icon ${isIncome
                        ? "income-icon"
                        : "expense-icon"
                    }`}
            >
                {isIncome ? "↑" : "↓"}
            </div>

            <div className="transaction-information">
                <div className="transaction-title-row">
                    <h3>
                        {transaction.title ||
                            "Untitled Transaction"}
                    </h3>

                    <span
                        className={`transaction-type ${isIncome
                                ? "income-badge"
                                : "expense-badge"
                            }`}
                    >
                        {transaction.type}
                    </span>

                    {isPlaidTransaction && (
                        <span className="transaction-source-badge">
                            Plaid
                        </span>
                    )}
                </div>

                <div className="transaction-meta">
                    <span>
                        {transaction.category ||
                            "Other"}
                    </span>

                    <span>•</span>

                    <span>{formattedDate}</span>

                    <span>•</span>

                    <span>
                        {transaction.paymentMethod ||
                            "other"}
                    </span>
                </div>

                {transaction.description && (
                    <p className="transaction-description">
                        {transaction.description}
                    </p>
                )}
            </div>

            <div className="transaction-actions">
                <strong
                    className={`transaction-amount ${isIncome
                            ? "income-amount"
                            : "expense-amount"
                        }`}
                >
                    {isIncome ? "+" : "-"}
                    {formattedAmount}
                </strong>

                <div className="transaction-action-buttons">
                    <button
                        className="edit-button"
                        type="button"
                        onClick={() =>
                            onEditTransaction(
                                transaction
                            )
                        }
                        disabled={
                            isDeleting ||
                            isPlaidTransaction
                        }
                        title={
                            isPlaidTransaction
                                ? "Plaid transactions should be updated through bank synchronization."
                                : "Edit transaction"
                        }
                    >
                        {isEditing
                            ? "Editing..."
                            : "Edit"}
                    </button>

                    <button
                        className="delete-button"
                        type="button"
                        onClick={() =>
                            onDeleteTransaction(
                                transactionId
                            )
                        }
                        disabled={isDeleting}
                    >
                        {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                    </button>
                </div>
            </div>
        </article>
    );
}

export default TransactionCard;