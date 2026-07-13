# 💰 Personal Finance Management (PFM) Dashboard

<p align="center">

![MERN](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![Status](https://img.shields.io/badge/Status-Week%201%20Day%203-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

</p>

---

# 📖 Project Overview

The **Personal Finance Management (PFM) Dashboard** is a full-stack MERN application that enables users to manage their personal finances efficiently from a single platform.

The application allows users to securely register, authenticate, connect their bank accounts, analyze spending patterns, create budgets, monitor income and expenses, and visualize financial data using interactive dashboards.

This project is being developed incrementally over **4 weeks** following professional software engineering practices as part of an internship program.

---

# ❗ Problem Statement

Managing personal finances across multiple bank accounts, credit cards, and investment platforms is difficult.

Most users struggle to:

- Track expenses
- Monitor income
- Create budgets
- Understand spending habits
- View complete financial data in one place

The Personal Finance Management Dashboard solves these problems by providing a centralized financial management platform.

---

# 🎯 Project Objectives

- Secure User Authentication
- Bank Account Integration
- Expense Tracking
- Income Management
- Budget Planning
- Spending Analytics
- Interactive Charts
- Financial Reports
- Responsive Dashboard
- Clean & Scalable Architecture

---

# 🚀 Tech Stack

## Frontend

- React.js (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- Recharts

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt.js

## Database

- MongoDB Atlas
- Mongoose ODM

## Third Party APIs

- Plaid API (Sandbox)

---

# 🏗 Project Architecture

```
React Frontend
       │
       ▼
Express REST API
       │
       ▼
Authentication Layer
       │
       ▼
MongoDB Database
       │
       ▼
Plaid API (Week 2)
```

---

# 📂 Folder Structure

```text
PFM-Dashboard/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── validations/
│   ├── services/
│   ├── tests/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .gitignore
│
├── docs/
│   └── reports/
│
├── README.md
└── .gitignore
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/Meet15-tech/Personal-Finance-Management-Dashboard.git
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🔐 Environment Variables

Create:

```
backend/.env
```

Example:

```env
PORT=5050
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

# ✨ Planned Features

- User Authentication
- JWT Authorization
- Protected Routes
- Plaid Integration
- Dashboard
- Expense Tracking
- Income Tracking
- Budget Management
- Spending Analytics
- Charts
- Monthly Reports
- Dark Mode
- Responsive UI

---

# 📡 Current API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | / | Backend Status |
| GET | /api/health | Health Check |
| POST | /api/auth/register | User Registration |

---

# 📅 Development Timeline

## Week 1

### ✅ Day 1 — Project Foundation

Completed

- React (Vite) Setup
- Express Server
- Project Structure
- Environment Configuration
- Health Check API
- GitHub Repository
- Initial Documentation

**Commit**

```
chore: initialize PFM dashboard project
```

---

### ✅ Day 2 — Database Setup

Completed

- MongoDB Atlas Configuration
- Mongoose Setup
- Database Connection
- User Model
- Environment Variables
- Connection Testing

**Commit**

```
feat: connect MongoDB Atlas and create User model
```

---

### ✅ Day 3 — User Registration & JWT

Completed

- User Registration API
- Password Hashing using bcrypt.js
- JWT Token Generation
- Duplicate Email Validation
- MongoDB User Storage
- Postman Testing

**Commit**

```
feat: implement user registration with password hashing and JWT
```

---

### ⏳ Day 4

- User Login API
- JWT Authentication Middleware
- Protected Routes

---

### ⏳ Day 5

- Frontend Authentication

---

### ⏳ Day 6

- Frontend & Backend Integration

---

### ⏳ Day 7

- Testing
- Bug Fixes
- Documentation

---

# 📅 Week 2

- Plaid API Integration
- Connect Bank Account
- Fetch Transactions
- Account Balance

---

# 📅 Week 3

- Dashboard Development
- Budget Management
- Expense Categories
- Analytics
- Charts

---

# 📅 Week 4

- Manual Transactions
- Testing
- UI Improvements
- Documentation
- Final Presentation

---

# 📊 Project Progress

Overall Progress

```
██████░░░░░░░░░░░░░ 15%
```

Week 1 Progress

```
███████████░░░░░░░░ 45%
```

---

# 🛠 Development Workflow

- Daily Feature Development
- Daily Git Commits
- Professional Folder Structure
- Modular Code
- Clean Architecture
- Continuous Testing
- Incremental Development

---

# 📚 Documentation

Project documentation is maintained inside:

```
docs/
```

Daily reports:

- Week1-Day1-Report.pdf
- Week1-Day2-Report.pdf
- Week1-Day3-Report.pdf

---

# 🚀 Future Enhancements

- Email Verification
- Forgot Password
- Google OAuth
- Two Factor Authentication
- AI Expense Prediction
- Financial Insights
- Mobile Responsive Dashboard
- CSV & PDF Export
- Notifications

---

# 👨‍💻 Team

### Meet Thakkar

- Frontend & Backend Development
- Authentication
- Documentation
- Project Architecture

### Ayush Soni

- Database Integration
- Backend Development
- MongoDB Configuration

---

# 📄 License

This project is developed as part of an internship for educational purposes.

---

⭐ If you like this project, consider giving it a star.
