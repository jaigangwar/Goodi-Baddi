// Mock Data for Development (Until Backend is Ready)

// Mock Users
export const mockUsers = [
  {
    id: '1',
    companyName: 'Tech Solutions Inc',
    hrName: 'John Doe',
    email: 'hr@techsolutions.com',
    mobile: '1234567890',
    status: 'Verified',
    role: 'Company_Admin'
  },
  {
    id: '2',
    companyName: 'Admin Company',
    hrName: 'Admin User',
    email: 'admin@goodibaddi.com',
    mobile: '9999999999',
    status: 'Verified',
    role: 'Super_Admin'
  }
];

// Mock Employees
export const mockEmployees = [
  {
    id: '1',
    employeeName: 'Rahul Sharma',
    mobile: '9876543210',
    email: 'rahul@example.com',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma',
    designation: 'Senior Developer',
    joiningDate: '2020-01-15',
    leavingDate: '2023-06-30',
    reasonForLeaving: 'Better opportunity',
    employmentType: 'Full-time',
    companyName: 'Tech Solutions Inc',
    rating: 4.5
  },
  {
    id: '2',
    employeeName: 'Priya Patel',
    mobile: '9876543211',
    email: 'priya@example.com',
    linkedinUrl: 'https://linkedin.com/in/priyapatel',
    designation: 'UI/UX Designer',
    joiningDate: '2021-03-10',
    leavingDate: '2024-01-20',
    reasonForLeaving: 'Relocation',
    employmentType: 'Full-time',
    companyName: 'Design Studio',
    rating: 4.8
  },
  {
    id: '3',
    employeeName: 'Amit Kumar',
    mobile: '9876543212',
    email: 'amit@example.com',
    linkedinUrl: 'https://linkedin.com/in/amitkumar',
    designation: 'Project Manager',
    joiningDate: '2019-06-01',
    leavingDate: '2023-12-15',
    reasonForLeaving: 'Career growth',
    employmentType: 'Full-time',
    companyName: 'Consulting Firm',
    rating: 4.2
  }
];

// Mock Feedbacks
export const mockFeedbacks = [
  {
    id: '1',
    employeeId: '1',
    companyId: '1',
    companyName: 'Tech Solutions Inc',
    rating: 5,
    positiveCategories: ['Good Communication', 'Team Player', 'Hardworking'],
    negativeCategories: [],
    hrComments: 'Excellent employee, always delivered on time. Great team player.',
    createdAt: '2023-07-01'
  },
  {
    id: '2',
    employeeId: '1',
    companyId: '2',
    companyName: 'Previous Company',
    rating: 4,
    positiveCategories: ['Skilled', 'Punctual'],
    negativeCategories: [],
    hrComments: 'Good technical skills and punctual.',
    createdAt: '2020-01-10'
  },
  {
    id: '3',
    employeeId: '2',
    companyId: '1',
    companyName: 'Design Studio',
    rating: 5,
    positiveCategories: ['Good Communication', 'Skilled', 'Team Player'],
    negativeCategories: [],
    hrComments: 'Outstanding designer with great communication skills.',
    createdAt: '2024-01-25'
  }
];

// Mock Dashboard Stats
export const mockDashboardStats = {
  totalEmployees: 15,
  totalFeedbacks: 23,
  recentSearches: 47
};

// Mock Recently Viewed
export const mockRecentlyViewed = mockEmployees.slice(0, 3);

// Mock Reports
export const mockReports = [
  {
    id: '1',
    category: 'Fake Feedback',
    description: 'This employee never worked at this company',
    status: 'Pending',
    createdAt: '2026-05-20T10:00:00Z'
  },
  {
    id: '2',
    category: 'Wrong Employee Record',
    description: 'Wrong designation mentioned',
    status: 'Resolved',
    createdAt: '2026-05-18T08:30:00Z',
    resolution: 'Reviewed and corrected the record.'
  }
];

// Recently viewed store (in-memory)
export const recentlyViewedStore = [];
