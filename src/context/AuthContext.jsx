// Authentication Context

import { createContext, useContext, useState, useEffect } from 'react';
import { getUser, getToken, isAuthenticated as checkAuth, logout as authLogout } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const token = getToken();
    const userData = getUser();
    
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
