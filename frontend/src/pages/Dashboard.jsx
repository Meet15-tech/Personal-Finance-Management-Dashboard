import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">PFM Dashboard</p>
          <h1>Welcome, {user?.fullName || "User"}</h1>
          <p>You are successfully authenticated.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <span>Email</span>
          <strong>{user?.email || "Not available"}</strong>
        </article>

        <article className="dashboard-card">
          <span>Currency</span>
          <strong>{user?.currency || "INR"}</strong>
        </article>

        <article className="dashboard-card">
          <span>Monthly income</span>
          <strong>
            {user?.currency || "INR"}{" "}
            {Number(user?.monthlyIncome || 0).toLocaleString()}
          </strong>
        </article>

        <article className="dashboard-card">
          <span>Account status</span>
          <strong>
            {user?.isVerified ? "Verified" : "Not verified"}
          </strong>
        </article>
      </section>

      <section className="dashboard-placeholder">
        <h2>Financial dashboard coming next</h2>
        <p>
          Accounts, transactions, budgets, analytics, and Plaid integration
          will be added in the upcoming development phases.
        </p>
      </section>
    </main>
  );
}