import api from './api';
import { User, LoginFormData, RegisterFormData, ApiResponse } from '../types';

// Response type for login/register
interface AuthResponse {
  token: string;
}

// Register a new user
export const register = async (userData: RegisterFormData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse> | AuthResponse>('/auth/register', userData);
  console.log('Register API response:', response);
  
  // Handle different response structures
  if (response.data && 'data' in response.data && response.data.data && response.data.data.token) {
    return response.data.data;
  } else if (response.data && 'token' in response.data) {
    return response.data;
  } else {
    console.error('Unexpected response structure:', response.data);
    throw new Error('Invalid response structure');
  }
};

// Login user
export const login = async (userData: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse> | AuthResponse>('/auth/login', userData);
  console.log('Login API response:', response);
  
  // Handle different response structures
  if (response.data && 'data' in response.data && response.data.data && response.data.data.token) {
    return response.data.data;
  } else if (response.data && 'token' in response.data) {
    return response.data;
  } else {
    console.error('Unexpected response structure:', response.data);
    throw new Error('Invalid response structure');
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}; 