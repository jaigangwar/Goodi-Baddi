// Add Feedback Page

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../../services/employeeService';
import { addFeedback } from '../../services/feedbackService';
import { POSITIVE_CATEGORIES, NEGATIVE_CATEGORIES } from '../../config/constants';
import './AddFeedbackPage.css';

const AddFeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    positiveCategories: [],
    negativeCategories: [],
    hrComments: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadEmployee();
  }, [id]);

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      
      if (response.success) {
        setEmployee(response.employee);
      }
    } catch (error) {
      setMessage('Failed to load employee details');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleCategoryToggle = (category, type) => {
    const field = type === 'positive' ? 'positiveCategories' : 'negativeCategories';
    
    setFormData(prev => {
      const categories = prev[field];
      const exists = categories.includes(category);
      
      return {
        ...prev,
        [field]: exists
          ? categories.filter(c => c !== category)
          : [...categories, category]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (formData.positiveCategories.length === 0 && formData.negativeCategories.length === 0) {
      setMessage('Please select at least one feedback category');
      return;
    }

    setSubmitting(true);

    try {
      const response = await addFeedback({
        employeeId: id,
        ...formData
      });
      
      if (response.success) {
        setMessage('Feedback submitted successfully!');
        setTimeout(() => {
          navigate(`/employee/${id}`);
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>Employee Not Found</h2>
        <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="add-feedback-page">
      <div className="add-feedback-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
          <h1>Add Feedback</h1>
          <p>Provide feedback for {employee.employeeName}</p>
        </div>

        {/* Employee Info Card */}
        <div className="employee-info-card">
          <div className="employee-avatar">
            {employee.employeeName.charAt(0).toUpperCase()}
          </div>
          <div className="employee-details">
            <h3>{employee.employeeName}</h3>
            <p>{employee.designation}</p>
            <p className="employee-email">{employee.email}</p>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Rating Section */}
          <div className="form-section">
            <h2>Overall Rating *</h2>
            <p className="section-description">Rate the employee's overall performance</p>
            
            <div className="rating-selector">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`star-button ${formData.rating >= star ? 'active' : ''}`}
                >
                  ⭐
                </button>
              ))}
              <span className="rating-label">{formData.rating} / 5</span>
            </div>
          </div>

          {/* Positive Categories */}
          <div className="form-section">
            <h2>Positive Points</h2>
            <p className="section-description">Select all that apply</p>
            
            <div className="categories-grid">
              {POSITIVE_CATEGORIES.map((category) => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.positiveCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category, 'positive')}
                  />
                  <span className="checkbox-label positive">✓ {category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Negative Categories */}
          <div className="form-section">
            <h2>Areas for Improvement</h2>
            <p className="section-description">Select all that apply (optional)</p>
            
            <div className="categories-grid">
              {NEGATIVE_CATEGORIES.map((category) => (
                <label key={category} className="category-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.negativeCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category, 'negative')}
                  />
                  <span className="checkbox-label negative">✗ {category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* HR Comments */}
          <div className="form-section">
            <h2>Additional Comments</h2>
            <p className="section-description">Provide detailed feedback (optional)</p>
            
            <textarea
              value={formData.hrComments}
              onChange={(e) => setFormData(prev => ({ ...prev, hrComments: e.target.value }))}
              rows="6"
              placeholder="Share your detailed observations about the employee's work, behavior, achievements, or any other relevant information..."
              className="comments-textarea"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeedbackPage;
