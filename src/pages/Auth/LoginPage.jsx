// Login Page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginService, loginWithGoogle } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await loginService(formData);
      
      if (response.success) {
        login(response.company, response.token);
        navigate('/dashboard');
      } else {
        setMessage(response.message || 'Login failed');
      }
    } catch (error) {
      setMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setMessage('Google Login failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>

          {message && (
            <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="your@company.com"
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-footer">
              <Link to="/forgot-password" className="link">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <button type="button" className="btn-google" onClick={handleGoogleLogin}>
               Login with Google
            </button>
          </form>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup" className="link">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
