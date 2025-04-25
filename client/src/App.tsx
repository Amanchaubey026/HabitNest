import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Schedule from './pages/Schedule';
import HomePage from './pages/HomePage';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/layout/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { GoalProvider } from './contexts/GoalContext';
import { ScheduleProvider } from './contexts/ScheduleContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import Chatbot from './components/chatbot/Chatbot';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            className: 'dark:bg-dark-surface-light dark:text-dark-text-primary',
            style: {
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '0.75rem 1.5rem',
            },
          }} 
        />
        <AuthProvider>
          <GoalProvider>
            <ScheduleProvider>
              <ChatbotProvider>
                <Layout>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<HomePage />} />
                    
                    <Route element={<PrivateRoute />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/schedule" element={<Schedule />} />
                    </Route>
                    
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                  <Chatbot />
                </Layout>
              </ChatbotProvider>
            </ScheduleProvider>
          </GoalProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App; 