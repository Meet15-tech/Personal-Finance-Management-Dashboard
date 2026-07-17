import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="dashboard-header">
          <div>
            <p className="dashboard-eyebrow">PFM Dashboard</p>
            <h1>Welcome, {user?.fullName}</h1>
            <p>You are successfully authenticated.</p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <section className="dashboard-grid">
          <article className="dashboard-card">
            <p>Email</p>
            <strong>{user?.email}</strong>
          </article>

          <article className="dashboard-card">
            <p>Currency</p>
            <strong>{user?.currency || "INR"}</strong>
          </article>

          <article className="dashboard-card">
            <p>Monthly income</p>
            <strong>
              {user?.currency || "INR"} {user?.monthlyIncome || 0}
            </strong>
          </article>

          <article className="dashboard-card">
            <p>Account status</p>
            <strong>
              {user?.isVerified ? "Verified" : "Not verified"}
            </strong>
          </article>
        </section>

        <section className="dashboard-feature-card">
          <div>
            <h2>Financial Management</h2>
            <p>
              Add, review, and manage your income and expense transactions.
            </p>
          </div>

          <Link
            to="/transactions"
            className="manage-transactions-button"
          >
            Manage Transactions
          </Link>
        </section>
      </section>
    </main>
  );
}