import api from './api';
import { ScheduleEntry, ScheduleFormData, ApiResponse } from '../types';

// Get all schedule entries for a specific date
export const getScheduleEntries = async (date?: string): Promise<ScheduleEntry[]> => {
  let url = '/schedule';
  
  if (date) {
    url += `?date=${date}`;
  }
  
  const response = await api.get<ApiResponse<ScheduleEntry[]>>(url);
  return response.data.data;
};

// Get a single schedule entry
export const getScheduleEntry = async (id: string): Promise<ScheduleEntry> => {
  const response = await api.get<ApiResponse<ScheduleEntry>>(`/schedule/${id}`);
  return response.data.data;
};

// Create a new schedule entry
export const createScheduleEntry = async (entryData: ScheduleFormData): Promise<ScheduleEntry> => {
  const response = await api.post<ApiResponse<ScheduleEntry>>('/schedule', entryData);
  return response.data.data;
};

// Update a schedule entry
export const updateScheduleEntry = async (id: string, entryData: Partial<ScheduleFormData>): Promise<ScheduleEntry> => {
  const response = await api.put<ApiResponse<ScheduleEntry>>(`/schedule/${id}`, entryData);
  return response.data.data;
};

// Delete a schedule entry
export const deleteScheduleEntry = async (id: string): Promise<void> => {
  await api.delete<ApiResponse<{}>>(`/schedule/${id}`);
}; 