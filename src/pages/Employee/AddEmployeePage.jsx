// Add Employee Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../../services/employeeService';
import { isValidEmail, isValidMobile, isValidDateRange } from '../../utils/validation';
import { EMPLOYMENT_TYPES } from '../../config/constants';
import './AddEmployeePage.css';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employeeName: '',
    mobile: '',
    email: '',
    linkedinUrl: '',
    designation: '',
    joiningDate: '',
    leavingDate: '',
    reasonForLeaving: '',
    employmentType: 'Full-time'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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

    if (!formData.employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!isValidMobile(formData.mobile)) {
      newErrors.mobile = 'Invalid mobile number (10 digits required)';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }

    if (!formData.leavingDate) {
      newErrors.leavingDate = 'Leaving date is required';
    }

    if (formData.joiningDate && formData.leavingDate) {
      if (!isValidDateRange(formData.joiningDate, formData.leavingDate)) {
        newErrors.leavingDate = 'Leaving date must be after joining date';
      }
    }

    if (!formData.reasonForLeaving.trim()) {
      newErrors.reasonForLeaving = 'Reason for leaving is required';
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
      const response = await addEmployee(formData);
      
      if (response.success) {
        setMessage('Employee record created successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message || 'Failed to add employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-employee-page">
      <div className="add-employee-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
          <h1>Add Employee Record</h1>
          <p>Add details of an employee who has left your company</p>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="employee-form">
          {/* Personal Information */}
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="employeeName">Employee Name *</label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className={errors.employeeName ? 'error' : ''}
                  placeholder="John Doe"
                />
                {errors.employeeName && <span className="error-text">{errors.employeeName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={errors.mobile ? 'error' : ''}
                  placeholder="9876543210"
                  maxLength="10"
                />
                {errors.mobile && <span className="error-text">{errors.mobile}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="linkedinUrl">LinkedIn URL (Optional)</label>
                <input
                  type="url"
                  id="linkedinUrl"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="form-section">
            <h2>Employment Details</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="designation">Designation *</label>
                <input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className={errors.designation ? 'error' : ''}
                  placeholder="Senior Developer"
                />
                {errors.designation && <span className="error-text">{errors.designation}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="employmentType">Employment Type *</label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                >
                  {EMPLOYMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="joiningDate">Joining Date *</label>
                <input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className={errors.joiningDate ? 'error' : ''}
                />
                {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="leavingDate">Leaving Date *</label>
                <input
                  type="date"
                  id="leavingDate"
                  name="leavingDate"
                  value={formData.leavingDate}
                  onChange={handleChange}
                  className={errors.leavingDate ? 'error' : ''}
                />
                {errors.leavingDate && <span className="error-text">{errors.leavingDate}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reasonForLeaving">Reason for Leaving *</label>
              <textarea
                id="reasonForLeaving"
                name="reasonForLeaving"
                value={formData.reasonForLeaving}
                onChange={handleChange}
                className={errors.reasonForLeaving ? 'error' : ''}
                rows="4"
                placeholder="e.g., Better opportunity, Relocation, Career growth..."
              ></textarea>
              {errors.reasonForLeaving && <span className="error-text">{errors.reasonForLeaving}</span>}
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding Employee...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeePage;
