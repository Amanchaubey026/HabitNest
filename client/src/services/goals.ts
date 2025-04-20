import api from './api';
import { Goal, GoalFormData, ApiResponse } from '../types';

// Get all goals
export const getGoals = async (month?: number, year?: number): Promise<Goal[]> => {
  let url = '/goals';
  
  if (month && year) {
    url += `?month=${month}&year=${year}`;
  } else if (year) {
    url += `?year=${year}`;
  }
  
  const response = await api.get<ApiResponse<Goal[]>>(url);
  return response.data.data;
};

// Get a single goal
export const getGoal = async (id: string): Promise<Goal> => {
  const response = await api.get<ApiResponse<Goal>>(`/goals/${id}`);
  return response.data.data;
};

// Create a new goal
export const createGoal = async (goalData: GoalFormData): Promise<Goal> => {
  const response = await api.post<ApiResponse<Goal>>('/goals', goalData);
  return response.data.data;
};

// Update a goal
export const updateGoal = async (id: string, goalData: Partial<GoalFormData>): Promise<Goal> => {
  const response = await api.put<ApiResponse<Goal>>(`/goals/${id}`, goalData);
  return response.data.data;
};

// Delete a goal
export const deleteGoal = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<{}>>(`/goals/${id}`);
}; 