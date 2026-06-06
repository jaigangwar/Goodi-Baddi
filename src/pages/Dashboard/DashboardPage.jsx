import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../services/companyService';
import { getRecentlyViewed } from '../../services/employeeService';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Search, UserPlus, FileText, Settings, Users, Star, Clock, ChevronRight } from 'lucide-react';
import './DashboardPage.css';

// 3D Tilt Card Component
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`tilt-card-wrapper ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalEmployees: 0, totalFeedbacks: 0, recentSearches: 0 });
  const [recentProfiles, setRecentProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { scrollYProgress } = useScroll();
  const yBackground = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  useEffect(() => {
    loadDashboardData();
  }, []);

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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <motion.div 
          className="premium-spinner"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="premium-dashboard">
      {/* Animated Background Blobs */}
      <motion.div className="bg-blob blob-1" style={{ y: yBackground }} />
      <motion.div className="bg-blob blob-2" style={{ y: yBackground }} />

      <motion.div 
        className="dashboard-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div className="welcome-section" variants={itemVariants}>
          <div className="welcome-text">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              Welcome back, <span className="highlight-text">{user?.hrName || user?.companyName}</span>
            </motion.h1>
            <p>Manage your ecosystem, track employee records, and discover top talent.</p>
          </div>
        </motion.div>

        {/* Quick Search */}
        <motion.div className="quick-search-section" variants={itemVariants}>
          <div className="search-glass-panel">
            <form onSubmit={handleSearch} className="premium-search-form">
              <Search className="search-icon-left" size={20} />
              <input
                type="text"
                placeholder="Search candidates by name, email, mobile, or LinkedIn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="premium-search-input"
              />
              <motion.button 
                type="submit" 
                className="premium-btn-search"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Search
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div className="stats-grid" variants={containerVariants}>
          <TiltCard className="stat-card glass-card">
            <div className="stat-icon-wrapper bg-blue">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalEmployees}</h3>
              <p>Employees Added</p>
            </div>
            <div className="stat-glow"></div>
          </TiltCard>

          <TiltCard className="stat-card glass-card">
            <div className="stat-icon-wrapper bg-yellow">
              <Star size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalFeedbacks}</h3>
              <p>Feedbacks Submitted</p>
            </div>
            <div className="stat-glow"></div>
          </TiltCard>

          <TiltCard className="stat-card glass-card">
            <div className="stat-icon-wrapper bg-green">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{recentProfiles.length}</h3>
              <p>Recent Profile Views</p>
            </div>
            <div className="stat-glow"></div>
          </TiltCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div className="quick-actions-section" variants={itemVariants}>
          <div className="section-header">
            <h2>Quick Actions</h2>
            <div className="header-line"></div>
          </div>
          <div className="actions-grid">
            {[
              { to: "/add-employee", icon: UserPlus, title: "Add Employee", desc: "Create a new record", color: "blue" },
              { to: "/search", icon: Search, title: "Search Profiles", desc: "Find verified candidates", color: "purple" },
              { to: "/reports", icon: FileText, title: "My Reports", desc: "View your submitted flags", color: "orange" },
              { to: "/profile", icon: Settings, title: "Company Profile", desc: "Manage your details", color: "green" },
            ].map((action, idx) => (
              <motion.div key={idx} variants={itemVariants} whileHover={{ y: -5 }}>
                <Link to={action.to} className="action-card premium-hover">
                  <div className={`action-icon color-${action.color}`}>
                    <action.icon size={28} />
                  </div>
                  <div className="action-text">
                    <h3>{action.title}</h3>
                    <p>{action.desc}</p>
                  </div>
                  <ChevronRight className="action-arrow" size={20} />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recently Viewed Profiles */}
        <motion.div className="recent-profiles-section" variants={itemVariants}>
          <div className="section-header">
            <h2>Recently Viewed Profiles</h2>
            <div className="header-line"></div>
          </div>
          
          {recentProfiles.length > 0 ? (
            <motion.div className="profiles-grid" variants={containerVariants}>
              {recentProfiles.map((profile, idx) => (
                <TiltCard key={profile.id + idx} className="profile-card glass-card">
                  <Link to={`/employee/${profile.id}`} className="profile-card-content">
                    <div className="profile-header">
                      <div className="profile-avatar-premium">
                        {profile.employeeName.charAt(0).toUpperCase()}
                        <div className="avatar-ring"></div>
                      </div>
                      <div className="profile-info">
                        <h3>{profile.employeeName}</h3>
                        <p className="gradient-text">{profile.designation}</p>
                      </div>
                    </div>
                    <div className="profile-meta">
                      <span className="company-badge">{profile.companyName}</span>
                      <div className="rating-pill">
                        <Star size={14} className="star-icon" /> 
                        {profile.rating ? profile.rating.toFixed(1) : 'New'}
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="empty-state glass-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="empty-icon-wrapper">
                <Search size={40} />
              </div>
              <h3>No Recent Views</h3>
              <p>You haven't checked any employee profiles recently.</p>
              <Link to="/search" className="premium-btn-primary">
                Start Sourcing Top Talent
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
