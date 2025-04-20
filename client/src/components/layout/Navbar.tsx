import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../common/ThemeToggle';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLink: React.FC<{to: string, children: React.ReactNode}> = ({ to, children }) => (
    <Link 
      to={to} 
      className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 md:inline-block md:text-sm ${
        isActive(to) 
          ? 'bg-primary-dark/70 text-white md:bg-transparent md:text-white md:border-b-2 md:border-white' 
          : 'text-gray-100 hover:bg-primary-dark/50 hover:text-white md:hover:bg-transparent md:hover:text-gray-100 md:hover:border-b-2 md:hover:border-white/70'
      }`}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  const authLinks = (
    <>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/goals">Goals</NavLink>
      <NavLink to="/schedule">Schedule</NavLink>
      <button 
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 rounded-md text-base font-medium text-gray-100 hover:bg-primary-dark/50 hover:text-white transition-all duration-200 md:inline-block md:w-auto md:text-sm md:ml-4 md:bg-red-500/20 md:hover:bg-red-500/40 md:border md:border-red-500/30"
      >
        Logout
      </button>
    </>
  );

  const guestLinks = (
    <>
      <NavLink to="/login">Login</NavLink>
      <Link 
        to="/register" 
        className="block w-full text-center px-4 py-2 mt-2 rounded-md bg-accent text-white font-medium hover:bg-accent-dark transition-all duration-200 md:inline-block md:w-auto md:mt-0 md:ml-4 md:shadow-md md:hover:shadow-lg md:transform md:hover:-translate-y-0.5"
        onClick={() => setIsMenuOpen(false)}
      >
        Register
      </Link>
    </>
  );

  return (
    <nav className={`${scrolled ? 'bg-primary/95 backdrop-blur-sm shadow-lg' : 'bg-primary'} dark:bg-dark-surface sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white flex items-center space-x-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-accent group-hover:text-white transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden sm:block relative">
                <span className="absolute -top-3 right-0 text-xs font-light text-accent">grow daily</span>
                HabitNest
              </span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {state.isAuthenticated ? authLinks : guestLinks}
            <div className="ml-2 border-l pl-4 border-gray-100/20">
              <ThemeToggle />
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-primary-dark/50 focus:outline-none transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon when closed */}
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                // X icon when open
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-300 ease-in-out`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-primary-dark/30 dark:border-dark-border">
          {state.isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 