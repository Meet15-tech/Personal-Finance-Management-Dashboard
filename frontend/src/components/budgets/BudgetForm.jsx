import { useState } from "react";

const categories = [
    "Food",
    "Transportation",
    "Shopping",
    "Entertainment",
    "Bills",
    "Healthcare",
    "Education",
    "Other",
];

function BudgetForm({ onAddBudget }) {
    const currentDate = new Date();

    const [formData, setFormData] = useState({
        category: "Food",
        limit: "",
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        description: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const limit = Number(formData.limit);

        if (!limit || limit <= 0) {
            return;
        }

        onAddBudget({
            id: crypto.randomUUID(),
            ...formData,
            limit,
            month: Number(formData.month),
            year: Number(formData.year),
            spent: 0,
        });

        setFormData((previousData) => ({
            ...previousData,
            limit: "",
            description: "",
        }));
    };

    return (
        <form className="budget-form" onSubmit={handleSubmit}>
            <h2>Create Monthly Budget</h2>

            <div className="budget-form-grid">
                <div className="form-group">
                    <label htmlFor="category">Category</label>

                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="limit">Budget Limit</label>

                    <input
                        id="limit"
                        type="number"
                        name="limit"
                        min="1"
                        placeholder="Enter budget limit"
                        value={formData.limit}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="month">Month</label>

                    <select
                        id="month"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                    >
                        {Array.from({ length: 12 }, (_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {new Date(2026, index).toLocaleString("en-US", {
                                    month: "long",
                                })}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="year">Year</label>

                    <input
                        id="year"
                        type="number"
                        name="year"
                        min="2000"
                        max="2100"
                        value={formData.year}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>

                <textarea
                    id="description"
                    name="description"
                    placeholder="Optional budget description"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            <button type="submit">Create Budget</button>
        </form>
    );
}

export default BudgetForm;