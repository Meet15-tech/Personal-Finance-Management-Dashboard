# 💰 Personal Finance Management (PFM) Dashboard

<p align="center">

![MERN](https://img.shields.io/badge/MERN-Stack-green)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-success)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-success)
![Status](https://img.shields.io/badge/Status-Week%201%20Completed-success)
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
| POST | /api/auth/login | User Login |
| GET | /api/auth/profile | Protected User Profile |

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

---

### ✅ Day 4 — User Login & JWT Authentication

Completed

- User Login API
- Password Verification using bcrypt.compare()
- JWT Authentication Middleware
- Protected Route Implementation
- Token Verification
- Authentication Error Handling
- Postman API Testing

**Implemented Features**

- Verify registered user credentials
- Compare hashed passwords securely
- Generate JWT token on successful login
- Protect private routes using authentication middleware
- Validate Bearer Token from request headers
- Return authenticated user information
- Handle unauthorized and invalid token requests

**API Endpoints**

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/login | User Login |
| GET | /api/auth/profile *(or /api/auth/me)* | Protected User Profile |

**Testing**

- ✅ Successful Login
- ✅ Invalid Password Handling
- ✅ Invalid Email Handling
- ✅ JWT Token Generation
- ✅ Protected Route Access
- ✅ Unauthorized Request Handling
- ✅ Invalid Token Handling
- ✅ Postman Tested

**Commit**

```text
feat: implement login API and JWT authentication middleware
```
---

### ✅ Day 5 — Frontend Authentication

Completed

- React Authentication Context
- Custom Authentication Hook
- Axios API Configuration
- User Registration Page
- User Login Page
- Protected Route Component
- Authentication State Management
- Local Storage Integration
- Form Validation
- React Router Integration

**Implemented Features**

- Created authentication context using React Context API
- Implemented custom `useAuth` hook
- Configured Axios instance for backend communication
- Added automatic JWT token attachment to API requests
- Built responsive Registration page
- Built responsive Login page
- Added client-side form validation
- Stored authenticated user information in Local Storage
- Protected private frontend routes
- Redirect unauthenticated users to Login page

**Frontend Routes**

| Route | Description |
|--------|-------------|
| /register | User Registration |
| /login | User Login |
| /dashboard | Protected Dashboard |

**Testing**

- ✅ Registration Form Validation
- ✅ Login Form Validation
- ✅ Protected Route Redirection
- ✅ Local Storage Token Management
- ✅ Logout Functionality
- ✅ React Router Navigation

**Commit**

```text
feat: implement frontend authentication
```

---

### ✅ Day 6 — Frontend & Backend Integration

Completed

- Connected Registration API
- Connected Login API
- JWT Authentication Flow
- Dashboard Integration
- User Session Management
- Logout Functionality
- API Error Handling
- MongoDB Integration Testing

**Implemented Features**

- Connected React frontend with Express backend
- Integrated Registration API using Axios
- Integrated Login API using Axios
- Stored JWT Token after successful authentication
- Displayed authenticated user information on Dashboard
- Implemented persistent login using Local Storage
- Added automatic logout functionality
- Displayed backend validation and authentication errors
- Successfully stored users in MongoDB
- Verified end-to-end authentication flow

**Current Authentication Flow**

```text
User Registration
        │
        ▼
React Form
        │
        ▼
Axios Request
        │
        ▼
Express API
        │
        ▼
MongoDB
        │
        ▼
JWT Generated
        │
        ▼
Frontend Stores Token
        │
        ▼
Protected Dashboard
```

**Integrated API Endpoints**

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /api/auth/register | Register User |
| POST | /api/auth/login | Login User |
| GET | /api/auth/profile *(or /api/auth/me)* | Protected User Profile |

**Testing**

- ✅ Registration from Frontend
- ✅ Login from Frontend
- ✅ JWT Token Storage
- ✅ Dashboard Access
- ✅ Logout Functionality
- ✅ MongoDB User Creation
- ✅ Duplicate Email Validation
- ✅ Invalid Login Handling
- ✅ Persistent Login After Refresh
- ✅ Full Frontend–Backend Integration

**Commit**

```text
feat: implement frontend authentication and backend integration
```

---

### ⏳ Day 7

- Complete End-to-End Testing
- Fix Bugs & Refactor Code
- Improve UI/UX
- Finalize README Documentation
- Generate Week 1 Project Report
- Prepare for Week 2 (Plaid API Integration)

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
