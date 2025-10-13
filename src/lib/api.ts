import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

console.log('🔗 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  estimated_duration_hours: number;
  dependencies: number[];
  status?: 'not_started' | 'todo' | 'in_progress' | 'review' | 'completed';
  start_date?: string;
  end_date?: string;
  progress?: number;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  order?: number;
  kanban_column?: string;
  kanban_position?: number;
  completed?: boolean;
}

export interface Plan {
  _id?: string;
  userId: string;
  projectName: string;
  projectSummary: string;
  goalText: string;
  tasks: Task[];
  status?: 'active' | 'completed' | 'archived';
  tags?: string[];
  color?: string;
  thumbnail?: string;
  totalTasks?: number;
  completedTasks?: number;
  progressPercentage?: number;
  estimatedDuration?: number;
  createdAt?: Date;
  updatedAt?: Date;
  lastAccessedAt?: Date;
  isStarred?: boolean;
  sharedWith?: Array<{
    userId: string;
    permission: 'view' | 'edit' | 'admin';
  }>;
}

export interface UserPreferences {
  _id?: string;
  userId: string;
  email: string;
  name?: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    emailNotifications?: boolean;
    taskReminders?: boolean;
    weeklyDigest?: boolean;
  };
  settings?: {
    defaultView?: 'list' | 'kanban' | 'timeline' | 'analytics';
    defaultPlanColor?: string;
    timezone?: string;
    language?: string;
  };
  stats?: {
    totalPlansCreated?: number;
    totalTasksCompleted?: number;
    lastLoginAt?: Date;
    accountCreatedAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GetPlansParams {
  userId: string;
  status?: 'active' | 'completed' | 'archived';
  starred?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'projectName';
  order?: 'asc' | 'desc';
}

// Plans API
export const plansAPI = {
  // Get all plans for a user
  getPlans: async (params: GetPlansParams) => {
    const { userId, ...queryParams } = params;
    const response = await api.get(`/plans/user/${userId}`, { params: queryParams });
    return response.data;
  },

  // Get a single plan by ID
  getPlan: async (planId: string) => {
    const response = await api.get(`/plans/${planId}`);
    return response.data;
  },

  // Create a new plan
  createPlan: async (plan: Omit<Plan, '_id'>) => {
    const response = await api.post('/plans', plan);
    return response.data;
  },

  // Update a plan
  updatePlan: async (planId: string, updates: Partial<Plan>) => {
    const response = await api.put(`/plans/${planId}`, updates);
    return response.data;
  },

  // Update plan tasks
  updateTasks: async (planId: string, tasks: Task[]) => {
    const response = await api.put(`/plans/${planId}/tasks`, { tasks });
    return response.data;
  },

  // Toggle star status
  toggleStar: async (planId: string) => {
    const response = await api.patch(`/plans/${planId}/star`);
    return response.data;
  },

  // Delete a plan
  deletePlan: async (planId: string) => {
    const response = await api.delete(`/plans/${planId}`);
    return response.data;
  },

  // Archive/Unarchive a plan
  toggleArchive: async (planId: string) => {
    const response = await api.patch(`/plans/${planId}/archive`);
    return response.data;
  },

  // Duplicate a plan
  duplicatePlan: async (planId: string) => {
    const response = await api.post(`/plans/${planId}/duplicate`);
    return response.data;
  },
};

// User Preferences API
export const userPreferencesAPI = {
  // Get user preferences
  getUserPreferences: async (userId: string) => {
    const response = await api.get(`/user-preferences/${userId}`);
    return response.data;
  },

  // Create or update user preferences
  saveUserPreferences: async (preferences: Omit<UserPreferences, '_id'>) => {
    const response = await api.post('/user-preferences', preferences);
    return response.data;
  },

  // Update user preferences (partial)
  updateUserPreferences: async (userId: string, updates: Partial<UserPreferences>) => {
    const response = await api.patch(`/user-preferences/${userId}`, updates);
    return response.data;
  },

  // Update last login
  updateLastLogin: async (userId: string) => {
    const response = await api.post(`/user-preferences/${userId}/login`);
    return response.data;
  },

  // Delete user preferences
  deleteUserPreferences: async (userId: string) => {
    const response = await api.delete(`/user-preferences/${userId}`);
    return response.data;
  },
};

// Authentication API
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: string;
  preferences: {
    defaultView?: string;
    theme?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
    emailNotifications?: boolean;
    taskReminders?: boolean;
    weeklyDigest?: boolean;
    defaultPlanColor?: string;
    timezone?: string;
    language?: string;
  };
  stats: {
    totalPlans?: number;
    completedPlans?: number;
    totalTasks?: number;
    completedTasks?: number;
    lastLoginAt?: Date;
    accountCreatedAt?: Date;
  };
  isEmailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: AuthUser;
    token: string;
  };
  error?: string;
}

export const authAPI = {
  // Sign up
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', { name, email, password });
    return response.data;
  },

  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Get current user profile
  getCurrentUser: async (): Promise<{ success: boolean; data?: AuthUser; error?: string }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (updates: Partial<AuthUser>) => {
    const response = await api.patch('/auth/profile', updates);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
};

export default api;
