import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEmployeeById, deleteEmployee } from '../../services/employeeService';
import { submitReport } from '../../services/reportService';
import { motion } from 'framer-motion';
import { Briefcase, Building, Calendar, Mail, Phone, ExternalLink, Star, Edit2, Trash2, Flag, CheckCircle, XCircle } from 'lucide-react';
import './EmployeeProfilePage.css';

const EmployeeProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reportData, setReportData] = useState({ category: 'Wrong Employee Record', description: '' });
  const [reportMessage, setReportMessage] = useState('');

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

  useEffect(() => {
    loadEmployeeProfile();
  }, [id]);

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
        targetType: 'Employee',
        targetId: id,
        reason: reportData.category,
        description: reportData.description
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
      <div className="dashboard-loading">
        <div className="loader-pulse"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bento-container-narrow" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h2>Employee Not Found</h2>
        <Link to="/search" className="btn-bento-primary">Back to Search</Link>
      </div>
    );
  }

  return (
    <div className="bento-profile-page">
      <div className="profile-container-bento">
        {/* Header Actions */}
        <div className="profile-actions-bar">
          <button onClick={() => navigate(-1)} className="btn-bento-secondary">← Back</button>
          <div className="action-group">
            <Link to={`/edit-employee/${id}`} className="btn-bento-outline"><Edit2 size={16}/> Edit</Link>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn-bento-danger"><Trash2 size={16}/> Delete</button>
            <button onClick={() => setShowReportModal(true)} className="btn-bento-warning"><Flag size={16}/> Report</button>
          </div>
        </div>

        {/* Hero Card */}
        <motion.div className="bento-card profile-hero" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
          <div className="profile-hero-bg"></div>
          <div className="profile-hero-content">
            <div className="hero-avatar">
              {employee.employeeName.charAt(0).toUpperCase()}
            </div>
            <div className="hero-info">
              <h1>{employee.employeeName}</h1>
              <div className="hero-tags">
                <span className="hero-tag"><Briefcase size={14}/> {employee.designation}</span>
                <span className="hero-tag"><Building size={14}/> {employee.companyName}</span>
              </div>
            </div>
            <div className="hero-rating">
              <div className="rating-score">
                <Star size={24} className="fill-star" />
                <span>{employee.rating ? employee.rating.toFixed(1) : 'N/A'}</span>
              </div>
              <span className="rating-subtitle">Average Rating</span>
            </div>
          </div>
          
          <div className="profile-contact-strip">
            <div className="contact-node"><Mail size={16}/> {employee.email}</div>
            <div className="contact-node"><Phone size={16}/> {employee.mobile}</div>
            {employee.linkedinUrl && (
              <a href={employee.linkedinUrl} target="_blank" rel="noopener noreferrer" className="contact-node link">
                <ExternalLink size={16}/> LinkedIn Profile
              </a>
            )}
          </div>
        </motion.div>

        {/* History & Feedbacks Grid */}
        <div className="profile-bento-grid">
          {/* Work History (Spans 1 col) */}
          <motion.div className="bento-card work-history" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}}>
            <h3 className="card-title">Employment Timeline</h3>
            <div className="timeline-bento">
              <div className="timeline-node">
                <div className="node-dot"></div>
                <div className="node-content">
                  <h4>{employee.designation}</h4>
                  <span className="node-company">{employee.companyName}</span>
                  <div className="node-meta">
                    <Calendar size={14}/> 
                    <span>{new Date(employee.joiningDate).toLocaleDateString()} - {employee.leavingDate ? new Date(employee.leavingDate).toLocaleDateString() : 'Present'}</span>
                  </div>
                  {employee.reasonForLeaving && (
                    <div className="node-reason">
                      <strong>Reason for exit:</strong> {employee.reasonForLeaving}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feedback Section (Spans 2 cols) */}
          <motion.div className="bento-card feedback-section" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}}>
            <div className="feedback-header">
              <h3 className="card-title">Verified Feedback</h3>
              <Link to={`/add-feedback/${id}`} className="btn-bento-primary btn-sm">Add Review</Link>
            </div>
            
            {employee.feedbacks && employee.feedbacks.length > 0 ? (
              <div className="feedback-list-bento">
                {employee.feedbacks.map((fb) => (
                  <div key={fb.id} className="feedback-bento-item">
                    <div className="fb-top">
                      <div className="fb-author">
                        <div className="fb-company-avatar">{fb.companyName.charAt(0)}</div>
                        <div>
                          <h4>{fb.companyName}</h4>
                          <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="fb-score"><Star size={16}/> {fb.rating}.0</div>
                    </div>
                    
                    {(fb.positives?.length > 0 || fb.negatives?.length > 0) && (
                      <div className="fb-tags">
                        {fb.positives?.map((p, i) => <span key={i} className="fb-tag positive"><CheckCircle size={14}/> {p}</span>)}
                        {fb.negatives?.map((n, i) => <span key={i} className="fb-tag negative"><XCircle size={14}/> {n}</span>)}
                      </div>
                    )}
                    
                    {fb.comments && <p className="fb-comment">"{fb.comments}"</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-bento">
                <Star size={32} opacity={0.3} />
                <p>No verified feedback yet.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modals... */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bento-card modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="card-title">Delete Record?</h2>
            <p>Are you sure you want to permanently delete <strong>{employee.employeeName}</strong>?</p>
            <div className="modal-actions-bento">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-bento-secondary">Cancel</button>
              <button onClick={handleDelete} className="btn-bento-danger">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="bento-card modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="card-title">Report Record</h2>
            {reportMessage && <div className="message success">{reportMessage}</div>}
            <form onSubmit={handleReport} className="report-form-bento">
              <div className="form-group">
                <label>Category</label>
                <select value={reportData.category} onChange={e => setReportData({...reportData, category: e.target.value})}>
                  <option>Wrong Employee Record</option>
                  <option>Fake Information</option>
                  <option>Spam</option>
                </select>
              </div>
              <div className="form-group">
                <label>Details</label>
                <textarea rows="3" value={reportData.description} onChange={e => setReportData({...reportData, description: e.target.value})}></textarea>
              </div>
              <div className="modal-actions-bento">
                <button type="button" onClick={() => setShowReportModal(false)} className="btn-bento-secondary">Cancel</button>
                <button type="submit" className="btn-bento-warning">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProfilePage;
