import { useMemo, useState } from "react";
import BudgetForm from "../components/budgets/BudgetForm";
import BudgetList from "../components/budgets/BudgetList";
import "./Budgets.css";

const initialBudgets = [
    {
        id: "sample-food-budget",
        category: "Food",
        limit: 8000,
        spent: 5200,
        month: 7,
        year: 2026,
        description: "Food and grocery expenses",
    },
    {
        id: "sample-transport-budget",
        category: "Transportation",
        limit: 3000,
        spent: 1800,
        month: 7,
        year: 2026,
        description: "Fuel and transportation",
    },
];

function Budgets() {
    const [budgets, setBudgets] = useState(initialBudgets);

    const totalBudget = useMemo(
        () => budgets.reduce((total, budget) => total + budget.limit, 0),
        [budgets]
    );

    const totalSpent = useMemo(
        () => budgets.reduce((total, budget) => total + budget.spent, 0),
        [budgets]
    );

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);

    const handleAddBudget = (newBudget) => {
        setBudgets((previousBudgets) => [
            newBudget,
            ...previousBudgets,
        ]);
    };

    const handleDeleteBudget = (budgetId) => {
        setBudgets((previousBudgets) =>
            previousBudgets.filter((budget) => budget.id !== budgetId)
        );
    };

    return (
        <main className="budgets-page">
            <header className="budgets-header">
                <div>
                    <p className="page-label">Financial Planning</p>
                    <h1>Budget Management</h1>
                    <p>
                        Create monthly spending limits and track your financial
                        progress.
                    </p>
                </div>
            </header>

            <section className="budget-summary">
                <article>
                    <span>Total Budget</span>
                    <strong>{formatCurrency(totalBudget)}</strong>
                </article>

                <article>
                    <span>Total Spent</span>
                    <strong>{formatCurrency(totalSpent)}</strong>
                </article>

                <article>
                    <span>Remaining</span>
                    <strong>
                        {formatCurrency(Math.max(totalBudget - totalSpent, 0))}
                    </strong>
                </article>
            </section>

            <BudgetForm onAddBudget={handleAddBudget} />

            <section className="budgets-section">
                <h2>Monthly Budgets</h2>

                <BudgetList
                    budgets={budgets}
                    onDelete={handleDeleteBudget}
                />
            </section>
        </main>
    );
}

export default Budgets;