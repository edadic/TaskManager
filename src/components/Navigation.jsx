import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-gray-800">
              Task Manager
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-600 hover:text-gray-900"
              >
                Admin Dashboard
              </Link>
            )}
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900"
            >
              My Tasks
            </Link>
            <Link
              to="/calendar"
              className="text-gray-600 hover:text-gray-900"
            >
              Calendar
            </Link>
            <span className="text-gray-600">
              Welcome, {user.username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;