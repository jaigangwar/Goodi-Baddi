// Main App Component

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import SearchPage from './pages/Search/SearchPage';
import EmployeeProfilePage from './pages/Profile/EmployeeProfilePage';
import AddEmployeePage from './pages/Employee/AddEmployeePage';
import EditEmployeePage from './pages/Employee/EditEmployeePage';
import AddFeedbackPage from './pages/Feedback/AddFeedbackPage';
import ReportsPage from './pages/Reports/ReportsPage';
import CompanyProfilePage from './pages/Profile/CompanyProfilePage';
import AdminPanelPage from './pages/Admin/AdminPanelPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employee/:id"
                element={
                  <ProtectedRoute>
                    <EmployeeProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-employee"
                element={
                  <ProtectedRoute>
                    <AddEmployeePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-employee/:id"
                element={
                  <ProtectedRoute>
                    <EditEmployeePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-feedback/:id"
                element={
                  <ProtectedRoute>
                    <AddFeedbackPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <CompanyProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminPanelPage />
                  </ProtectedRoute>
                }
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
