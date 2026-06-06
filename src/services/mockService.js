// Mock Service - Simulates Backend API (Remove when real backend is ready)

import { 
  mockUsers, 
  mockEmployees, 
  mockFeedbacks, 
  mockDashboardStats, 
  mockRecentlyViewed,
  mockReports,
  recentlyViewedStore
} from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Auth Service
export const mockAuthService = {
  async login(credentials) {
    await delay();
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'password123') {
      return {
        success: true,
        token: 'mock-jwt-token-' + user.id,
        company: user
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async signup(data) {
    await delay();
    return {
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      companyId: 'new-company-id'
    };
  },

  async logout() {
    await delay();
    return { success: true };
  },

  async forgotPassword(email) {
    await delay();
    return {
      success: true,
      message: 'Password reset link sent to your email'
    };
  }
};

// Mock Employee Service
export const mockEmployeeService = {
  async searchEmployees(params) {
    await delay();
    let results = [...mockEmployees];
    
    if (params.name) {
      results = results.filter(e => 
        e.employeeName.toLowerCase().includes(params.name.toLowerCase())
      );
    }
    if (params.email) {
      results = results.filter(e => 
        e.email.toLowerCase().includes(params.email.toLowerCase())
      );
    }
    if (params.mobile) {
      results = results.filter(e => e.mobile.includes(params.mobile));
    }
    if (params.linkedin) {
      results = results.filter(e =>
        (e.linkedinUrl || '').toLowerCase().includes(params.linkedin.toLowerCase())
      );
    }
    
    return {
      success: true,
      results,
      count: results.length
    };
  },

  async getEmployeeById(id) {
    await delay();
    const employee = mockEmployees.find(e => e.id === id);
    
    if (!employee) {
      throw new Error('Employee not found');
    }
    
    // Track recently viewed
    const exists = recentlyViewedStore.findIndex(p => p.id === id);
    if (exists !== -1) recentlyViewedStore.splice(exists, 1);
    recentlyViewedStore.unshift(employee);
    if (recentlyViewedStore.length > 10) recentlyViewedStore.length = 10;
    
    const feedbacks = mockFeedbacks.filter(f => f.employeeId === id);
    const overallRating = feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
      : 0;
    
    return {
      success: true,
      employee: {
        ...employee,
        employmentHistory: [
          {
            company: employee.companyName,
            designation: employee.designation,
            joiningDate: employee.joiningDate,
            leavingDate: employee.leavingDate,
            reasonForLeaving: employee.reasonForLeaving
          }
        ],
        feedbacks,
        overallRating: overallRating.toFixed(1),
        feedbackCount: feedbacks.length
      }
    };
  },

  async addEmployee(data) {
    await delay();
    const newEmployee = {
      id: Date.now().toString(),
      ...data,
      companyName: 'Your Company',
      rating: 0
    };
    mockEmployees.push(newEmployee);
    
    return {
      success: true,
      employeeId: newEmployee.id,
      message: 'Employee record created successfully'
    };
  },

  async getRecentlyViewed() {
    await delay();
    const profiles = recentlyViewedStore.length > 0 ? recentlyViewedStore : mockRecentlyViewed;
    return {
      success: true,
      profiles
    };
  },

  async updateEmployee(id, data) {
    await delay();
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    mockEmployees[index] = { ...mockEmployees[index], ...data };
    return { success: true, message: 'Employee updated successfully' };
  },

  async deleteEmployee(id) {
    await delay();
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Employee not found');
    mockEmployees.splice(index, 1);
    return { success: true, message: 'Employee deleted successfully' };
  }
};

// Mock Feedback Service
export const mockFeedbackService = {
  async addFeedback(data) {
    await delay();
    const newFeedback = {
      id: Date.now().toString(),
      ...data,
      companyName: 'Your Company',
      createdAt: new Date().toISOString()
    };
    mockFeedbacks.push(newFeedback);
    
    return {
      success: true,
      feedbackId: newFeedback.id,
      message: 'Feedback submitted successfully'
    };
  },

  async updateFeedback(id, data) {
    await delay();
    const index = mockFeedbacks.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Feedback not found');
    mockFeedbacks[index] = { ...mockFeedbacks[index], ...data };
    return { success: true, message: 'Feedback updated successfully' };
  },

  async deleteFeedback(id) {
    await delay();
    const index = mockFeedbacks.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Feedback not found');
    mockFeedbacks.splice(index, 1);
    return { success: true, message: 'Feedback deleted successfully' };
  },

  async getFeedbackByEmployee(employeeId) {
    await delay();
    const feedbacks = mockFeedbacks.filter(f => f.employeeId === employeeId);
    return { success: true, feedbacks };
  }
};

// Mock Company Service
export const mockCompanyService = {
  async getDashboardStats() {
    await delay();
    return {
      success: true,
      stats: mockDashboardStats
    };
  },

  async getProfile() {
    await delay();
    return {
      success: true,
      company: mockUsers[0]
    };
  },

  async updateProfile(data) {
    await delay();
    Object.assign(mockUsers[0], data);
    return {
      success: true,
      company: { ...mockUsers[0] },
      message: 'Profile updated successfully'
    };
  }
};

// Mock Report Service
export const mockReportService = {
  async submitReport(data) {
    await delay();
    return {
      success: true,
      reportId: Date.now().toString(),
      message: 'Report submitted successfully. Admin will review it soon.'
    };
  },

  async getMyReports() {
    await delay();
    return {
      success: true,
      reports: []
    };
  },

  async getReports() {
    await delay();
    return {
      success: true,
      reports: [...mockReports]
    };
  },

  async resolveReport(id, action, resolution) {
    await delay();
    const report = mockReports.find(r => r.id === id);
    if (report) {
      report.status = action === 'approve' ? 'Resolved' : 'Dismissed';
      if (resolution) report.resolution = resolution;
    }
    return { success: true, message: `Report ${action === 'approve' ? 'resolved' : 'dismissed'} successfully` };
  }
};

// Mock Admin Service
export const mockAdminService = {
  async getCompanies(status) {
    await delay();
    let companies = [...mockUsers];
    if (status) {
      companies = companies.filter(c => c.status === status);
    }
    return {
      success: true,
      companies
    };
  },

  async verifyCompany(id, action) {
    await delay();
    const company = mockUsers.find(c => c.id === id);
    if (company) {
      company.status = action === 'approve' ? 'Verified' : 'Rejected';
    }
    return {
      success: true,
      message: `Company ${action === 'approve' ? 'approved' : 'rejected'} successfully`
    };
  },

  async deleteCompany(id) {
    await delay();
    const index = mockUsers.findIndex(c => c.id === id);
    if (index !== -1) mockUsers.splice(index, 1);
    return { success: true, message: 'Company deleted successfully' };
  },

  async getReports() {
    await delay();
    return { success: true, reports: [...mockReports] };
  },

  async resolveReport(id, action, resolution) {
    await delay();
    const report = mockReports.find(r => r.id === id);
    if (report) {
      report.status = action === 'approve' ? 'Resolved' : 'Dismissed';
      if (resolution) report.resolution = resolution;
    }
    return { success: true, message: `Report ${action === 'approve' ? 'resolved' : 'dismissed'} successfully` };
  },

  async getModerationLogs() {
    await delay();
    return { success: true, logs: [] };
  }
};
