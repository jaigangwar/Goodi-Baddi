// Reports Page

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyReports } from '../../services/reportService';
import './ReportsPage.css';

const ReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await getMyReports();
      
      if (response.success) {
        setReports(response.reports);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'Pending': 'badge-pending',
      'Resolved': 'badge-resolved',
      'Dismissed': 'badge-dismissed'
    };
    return badges[status] || 'badge-pending';
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="reports-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Back
          </button>
          <h1>My Reports</h1>
          <p>View all reports you have submitted</p>
        </div>

        {reports.length > 0 ? (
          <div className="reports-list">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div>
                    <h3>{report.category}</h3>
                    <p className="report-date">
                      Submitted on {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`status-badge ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                </div>

                {report.description && (
                  <div className="report-description">
                    <p>{report.description}</p>
                  </div>
                )}

                {report.resolution && (
                  <div className="report-resolution">
                    <h4>Admin Response:</h4>
                    <p>{report.resolution}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Reports Yet</h3>
            <p>You haven't submitted any reports</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
