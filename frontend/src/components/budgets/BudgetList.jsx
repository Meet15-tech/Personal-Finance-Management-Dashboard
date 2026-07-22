import BudgetCard from "./BudgetCard";

function BudgetList({ budgets, onDelete }) {
    if (budgets.length === 0) {
        return (
            <div className="empty-budget-state">
                <h3>No budgets created</h3>
                <p>Create a monthly budget to start tracking your spending.</p>
            </div>
        );
    }

    return (
        <section className="budget-list">
            {budgets.map((budget) => (
                <BudgetCard
                    key={budget.id}
                    budget={budget}
                    onDelete={onDelete}
                />
            ))}
        </section>
    );
}

export default BudgetList;