export const exportCsv = (filename, rows) => {
    const csvContent = rows
        .map((row) =>
            row
                .map((value) => {
                    const stringValue = String(value ?? "");
                    return `"${stringValue.replaceAll('"', '""')}"`;
                })
                .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(downloadUrl);
};

export const buildTransactionExportRows = (transactions = [], currency = "INR") => {
    const header = ["Title", "Type", "Category", "Amount", "Currency", "Date", "Payment Method", "Description"];
    const rows = [header];

    transactions.forEach((transaction) => {
        rows.push([
            transaction.title || "",
            transaction.type || "",
            transaction.category || "",
            transaction.amount || 0,
            currency,
            transaction.date ? new Date(transaction.date).toLocaleDateString("en-IN") : "",
            transaction.paymentMethod || "",
            transaction.description || "",
        ]);
    });

    return rows;
};

export const buildReportExportRows = (summary, monthlyData, categoryData, paymentMethodData, selectedYear) => {
    return [
        ["Financial Report"],
        ["Year", selectedYear],
        [],
        ["Summary"],
        ["Total Income", summary.totalIncome],
        ["Total Expenses", summary.totalExpenses],
        ["Net Balance", summary.netBalance],
        ["Savings Rate", `${summary.savingsRate}%`],
        [],
        ["Monthly Performance"],
        ["Month", "Income", "Expense", "Net Balance"],
        ...monthlyData.map((item) => [item.month, item.income, item.expense, item.income - item.expense]),
        [],
        ["Expense Categories"],
        ["Category", "Amount", "Percentage"],
        ...categoryData.map((item) => [item.category, item.totalAmount, `${item.percentage}%`]),
        [],
        ["Payment Methods"],
        ["Payment Method", "Amount"],
        ...paymentMethodData.map((item) => [item.paymentMethod, item.totalAmount]),
    ];
};
