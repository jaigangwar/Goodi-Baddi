// Employee Profile Page

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEmployeeById, deleteEmployee } from '../../services/employeeService';
import { submitReport } from '../../services/reportService';
import './EmployeeProfilePage.css';

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportData, setReportData] = useState({
    category: 'Wrong Employee Record',
    description: ''
  });
  const [reportMessage, setReportMessage] = useState('');

  useEffect(() => {
    loadEmployeeProfile();
  }, [id]);

  const loadEmployeeProfile = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeById(id);
      
      if (response.success) {
        setEmployee(response.employee);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await deleteEmployee(id);
      if (response.success) {
        navigate('/search', { state: { message: 'Employee record deleted successfully' } });
      }
    } catch (error) {
      alert(error.message || 'Failed to delete employee');
    }
    setShowDeleteConfirm(false);
  };

  const handleReport = async (e) => {
    e.preventDefault();
    
    try {
      const response = await submitReport({
        contentType: 'EmployeeRecord',
        contentId: id,
        ...reportData
      });
      
      if (response.success) {
        setReportMessage('Report submitted successfully');
        setTimeout(() => {
          setShowReportModal(false);
          setReportMessage('');
          setReportData({ category: 'Wrong Employee Record', description: '' });
        }, 2000);
      }
    } catch (error) {
      setReportMessage(error.message || 'Failed to submit report');
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
        <Link to="/search" className="btn-primary">Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header-section">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
          <div className="header-actions">
            <Link to={`/edit-employee/${id}`} className="btn-edit">✏️ Edit</Link>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn-delete">🗑️ Delete</button>
            <button onClick={() => setShowReportModal(true)} className="btn-report">🚩 Report</button>
          </div>
        </div>

        {/* Personal Details */}
        <div className="profile-card">
          <div className="profile-main">
            <div className="profile-avatar-large">
              {employee.employeeName.charAt(0).toUpperCase()}
            </div>
            <div className="profile-main-info">
              <h1>{employee.employeeName}</h1>
              <p className="current-designation">{employee.designation}</p>
              <div className="profile-rating">
                <span className="rating-stars">
                  {'⭐'.repeat(Math.round(employee.overallRating))}
                </span>
                <span className="rating-value">{employee.overallRating} / 5.0</span>
                <span className="rating-count">({employee.feedbackCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="profile-contact">
            <div className="contact-item">
              <span className="contact-label">📧 Email:</span>
              <span className="contact-value">{employee.email}</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">📱 Mobile:</span>
              <span className="contact-value">{employee.mobile}</span>
            </div>
            {employee.linkedinUrl && (
              <div className="contact-item">
                <span className="contact-label">🔗 LinkedIn:</span>
                <a href={employee.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-link">
                  View Profile
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Employment History */}
        <div className="section-card">
          <h2>Employment History</h2>
          <div className="employment-timeline">
            {employee.employmentHistory.map((job, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h3>{job.designation}</h3>
                  <p className="company">{job.company}</p>
                  <p className="duration">
                    {new Date(job.joiningDate).toLocaleDateString()} - {new Date(job.leavingDate).toLocaleDateString()}
                  </p>
                  <p className="reason">
                    <strong>Reason for leaving:</strong> {job.reasonForLeaving}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback History */}
        <div className="section-card">
          <h2>Feedback from Previous Employers</h2>
          {employee.feedbacks && employee.feedbacks.length > 0 ? (
            <div className="feedback-list">
              {employee.feedbacks.map((feedback) => (
                <div key={feedback.id} className="feedback-card">
                  <div className="feedback-header">
                    <div>
                      <h3>{feedback.companyName}</h3>
                      <p className="feedback-date">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="feedback-rating">
                      {'⭐'.repeat(feedback.rating)}
                    </div>
                  </div>

                  {feedback.positiveCategories && feedback.positiveCategories.length > 0 && (
                    <div className="feedback-categories">
                      <h4>Positive Points:</h4>
                      <div className="category-badges">
                        {feedback.positiveCategories.map((cat, idx) => (
                          <span key={idx} className="badge badge-positive">
                            ✓ {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedback.negativeCategories && feedback.negativeCategories.length > 0 && (
                    <div className="feedback-categories">
                      <h4>Areas for Improvement:</h4>
                      <div className="category-badges">
                        {feedback.negativeCategories.map((cat, idx) => (
                          <span key={idx} className="badge badge-negative">
                            ✗ {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedback.hrComments && (
                    <div className="feedback-comments">
                      <h4>HR Comments:</h4>
                      <p>{feedback.hrComments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-feedback">
              <p>No feedback available yet</p>
            </div>
          )}
        </div>

        {/* Add Feedback Button */}
        <div className="action-section">
          <Link to={`/add-feedback/${id}`} className="btn-primary btn-large">
            ➕ Add Feedback for this Employee
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Employee Record</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-close">✕</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the record for <strong>{employee?.employeeName}</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-danger">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report Employee Record</h2>
              <button onClick={() => setShowReportModal(false)} className="btn-close">
                ✕
              </button>
            </div>

            {reportMessage && (
              <div className={`message ${reportMessage.includes('success') ? 'success' : 'error'}`}>
                {reportMessage}
              </div>
            )}

            <form onSubmit={handleReport} className="report-form">
              <div className="form-group">
                <label htmlFor="category">Report Category</label>
                <select
                  id="category"
                  value={reportData.category}
                  onChange={(e) => setReportData(prev => ({ ...prev, category: e.target.value }))}
                  required
                >
                  <option value="Wrong Employee Record">Wrong Employee Record</option>
                  <option value="Fake Feedback">Fake Feedback</option>
                  <option value="Abuse/Spam">Abuse/Spam</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description (Optional)</label>
                <textarea
                  id="description"
                  value={reportData.description}
                  onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                  rows="4"
                  placeholder="Provide additional details about this report..."
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowReportModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-danger">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
