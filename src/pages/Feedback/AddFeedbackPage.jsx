import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById } from '../../services/employeeService';
import { addFeedback } from '../../services/feedbackService';
import { POSITIVE_CATEGORIES, NEGATIVE_CATEGORIES } from '../../config/constants';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import '../Employee/AddEmployeePage.css'; /* Reuse form styles */

const AddFeedbackPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({ rating: 5, positiveCategories: [], negativeCategories: [], hrComments: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { loadEmployee(); }, [id]);

  const loadEmployee = async () => {
    try {
      const response = await getEmployeeById(id);
      if (response.success) setEmployee(response.employee);
    } catch { setMessage('Failed to load employee details'); } 
    finally { setLoading(false); }
  };

  const handleCategoryToggle = (category, type) => {
    const field = type === 'positive' ? 'positiveCategories' : 'negativeCategories';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(category) ? prev[field].filter(c => c !== category) : [...prev[field], category]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.positiveCategories.length === 0 && formData.negativeCategories.length === 0) {
      setMessage('Select at least one category'); return;
    }
    setSubmitting(true);
    try {
      const res = await addFeedback({ employeeId: id, ...formData });
      if (res.success) {
        setMessage('Feedback submitted!');
        setTimeout(() => navigate(`/employee/${id}`), 2000);
      }
    } catch (err) { setMessage(err.message || 'Submission failed'); } 
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="dashboard-loading"><div className="loader-pulse"></div></div>;

  return (
    <div className="bento-subpage">
      <div className="bento-container-narrow">
        <div className="bento-header">
          <button onClick={() => navigate(-1)} className="btn-bento-icon"><ChevronLeft size={20} /> Back</button>
          <div className="header-titles">
            <motion.h1 initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}>Submit Feedback</motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}}>Evaluate {employee?.employeeName}'s professional performance</motion.p>
          </div>
        </div>

        {message && <motion.div className={`message ${message.includes('success')?'success':'error'}`} initial={{opacity:0}} animate={{opacity:1}}>{message}</motion.div>}

        <form onSubmit={handleSubmit} className="bento-form-layout">
          {/* Rating */}
          <motion.div className="bento-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
            <h2 className="card-title"><Star size={20}/> Overall Rating</h2>
            <div className="premium-rating-selector" style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
              {[1,2,3,4,5].map(star => (
                <button 
                  type="button" 
                  key={star} 
                  onClick={() => setFormData({...formData, rating: star})}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: formData.rating >= star ? '#f59e0b' : '#cbd5e1', transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Star size={40} fill={formData.rating >= star ? '#f59e0b' : 'transparent'} />
                </button>
              ))}
              <span style={{fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginLeft: '1rem'}}>{formData.rating}.0</span>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div className="bento-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}}>
            <h2 className="card-title"><ThumbsUp size={20} color="#10b981"/> Positive Points</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
              {POSITIVE_CATEGORIES.map(cat => (
                <label key={cat} style={{cursor: 'pointer'}}>
                  <input type="checkbox" hidden checked={formData.positiveCategories.includes(cat)} onChange={() => handleCategoryToggle(cat, 'positive')} />
                  <span style={{
                    display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600,
                    background: formData.positiveCategories.includes(cat) ? '#10b981' : '#f1f5f9',
                    color: formData.positiveCategories.includes(cat) ? 'white' : '#64748b', transition: 'all 0.2s'
                  }}>{cat}</span>
                </label>
              ))}
            </div>
          </motion.div>

          <motion.div className="bento-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.15}}>
            <h2 className="card-title"><ThumbsDown size={20} color="#ef4444"/> Areas for Improvement</h2>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.75rem'}}>
              {NEGATIVE_CATEGORIES.map(cat => (
                <label key={cat} style={{cursor: 'pointer'}}>
                  <input type="checkbox" hidden checked={formData.negativeCategories.includes(cat)} onChange={() => handleCategoryToggle(cat, 'negative')} />
                  <span style={{
                    display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600,
                    background: formData.negativeCategories.includes(cat) ? '#ef4444' : '#f1f5f9',
                    color: formData.negativeCategories.includes(cat) ? 'white' : '#64748b', transition: 'all 0.2s'
                  }}>{cat}</span>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Comments */}
          <motion.div className="bento-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}}>
            <h2 className="card-title"><MessageSquare size={20}/> Detailed Comments</h2>
            <div className="input-wrapper textarea-wrapper">
              <MessageSquare className="input-icon" size={18} />
              <textarea value={formData.hrComments} onChange={e => setFormData({...formData, hrComments: e.target.value})} rows="4" placeholder="Share qualitative insights about performance..."></textarea>
            </div>
          </motion.div>

          <div className="bento-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-bento-secondary">Cancel</button>
            <button type="submit" className="btn-bento-primary" disabled={submitting}>
              <Star size={18}/> {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFeedbackPage;
