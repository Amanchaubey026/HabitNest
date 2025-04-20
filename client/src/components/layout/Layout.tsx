import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow py-4">
        {children}
      </main>
      <footer className="py-4 bg-primary text-white text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Achievement Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 