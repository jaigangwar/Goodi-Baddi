// Application Constants

export const APP_NAME = 'Goodi Baddi';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_TIMEOUT = 30000;

// Authentication
export const TOKEN_KEY = 'goodibaddi_token';
export const USER_KEY = 'goodibaddi_user';
export const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Company Status
export const COMPANY_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended'
};

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'Admin',
  COMPANY_ADMIN: 'Company',
  HR: 'HR'
};

// Employment Types
export const EMPLOYMENT_TYPES = [
  'Full-time',
  'Part-time',
  'Intern',
  'Contract'
];

// Feedback Categories
export const POSITIVE_CATEGORIES = [
  'Good Communication',
  'Punctual',
  'Team Player',
  'Hardworking',
  'Skilled'
];

export const NEGATIVE_CATEGORIES = [
  'Poor Performance',
  'Unprofessional Behavior',
  'Left Without Notice',
  'Attendance Issues',
  'Missed Deadlines'
];

// Report Categories
export const REPORT_CATEGORIES = [
  'Fake Feedback',
  'Wrong Employee Record',
  'Abuse/Spam'
];

// Pagination
export const ITEMS_PER_PAGE = 10;
export const RECENT_PROFILES_LIMIT = 10;

// Search Parameters
export const SEARCH_PARAMS = {
  NAME: 'name',
  MOBILE: 'mobile',
  EMAIL: 'email',
  LINKEDIN: 'linkedin'
};

// Rating Range
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// Performance SLAs
export const SEARCH_TIMEOUT = 2000; // 2 seconds
export const PAGE_LOAD_TIMEOUT = 3000; // 3 seconds
