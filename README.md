# Personal Finance Management (PFM) Dashboard

## Project Overview
The Personal Finance Management (PFM) Dashboard is a comprehensive web application designed to help users track their spending, manage budgets, and achieve their financial goals.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, Recharts, React Router DOM, Axios
- **Backend**: Node.js, Express.js, JWT, BcryptJS
- **Database**: MongoDB (Mongoose)

## Folder Structure
```text
PFM-Dashboard/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validations/
│   ├── tests/
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── docs/
│   └── screenshots/
│
├── README.md
├── LICENSE
└── .gitignore
```

## Installation Steps

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd PFM
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Create a .env file with VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

## Planned Features
- Secure User Authentication (JWT)
- Plaid Integration for bank transactions
- Dashboard with Real-time Charts (Recharts)
- Budget Management and Goals Tracking
- Expense Categorization

## Week 1 Roadmap
- **Day 1**: Project Foundation (Frontend & Backend initialization, folder structure, layouts).
- **Day 2**: Database setup and Mongoose models.
- **Day 3**: Authentication API and JWT integration.
- **Day 4**: Frontend Authentication context and protected routes.
- **Day 5**: Plaid API integration research and setup.
