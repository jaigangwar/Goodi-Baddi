import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { searchEmployees } from '../../services/employeeService';
import { motion } from 'framer-motion';
import { Search, User, Mail, Phone, ExternalLink, Star, Briefcase, Building } from 'lucide-react';
import './SearchPage.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: searchParams.get('q') || '',
    mobile: '',
    email: '',
    linkedin: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState(location.state?.message || '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const hasQuery = Object.values(formData).some(val => val.trim() !== '');
    if (!hasQuery) {
      setMessage('Please enter at least one search parameter');
      return;
    }
    setLoading(true);
    setMessage('');
    setSearched(true);
    try {
      const params = {};
      if (formData.name) params.name = formData.name;
      if (formData.mobile) params.mobile = formData.mobile;
      if (formData.email) params.email = formData.email;
      if (formData.linkedin) params.linkedin = formData.linkedin;

      const response = await searchEmployees(params);
      if (response.success) {
        setResults(response.results);
        if (response.results.length === 0) {
          setMessage('No employees found matching your search criteria.');
        }
      }
    } catch (error) {
      setMessage(error.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('q')) {
      handleSearch();
    }
  }, []);

  const handleClear = () => {
    setFormData({ name: '', mobile: '', email: '', linkedin: '' });
    setResults([]);
    setSearched(false);
    setMessage('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="bento-search-page">
      <div className="bento-container-narrow">
        <div className="search-header-premium">
          <motion.h1 initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>Find Candidates</motion.h1>
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}>
            Lookup verified professional histories from our trusted ecosystem.
          </motion.p>
        </div>

        {/* Search Bento Box */}
        <motion.div className="bento-card search-filter-card" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}>
          <form onSubmit={handleSearch} className="premium-filter-form">
            <div className="filter-grid">
              <div className="premium-input-group">
                <User className="input-icon" size={18} />
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" />
              </div>
              <div className="premium-input-group">
                <Phone className="input-icon" size={18} />
                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" />
              </div>
              <div className="premium-input-group">
                <Mail className="input-icon" size={18} />
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
              </div>
              <div className="premium-input-group">
                <ExternalLink className="input-icon" size={18} />
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
              </div>
            </div>
            <div className="filter-actions">
              <button type="button" onClick={handleClear} className="btn-bento-secondary">Clear</button>
              <button type="submit" className="btn-bento-primary" disabled={loading}>
                {loading ? 'Searching...' : <><Search size={18} /> Search Ecosystem</>}
              </button>
            </div>
          </form>
        </motion.div>

        {message && (
          <motion.div className={`message ${results.length === 0 ? 'info' : 'success'}`} initial={{opacity:0}} animate={{opacity:1}}>
            {message}
          </motion.div>
        )}

        {searched && !loading && (
          <motion.div className="search-results-bento" variants={containerVariants} initial="hidden" animate="visible">
            <div className="results-meta">
              <h2>Verified Records</h2>
              <span className="badge-count">{results.length} Found</span>
            </div>

            {results.length > 0 ? (
              <div className="bento-results-grid">
                {results.map((employee) => (
                  <motion.div key={employee.id} variants={itemVariants}>
                    <Link to={`/employee/${employee.id}`} className="bento-card result-bento-card">
                      <div className="result-header">
                        <div className="result-avatar-bento">
                          {employee.employeeName.charAt(0).toUpperCase()}
                        </div>
                        <div className="result-main-info">
                          <h3>{employee.employeeName}</h3>
                          <div className="designation-badge">
                            <Briefcase size={14} /> {employee.designation}
                          </div>
                        </div>
                        <div className="result-rating-bento">
                          <Star size={16} className="star-icon" />
                          <span>{employee.rating ? employee.rating.toFixed(1) : 'N/A'}</span>
                        </div>
                      </div>

                      <div className="result-body-bento">
                        <div className="bento-detail-row">
                          <Building size={16} /> <span>{employee.companyName}</span>
                        </div>
                        <div className="bento-detail-row">
                          <Mail size={16} /> <span>{employee.email}</span>
                        </div>
                        <div className="bento-detail-row">
                          <Phone size={16} /> <span>{employee.mobile}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div className="bento-card empty-bento" variants={itemVariants}>
                <div className="empty-icon-box">
                  <Search size={32} />
                </div>
                <h3>No Candidates Found</h3>
                <p>Try refining your search parameters.</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
