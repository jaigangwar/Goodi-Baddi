import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../services/companyService';
import { isValidEmail, isValidMobile } from '../../utils/validation';
import './CompanyProfilePage.css';

const CompanyProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    hrName: '',
    email: '',
    mobile: '',
    linkedinProfile: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response.success) {
        const c = response.company;
        setFormData({
          companyName: c.companyName || '',
          hrName: c.hrName || '',
          email: c.email || '',
          mobile: c.mobile || '',
          linkedinProfile: c.linkedinProfile || ''
        });
      }
    } catch (error) {
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.hrName.trim()) newErrors.hrName = 'HR name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!isValidMobile(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number (10 digits)';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validate()) return;

    setSaving(true);
    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setMessage('Profile updated successfully');
        if (response.company) {
          updateUser(response.company);
        }
      }
    } catch (error) {
      setMessage(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
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
    <div className="profile-page">
      <div className="profile-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
          <h1>Company Profile</h1>
          <p>Manage your company information</p>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Company Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company Name *</label>
                <input
                  type="text" id="companyName" name="companyName"
                  value={formData.companyName} onChange={handleChange}
                  className={errors.companyName ? 'error' : ''}
                />
                {errors.companyName && <span className="error-text">{errors.companyName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="hrName">HR Name *</label>
                <input
                  type="text" id="hrName" name="hrName"
                  value={formData.hrName} onChange={handleChange}
                  className={errors.hrName ? 'error' : ''}
                />
                {errors.hrName && <span className="error-text">{errors.hrName}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Contact Details</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Official Email *</label>
                <input
                  type="email" id="email" name="email"
                  value={formData.email} onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel" id="mobile" name="mobile"
                  value={formData.mobile} onChange={handleChange}
                  className={errors.mobile ? 'error' : ''}
                  maxLength="10"
                />
                {errors.mobile && <span className="error-text">{errors.mobile}</span>}
              </div>
            </div>
            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label htmlFor="linkedinProfile">LinkedIn Profile (Optional)</label>
              <input
                type="url" id="linkedinProfile" name="linkedinProfile"
                value={formData.linkedinProfile} onChange={handleChange}
                placeholder="https://linkedin.com/in/company"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Account Status</h2>
            <div className="status-info">
              <div className="status-item">
                <span className="status-label">Status:</span>
                <span className={`status-badge badge-${(user?.status || 'Pending').toLowerCase()}`}>
                  {user?.status || 'Pending'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Role:</span>
                <span>{user?.role || 'Company_Admin'}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
