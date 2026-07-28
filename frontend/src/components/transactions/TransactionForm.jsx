import { useState } from "react";

const initialFormData = {
    title: "",
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
};

const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Other Income",
];

const expenseCategories = [
    "Food",
    "Groceries",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Healthcare",
    "Education",
    "Rent",
    "Other Expense",
];

function TransactionForm({ onAddTransaction }) {
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState("");

    const categories =
        formData.type === "income" ? incomeCategories : expenseCategories;

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => {
            if (name === "type") {
                return {
                    ...previousData,
                    type: value,
                    category: "",
                };
            }

            return {
                ...previousData,
                [name]: value,
            };
        });

        setError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            setError("Please enter a transaction title.");
            return;
        }

        if (!formData.amount || Number(formData.amount) <= 0) {
            setError("Please enter an amount greater than zero.");
            return;
        }

        if (!formData.category) {
            setError("Please select a category.");
            return;
        }

        const newTransaction = {
            id: crypto.randomUUID(),
            ...formData,
            title: formData.title.trim(),
            amount: Number(formData.amount),
            description: formData.description.trim(),
            createdAt: new Date().toISOString(),
        };

        onAddTransaction(newTransaction);
        setFormData(initialFormData);
        setError("");
    };

    return (
        <section className="transaction-form-card">
            <div className="section-heading">
                <div>
                    <p className="section-label">New record</p>
                    <h2>Add Transaction</h2>
                </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <form className="transaction-form" onSubmit={handleSubmit}>
                <div className="form-group full-width">
                    <label htmlFor="title">Transaction title</label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Example: Grocery shopping"
                        maxLength="100"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    >
                        <option value="">Select category</option>

                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="paymentMethod">Payment method</label>
                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                    >
                        <option value="cash">Cash</option>
                        <option value="credit-card">Credit Card</option>
                        <option value="debit-card">Debit Card</option>
                        <option value="bank-transfer">Bank Transfer</option>
                        <option value="upi">UPI</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="date">Transaction date</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Optional transaction description"
                        maxLength="500"
                    />
                </div>

                <button className="primary-button full-width" type="submit">
                    Add Transaction
                </button>
            </form>
        </section>
    );
}

export default TransactionForm;