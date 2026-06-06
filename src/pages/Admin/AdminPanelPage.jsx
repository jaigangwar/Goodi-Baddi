import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies, verifyCompany, deleteCompany, getReports, resolveReport } from '../../services/adminService';
import { COMPANY_STATUS } from '../../config/constants';
import './AdminPanelPage.css';

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('companies');
  const [companies, setCompanies] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [resolutionTexts, setResolutionTexts] = useState({});

  useEffect(() => {
    loadData();
  }, [activeTab, filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'companies') {
        const res = await getCompanies(filterStatus || undefined);
        if (res.success) setCompanies(res.companies);
      } else {
        const res = await getReports();
        if (res.success) setReports(res.reports);
      }
    } catch (error) {
      setMessage(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, action) => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await verifyCompany(id, action);
      if (res.success) {
        setMessage(`Company ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        loadData();
      }
    } catch (error) {
      setMessage(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    setActionLoading(true);
    setMessage('');
    try {
      const res = await deleteCompany(id);
      if (res.success) {
        setMessage('Company deleted successfully');
        loadData();
      }
    } catch (error) {
      setMessage(error.message || 'Failed to delete company');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveReport = async (id, action) => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await resolveReport(id, action, resolutionTexts[id] || '');
      if (res.success) {
        setMessage(`Report ${action === 'approve' ? 'resolved' : 'dismissed'} successfully`);
        setResolutionTexts(prev => ({ ...prev, [id]: '' }));
        loadData();
      }
    } catch (error) {
      setMessage(error.message || 'Failed to resolve report');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="page-header">
          <button onClick={() => navigate(-1)} className="btn-back">← Back</button>
          <h1>Admin Panel</h1>
          <p>Manage companies, reports, and moderation</p>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'companies' ? 'active' : ''}`}
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </button>
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
        </div>

        {activeTab === 'companies' && (
          <div className="admin-section">
            <div className="filter-bar">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                {Object.values(COMPANY_STATUS).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : companies.length > 0 ? (
              <div className="data-table">
                <div className="table-header">
                  <span>Company</span>
                  <span>Email</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {companies.map(company => (
                  <div key={company.id} className="table-row">
                    <div>
                      <strong>{company.companyName}</strong>
                      <p className="text-muted">{company.hrName}</p>
                    </div>
                    <span>{company.email}</span>
                    <span>
                      <span className={`status-badge badge-${company.status.toLowerCase()}`}>
                        {company.status}
                      </span>
                    </span>
                    <div className="action-btns">
                      {company.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleVerify(company.id, 'approve')}
                            className="btn-approve"
                            disabled={actionLoading}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleVerify(company.id, 'reject')}
                            className="btn-reject"
                            disabled={actionLoading}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteCompany(company.id)}
                        className="btn-danger-sm"
                        disabled={actionLoading}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No companies found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="admin-section">
            {loading ? (
              <div className="loading"><div className="spinner"></div></div>
            ) : reports.length > 0 ? (
              <div className="reports-list-admin">
                {reports.map(report => (
                  <div key={report.id} className="report-card-admin">
                    <div className="report-header">
                      <h3>{report.category}</h3>
                      <span className={`status-badge badge-${(report.status || 'pending').toLowerCase()}`}>
                        {report.status || 'Pending'}
                      </span>
                    </div>
                    {report.description && (
                      <p className="report-desc">{report.description}</p>
                    )}
                    {report.status === 'Pending' && (
                      <div className="resolve-section">
                        <textarea
                          placeholder="Resolution notes..."
                          value={resolutionTexts[report.id] || ''}
                          onChange={(e) => setResolutionTexts(prev => ({ ...prev, [report.id]: e.target.value }))}
                          rows="2"
                        />
                        <div className="resolve-actions">
                          <button
                            onClick={() => handleResolveReport(report.id, 'approve')}
                            className="btn-approve"
                            disabled={actionLoading}
                          >
                            Resolve
                          </button>
                          <button
                            onClick={() => handleResolveReport(report.id, 'dismiss')}
                            className="btn-reject"
                            disabled={actionLoading}
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                    )}
                    {report.resolution && (
                      <div className="resolution-info">
                        <strong>Resolution:</strong> {report.resolution}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No reports found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
