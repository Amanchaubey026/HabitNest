import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Goals from './pages/Goals';
import Schedule from './pages/Schedule';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/layout/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import { GoalProvider } from './contexts/GoalContext';
import { ScheduleProvider } from './contexts/ScheduleContext';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <GoalProvider>
          <ScheduleProvider>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/schedule" element={<Schedule />} />
                </Route>
                
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ScheduleProvider>
        </GoalProvider>
      </AuthProvider>
    </Router>
  );
};

export default App; 