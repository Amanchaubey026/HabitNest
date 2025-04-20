import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../common/Spinner';

const PrivateRoute: React.FC = () => {
  const { state } = useAuth();
  
  if (state.loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return state.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute; 