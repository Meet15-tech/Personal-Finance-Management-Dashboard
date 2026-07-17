import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  currency: "INR",
  monthlyIncome: "",
};

export default function Register() {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setError("");
    setFieldError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Full name is required";
    }

    if (!formData.email.trim()) {
      return "Email is required";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      return "Please provide a valid email address";
    }

    if (formData.password.length < 8) {
      return "Password must contain at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (formData.monthlyIncome && Number(formData.monthlyIncome) < 0) {
      return "Monthly income cannot be negative";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setFieldError(validationError);
      return;
    }

    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        currency: formData.currency,
        monthlyIncome: formData.monthlyIncome
          ? Number(formData.monthlyIncome)
          : 0,
      });

      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      const serverMessage = requestError.response?.data?.message;
      const serverErrors = requestError.response?.data?.errors;
      const fallbackMessage = serverErrors?.[0] || serverMessage || "Registration failed. Please try again.";

      setError(fallbackMessage);
      setFieldError(serverErrors?.[0] || "");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <p className="eyebrow">PFM Dashboard</p>
          <h1>Create your account</h1>
          <p>Start tracking and managing your finances securely.</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Full name
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Meet Thakkar"
              autoComplete="name"
              required
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="meet@example.com"
              autoComplete="email"
              required
            />
            {fieldError && !formData.email.trim() && <span className="field-hint">Email is required</span>}
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 8 characters"
              autoComplete="new-password"
              minLength="8"
              required
            />
            {fieldError && formData.password.length < 8 && <span className="field-hint">Password must contain at least 8 characters</span>}
          </label>

          <label>
            Confirm password
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter password again"
              autoComplete="new-password"
              minLength="8"
              required
            />
            {fieldError && formData.password !== formData.confirmPassword && <span className="field-hint">Passwords do not match</span>}
          </label>

          <div className="form-grid">
            <label>
              Currency
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </label>

            <label>
              Monthly income
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                placeholder="50000"
                min="0"
              />
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}