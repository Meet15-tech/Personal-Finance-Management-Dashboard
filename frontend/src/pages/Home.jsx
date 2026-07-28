import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
        Take Control of Your <span className="text-blue-600">Finances</span>
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-2xl">
        The ultimate personal finance management dashboard. Track your spending, set budgets, and achieve your financial goals with ease.
      </p>
      <div className="flex gap-4">
        <Link to="/register" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Get Started
        </Link>
        <Link to="/login" className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
