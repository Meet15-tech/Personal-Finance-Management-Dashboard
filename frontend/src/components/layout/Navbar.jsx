import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm h-16 flex items-center px-6 sticky top-0 z-10 w-full">
      <div className="flex justify-between w-full">
        <Link to="/" className="text-xl font-bold text-blue-600">PFM Dashboard</Link>
        <div className="flex gap-4">
          <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
          <Link to="/register" className="text-gray-600 hover:text-blue-600">Register</Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
