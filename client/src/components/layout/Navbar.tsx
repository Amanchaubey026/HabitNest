import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <div className="flex items-center space-x-4">
      <Link to="/dashboard" className="hover:text-accent transition-colors">
        Dashboard
      </Link>
      <Link to="/goals" className="hover:text-accent transition-colors">
        Goals
      </Link>
      <Link to="/schedule" className="hover:text-accent transition-colors">
        Schedule
      </Link>
      <button 
        onClick={handleLogout}
        className="hover:text-accent transition-colors"
      >
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-4">
      <Link to="/login" className="hover:text-accent transition-colors">
        Login
      </Link>
      <Link to="/register" className="btn-primary">
        Register
      </Link>
    </div>
  );

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Achievement Planner
          </Link>
          {state.isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 