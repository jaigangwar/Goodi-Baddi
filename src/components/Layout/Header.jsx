import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, LayoutDashboard, Search, UserPlus, Shield } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={`premium-header ${isLandingPage ? 'header-floating-dark' : 'header-light'}`}>
      <div className="header-container">
        <Link to="/" className="logo-container">
          <div className={`logo-box ${isLandingPage ? 'logo-dark' : 'logo-light'}`}>GB</div>
          <span className="logo-text">Goodi Baddi</span>
        </Link>

        <nav className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <LayoutDashboard size={18} /> <span>Dashboard</span>
              </Link>
              <Link to="/search" className="nav-link">
                <Search size={18} /> <span>Search</span>
              </Link>
              <Link to="/add-employee" className="nav-link">
                <UserPlus size={18} /> <span>Add</span>
              </Link>
              {user?.role === 'Super_Admin' && (
                <Link to="/admin" className="nav-link">
                  <Shield size={18} /> <span>Admin</span>
                </Link>
              )}
              
              <div className="user-profile-section">
                <div className="user-avatar">
                  {(user?.hrName || user?.companyName || 'U').charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="btn-logout-premium">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-nav-login">Sign In</Link>
              <Link to="/signup" className="btn-nav-signup">Get Started</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
