// Validation Utilities

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate mobile number (10 digits)
 */
export const isValidMobile = (mobile) => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

/**
 * Validate LinkedIn URL
 */
export const isValidLinkedIn = (url) => {
  const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/.+$/;
  return linkedInRegex.test(url);
};

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Get password strength
 */
export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: 'None' };
  
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;
  
  if (strength <= 2) return { strength: 1, label: 'Weak' };
  if (strength <= 4) return { strength: 2, label: 'Medium' };
  return { strength: 3, label: 'Strong' };
};

/**
 * Validate required field
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== '';
};

/**
 * Validate rating (1-5)
 */
export const isValidRating = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

/**
 * Validate date range
 */
export const isValidDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start <= end;
};
