// Signup Page

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup, verifyOtp, loginWithGoogle } from '../../services/authService';
import { isValidEmail, isValidMobile, isValidPassword, getPasswordStrength } from '../../utils/validation';
import './AuthPages.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    hrName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    linkedinProfile: ''
  });
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: 'None' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.hrName) newErrors.hrName = 'HR name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!isValidMobile(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number (10 digits required)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (showOtp) {
      // OTP Verification Flow
      if (!otp) {
        setErrors({ otp: 'OTP is required' });
        return;
      }
      setLoading(true);
      try {
        const res = await verifyOtp(formData.email, otp);
        if (res.success) {
          setMessage('Email verified! You can now login.');
          setTimeout(() => navigate('/login'), 2000);
        }
      } catch (err) {
        setMessage(err.message || 'OTP Verification failed');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Initial Registration Flow
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await signup(formData);
      if (response.success) {
        setMessage(response.message);
        setShowOtp(true);
      }
    } catch (error) {
      setMessage(error.message || 'Registration failed. Please try again.');
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
          <h2>Create Account</h2>
          <p className="auth-subtitle">Register your company to get started</p>

          {message && (
            <div className={`message ${message.includes('success') || message.includes('OTP') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {!showOtp ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="companyName">Company Name *</label>
                    <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} className={errors.companyName ? 'error' : ''} placeholder="Your Company Ltd." />
                    {errors.companyName && <span className="error-text">{errors.companyName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="hrName">HR Name *</label>
                    <input type="text" id="hrName" name="hrName" value={formData.hrName} onChange={handleChange} className={errors.hrName ? 'error' : ''} placeholder="John Doe" />
                    {errors.hrName && <span className="error-text">{errors.hrName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Official Email *</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} placeholder="hr@company.com" />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="mobile">Mobile Number *</label>
                  <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} className={errors.mobile ? 'error' : ''} placeholder="1234567890" maxLength="10" />
                  {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="linkedinProfile">LinkedIn Profile (Optional)</label>
                  <input type="url" id="linkedinProfile" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password *</label>
                  <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={errors.password ? 'error' : ''} placeholder="Create a strong password" />
                  {formData.password && (
                    <div className={`password-strength strength-${passwordStrength.strength}`}>
                      <div className="strength-bar"></div>
                      <span>{passwordStrength.label}</span>
                    </div>
                  )}
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password *</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={errors.confirmPassword ? 'error' : ''} placeholder="Re-enter your password" />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              </>
            ) : (
              <div className="form-group">
                <label htmlFor="otp">Enter 6-digit OTP sent to {formData.email}</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  className={errors.otp ? 'error' : ''}
                  placeholder="123456"
                />
                {errors.otp && <span className="error-text">{errors.otp}</span>}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? (showOtp ? 'Verifying...' : 'Creating Account...') : (showOtp ? 'Verify OTP' : 'Create Account')}
            </button>
            
            {!showOtp && (
              <button type="button" className="btn-google" onClick={handleGoogleLogin}>
                 Signup with Google
              </button>
            )}
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="link">Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
