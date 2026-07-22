import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#EC4899", "#14B8A6", "#6366F1", "#84CC16", "#06B6D4",
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

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            setError("");

            const [summaryRes, categoryRes, trendRes] = await Promise.all([
                getFinancialSummary(),
                getCategoryBreakdown("expense"),
                getMonthlyTrend(new Date().getFullYear()),
            ]);

            if (summaryRes.success) {
                setSummary(summaryRes.data);
            }
            if (categoryRes.success) {
                setCategoryBreakdown(categoryRes.data);
            }
            if (trendRes.success) {
                setMonthlyTrend(trendRes.data);
            }
        } catch (err) {
            console.error("Error loading dashboard analytics:", err);
            setError("Unable to load real-time analytics data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: user?.currency || "INR",
            maximumFractionDigits: 2,
        }).format(amount || 0);
    };

    return (
        <main className="dashboard-page">
            <section className="dashboard-shell">
                <header className="dashboard-header">
                    <div>
                        <p className="dashboard-eyebrow">PFM Financial Analytics</p>
                        <h1>Welcome back, {user?.fullName || "User"}</h1>
                        <p>Here is your comprehensive real-time financial summary & analytics overview.</p>
                    </div>

                    <div className="dashboard-header-actions">
                        <Link
                            to="/transactions"
                            className="manage-transactions-button"
                        >
                            + Manage Transactions
                        </Link>

                        <Link
                            to="/budgets"
                            className="manage-budgets-button"
                        >
                            + Manage Budgets
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

                {error && <div className="form-error mb-4">{error}</div>}

                {/* KPI Summary Cards */}
                <section className="summary-grid">
                    <article className="summary-card kpi-card">
                        <div className="kpi-header">
                            <p>Total Income</p>
                            <span className="kpi-icon income-badge">↑</span>
                        </div>
                        <h2>{formatCurrency(summary.totalIncome)}</h2>
                        <span className="income-text">Accumulated Income</span>
                    </article>

                    <article className="summary-card kpi-card">
                        <div className="kpi-header">
                            <p>Total Expenses</p>
                            <span className="kpi-icon expense-badge">↓</span>
                        </div>
                        <h2>{formatCurrency(summary.totalExpenses)}</h2>
                        <span className="expense-text">Total Outflow</span>
                    </article>

                    <article className="summary-card kpi-card">
                        <div className="kpi-header">
                            <p>Net Balance</p>
                            <span className="kpi-icon balance-badge">₹</span>
                        </div>
                        <h2>{formatCurrency(summary.netBalance)}</h2>
                        <span>Net Savings Capital</span>
                    </article>

                    <article className="summary-card kpi-card">
                        <div className="kpi-header">
                            <p>Savings Rate</p>
                            <span className="kpi-icon savings-badge">%</span>
                        </div>
                        <h2>{summary.savingsRate}%</h2>
                        <span>
                            {summary.savingsRate >= 0 ? "Positive Savings Ratio" : "Deficit Ratio"}
                        </span>
                    </article>
                </section>

                {/* Charts Section */}
                {loading ? (
                    <div className="loading-spinner my-8">Loading analytics charts...</div>
                ) : (
                    <section className="analytics-charts-grid">
                        {/* Expense Category Breakdown Chart */}
                        <article className="analytics-chart-card">
                            <div className="section-heading">
                                <div>
                                    <p className="section-label">Category Analytics</p>
                                    <h2>Expense Distribution</h2>
                                </div>
                            </div>

                            {categoryBreakdown.length > 0 ? (
                                <div style={{ width: "100%", height: 300 }}>
                                    <ResponsiveContainer>
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
                                                label={({ category, percentage }) => `${category} (${percentage}%)`}
                                            >
                                                {categoryBreakdown.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => formatCurrency(value)}
                                            />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="empty-chart-placeholder">
                                    <p>No expense transaction data available to plot category chart.</p>
                                    <Link to="/transactions" className="text-link">
                                        Add your first transaction
                                    </Link>
                                </div>
                            )}
                        </article>

                        {/* Monthly Income vs Expense Trend Chart */}
                        <article className="analytics-chart-card">
                            <div className="section-heading">
                                <div>
                                    <p className="section-label">Annual Performance</p>
                                    <h2>Income vs Expense Trend ({new Date().getFullYear()})</h2>
                                </div>
                            </div>

                            <div style={{ width: "100%", height: 300 }}>
                                <ResponsiveContainer>
                                    <BarChart data={monthlyTrend} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="month" />
                                        <YAxis tickFormatter={(v) => `₹${v}`} />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend />
                                        <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="expense" name="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </article>
                    </section>
                )}

                {/* Overview & Quick Table Section */}
                <section className="dashboard-overview-grid">
                    <article className="dashboard-card recent-activity-card">
                        <div className="section-heading">
                            <div>
                                <p className="section-label">Feed</p>
                                <h2>Recent Transactions</h2>
                            </div>
                            <Link to="/transactions" className="secondary-button text-xs">
                                View All ({summary.totalTransactions})
                            </Link>
                        </div>

                        {summary.recentTransactions && summary.recentTransactions.length > 0 ? (
                            <ul className="recent-transactions-list">
                                {summary.recentTransactions.map((item) => (
                                    <li key={item._id} className="recent-transaction-item">
                                        <div>
                                            <strong>{item.title}</strong>
                                            <div className="text-xs text-gray-500">
                                                {item.category} • {new Date(item.date).toLocaleDateString("en-IN")}
                                            </div>
                                        </div>
                                        <span className={`transaction-amount ${item.type === "income" ? "income-amount" : "expense-amount"}`}>
                                            {item.type === "income" ? "+" : "-"} {formatCurrency(item.amount)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm py-4">No recent activity recorded yet.</p>
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
                                <strong>{user?.fullName}</strong>
                            </div>
                            <div className="account-detail-row">
                                <span>Registered Email:</span>
                                <strong>{user?.email}</strong>
                            </div>
                            <div className="account-detail-row">
                                <span>Default Currency:</span>
                                <strong>{user?.currency || "INR"}</strong>
                            </div>
                            <div className="account-detail-row">
                                <span>Base Monthly Income:</span>
                                <strong>{formatCurrency(user?.monthlyIncome)}</strong>
                            </div>
                            <div className="account-detail-row">
                                <span>Account Status:</span>
                                <span className="status-badge-verified">
                                    {user?.isVerified ? "Verified" : "Active Member"}
                                </span>
                            </div>
                        </div>
                    </article>
                </section>
            </section>
        </main>
    );
}