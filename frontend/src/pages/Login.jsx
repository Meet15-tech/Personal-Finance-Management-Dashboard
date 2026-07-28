import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from || "/dashboard";

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: value,
    }));

    setError("");
    setFieldError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!credentials.email.trim() || !credentials.password) {
      setFieldError("Please enter both your email and password.");
      return;
    }

    try {
      await login({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      navigate(destination, { replace: true });
    } catch (requestError) {
      const serverMessage = requestError.response?.data?.message;
      const serverErrors = requestError.response?.data?.errors;
      const fallbackMessage = serverErrors?.[0] || serverMessage || "Login failed. Please check your credentials.";

      setError(fallbackMessage);
      setFieldError(serverErrors?.[0] || "");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow">PFM Dashboard</p>
          <h1>Welcome back</h1>
          <p>Sign in to continue managing your finances.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email address
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="meet@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            {fieldError && !credentials.password && <span className="field-hint">Password is required</span>}
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          New to PFM? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}