// Authentication Context

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabaseClient';
import { getUser, getToken, isAuthenticated as checkAuth, logout as authLogout, setToken, setUser as setLocalUser } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Check from Local Storage (for fast load)
    const token = getToken();
    const userData = getUser();
    
    if (token && userData) {
      setUser(userData);
      setIsAuthenticated(true);
    }
    
    // 2. Listen to Supabase Auth Changes (Crucial for Google OAuth)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Fetch custom profile data if needed, or use session meta
        const { data: profile } = await supabase
          .from('companies')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const customUser = {
          id: session.user.id,
          email: session.user.email,
          companyName: profile?.company_name || session.user.user_metadata?.full_name || 'My Company',
          hrName: profile?.hr_name || session.user.user_metadata?.name || 'HR Admin',
          role: profile?.role || 'Company',
          status: profile?.status || 'Verified'
        };

        setToken(session.access_token);
        setLocalUser(customUser);
        
        setUser(customUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        authLogout();
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    authLogout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    setUser(userData);
    setLocalUser(userData);
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
