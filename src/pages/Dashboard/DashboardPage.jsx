// Dashboard Page

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/companyService';
import { getRecentlyViewed } from '../../services/employeeService';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalFeedbacks: 0,
    recentSearches: 0
  });
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard stats
      const statsData = await getDashboardStats();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Load recently viewed profiles
      const recentData = await getRecentlyViewed();
      if (recentData.success) {
        setRecentProfiles(recentData.profiles);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome back, {user?.hrName || user?.companyName}!</h1>
          <p>Manage your employee records and search candidate profiles</p>
        </div>

        {/* Quick Search */}
        <div className="quick-search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search employees by name, email, mobile, or LinkedIn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn-search">
              🔍 Search
            </button>
          </form>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalEmployees}</h3>
              <p>Employees Added</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{stats.totalFeedbacks}</h3>
              <p>Feedbacks Submitted</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔍</div>
            <div className="stat-content">
              <h3>{stats.recentSearches}</h3>
              <p>Recent Searches</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/add-employee" className="action-card">
              <div className="action-icon">➕</div>
              <h3>Add Employee</h3>
              <p>Add a new employee record</p>
            </Link>

            <Link to="/search" className="action-card">
              <div className="action-icon">🔍</div>
              <h3>Search Employees</h3>
              <p>Find candidate profiles</p>
            </Link>

            <Link to="/reports" className="action-card">
              <div className="action-icon">📋</div>
              <h3>My Reports</h3>
              <p>View submitted reports</p>
            </Link>

            <Link to="/profile" className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>Company Profile</h3>
              <p>Manage your profile</p>
            </Link>
          </div>
        </div>

        {/* Recently Viewed Profiles */}
        <div className="recent-profiles-section">
          <h2>Recently Viewed Profiles</h2>
          {recentProfiles.length > 0 ? (
            <div className="profiles-grid">
              {recentProfiles.map((profile) => (
                <Link
                  key={profile.id}
                  to={`/employee/${profile.id}`}
                  className="profile-card"
                >
                  <div className="profile-header">
                    <div className="profile-avatar">
                      {profile.employeeName.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-info">
                      <h3>{profile.employeeName}</h3>
                      <p>{profile.designation}</p>
                    </div>
                  </div>
                  <div className="profile-meta">
                    <span className="company-name">{profile.companyName}</span>
                    <span className="rating">
                      ⭐ {profile.rating ? profile.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No recently viewed profiles</p>
              <Link to="/search" className="btn-primary">
                Start Searching
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
