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
| POST | /api/transactions | Create Transaction |
| GET | /api/transactions | Get User Transactions |
| GET | /api/transactions/:id | Get Single Transaction |
| PUT | /api/transactions/:id | Update Transaction |
| DELETE | /api/transactions/:id | Delete Transaction |
| GET | /api/analytics/summary | Financial Summary KPI Stats |
| GET | /api/analytics/category-breakdown | Expense Category Aggregation |
| GET | /api/analytics/monthly-trend | Monthly Income vs Expense Trend |
| GET | /api/analytics/payment-methods | Payment Method Statistics |

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

## ✅ Day 7 — Testing, Bug Fixes & Documentation

### Completed

- End-to-End Backend API Testing
- Frontend Authentication Flow Testing
- JWT Authentication Verification
- Protected Route Validation
- Form Validation Improvements
- Error Handling Enhancements
- Code Refactoring & Cleanup
- README Documentation Updated
- Week 1 Development Report Prepared

---

### 🧪 Testing Performed

#### Backend API Testing

- ✅ Health Check API
- ✅ User Registration API
- ✅ User Login API
- ✅ Protected Profile API
- ✅ JWT Token Validation
- ✅ Invalid Credentials Handling
- ✅ Duplicate Email Validation
- ✅ Unauthorized Access Testing

---

#### Frontend Testing

- ✅ Registration Form
- ✅ Login Form
- ✅ Protected Dashboard Access
- ✅ Logout Functionality
- ✅ Route Protection
- ✅ Persistent Login After Refresh
- ✅ Error Message Display
- ✅ Authentication Context Validation

---

#### Database Testing

- ✅ MongoDB Connection
- ✅ User Registration
- ✅ Password Hash Storage
- ✅ JWT Authentication Flow
- ✅ User Data Retrieval
- ✅ Profile Information Display

---

### 🐞 Bug Fixes

- Improved API error responses
- Enhanced frontend validation
- Fixed authentication edge cases
- Improved protected route handling
- Better code organization
- Removed unused code
- Improved project stability

---

### 📂 Documentation

Updated project documentation with:

- Day-wise development progress
- API endpoints
- Authentication workflow
- Installation instructions
- Development roadmap
- Testing procedures

---

### ✅ Week 1 Achievements

Successfully completed:

- MERN Project Setup
- MongoDB Integration
- User Model
- JWT Authentication
- User Registration
- User Login
- Password Encryption
- Protected Backend APIs
- React Authentication Context
- Protected Frontend Routes
- Frontend–Backend Integration
- Authentication Dashboard
- API Testing
- Project Documentation

---

### 📊 Week 1 Summary

| Module | Status |
|---------|--------|
| Project Setup | ✅ Completed |
| MongoDB Integration | ✅ Completed |
| User Model | ✅ Completed |
| Registration API | ✅ Completed |
| Login API | ✅ Completed |
| JWT Authentication | ✅ Completed |
| Protected Routes | ✅ Completed |
| React Authentication | ✅ Completed |
| Frontend Integration | ✅ Completed |
| Testing & Documentation | ✅ Completed |

---

### 🎯 Ready for Week 2

Upcoming development includes:

- Plaid Sandbox Integration
- Bank Account Linking
- Transaction Synchronization
- Financial Dashboard
- Budget Management
- Savings Goals
- Reports & Analytics

---

### 📝 Commit

```text
chore: complete week 1 testing, bug fixes, and documentation
```

---

## 🎉 Week 1 Successfully Completed

Week 1 established the core foundation of the Personal Finance Management Dashboard by implementing a complete authentication system using the MERN stack. Users can now register, log in securely with JWT-based authentication, access protected routes, and interact with a connected MongoDB database through a fully integrated React frontend.

The project is now ready to move into **Week 2**, where the focus shifts from authentication to personal finance functionality, including bank integration, transaction management, and dashboard development.

---

# 📅 Week 2

