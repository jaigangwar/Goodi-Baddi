// Header Component

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Goodi Baddi</h1>
        </Link>

        <nav className="nav">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/search" className="nav-link">Search</Link>
              <Link to="/add-employee" className="nav-link">Add Employee</Link>
              {user?.role === 'Super_Admin' && (
                <Link to="/admin" className="nav-link">Admin Panel</Link>
              )}
              <div className="user-menu">
                <span className="user-name">{user?.companyName || user?.hrName}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
