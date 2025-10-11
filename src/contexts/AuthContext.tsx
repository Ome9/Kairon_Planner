import React, { createContext, useState, useEffect } from 'react';
import { authAPI, AuthUser } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<AuthUser>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// AuthContext needs to be exported for useAuth hook
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          const response = await authAPI.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data);
            localStorage.setItem('auth_user', JSON.stringify(response.data));
          } else {
            // Token invalid, clear auth
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to verify token:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          setToken(null);
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        const { user: userData, token: userToken } = response.data;
        
        setUser(userData);
        setToken(userToken);
        
        localStorage.setItem('auth_token', userToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        toast.success('Login successful!');
        navigate('/app');
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: unknown) {
      let errorMessage = 'Login failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.signup(name, email, password);
      
      if (response.success && response.data) {
        // Don't auto-login after signup, redirect to login page instead
        toast.success('Account created successfully! Please login with your credentials.');
        navigate('/login');
      } else {
        throw new Error(response.error || 'Signup failed');
      }
    } catch (error: unknown) {
      let errorMessage = 'Signup failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout().catch(console.error);
    
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    toast.success('Logged out successfully');
    navigate('/');
  };

  const updateUser = async (updates: Partial<AuthUser>) => {
    try {
      const response = await authAPI.updateProfile(updates);
      
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('auth_user', JSON.stringify(response.data));
        toast.success('Profile updated successfully');
      }
    } catch (error: unknown) {
      let errorMessage = 'Update failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('auth_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