- Plaid API Integration
- Connect Bank Account
- Fetch Transactions
- Account Balance

---

# ✅ Day 8 — Transaction Management Module

## 📌 Objective

The objective of Day 8 was to build the core **Transaction Management System**, enabling authenticated users to manage their financial records through secure CRUD (Create, Read, Update, Delete) operations. This module serves as the foundation for future dashboard analytics, budgeting, reports, and bank transaction synchronization.

---

## 🚀 Features Implemented

### Backend Development

- Designed and implemented the **Transaction** MongoDB model using Mongoose.
- Established a relationship between users and transactions.
- Implemented secure **JWT-protected Transaction APIs**.
- Developed complete CRUD functionality for transactions.
- Added server-side validation for transaction data.
- Ensured each user can access only their own transactions.
- Implemented proper HTTP status codes and structured API responses.

---

### 📂 Transaction Model

The Transaction schema includes:

- User Reference
- Transaction Title
- Amount
- Transaction Type (Income / Expense)
- Category
- Description
- Transaction Date
- Payment Method
- Created At
- Updated At

---

### 🔐 Protected API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/transactions` | Create Transaction |
| GET | `/api/transactions` | Get All Transactions |
| GET | `/api/transactions/:id` | Get Single Transaction |
| PUT | `/api/transactions/:id` | Update Transaction |
| DELETE | `/api/transactions/:id` | Delete Transaction |

All endpoints are protected using JWT Authentication.

---

## 🎨 Frontend Development

Developed the initial Transaction Management UI using React.

### Components Created

- Transactions Page
- Transaction Form
- Transaction Card
- Transaction List
- Dashboard Navigation

---

### Implemented UI Features

- Add Transaction Form
- Income & Expense Selection
- Category Selection
- Payment Method Selection
- Date Picker
- Description Field
- Transaction Listing
- Summary Cards
- Delete Transaction Button
- Dashboard Navigation

---

## 📊 Dashboard Summary Cards

Implemented summary cards displaying:

- Total Income
- Total Expenses
- Current Balance

> **Note:** During Day 8, summary values are calculated from local state. Backend integration will be completed in a later phase.

---

## 🛡️ Backend Validation

Implemented validation for:

- Required Transaction Title
- Amount greater than zero
- Valid Transaction Type
- Required Category
- Valid Payment Method
- Valid Date
- JWT Authentication

---

## 🧪 API Testing

Successfully tested all APIs using Postman.

### Tested Endpoints

- User Login
- Create Transaction
- Get Transactions
- Get Transaction By ID
- Update Transaction
- Delete Transaction
- Unauthorized Access
- Validation Errors

---

## 🗄️ Database

Successfully verified:

- MongoDB Transaction Collection
- User-wise Transaction Storage
- Protected Database Access

---

## 📁 Project Structure

### Backend

```text
backend/
├── controllers/
│   └── transactionController.js
├── models/
│   └── Transaction.js
├── routes/
│   └── transactionRoutes.js
```

### Frontend

```text
frontend/
├── pages/
│   └── Transactions.jsx
├── components/
│   └── transactions/
│       ├── TransactionForm.jsx
│       ├── TransactionList.jsx
│       └── TransactionCard.jsx
```

---

## 📌 Current Status

### ✅ Completed

- Transaction Database Model
- Transaction CRUD APIs
- JWT Protected Routes
- Backend Validation
- MongoDB Integration
- Transaction Management UI
- Dashboard Navigation
- Summary Cards
- API Testing

### ⏳ Planned for Upcoming Days

- Connect Frontend with Backend APIs
- Persistent Transaction Storage
- Dashboard Analytics
- Budget Management
- Savings Goals
- Charts & Reports
- Plaid Integration

---

## 📚 Technologies Used

- React.js
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Axios
- React Router
- Postman

---

## 🎯 Learning Outcomes

