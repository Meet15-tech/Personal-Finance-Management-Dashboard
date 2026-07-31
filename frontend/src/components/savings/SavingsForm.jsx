import { useState } from "react";

const categories = [
    "Emergency Fund",
    "Retirement",
    "Travel",
    "Electronics",
    "Home",
    "Education",
    "Vehicle",
    "Other",
];

function SavingsForm({
    onAddGoal,
    submitting = false,
}) {
    const getTomorrowDate = () => {
        const tomorrow = new Date();

        tomorrow.setDate(
            tomorrow.getDate() + 1
        );

        return tomorrow
            .toISOString()
            .split("T")[0];
    };

    const tomorrowDate = getTomorrowDate();

    const [formData, setFormData] = useState({
        name: "",
        targetAmount: "",
        savedAmount: "0",
        targetDate: tomorrowDate,
        category: "Emergency Fund",
        notes: "",
    });

    const [validationError, setValidationError] =
        useState("");

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

        setValidationError("");

        const name = formData.name.trim();
        const targetAmount = Number(
            formData.targetAmount
        );
        const savedAmount = Number(
            formData.savedAmount || 0
        );

        if (!name) {
            setValidationError(
                "Goal name is required."
            );
            return;
        }

        if (
            Number.isNaN(targetAmount) ||
            targetAmount <= 0
        ) {
            setValidationError(
                "Target amount must be greater than zero."
            );
            return;
        }

        if (
            Number.isNaN(savedAmount) ||
            savedAmount < 0
        ) {
            setValidationError(
                "Initial saved amount cannot be negative."
            );
            return;
        }

        if (savedAmount > targetAmount) {
            setValidationError(
                "Initial savings cannot exceed the target amount."
            );
            return;
        }

        if (!formData.targetDate) {
            setValidationError(
                "Target date is required."
            );
            return;
        }

        const selectedDate = new Date(
            `${formData.targetDate}T23:59:59`
        );

        if (
            Number.isNaN(selectedDate.getTime()) ||
            selectedDate <= new Date()
        ) {
            setValidationError(
                "Target date must be in the future."
            );
            return;
        }

        try {
            await onAddGoal({
                name,
                targetAmount,
                savedAmount,
                targetDate: formData.targetDate,
                category: formData.category,
                notes: formData.notes.trim(),
            });

            setFormData({
                name: "",
                targetAmount: "",
                savedAmount: "0",
                targetDate: getTomorrowDate(),
                category: "Emergency Fund",
                notes: "",
            });

            setValidationError("");
        } catch {
            // The parent page displays the API error.
            // Keep the form values so the user can retry.
        }
    };

    return (
        <form
            className="savings-form"
            onSubmit={handleSubmit}
        >
            <h2>Create New Savings Goal</h2>

            {validationError && (
                <div className="form-error">
                    {validationError}
                </div>
            )}

            <div className="savings-form-grid">
                <div className="form-group">
                    <label htmlFor="name">
                        Goal Name
                    </label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        maxLength="100"
                        placeholder="e.g. New Laptop"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="targetAmount">
                        Target Amount
                    </label>

                    <input
                        id="targetAmount"
                        type="number"
                        name="targetAmount"
                        min="1"
                        step="0.01"
                        placeholder="Enter target amount"
                        value={
                            formData.targetAmount
                        }
                        onChange={handleChange}
                        disabled={submitting}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="savedAmount">
                        Initial Saved Amount
                    </label>

                    <input
                        id="savedAmount"
                        type="number"
                        name="savedAmount"
                        min="0"
                        step="0.01"
                        placeholder="Amount already saved"
                        value={formData.savedAmount}
                        onChange={handleChange}
                        disabled={submitting}
                    />
                </div>

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
                        {categories.map(
                            (category) => (
                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category}
                                </option>
                            )
                        )}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="targetDate">
                        Target Date
                    </label>

                    <input
                        id="targetDate"
                        type="date"
                        name="targetDate"
                        min={tomorrowDate}
                        value={formData.targetDate}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">
                    Notes / Description
                </label>

                <textarea
                    id="notes"
                    name="notes"
                    maxLength="500"
                    placeholder="Optional details about this goal"
                    value={formData.notes}
                    onChange={handleChange}
                    disabled={submitting}
                />
            </div>

            <button
                type="submit"
                className="create-goal-button"
                disabled={submitting}
            >
                {submitting
                    ? "Creating Goal..."
                    : "Create Savings Goal"}
            </button>
        </form>
    );
}

export default SavingsForm;