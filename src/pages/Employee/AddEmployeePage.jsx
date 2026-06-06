import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../../services/employeeService';
import { isValidEmail, isValidMobile, isValidDateRange } from '../../utils/validation';
import { EMPLOYMENT_TYPES } from '../../config/constants';
import { motion } from 'framer-motion';
import { UserPlus, User, Phone, Mail, Link as LinkIcon, Briefcase, Calendar, FileText, ChevronLeft } from 'lucide-react';
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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.employeeName.trim()) newErrors.employeeName = 'Required';
    if (!formData.mobile) newErrors.mobile = 'Required';
    else if (!isValidMobile(formData.mobile)) newErrors.mobile = 'Invalid format';
    
    if (!formData.email) newErrors.email = 'Required';
    else if (!isValidEmail(formData.email)) newErrors.email = 'Invalid format';
    
    if (!formData.designation.trim()) newErrors.designation = 'Required';
    if (!formData.joiningDate) newErrors.joiningDate = 'Required';
    
    if (formData.leavingDate && !isValidDateRange(formData.joiningDate, formData.leavingDate)) {
      newErrors.leavingDate = 'Must be after joining';
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
        setMessage('Record created successfully!');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    } catch (error) {
      setMessage(error.message || 'Failed to add employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bento-subpage">
      <div className="bento-container-narrow">
        
        <div className="bento-header">
          <button onClick={() => navigate(-1)} className="btn-bento-icon">
            <ChevronLeft size={20} /> Back
          </button>
          <div className="header-titles">
            <motion.h1 initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}>New Employee Record</motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.1}}>
              Add verified professional history to the ecosystem
            </motion.p>
          </div>
        </div>

        {message && (
          <motion.div className={`message ${message.includes('success') ? 'success' : 'error'}`} initial={{opacity:0}} animate={{opacity:1}}>
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="bento-form-layout">
          
          {/* Personal Info Bento */}
          <motion.div className="bento-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
            <h2 className="card-title"><User size={20}/> Personal Information</h2>
            
            <div className="bento-grid-2">
              <div className="premium-input-group">
                <label>Full Name *</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} className={errors.employeeName ? 'error' : ''} placeholder="John Doe" />
                </div>
                {errors.employeeName && <span className="error-text">{errors.employeeName}</span>}
              </div>

              <div className="premium-input-group">
                <label>Mobile *</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={18} />
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className={errors.mobile ? 'error' : ''} placeholder="9876543210" maxLength="10" />
                </div>
                {errors.mobile && <span className="error-text">{errors.mobile}</span>}
              </div>

              <div className="premium-input-group">
                <label>Email *</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} placeholder="john@example.com" />
                </div>
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="premium-input-group">
                <label>LinkedIn (Optional)</label>
                <div className="input-wrapper">
                  <LinkIcon className="input-icon" size={18} />
                  <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Employment Details Bento */}
          <motion.div className="bento-card" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.1}}>
            <h2 className="card-title"><Briefcase size={20}/> Employment Details</h2>
            
            <div className="bento-grid-2">
              <div className="premium-input-group">
                <label>Designation *</label>
                <div className="input-wrapper">
                  <Briefcase className="input-icon" size={18} />
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} className={errors.designation ? 'error' : ''} placeholder="Senior Developer" />
                </div>
                {errors.designation && <span className="error-text">{errors.designation}</span>}
              </div>

              <div className="premium-input-group">
                <label>Employment Type *</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="premium-select">
                  {EMPLOYMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="premium-input-group">
                <label>Joining Date *</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" size={18} />
                  <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className={errors.joiningDate ? 'error' : ''} />
                </div>
                {errors.joiningDate && <span className="error-text">{errors.joiningDate}</span>}
              </div>

              <div className="premium-input-group">
                <label>Leaving Date (Optional)</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" size={18} />
                  <input type="date" name="leavingDate" value={formData.leavingDate} onChange={handleChange} className={errors.leavingDate ? 'error' : ''} />
                </div>
                {errors.leavingDate && <span className="error-text">{errors.leavingDate}</span>}
              </div>
            </div>

            <div className="premium-input-group" style={{marginTop: '1.25rem'}}>
              <label>Reason for Leaving</label>
              <div className="input-wrapper textarea-wrapper">
                <FileText className="input-icon" size={18} />
                <textarea name="reasonForLeaving" value={formData.reasonForLeaving} onChange={handleChange} rows="3" placeholder="e.g. Better opportunity, relocation..."></textarea>
              </div>
            </div>
          </motion.div>

          <div className="form-actions bento-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-bento-secondary">Cancel</button>
            <button type="submit" className="btn-bento-primary" disabled={loading}>
              <UserPlus size={18}/> {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeePage;
