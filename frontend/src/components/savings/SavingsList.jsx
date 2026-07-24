import SavingsCard from "./SavingsCard";

function SavingsList({ goals, onDelete, onUpdate }) {
    if (goals.length === 0) {
        return (
            <div className="empty-savings-state">
                <h3>No savings goals created</h3>
                <p>Create a savings goal to start tracking your progress and saving up!</p>
            </div>
        );
    }

    return (
        <section className="savings-list">
            {goals.map((goal) => (
                <SavingsCard
                    key={goal._id}
                    goal={goal}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </section>
    );
}

export default SavingsList;
