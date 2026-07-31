import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PlaidLinkButton from "../components/PlaidLinkButton";
import ConnectedAccounts from "../components/ConnectedAccounts";

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import useAuth from "../hooks/useAuth";

import {
    getFinancialSummary,
    getCategoryBreakdown,
    getMonthlyTrend,
} from "../services/analyticsService";

const CATEGORY_COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#6366F1",
    "#84CC16",
    "#06B6D4",
];

export default function Dashboard() {
    const { user, logout } = useAuth();

    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netBalance: 0,
        savingsRate: 0,
        totalTransactions: 0,
        recentTransactions: [],
    });

    const [categoryBreakdown, setCategoryBreakdown] = useState([]);
    const [monthlyTrend, setMonthlyTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [accountsRefreshKey, setAccountsRefreshKey] = useState(0);

    const fetchAnalyticsData = async (showLoader = false) => {
        try {
            if (showLoader) {
                setLoading(true);
            }

            setError("");

            const currentYear = new Date().getFullYear();

            const [summaryRes, categoryRes, trendRes] = await Promise.all([
                getFinancialSummary(),
                getCategoryBreakdown("expense"),
                getMonthlyTrend(currentYear),
            ]);

            if (summaryRes?.success) {
                setSummary({
                    totalIncome: summaryRes.data?.totalIncome || 0,
                    totalExpenses: summaryRes.data?.totalExpenses || 0,
                    netBalance: summaryRes.data?.netBalance || 0,
                    savingsRate: summaryRes.data?.savingsRate || 0,
                    totalTransactions:
                        summaryRes.data?.totalTransactions || 0,
                    recentTransactions:
                        summaryRes.data?.recentTransactions || [],
                });
            }

            if (categoryRes?.success) {
                setCategoryBreakdown(categoryRes.data || []);
            }

            if (trendRes?.success) {
                setMonthlyTrend(trendRes.data || []);
            }
        } catch (err) {
            console.error("Error loading dashboard analytics:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load financial analytics. Please try again."
            );
        } finally {
            if (showLoader) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAnalyticsData(true);

        const refreshInterval = window.setInterval(() => {
            fetchAnalyticsData(false);
        }, 30000);

        const handleWindowFocus = () => {
            fetchAnalyticsData(false);
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                fetchAnalyticsData(false);
            }
        };

        const handleFinancialDataUpdated = () => {
            fetchAnalyticsData(false);
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
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: user?.currency || "INR",
            maximumFractionDigits: 2,
        }).format(Number(amount) || 0);
    };

    const currentYear = new Date().getFullYear();

    return (
        <main className="dashboard-page">
            <section className="dashboard-shell">
                <header className="dashboard-header">
                    <div className="dashboard-header-content">
                        <p className="dashboard-eyebrow">
                            PFM Financial Analytics
                        </p>

                        <h1>
                            Welcome back, {user?.fullName || "User"}
                        </h1>

                        <p>
                            Here is your comprehensive financial summary and
                            analytics overview.
                        </p>
                    </div>

                    <div className="dashboard-header-actions">
                        <PlaidLinkButton
                            onAccountConnected={() => {
                                setAccountsRefreshKey(
                                    (currentKey) => currentKey + 1
                                );
                            }}
                        />
                        <Link
                            to="/transactions"
                            className="manage-transactions-button"
                        >
                            + Transactions
                        </Link>

                        <Link
                            to="/budgets"
                            className="manage-budgets-button"
                        >
                            + Budgets
                        </Link>

                        <Link
                            to="/savings"
                            className="manage-savings-button"
                        >
                            + Savings Goals
                        </Link>

                        <Link
                            to="/reports"
                            className="manage-reports-button"
                        >
                            View Reports
                        </Link>

                        <button
                            type="button"
                            className="logout-button"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <ConnectedAccounts
                    refreshKey={accountsRefreshKey}
                />

                {error && (
                    <div className="form-error dashboard-error">
                        {error}

                        <button
                            type="button"
                            className="dashboard-retry-button"
                            onClick={() => fetchAnalyticsData(true)}
                        >
                            Retry
                        </button>
                    </div>
                )}

                <section className="summary-grid">
                    <article className="summary-card kpi-card">
                        <div className="kpi-header">
                            <p>Total Income</p>

                            <span className="kpi-icon income-badge">
                                ↑
                            </span>
                        </div>

                        <h2>
                            {formatCurrency(summary.totalIncome)}
                        </h2>

                        <span className="income-text">
                            Accumulated income
                        </span>
                    </article>

                    <article className="summary-card kpi-card">
                        <div className="kpi-header">
                            <p>Total Expenses</p>

                            <span className="kpi-icon expense-badge">
                                ↓
                            </span>
                        </div>

                        <h2>
                            {formatCurrency(summary.totalExpenses)}
                        </h2>

                        <span className="expense-text">
                            Total outflow
                        </span>
                    </article>

                    <article className="summary-card kpi-card">
                        <div className="kpi-header">
                            <p>Net Balance</p>

                            <span className="kpi-icon balance-badge">
                                ₹
                            </span>
                        </div>

                        <h2>
                            {formatCurrency(summary.netBalance)}
                        </h2>

                        <span>Current financial balance</span>
                    </article>

                    <article className="summary-card kpi-card">
                        <div className="kpi-header">
                            <p>Savings Rate</p>

                            <span className="kpi-icon savings-badge">
                                %
                            </span>
                        </div>

                        <h2>
                            {Number(summary.savingsRate || 0).toFixed(2)}%
                        </h2>

                        <span>
                            {summary.savingsRate >= 0
                                ? "Positive savings ratio"
                                : "Deficit ratio"}
                        </span>
                    </article>
                </section>

                {loading ? (
                    <div className="loading-spinner">
                        Loading financial analytics...
                    </div>
                ) : (
                    <section className="analytics-charts-grid">
                        <article className="analytics-chart-card">
                            <div className="section-heading">
                                <div>
                                    <p className="section-label">
                                        Category Analytics
                                    </p>

                                    <h2>Expense Distribution</h2>
                                </div>
                            </div>

                            {categoryBreakdown.length > 0 ? (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 300,
                                    }}
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={categoryBreakdown}
                                                dataKey="totalAmount"
                                                nameKey="category"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={95}
                                                innerRadius={45}
                                                paddingAngle={4}
                                                label={({
                                                    category,
                                                    percentage,
                                                }) =>
                                                    `${category} (${percentage || 0}%)`
                                                }
                                            >
                                                {categoryBreakdown.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={
                                                                entry.category ||
                                                                `category-${index}`
                                                            }
                                                            fill={
                                                                CATEGORY_COLORS[
                                                                index %
                                                                CATEGORY_COLORS.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>

                                            <Tooltip
                                                formatter={(value) =>
                                                    formatCurrency(value)
                                                }
                                            />

                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="empty-chart-placeholder">
                                    <h3>No expense data yet</h3>

                                    <p>
                                        Add an expense transaction to view
                                        your category distribution.
                                    </p>

                                    <Link
                                        to="/transactions"
                                        className="secondary-button"
                                    >
                                        Add Transaction
                                    </Link>
                                </div>
                            )}
                        </article>
                        <article className="analytics-chart-card">
                            <div className="section-heading">
                                <div>
                                    <p className="section-label">
                                        Annual Performance
                                    </p>

                                    <h2>
                                        Income vs Expense Trend ({currentYear})
                                    </h2>
                                </div>
                            </div>

                            {monthlyTrend.length > 0 ? (
                                <div
                                    style={{
                                        width: "100%",
                                        height: 300,
                                    }}
                                >
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart
                                            data={monthlyTrend}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 0,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                opacity={0.3}
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
                                                fill="#10B981"
                                                radius={[4, 4, 0, 0]}
                                            />

                                            <Bar
                                                dataKey="expense"
                                                name="Expense"
                                                fill="#EF4444"
                                                radius={[4, 4, 0, 0]}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="empty-chart-placeholder">
                                    <h3>No monthly trend data yet</h3>

                                    <p>
                                        Add income and expense transactions
                                        to view the yearly trend.
                                    </p>

                                    <Link
                                        to="/transactions"
                                        className="secondary-button"
                                    >
                                        Add Transaction
                                    </Link>
                                </div>
                            )}
                        </article>
                    </section>
                )}

                <section className="dashboard-overview-grid">
                    <article className="dashboard-card recent-activity-card">
                        <div className="section-heading">
                            <div>
                                <p className="section-label">Activity</p>

                                <h2>Recent Transactions</h2>
                            </div>

                            <Link
                                to="/transactions"
                                className="secondary-button"
                            >
                                View All ({summary.totalTransactions})
                            </Link>
                        </div>

                        {summary.recentTransactions?.length > 0 ? (
                            <ul className="recent-transactions-list">
                                {summary.recentTransactions.map((item) => (
                                    <li
                                        key={item._id}
                                        className="recent-transaction-item"
                                    >
                                        <div className="recent-transaction-info">
                                            <strong>
                                                {item.title ||
                                                    "Untitled Transaction"}
                                            </strong>

                                            <div className="transaction-meta">
                                                <span>
                                                    {item.category ||
                                                        "Uncategorized"}
                                                </span>

                                                <span>•</span>

                                                <span>
                                                    {item.date
                                                        ? new Date(
                                                            item.date
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                        : "No date"}
                                                </span>
                                            </div>
                                        </div>

                                        <span
                                            className={`transaction-amount ${item.type === "income"
                                                ? "income-amount"
                                                : "expense-amount"
                                                }`}
                                        >
                                            {item.type === "income"
                                                ? "+"
                                                : "-"}{" "}
                                            {formatCurrency(item.amount)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="dashboard-empty-state">
                                <h3>No recent transactions</h3>

                                <p>
                                    Add your first transaction to see
                                    activity here.
                                </p>

                                <Link
                                    to="/transactions"
                                    className="secondary-button"
                                >
                                    Add Transaction
                                </Link>
                            </div>
                        )}
                    </article>

                    <article className="dashboard-card account-summary-card">
                        <div className="section-heading">
                            <div>
                                <p className="section-label">Account</p>

                                <h2>Profile & Preferences</h2>
                            </div>
                        </div>

                        <div className="account-details-list">
                            <div className="account-detail-row">
                                <span>User Name:</span>

                                <strong>
                                    {user?.fullName || "Not provided"}
                                </strong>
                            </div>

                            <div className="account-detail-row">
                                <span>Registered Email:</span>

                                <strong>
                                    {user?.email || "Not provided"}
                                </strong>
                            </div>

                            <div className="account-detail-row">
                                <span>Default Currency:</span>

                                <strong>
                                    {user?.currency || "INR"}
                                </strong>
                            </div>

                            <div className="account-detail-row">
                                <span>Base Monthly Income:</span>

                                <strong>
                                    {formatCurrency(user?.monthlyIncome)}
                                </strong>
                            </div>

                            <div className="account-detail-row">
                                <span>Account Status:</span>

                                <span className="status-badge-verified">
                                    {user?.isVerified
                                        ? "Verified"
                                        : "Active Member"}
                                </span>
                            </div>
                        </div>
                    </article>
                </section>
            </section>
        </main>
    );
}