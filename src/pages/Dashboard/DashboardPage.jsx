import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/companyService';
import { getRecentlyViewed } from '../../services/employeeService';
import { motion } from 'framer-motion';
import { Search, UserPlus, ShieldAlert, Settings, Users, Star, Activity, ArrowRight } from 'lucide-react';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalEmployees: 0, totalFeedbacks: 0, recentSearches: 0 });
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await getDashboardStats();
      if (statsData.success) setStats(statsData.stats);
      
      const recentData = await getRecentlyViewed();
      if (recentData.success) setRecentProfiles(recentData.profiles);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loader-pulse"></div>
      </div>
    );
  }

  return (
    <div className="bento-dashboard">
      <motion.div 
        className="bento-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Card - Spans 2 Columns */}
        <motion.div className="bento-card welcome-card" variants={itemVariants}>
          <div className="welcome-content">
            <span className="badge">Overview</span>
            <h1 className="welcome-title">
              Hello, {user?.hrName || user?.companyName}
            </h1>
            <p className="welcome-desc">
              Your central hub for verifying candidates and managing employee records. Make informed hiring decisions with trusted feedback.
            </p>
          </div>
          <div className="welcome-decoration">
            <div className="deco-circle circle-1"></div>
            <div className="deco-circle circle-2"></div>
          </div>
        </motion.div>

        {/* Search Card - Spans 1 Column */}
        <motion.div className="bento-card search-card" variants={itemVariants}>
          <h2 className="card-title">Candidate Search</h2>
          <form onSubmit={handleSearch} className="bento-search-form">
            <div className="input-wrapper">
              <Search className="input-icon" size={20} />
              <input
                type="text"
                placeholder="Name, email, mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bento-btn">
              <ArrowRight size={20} />
            </button>
          </form>
        </motion.div>

        {/* Stat 1 */}
        <motion.div className="bento-card stat-card" variants={itemVariants}>
          <div className="stat-header">
            <div className="icon-box blue-box">
              <Users size={22} />
            </div>
          </div>
          <div className="stat-body">
            <h3>{stats.totalEmployees}</h3>
            <p>Employees Added</p>
          </div>
        </motion.div>

        {/* Stat 2 */}
        <motion.div className="bento-card stat-card" variants={itemVariants}>
          <div className="stat-header">
            <div className="icon-box orange-box">
              <Star size={22} />
            </div>
          </div>
          <div className="stat-body">
            <h3>{stats.totalFeedbacks}</h3>
            <p>Feedbacks Given</p>
          </div>
        </motion.div>

        {/* Stat 3 */}
        <motion.div className="bento-card stat-card stat-card-last" variants={itemVariants}>
          <div className="stat-header">
            <div className="icon-box green-box">
              <Activity size={22} />
            </div>
          </div>
          <div className="stat-body">
            <h3>{recentProfiles.length}</h3>
            <p>Recent Views</p>
          </div>
        </motion.div>

        {/* Actions Grid - Nested Bento */}
        <motion.div className="bento-card actions-card" variants={itemVariants}>
          <div className="actions-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="action-buttons-grid">
            <Link to="/add-employee" className="action-btn add-btn">
              <UserPlus size={24} />
              <span>Add Employee</span>
            </Link>
            <Link to="/search" className="action-btn search-btn">
              <Search size={24} />
              <span>Find Profile</span>
            </Link>
            <Link to="/reports" className="action-btn report-btn">
              <ShieldAlert size={24} />
              <span>My Reports</span>
            </Link>
            <Link to="/profile" className="action-btn profile-btn">
              <Settings size={24} />
              <span>Settings</span>
            </Link>
          </div>
        </motion.div>

        {/* Recent Profiles List */}
        <motion.div className="bento-card recent-card" variants={itemVariants}>
          <div className="recent-header">
            <h2 className="card-title">Recently Viewed</h2>
            <Link to="/search" className="view-all">View All</Link>
          </div>
          
          {recentProfiles.length > 0 ? (
            <div className="recent-list">
              {recentProfiles.map((profile, idx) => (
                <Link to={`/employee/${profile.id}`} key={profile.id + idx} className="recent-item">
                  <div className="recent-avatar">
                    {profile.employeeName.charAt(0).toUpperCase()}
                  </div>
                  <div className="recent-info">
                    <h4>{profile.employeeName}</h4>
                    <p>{profile.designation}</p>
                  </div>
                  <div className="recent-rating">
                    <Star size={14} className="star-icon" />
                    <span>{profile.rating ? profile.rating.toFixed(1) : 'N/A'}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="recent-empty">
              <div className="empty-icon-box">
                <Search size={32} />
              </div>
              <p>No recent activity</p>
              <span>Search for candidates to see history here.</span>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
