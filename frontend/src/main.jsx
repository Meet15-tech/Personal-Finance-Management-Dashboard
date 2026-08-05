import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "./index.css";

import "./styles/variables.css";

import "./styles/reset.css";

import "./styles/typography.css";

import "./styles/layout.css";

import "./styles/cards.css";

import "./styles/buttons.css";

import "./styles/forms.css";

import "./styles/dashboard.css";

import "./styles/transactions.css";

import "./styles/budgets.css";

import "./styles/reports.css";

import "./styles/savings.css";

import "./styles/animations.css";

import "./styles/responsive.css";
import "./styles/auth.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);