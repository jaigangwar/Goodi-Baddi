// Authentication Utilities

import { TOKEN_KEY, USER_KEY } from '../config/constants';

/**
 * Store authentication token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get authentication token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove authentication token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Store user data
 */
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data
 */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Remove user data
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * Check if user is verified
 */
export const isVerified = () => {
  const user = getUser();
  return user && user.status === 'Verified';
};

/**
 * Check if user is Super Admin
 */
export const isAdmin = () => {
  const user = getUser();
  return user && user.role === 'Admin';
};

/**
 * Logout user
 */
export const logout = () => {
  removeToken();
  removeUser();
};

/**
 * Get authorization header
 */
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
