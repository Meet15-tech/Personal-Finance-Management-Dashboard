import { useEffect, useMemo, useState } from "react";

const createInitialFormData = () => ({
    title: "",
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
});

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

function TransactionForm({
    onAddTransaction,
    onUpdateTransaction,
    editingTransaction = null,
    submitting = false,
    updating = false,
    onCancelEdit,
}) {
    const [formData, setFormData] = useState(
        createInitialFormData
    );

    const [error, setError] = useState("");

    const isEditMode = Boolean(
        editingTransaction
    );

    const isBusy =
        submitting || updating;

    const categories = useMemo(() => {
        return formData.type === "income"
            ? incomeCategories
            : expenseCategories;
    }, [formData.type]);

    useEffect(() => {
        if (!editingTransaction) {
            setFormData(
                createInitialFormData()
            );
            setError("");
            return;
        }

        const transactionDate =
            editingTransaction.date
                ? new Date(
                    editingTransaction.date
                )
                : new Date();

        const formattedDate =
            Number.isNaN(
                transactionDate.getTime()
            )
                ? new Date()
                    .toISOString()
                    .split("T")[0]
                : transactionDate
                    .toISOString()
                    .split("T")[0];

        setFormData({
            title:
                editingTransaction.title || "",
            amount:
                editingTransaction.amount ?? "",
            type:
                editingTransaction.type ||
                "expense",
            category:
                editingTransaction.category ||
                "",
            description:
                editingTransaction.description ||
                "",
            date: formattedDate,
            paymentMethod:
                editingTransaction.paymentMethod ||
                "cash",
        });

        setError("");
    }, [editingTransaction]);

    const handleChange = (event) => {
        const { name, value } =
            event.target;

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

        if (error) {
            setError("");
        }
    };

    const validateForm = () => {
        if (!formData.title.trim()) {
            return "Please enter a transaction title.";
        }

        const amount = Number(
            formData.amount
        );

        if (
            Number.isNaN(amount) ||
            amount <= 0
        ) {
            return "Please enter an amount greater than zero.";
        }

        if (!formData.category) {
            return "Please select a category.";
        }

        if (!formData.date) {
            return "Please select a transaction date.";
        }

        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationMessage =
            validateForm();

        if (validationMessage) {
            setError(validationMessage);
            return;
        }

        const transactionData = {
            title: formData.title.trim(),
            amount: Number(
                formData.amount
            ),
            type: formData.type,
            category: formData.category,
            description:
                formData.description.trim(),
            date: formData.date,
            paymentMethod:
                formData.paymentMethod,
        };

        try {
            if (isEditMode) {
                const transactionId =
                    editingTransaction._id ||
                    editingTransaction.id;

                await onUpdateTransaction(
                    transactionId,
                    transactionData
                );
            } else {
                await onAddTransaction(
                    transactionData
                );
            }

            setFormData(
                createInitialFormData()
            );

            setError("");
        } catch {
            // Parent component shows the API error.
            // Keep form values for retry.
        }
    };

    const handleCancel = () => {
        setFormData(
            createInitialFormData()
        );

        setError("");

        if (
            typeof onCancelEdit ===
            "function"
        ) {
            onCancelEdit();
        }
    };

    return (
        <section className="transaction-form-card">
            <div className="section-heading">
                <div>
                    <p className="section-label">
                        {isEditMode
                            ? "Update record"
                            : "New record"}
                    </p>

                    <h2>
                        {isEditMode
                            ? "Edit Transaction"
                            : "Add Transaction"}
                    </h2>
                </div>

                {isEditMode && (
                    <span className="transaction-edit-mode-badge">
                        Editing
                    </span>
                )}
            </div>

            {error && (
                <div className="form-error">
                    {error}
                </div>
            )}

            <form
                className="transaction-form"
                onSubmit={handleSubmit}
            >
                <div className="form-group full-width">
                    <label htmlFor="title">
                        Transaction title
                    </label>

                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Example: Grocery shopping"
                        maxLength="100"
                        disabled={isBusy}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="amount">
                        Amount
                    </label>

                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        disabled={isBusy}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="type">
                        Type
                    </label>

                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        disabled={isBusy}
                    >
                        <option value="expense">
                            Expense
                        </option>

                        <option value="income">
                            Income
                        </option>
                    </select>
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
                        disabled={isBusy}
                        required
                    >
                        <option value="">
                            Select category
                        </option>

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
                    <label htmlFor="paymentMethod">
                        Payment method
                    </label>

                    <select
                        id="paymentMethod"
                        name="paymentMethod"
                        value={
                            formData.paymentMethod
                        }
                        onChange={handleChange}
                        disabled={isBusy}
                    >
                        <option value="cash">
                            Cash
                        </option>

                        <option value="credit-card">
                            Credit Card
                        </option>

                        <option value="debit-card">
                            Debit Card
                        </option>

                        <option value="bank-transfer">
                            Bank Transfer
                        </option>

                        <option value="upi">
                            UPI
                        </option>

                        <option value="other">
                            Other
                        </option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="date">
                        Transaction date
                    </label>

                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={isBusy}
                        required
                    />
                </div>

                <div className="form-group full-width">
                    <label htmlFor="description">
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        value={
                            formData.description
                        }
                        onChange={handleChange}
                        placeholder="Optional transaction description"
                        maxLength="500"
                        disabled={isBusy}
                    />
                </div>

                <div className="transaction-form-actions full-width">
                    <button
                        className="primary-button"
                        type="submit"
                        disabled={isBusy}
                    >
                        {isEditMode
                            ? updating
                                ? "Updating Transaction..."
                                : "Update Transaction"
                            : submitting
                                ? "Adding Transaction..."
                                : "Add Transaction"}
                    </button>

                    {isEditMode && (
                        <button
                            className="secondary-button"
                            type="button"
                            onClick={
                                handleCancel
                            }
                            disabled={isBusy}
                        >
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default TransactionForm;