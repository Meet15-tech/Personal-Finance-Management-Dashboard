import TransactionCard from "./TransactionCard";

function TransactionList({
    transactions = [],
    onDeleteTransaction,
    onEditTransaction,
    deletingId = "",
    editingId = "",
}) {
    if (transactions.length === 0) {
        return (
            <section className="transaction-list-card">
                <div className="section-heading">
                    <div>
                        <p className="section-label">Activity</p>
                        <h2>Recent Transactions</h2>
                    </div>
                </div>

                <div className="empty-state">
                    <div className="empty-state-icon">₹</div>

                    <h3>No transactions found</h3>

                    <p>
                        Add your first income or expense using
                        the transaction form.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="transaction-list-card">
            <div className="section-heading">
                <div>
                    <p className="section-label">Activity</p>
                    <h2>Recent Transactions</h2>
                </div>

                <span className="transaction-count">
                    {transactions.length} transaction
                    {transactions.length !== 1 ? "s" : ""}
                </span>
            </div>

            <div className="transaction-list">
                {transactions.map((transaction) => {
                    const transactionId =
                        transaction._id || transaction.id;

                    return (
                        <TransactionCard
                            key={transactionId}
                            transaction={transaction}
                            onDeleteTransaction={
                                onDeleteTransaction
                            }
                            onEditTransaction={
                                onEditTransaction
                            }
                            deletingId={deletingId}
                            editingId={editingId}
                        />
                    );
                })}
            </div>
        </section>
    );
}

export default TransactionList;