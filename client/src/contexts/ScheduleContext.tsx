import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { ScheduleEntry, ScheduleState, ScheduleFormData } from '../types';
import * as scheduleService from '../services/schedule';

// Schedule context initial state
const initialState: ScheduleState = {
  scheduleEntries: [],
  currentEntry: null,
  loading: false,
  error: null
};

// Schedule context type
interface ScheduleContextType {
  state: ScheduleState;
  getScheduleEntries: (date?: string) => Promise<void>;
  getScheduleEntry: (id: string) => Promise<void>;
  createScheduleEntry: (entryData: ScheduleFormData) => Promise<void>;
  updateScheduleEntry: (id: string, entryData: Partial<ScheduleFormData>) => Promise<void>;
  deleteScheduleEntry: (id: string) => Promise<void>;
  clearSchedule: () => void;
  clearError: () => void;
}

// Schedule reducer type
type ScheduleAction =
  | { type: 'GET_ENTRIES_SUCCESS'; payload: ScheduleEntry[] }
  | { type: 'GET_ENTRY_SUCCESS'; payload: ScheduleEntry }
  | { type: 'CREATE_ENTRY_SUCCESS'; payload: ScheduleEntry }
  | { type: 'UPDATE_ENTRY_SUCCESS'; payload: ScheduleEntry }
  | { type: 'DELETE_ENTRY_SUCCESS'; payload: string }
  | { type: 'SCHEDULE_ERROR'; payload: string }
  | { type: 'SET_LOADING' }
  | { type: 'CLEAR_SCHEDULE' }
  | { type: 'CLEAR_ERROR' };

// Schedule reducer
const scheduleReducer = (state: ScheduleState, action: ScheduleAction): ScheduleState => {
  switch (action.type) {
    case 'GET_ENTRIES_SUCCESS':
      return {
        ...state,
        scheduleEntries: action.payload,
        loading: false
      };
    case 'GET_ENTRY_SUCCESS':
      return {
        ...state,
        currentEntry: action.payload,
        loading: false
      };
    case 'CREATE_ENTRY_SUCCESS':
      return {
        ...state,
        scheduleEntries: [...state.scheduleEntries, action.payload],
        loading: false
      };
    case 'UPDATE_ENTRY_SUCCESS':
      return {
        ...state,
        scheduleEntries: state.scheduleEntries.map(entry => 
          entry._id === action.payload._id ? action.payload : entry
        ),
        currentEntry: action.payload,
        loading: false
      };
    case 'DELETE_ENTRY_SUCCESS':
      return {
        ...state,
        scheduleEntries: state.scheduleEntries.filter(entry => entry._id !== action.payload),
        loading: false
      };
    case 'SCHEDULE_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'CLEAR_SCHEDULE':
      return {
        ...state,
        scheduleEntries: [],
        currentEntry: null
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

// Create schedule context
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

// Schedule provider component
export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialState);

  // Get all schedule entries
  const getScheduleEntries = useCallback(async (date?: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const entries = await scheduleService.getScheduleEntries(date);
      dispatch({ type: 'GET_ENTRIES_SUCCESS', payload: entries });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error fetching schedule entries';
      dispatch({ type: 'SCHEDULE_ERROR', payload: errorMessage });
    }
  }, []);

  // Get a single schedule entry
  const getScheduleEntry = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const entry = await scheduleService.getScheduleEntry(id);
      dispatch({ type: 'GET_ENTRY_SUCCESS', payload: entry });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error fetching schedule entry';
      dispatch({ type: 'SCHEDULE_ERROR', payload: errorMessage });
    }
  }, []);

  // Create a new schedule entry
  const createScheduleEntry = useCallback(async (entryData: ScheduleFormData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const entry = await scheduleService.createScheduleEntry(entryData);
      dispatch({ type: 'CREATE_ENTRY_SUCCESS', payload: entry });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error creating schedule entry';
      dispatch({ type: 'SCHEDULE_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  // Update schedule entry
  const updateScheduleEntry = useCallback(async (id: string, entryData: Partial<ScheduleFormData>) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const entry = await scheduleService.updateScheduleEntry(id, entryData);
      dispatch({ type: 'UPDATE_ENTRY_SUCCESS', payload: entry });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error updating schedule entry';
      dispatch({ type: 'SCHEDULE_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  }, []);

  // Delete schedule entry
  const deleteScheduleEntry = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await scheduleService.deleteScheduleEntry(id);
      dispatch({ type: 'DELETE_ENTRY_SUCCESS', payload: id });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error deleting schedule entry';
      dispatch({ type: 'SCHEDULE_ERROR', payload: errorMessage });
    }
  }, []);

  // Clear schedule
  const clearSchedule = useCallback(() => {
    dispatch({ type: 'CLEAR_SCHEDULE' });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  return (
    <ScheduleContext.Provider value={{
      state,
      getScheduleEntries,
      getScheduleEntry,
      createScheduleEntry,
      updateScheduleEntry,
      deleteScheduleEntry,
      clearSchedule,
      clearError
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};

// Custom hook to use schedule context
export const useSchedule = (): ScheduleContextType => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}; 