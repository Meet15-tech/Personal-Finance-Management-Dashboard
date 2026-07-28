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

function SavingsForm({ onAddGoal }) {
    // Tomorrow's date for validation
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        name: "",
        targetAmount: "",
        savedAmount: "0",
        targetDate: tomorrowStr,
        category: "Emergency Fund",
        notes: "",
    });

    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");

        const target = Number(formData.targetAmount);
        const saved = Number(formData.savedAmount || 0);

        if (!formData.name.trim()) {
            setError("Goal name is required");
            return;
        }

        if (isNaN(target) || target <= 0) {
            setError("Target amount must be a positive number greater than 0");
            return;
        }

        if (isNaN(saved) || saved < 0) {
            setError("Saved amount cannot be negative");
            return;
        }

        if (saved > target) {
            setError("Initial savings cannot exceed the target amount");
            return;
        }

        if (!formData.targetDate) {
            setError("Target date is required");
            return;
        }

        const dateTarget = new Date(formData.targetDate);
        if (dateTarget <= new Date()) {
            setError("Target date must be in the future");
            return;
        }

        onAddGoal({
            name: formData.name.trim(),
            targetAmount: target,
            savedAmount: saved,
            targetDate: formData.targetDate,
            category: formData.category,
            notes: formData.notes.trim(),
        });

        // Reset form
        setFormData({
            name: "",
            targetAmount: "",
            savedAmount: "0",
            targetDate: tomorrowStr,
            category: "Emergency Fund",
            notes: "",
        });
    };

    return (
        <form className="savings-form" onSubmit={handleSubmit}>
            <h2>Create New Savings Goal</h2>
            
            {error && <div className="form-error mb-4 text-red-500 font-semibold">{error}</div>}

            <div className="savings-form-grid">
                <div className="form-group">
                    <label htmlFor="name">Goal Name</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="e.g. New Laptop, Hawaii Trip"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="targetAmount">Target Amount (INR)</label>
                    <input
                        id="targetAmount"
                        type="number"
                        name="targetAmount"
                        min="1"
                        placeholder="Enter target amount"
                        value={formData.targetAmount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="savedAmount">Initial Saved Amount (INR)</label>
                    <input
                        id="savedAmount"
                        type="number"
                        name="savedAmount"
                        min="0"
                        placeholder="Saved amount so far"
                        value={formData.savedAmount}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="targetDate">Target Date</label>
                    <input
                        id="targetDate"
                        type="date"
                        name="targetDate"
                        min={tomorrowStr}
                        value={formData.targetDate}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes / Description</label>
                <textarea
                    id="notes"
                    name="notes"
                    placeholder="Optional notes or details about this goal..."
                    value={formData.notes}
                    onChange={handleChange}
                />
            </div>

            <button type="submit" className="create-goal-button">Create Savings Goal</button>
        </form>
    );
}

export default SavingsForm;
