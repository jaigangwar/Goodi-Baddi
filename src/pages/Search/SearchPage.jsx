// Search Page

import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { searchEmployees } from '../../services/employeeService';
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

  useEffect(() => {
    // Auto-search if query param exists
    if (searchParams.get('q')) {
      handleSearch();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    // Check if at least one field is filled
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
          setMessage('No employees found matching your search criteria');
        }
      }
    } catch (error) {
      setMessage(error.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      name: '',
      mobile: '',
      email: '',
      linkedin: ''
    });
    setResults([]);
    setSearched(false);
    setMessage('');
  };

  return (
    <div className="search-page">
      <div className="search-container">
        <div className="search-header">
          <h1>Search Employees</h1>
          <p>Find candidate profiles by name, email, mobile, or LinkedIn</p>
        </div>

        {/* Search Form */}
        <div className="search-form-card">
          <form onSubmit={handleSearch} className="search-form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Rahul Sharma"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="e.g., 9876543210"
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., employee@example.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="e.g., https://linkedin.com/in/username"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? 'Searching...' : '🔍 Search'}
              </button>
              <button type="button" onClick={handleClear} className="btn-clear">
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Message */}
        {message && (
          <div className={`message ${results.length === 0 ? 'info' : 'success'}`}>
            {message}
          </div>
        )}

        {/* Search Results */}
        {searched && !loading && (
          <div className="search-results">
            <div className="results-header">
              <h2>Search Results</h2>
              <span className="results-count">{results.length} employee(s) found</span>
            </div>

            {results.length > 0 ? (
              <div className="results-grid">
                {results.map((employee) => (
                  <Link
                    key={employee.id}
                    to={`/employee/${employee.id}`}
                    className="result-card"
                  >
                    <div className="result-header">
                      <div className="result-avatar">
                        {employee.employeeName.charAt(0).toUpperCase()}
                      </div>
                      <div className="result-info">
                        <h3>{employee.employeeName}</h3>
                        <p className="designation">{employee.designation}</p>
                      </div>
                    </div>

                    <div className="result-details">
                      <div className="detail-item">
                        <span className="detail-label">Company:</span>
                        <span className="detail-value">{employee.companyName}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{employee.email}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Mobile:</span>
                        <span className="detail-value">{employee.mobile}</span>
                      </div>
                    </div>

                    <div className="result-footer">
                      <span className="rating">
                        ⭐ {employee.rating ? employee.rating.toFixed(1) : 'N/A'}
                      </span>
                      <span className="view-profile">View Profile →</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-results">
                <div className="empty-icon">🔍</div>
                <h3>No Results Found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Searching employees...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