- Built secure RESTful CRUD APIs.
- Strengthened understanding of MongoDB relationships using Mongoose.
- Implemented JWT-protected routes.
- Developed reusable React components.
- Designed a scalable transaction management architecture for future financial analytics.

---

## 📝 Commit

```text
feat: implement transaction management module with secure CRUD APIs
```

---

## 📅 Progress Update

- **Week 2 Progress:** 15%
- **Overall Project Progress:** 40%

---

# ✅ Day 9 — Dashboard Analytics & Financial Summary APIs

## 📌 Objective

The primary objective of Day 9 was to build the **Dashboard Analytics & Financial Summary System**, providing authenticated users with aggregated real-time financial insights, key performance indicators (KPIs), category spending breakdowns, annual income vs expense trends, and seamless frontend visualization powered by Recharts.

---

## 🚀 Features Implemented

### Backend Analytics APIs

- Built `analyticsController.js` and `analyticsRoutes.js` under `/api/analytics`.
- Implemented MongoDB Aggregation Pipelines to compute real-time metrics efficiently.
- Developed **Financial Summary API** (`GET /api/analytics/summary`) returning:
  - Total Income
  - Total Expenses
  - Net Balance
  - Savings Rate (%)
  - Total Transaction Counts
  - 5 Recent Transactions overview
- Developed **Category Breakdown API** (`GET /api/analytics/category-breakdown`) returning category-wise totals and percentage distribution.
- Developed **Monthly Trend API** (`GET /api/analytics/monthly-trend`) returning month-by-month income vs expense comparisons for the current year.
- Developed **Payment Methods API** (`GET /api/analytics/payment-methods`) aggregating spending distribution across UPI, Cash, Credit Card, Debit Card, and Bank Transfers.
- Secured all analytics endpoints using JWT Authentication middleware.

---

### 🎨 Frontend Analytics Dashboard & Integration

- Connected `Transactions.jsx` to live MongoDB backend via `transactionService.js`.
- Integrated `Dashboard.jsx` with real-time financial metrics from `analyticsService.js`.
- Implemented KPI Summary Cards for Income, Expenses, Net Balance, and Savings Rate.
- Integrated **Recharts** interactive data visualizations:
  - **Expense Category Pie/Donut Chart** with HSL colors & percentage badges.
  - **Monthly Income vs Expense Bar Chart** with custom tooltips & responsive containers.
- Added Recent Transactions feed and Profile overview card on the main dashboard.
- Maintained modern, responsive UI design system with micro-interactions and sleek aesthetics.

---

## 🔐 Protected API Endpoints (Day 9)

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/analytics/summary` | Overall Financial Summary KPIs & Recent Activity |
| GET | `/api/analytics/category-breakdown` | Category-wise spending & income percentage breakdown |
| GET | `/api/analytics/monthly-trend` | Monthly income vs expense annual trend |
| GET | `/api/analytics/payment-methods` | Aggregated stats by payment method |

---

## 🧪 Testing & Verification

- ✅ Automated unit tests added in `backend/tests/analytics.validation.test.js` (6 passing tests).
- ✅ Postman collection added (`backend/postman/PFM_Analytics_Testing.postman_collection.json`).
- ✅ Real-time data pipeline verified with MongoDB.
- ✅ Recharts responsive layout tested on desktop and mobile viewports.

---

## 📁 Updated Project Architecture

```text
backend/
├── controllers/
│   ├── analyticsController.js
│   └── transactionController.js
├── routes/
│   ├── analyticsRoutes.js
│   └── transactionRoutes.js
├── tests/
│   └── analytics.validation.test.js
└── postman/
    └── PFM_Analytics_Testing.postman_collection.json

frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Transactions.jsx
│   └── services/
│       ├── analyticsService.js
│       └── transactionService.js
```

---

## 📝 Commit

```text
feat: implement dashboard analytics and financial summary APIs
```

---

## 📅 Progress Update

- **Week 2 Progress:** 30%
- **Overall Project Progress:** 50%

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
