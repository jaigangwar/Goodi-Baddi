import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';
import { isValidEmail } from '../../utils/validation';
import './AuthPages.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Invalid email format';
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
      const response = await forgotPassword(email);
      if (response.success) {
        setSent(true);
        setMessage('Password reset link has been sent to your email');
      } else {
        setMessage(response.message || 'Failed to send reset link');
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {!sent ? (
            <>
              <h2>Forgot Password</h2>
              <p className="auth-subtitle">Enter your email to receive a reset link</p>

              {message && (
                <div className={`message ${message.includes('sent') ? 'success' : 'error'}`}>
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
                    value={email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="your@company.com"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📧</div>
              <h2>Check Your Email</h2>
              <p className="auth-subtitle">{message}</p>
            </div>
          )}

          <div className="auth-footer">
            <p><Link to="/login" className="link">Back to Sign In</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
