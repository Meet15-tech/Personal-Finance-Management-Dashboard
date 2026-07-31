import SavingsCard from "./SavingsCard";

function SavingsList({
    goals = [],
    onDelete,
    onUpdate,
    updatingId = "",
    deletingId = "",
    currency = "INR",
}) {
    if (goals.length === 0) {
        return (
            <div className="empty-savings-state">
                <h3>No savings goals created</h3>

                <p>
                    Create a savings goal to start tracking
                    your progress.
                </p>
            </div>
        );
    }

    return (
        <section className="savings-list">
            {goals.map((goal) => {
                const goalId = goal._id || goal.id;

                return (
                    <SavingsCard
                        key={goalId}
                        goal={goal}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        updatingId={updatingId}
                        deletingId={deletingId}
                        currency={currency}
                    />
                );
            })}
        </section>
    );
}

export default SavingsList;