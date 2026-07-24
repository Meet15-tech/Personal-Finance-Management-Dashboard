import React from 'react';
import { Link } from 'react-router-dom';
import { Home, PieChart, Wallet, Settings, PiggyBank } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col hidden md:flex">
      <div className="p-6 text-2xl font-bold text-blue-400">
        PFM
      </div>
      <nav className="flex-1 px-4 space-y-2">
        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Home size={20} />
          <span>Overview</span>
        </Link>
        <Link to="/transactions" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Wallet size={20} />
          <span>Transactions</span>
        </Link>
        <Link to="/budgets" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <PieChart size={20} />
          <span>Budgets</span>
        </Link>
        <Link to="/savings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <PiggyBank size={20} />
          <span>Savings Goals</span>
        </Link>
      </nav>
      <div className="p-4 border-t border-gray-800">
        <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
