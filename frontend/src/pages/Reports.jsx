import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import useAuth from "../hooks/useAuth";

import {
    getReportSummary,
    getReportCategoryBreakdown,
    getReportMonthlyTrend,
    getReportPaymentMethods,
} from "../services/reportService";

import "./Reports.css";

const CHART_COLORS = [
    "#2563eb",
    "#059669",
    "#f59e0b",
    "#dc2626",
    "#7c3aed",
    "#db2777",
    "#0891b2",
    "#4f46e5",
    "#65a30d",
    "#0d9488",
];

const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export default function Reports() {
    const { user } = useAuth();

    const [selectedYear, setSelectedYear] = useState(
        new Date().getFullYear()
    );

    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        savingsRate: 0,
    });

    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [paymentMethodData, setPaymentMethodData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();

        return Array.from(
            { length: 5 },
            (_, index) => currentYear - index
        );
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: user?.currency || "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount) || 0);
    };

    const prepareCategoryData = (items = []) => {
        const totalExpense = items.reduce(
            (total, item) => total + Number(item.total || 0),
            0
        );

        return items.map((item) => {
            const amount = Number(item.total || 0);

            return {
                category: item._id || "Other",
                totalAmount: amount,
                percentage:
                    totalExpense > 0
                        ? Number(
                            ((amount / totalExpense) * 100).toFixed(1)
                        )
                        : 0,
            };
        });
    };

    const prepareMonthlyData = (items = []) => {
        const months = MONTH_NAMES.map((month, index) => ({
            month,
            monthNumber: index + 1,
            income: 0,
            expense: 0,
        }));

        items.forEach((item) => {
            const monthNumber = Number(item?._id?.month);
            const transactionType = item?._id?.type;
            const monthIndex = monthNumber - 1;

            if (
                monthIndex >= 0 &&
                monthIndex < months.length &&
                (transactionType === "income" ||
                    transactionType === "expense")
            ) {
                months[monthIndex][transactionType] = Number(
                    item.total || 0
                );
            }
        });

        return months;
    };

    const preparePaymentMethodData = (items = []) => {
        return items.map((item) => ({
            paymentMethod: item._id
                ? item._id
                    .split("-")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                    )
                    .join(" ")
                : "Other",
            totalAmount: Number(item.total || 0),
        }));
    };

    const fetchReportData = async (showLoader = false) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const [
                summaryResponse,
                categoryResponse,
                monthlyResponse,
                paymentResponse,
            ] = await Promise.all([
                getReportSummary(),
                getReportCategoryBreakdown("expense"),
                getReportMonthlyTrend(selectedYear),
                getReportPaymentMethods(),
            ]);

            if (summaryResponse?.success) {
                setSummary({
                    totalIncome:
                        Number(summaryResponse.data?.totalIncome) || 0,
                    totalExpenses:
                        Number(summaryResponse.data?.totalExpenses) || 0,
                    netBalance:
                        Number(summaryResponse.data?.netBalance) || 0,
                    savingsRate:
                        Number(summaryResponse.data?.savingsRate) || 0,
                });
            }

            if (categoryResponse?.success) {
                setCategoryData(
                    prepareCategoryData(categoryResponse.data || [])
                );
            }

            if (monthlyResponse?.success) {
                setMonthlyData(
                    prepareMonthlyData(monthlyResponse.data || [])
                );
            }

            if (paymentResponse?.success) {
                setPaymentMethodData(
                    preparePaymentMethodData(
                        paymentResponse.data || []
                    )
                );
            }
        } catch (err) {
            console.error("Error loading financial reports:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load financial reports."
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchReportData(true);

        const refreshInterval = window.setInterval(() => {
            fetchReportData(false);
        }, 30000);

        const handleWindowFocus = () => {
            fetchReportData(false);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchReportData(false);
            }
        };

        const handleFinancialDataUpdated = () => {
            fetchReportData(false);
        };

        window.addEventListener(
            "focus",
            handleWindowFocus
        );

        window.addEventListener(
            "financialDataUpdated",
            handleFinancialDataUpdated
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            window.clearInterval(refreshInterval);

            window.removeEventListener(
                "focus",
                handleWindowFocus
            );

            window.removeEventListener(
                "financialDataUpdated",
                handleFinancialDataUpdated
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [selectedYear]);

    const handlePrintReport = () => {
        window.print();
    };

    const handleExportCsv = () => {
        const rows = [
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
            ...monthlyData.map((item) => [
                item.month,
                item.income,
                item.expense,
                item.income - item.expense,
            ]),
            [],
            ["Expense Categories"],
            ["Category", "Amount", "Percentage"],
            ...categoryData.map((item) => [
                item.category,
                item.totalAmount,
                `${item.percentage}%`,
            ]),
            [],
            ["Payment Methods"],
            ["Payment Method", "Amount"],
            ...paymentMethodData.map((item) => [
                item.paymentMethod,
                item.totalAmount,
            ]),
        ];

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

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });

        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = `financial-report-${selectedYear}.csv`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(downloadUrl);
    };

    return (
        <main className="reports-page">
            <section className="reports-shell">
                <header className="reports-header">
                    <div>
                        <p className="reports-eyebrow">
                            PFM Financial Intelligence
                        </p>

                        <h1>Financial Reports</h1>

                        <p>
                            Analyse your income, expenses, payment
                            behaviour and monthly financial performance.
                        </p>
                    </div>

                    <div className="reports-header-actions">
                        <Link
                            to="/dashboard"
                            className="reports-dashboard-button"
                        >
                            Back to Dashboard
                        </Link>

                        <button
                            type="button"
                            className="reports-export-button"
                            onClick={handleExportCsv}
                            disabled={loading}
                        >
                            Export CSV
                        </button>

                        <button
                            type="button"
                            className="reports-print-button"
                            onClick={handlePrintReport}
                            disabled={loading}
                        >
                            Print Report
                        </button>
                    </div>
                </header>

                <section className="reports-filter-card">
                    <div>
                        <p className="reports-filter-label">
                            Reporting Period
                        </p>

                        <h2>Annual Financial Analysis</h2>
                    </div>

                    <label className="reports-year-field">
                        <span>Select Year</span>

                        <select
                            value={selectedYear}
                            onChange={(event) =>
                                setSelectedYear(
                                    Number(event.target.value)
                                )
                            }
                        >
                            {availableYears.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>
                </section>

                {error && (
                    <div className="reports-error-message">
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={() => fetchReportData(true)}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {loading ? (
                    <section className="reports-loading-card">
                        <div className="reports-loader" />

                        <h2>Generating your financial report</h2>

                        <p>
                            Please wait while your latest transaction
                            data is analysed.
                        </p>
                    </section>
                ) : (
                    <>
                        <section className="reports-summary-grid">
                            <article className="reports-summary-card">
                                <div className="reports-card-heading">
                                    <p>Total Income</p>
                                    <span className="reports-icon reports-income-icon">
                                        ↑
                                    </span>
                                </div>

                                <h2>
                                    {formatCurrency(
                                        summary.totalIncome
                                    )}
                                </h2>

                                <span className="reports-positive-text">
                                    Total accumulated inflow
                                </span>
                            </article>

                            <article className="reports-summary-card">
                                <div className="reports-card-heading">
                                    <p>Total Expenses</p>
                                    <span className="reports-icon reports-expense-icon">
                                        ↓
                                    </span>
                                </div>

                                <h2>
                                    {formatCurrency(
                                        summary.totalExpenses
                                    )}
                                </h2>

                                <span className="reports-negative-text">
                                    Total recorded outflow
                                </span>
                            </article>

                            <article className="reports-summary-card">
                                <div className="reports-card-heading">
                                    <p>Net Balance</p>
                                    <span className="reports-icon reports-balance-icon">
                                        ₹
                                    </span>
                                </div>

                                <h2>
                                    {formatCurrency(
                                        summary.netBalance
                                    )}
                                </h2>

                                <span>
                                    Income remaining after expenses
                                </span>
                            </article>

                            <article className="reports-summary-card">
                                <div className="reports-card-heading">
                                    <p>Savings Rate</p>
                                    <span className="reports-icon reports-savings-icon">
                                        %
                                    </span>
                                </div>

                                <h2>
                                    {Number(summary.savingsRate || 0).toFixed(2)}%
                                </h2>

                                <span>
                                    {summary.savingsRate >= 20
                                        ? "Healthy savings performance"
                                        : summary.savingsRate >= 0
                                            ? "Savings need improvement"
                                            : "Expenses exceed income"}
                                </span>
                            </article>
                        </section>

                        <section className="reports-primary-chart-grid">
                            <article className="reports-chart-card">
                                <div className="reports-section-heading">
                                    <div>
                                        <p className="reports-section-label">
                                            Annual Performance
                                        </p>

                                        <h2>
                                            Monthly Income vs Expenses
                                        </h2>
                                    </div>

                                    <span className="reports-year-badge">
                                        {selectedYear}
                                    </span>
                                </div>

                                <div className="reports-chart-container reports-large-chart">
                                    <ResponsiveContainer>
                                        <BarChart
                                            data={monthlyData}
                                            margin={{
                                                top: 15,
                                                right: 15,
                                                left: 5,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                opacity={0.25}
                                            />

                                            <XAxis dataKey="month" />

                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `₹${value}`
                                                }
                                            />

                                            <Tooltip
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                            />

                                            <Legend />

                                            <Bar
                                                dataKey="income"
                                                name="Income"
                                                fill="#059669"
                                                radius={[5, 5, 0, 0]}
                                            />

                                            <Bar
                                                dataKey="expense"
                                                name="Expense"
                                                fill="#dc2626"
                                                radius={[5, 5, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </article>

                            <article className="reports-chart-card">
                                <div className="reports-section-heading">
                                    <div>
                                        <p className="reports-section-label">
                                            Spending Analysis
                                        </p>

                                        <h2>Expense Categories</h2>
                                    </div>
                                </div>

                                {categoryData.length > 0 ? (
                                    <div className="reports-chart-container reports-large-chart">
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={categoryData}
                                                    dataKey="totalAmount"
                                                    nameKey="category"
                                                    cx="50%"
                                                    cy="48%"
                                                    innerRadius={58}
                                                    outerRadius={100}
                                                    paddingAngle={4}
                                                    label={({
                                                        category,
                                                        percentage,
                                                    }) =>
                                                        `${category} ${percentage}%`
                                                    }
                                                >
                                                    {categoryData.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => (
                                                            <Cell
                                                                key={`${item.category}-${index}`}
                                                                fill={
                                                                    CHART_COLORS[
                                                                    index %
                                                                    CHART_COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Pie>

                                                <Tooltip
                                                    formatter={(value) =>
                                                        formatCurrency(
                                                            value
                                                        )
                                                    }
                                                />

                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="reports-empty-state">
                                        <div className="reports-empty-icon">
                                            ₹
                                        </div>

                                        <h3>
                                            No expense information
                                        </h3>

                                        <p>
                                            Add expense transactions to
                                            generate a category report.
                                        </p>

                                        <Link
                                            to="/transactions"
                                            className="reports-empty-link"
                                        >
                                            Add Transaction
                                        </Link>
                                    </div>
                                )}
                            </article>
                        </section>

                        <section className="reports-secondary-grid">
                            <article className="reports-chart-card">
                                <div className="reports-section-heading">
                                    <div>
                                        <p className="reports-section-label">
                                            Cash Flow Movement
                                        </p>

                                        <h2>Monthly Net Balance</h2>
                                    </div>
                                </div>

                                <div className="reports-chart-container">
                                    <ResponsiveContainer>
                                        <LineChart
                                            data={monthlyData.map(
                                                (item) => ({
                                                    ...item,
                                                    netBalance:
                                                        item.income -
                                                        item.expense,
                                                })
                                            )}
                                            margin={{
                                                top: 15,
                                                right: 15,
                                                left: 5,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                opacity={0.25}
                                            />

                                            <XAxis dataKey="month" />

                                            <YAxis
                                                tickFormatter={(value) =>
                                                    `₹${value}`
                                                }
                                            />

                                            <Tooltip
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                            />

                                            <Legend />

                                            <Line
                                                type="monotone"
                                                dataKey="netBalance"
                                                name="Net Balance"
                                                stroke="#2563eb"
                                                strokeWidth={3}
                                                activeDot={{ r: 7 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </article>

                            <article className="reports-chart-card">
                                <div className="reports-section-heading">
                                    <div>
                                        <p className="reports-section-label">
                                            Payment Behaviour
                                        </p>

                                        <h2>
                                            Payment Method Distribution
                                        </h2>
                                    </div>
                                </div>

                                {paymentMethodData.length > 0 ? (
                                    <div className="reports-chart-container">
                                        <ResponsiveContainer>
                                            <BarChart
                                                data={paymentMethodData}
                                                layout="vertical"
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    opacity={0.25}
                                                />

                                                <XAxis
                                                    type="number"
                                                    tickFormatter={(
                                                        value
                                                    ) => `₹${value}`}
                                                />

                                                <YAxis
                                                    type="category"
                                                    dataKey="paymentMethod"
                                                    width={105}
                                                />

                                                <Tooltip
                                                    formatter={(value) =>
                                                        formatCurrency(
                                                            value
                                                        )
                                                    }
                                                />

                                                <Bar
                                                    dataKey="totalAmount"
                                                    name="Transaction Amount"
                                                    fill="#7c3aed"
                                                    radius={[
                                                        0, 5, 5, 0,
                                                    ]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="reports-empty-state reports-small-empty">
                                        <h3>No payment data</h3>

                                        <p>
                                            Payment method analytics
                                            will appear after you add
                                            transactions.
                                        </p>
                                    </div>
                                )}
                            </article>
                        </section>

                        <section className="reports-table-card">
                            <div className="reports-section-heading">
                                <div>
                                    <p className="reports-section-label">
                                        Detailed Analysis
                                    </p>

                                    <h2>
                                        Monthly Financial Statement
                                    </h2>
                                </div>

                                <span className="reports-year-badge">
                                    {selectedYear}
                                </span>
                            </div>

                            <div className="reports-table-wrapper">
                                <table className="reports-table">
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Income</th>
                                            <th>Expenses</th>
                                            <th>Net Balance</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {monthlyData.map((item) => {
                                            const netBalance =
                                                item.income -
                                                item.expense;

                                            return (
                                                <tr key={item.month}>
                                                    <td>
                                                        <strong>
                                                            {item.month}
                                                        </strong>
                                                    </td>

                                                    <td className="reports-positive-text">
                                                        {formatCurrency(
                                                            item.income
                                                        )}
                                                    </td>

                                                    <td className="reports-negative-text">
                                                        {formatCurrency(
                                                            item.expense
                                                        )}
                                                    </td>

                                                    <td
                                                        className={
                                                            netBalance >=
                                                                0
                                                                ? "reports-positive-text"
                                                                : "reports-negative-text"
                                                        }
                                                    >
                                                        {formatCurrency(
                                                            netBalance
                                                        )}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={
                                                                netBalance >
                                                                    0
                                                                    ? "reports-status reports-status-positive"
                                                                    : netBalance <
                                                                        0
                                                                        ? "reports-status reports-status-negative"
                                                                        : "reports-status reports-status-neutral"
                                                            }
                                                        >
                                                            {netBalance >
                                                                0
                                                                ? "Surplus"
                                                                : netBalance <
                                                                    0
                                                                    ? "Deficit"
                                                                    : "Balanced"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
            </section>
        </main>
    );
}