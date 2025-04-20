// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
}

// Goal types
export interface Goal {
  _id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  user: string;
  createdAt: string;
}

export interface GoalState {
  goals: Goal[];
  currentGoal: Goal | null;
  loading: boolean;
  error: string | null;
}

// Schedule types
export interface ScheduleEntry {
  _id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  user: string;
  createdAt: string;
}

export interface ScheduleState {
  scheduleEntries: ScheduleEntry[];
  currentEntry: ScheduleEntry | null;
  loading: boolean;
  error: string | null;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface GoalFormData {
  title: string;
  description: string;
  targetDate: string;
  status?: 'not-started' | 'in-progress' | 'completed';
}

export interface ScheduleFormData {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
} 