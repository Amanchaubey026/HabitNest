import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-dark-background transition-theme">
      <Navbar />
      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <footer className="py-6 bg-gray-100 dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border transition-theme">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-dark-text-secondary text-sm">
                &copy; {new Date().getFullYear()} Achievement Planner. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary dark:text-dark-text-secondary dark:hover:text-primary-light transition-colors"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary dark:text-dark-text-secondary dark:hover:text-primary-light transition-colors"
                aria-label="Terms of Service"
              >
                Terms of Service
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-primary dark:text-dark-text-secondary dark:hover:text-primary-light transition-colors"
                aria-label="Contact Us"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 