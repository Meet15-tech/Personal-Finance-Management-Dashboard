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

function BudgetForm({ onAddBudget, submitting = false }) {
    const currentDate = new Date();

    const [formData, setFormData] = useState({
        category: "Food",
        limit: "",
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        description: "",
    });

    const [validationError, setValidationError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));

        if (validationError) {
            setValidationError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const numericLimit = Number(formData.limit);
        const numericMonth = Number(formData.month);
        const numericYear = Number(formData.year);

        if (!numericLimit || numericLimit <= 0) {
            setValidationError(
                "Budget limit must be greater than zero."
            );
            return;
        }

        if (numericMonth < 1 || numericMonth > 12) {
            setValidationError(
                "Please select a valid month."
            );
            return;
        }

        if (numericYear < 2000 || numericYear > 2100) {
            setValidationError(
                "Year must be between 2000 and 2100."
            );
            return;
        }

        try {
            await onAddBudget({
                category: formData.category,
                limit: numericLimit,
                month: numericMonth,
                year: numericYear,
                description: formData.description.trim(),
            });

            setFormData((previousData) => ({
                ...previousData,
                limit: "",
                description: "",
            }));

            setValidationError("");
        } catch {
            // The parent component displays the API error.
            // Keep the entered form data so the user can correct it.
        }
    };

    return (
        <form
            className="budget-form"
            onSubmit={handleSubmit}
        >
            <h2>Create Monthly Budget</h2>

            {validationError && (
                <div className="form-error">
                    {validationError}
                </div>
            )}

            <div className="budget-form-grid">
                <div className="form-group">
                    <label htmlFor="category">
                        Category
                    </label>

                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        {categories.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="limit">
                        Budget Limit
                    </label>

                    <input
                        id="limit"
                        type="number"
                        name="limit"
                        min="1"
                        step="0.01"
                        placeholder="Enter budget limit"
                        value={formData.limit}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="month">
                        Month
                    </label>

                    <select
                        id="month"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        disabled={submitting}
                    >
                        {Array.from(
                            { length: 12 },
                            (_, index) => (
                                <option
                                    key={index + 1}
                                    value={index + 1}
                                >
                                    {new Date(
                                        2026,
                                        index
                                    ).toLocaleString(
                                        "en-US",
                                        {
                                            month: "long",
                                        }
                                    )}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="year">
                        Year
                    </label>

                    <input
                        id="year"
                        type="number"
                        name="year"
                        min="2000"
                        max="2100"
                        value={formData.year}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="description">
                    Description
                </label>

                <textarea
                    id="description"
                    name="description"
                    maxLength="250"
                    placeholder="Optional budget description"
                    value={formData.description}
                    onChange={handleChange}
                    disabled={submitting}
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
            >
                {submitting
                    ? "Creating Budget..."
                    : "Create Budget"}
            </button>
        </form>
    );
}

export default BudgetForm;