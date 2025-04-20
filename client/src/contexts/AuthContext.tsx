import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, LoginFormData, RegisterFormData, User } from '../types';
import * as authService from '../services/auth';
import toast from 'react-hot-toast';

// Auth context initial state
const initialState: AuthState = {
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

// Auth context type
interface AuthContextType {
  state: AuthState;
  login: (formData: LoginFormData) => Promise<void>;
  register: (formData: RegisterFormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Auth reducer type
type AuthAction =
  | { type: 'LOGIN_SUCCESS' | 'REGISTER_SUCCESS'; payload: { token: string } }
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'AUTH_ERROR' | 'LOGIN_FAIL' | 'REGISTER_FAIL' | 'LOGOUT'; payload?: string }
  | { type: 'CLEAR_ERROR' };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      if (action.payload && typeof action.payload.token === 'string') {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('token', action.payload.token);
        }
        return {
          ...state,
          token: action.payload.token,
          isAuthenticated: true,
          loading: false,
          error: null
        };
      }
      return state;
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('token');
      }
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload || null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user when token changes or on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        if (state.token) {
          const user = await authService.getCurrentUser();
          dispatch({ type: 'USER_LOADED', payload: user });
        } else {
          dispatch({ type: 'AUTH_ERROR' });
        }
      } catch (error) {
        console.error('Error loading user:', error);
        dispatch({ type: 'AUTH_ERROR' });
      }
    };

    loadUser();
  }, [state.token]);

  // Login user
  const login = async (formData: LoginFormData) => {
    try {
      const data = await authService.login(formData);
      if (data && typeof data === 'object' && 'token' in data && typeof data.token === 'string') {
        dispatch({ type: 'LOGIN_SUCCESS', payload: data });
        toast.success('Logged in successfully!', {
          position: 'top-center'
        });
      } else {
        console.error('Invalid response data structure:', data);
        toast.error('Login failed', {
          position: 'top-center'
        });
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAIL', payload: errorMessage });
      toast.error(errorMessage, {
        position: 'top-center'
      });
      throw new Error(errorMessage);
    }
  };

  // Register user
  const register = async (formData: RegisterFormData) => {
    try {
      const data = await authService.register(formData);
      console.log('Register data received:', data);
      if (data && typeof data === 'object' && 'token' in data && typeof data.token === 'string') {
        dispatch({ type: 'REGISTER_SUCCESS', payload: data });
        toast.success('Registered successfully!', {
          position: 'top-center'
        });
      } else {
        console.error('Invalid response data structure:', data);
        toast.error('Registration failed', {
          position: 'top-center'
        });
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      dispatch({ type: 'REGISTER_FAIL', payload: errorMessage });
      toast.error(errorMessage, {
        position: 'top-center'
      });
      throw new Error(errorMessage);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully!', {
        position: 'top-center'
      });
    } catch (error) {
      console.error('Logout error:', error);
      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully!', {
        position: 'top-center'
      });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider value={{ state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 