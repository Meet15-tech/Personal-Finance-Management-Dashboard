import React from 'react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Balance</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">$12,450.00</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Monthly Income</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">+$4,200.00</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Monthly Expenses</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">-$1,850.00</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-96 flex items-center justify-center">
        <p className="text-gray-500">Charts (Recharts) will be implemented here</p>
      </div>
    </div>
  );
};

export default Dashboard;
