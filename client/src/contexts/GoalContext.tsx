import React, { createContext, useContext, useReducer } from 'react';
import { Goal, GoalState, GoalFormData } from '../types';
import * as goalService from '../services/goals';

// Goal context initial state
const initialState: GoalState = {
  goals: [],
  currentGoal: null,
  loading: false,
  error: null
};

// Goal context type
interface GoalContextType {
  state: GoalState;
  getGoals: (month?: number, year?: number) => Promise<void>;
  getGoal: (id: string) => Promise<void>;
  createGoal: (goalData: GoalFormData) => Promise<void>;
  updateGoal: (id: string, goalData: Partial<GoalFormData>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  clearGoals: () => void;
  clearError: () => void;
}

// Goal reducer type
type GoalAction =
  | { type: 'GET_GOALS_SUCCESS'; payload: Goal[] }
  | { type: 'GET_GOAL_SUCCESS'; payload: Goal }
  | { type: 'CREATE_GOAL_SUCCESS'; payload: Goal }
  | { type: 'UPDATE_GOAL_SUCCESS'; payload: Goal }
  | { type: 'DELETE_GOAL_SUCCESS'; payload: string }
  | { type: 'GOAL_ERROR'; payload: string }
  | { type: 'SET_LOADING' }
  | { type: 'CLEAR_GOALS' }
  | { type: 'CLEAR_ERROR' };

// Goal reducer
const goalReducer = (state: GoalState, action: GoalAction): GoalState => {
  switch (action.type) {
    case 'GET_GOALS_SUCCESS':
      return {
        ...state,
        goals: action.payload,
        loading: false
      };
    case 'GET_GOAL_SUCCESS':
      return {
        ...state,
        currentGoal: action.payload,
        loading: false
      };
    case 'CREATE_GOAL_SUCCESS':
      return {
        ...state,
        goals: [...state.goals, action.payload],
        loading: false
      };
    case 'UPDATE_GOAL_SUCCESS':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal._id === action.payload._id ? action.payload : goal
        ),
        currentGoal: action.payload,
        loading: false
      };
    case 'DELETE_GOAL_SUCCESS':
      return {
        ...state,
        goals: state.goals.filter(goal => goal._id !== action.payload),
        loading: false
      };
    case 'GOAL_ERROR':
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
    case 'CLEAR_GOALS':
      return {
        ...state,
        goals: [],
        currentGoal: null
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

// Create goal context
const GoalContext = createContext<GoalContextType | undefined>(undefined);

// Goal provider component
export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(goalReducer, initialState);

  // Get all goals
  const getGoals = async (month?: number, year?: number) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const goals = await goalService.getGoals(month, year);
      dispatch({ type: 'GET_GOALS_SUCCESS', payload: goals });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error fetching goals';
      dispatch({ type: 'GOAL_ERROR', payload: errorMessage });
    }
  };

  // Get a single goal
  const getGoal = async (id: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const goal = await goalService.getGoal(id);
      dispatch({ type: 'GET_GOAL_SUCCESS', payload: goal });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error fetching goal';
      dispatch({ type: 'GOAL_ERROR', payload: errorMessage });
    }
  };

  // Create a new goal
  const createGoal = async (goalData: GoalFormData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const goal = await goalService.createGoal(goalData);
      dispatch({ type: 'CREATE_GOAL_SUCCESS', payload: goal });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error creating goal';
      dispatch({ type: 'GOAL_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Update goal
  const updateGoal = async (id: string, goalData: Partial<GoalFormData>) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const goal = await goalService.updateGoal(id, goalData);
      dispatch({ type: 'UPDATE_GOAL_SUCCESS', payload: goal });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error updating goal';
      dispatch({ type: 'GOAL_ERROR', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Delete goal
  const deleteGoal = async (id: string) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await goalService.deleteGoal(id);
      dispatch({ type: 'DELETE_GOAL_SUCCESS', payload: id });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error deleting goal';
      dispatch({ type: 'GOAL_ERROR', payload: errorMessage });
    }
  };

  // Clear goals
  const clearGoals = () => {
    dispatch({ type: 'CLEAR_GOALS' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <GoalContext.Provider value={{
      state,
      getGoals,
      getGoal,
      createGoal,
      updateGoal,
      deleteGoal,
      clearGoals,
      clearError
    }}>
      {children}
    </GoalContext.Provider>
  );
};

// Custom hook to use goal context
export const useGoals = (): GoalContextType => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
}; 