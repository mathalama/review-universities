import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UpdateUserRequest } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateUserRequest) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
            const response = await api.get<User>('/auth/me');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user", error);
            // If fetching user fails (e.g., token expired), logout
            localStorage.removeItem('token');
            setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    try {
        const response = await api.get<User>('/auth/me');
        setUser(response.data);
    } catch (error) {
         console.error("Failed to fetch user after login", error);
         // Handle error if needed, maybe throw
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (data: UpdateUserRequest) => {
    if (!user) return;

    // Optimistic update
    const previousUser = user;
    setUser({ ...user, ...data });

    try {
      await api.patch('/users/profile', data);
    } catch (error) {
      console.error("Failed to update profile", error);
      // Revert on error
      setUser(previousUser);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};