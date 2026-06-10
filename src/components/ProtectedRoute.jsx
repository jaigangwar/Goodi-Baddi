// Protected Route Component

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireVerified = true, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerified && user?.status !== 'Verified' && user?.role !== 'Admin') {
    const isRejected = user?.status === 'Rejected';
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>{isRejected ? 'Account Verification Rejected' : 'Account Pending Verification'}</h2>
        <p>
          {isRejected 
            ? 'Your company account verification has been rejected by the admin. Please contact support if you believe this is a mistake.' 
            : 'Your company account is awaiting admin approval. You\'ll receive an email once verified.'}
        </p>
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>
          Status: <strong style={{ color: isRejected ? '#ef4444' : '#d97706' }}>{user?.status || 'Pending'}</strong>
        </p>
      </div>
    );
  }

  if (requireAdmin && user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
