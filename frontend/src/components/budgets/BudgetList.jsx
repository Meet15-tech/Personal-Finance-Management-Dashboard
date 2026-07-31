import BudgetCard from "./BudgetCard";

function BudgetList({
    budgets = [],
    onDelete,
    deletingId = "",
}) {
    if (budgets.length === 0) {
        return (
            <div className="empty-budget-state">
                <h3>No budgets created</h3>

                <p>
                    Create a monthly budget to start
                    tracking your spending.
                </p>
            </div>
        );
    }

    return (
        <section className="budget-list">
            {budgets.map((budget) => {
                const budgetId =
                    budget._id || budget.id;

                return (
                    <BudgetCard
                        key={budgetId}
                        budget={budget}
                        onDelete={onDelete}
                        deletingId={deletingId}
                    />
                );
            })}
        </section>
    );
}

export default BudgetList;