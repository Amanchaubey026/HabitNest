import api from './api';
import { User, LoginFormData, RegisterFormData, ApiResponse } from '../types';

// Response type for login/register
interface AuthResponse {
  token: string;
}

// Register a new user
export const register = async (userData: RegisterFormData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);
  return response.data.data;
};

// Login user
export const login = async (userData: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', userData);
  return response.data.data;
};

// Get current user
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}; 