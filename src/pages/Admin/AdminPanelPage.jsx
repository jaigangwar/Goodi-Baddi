import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanies, verifyCompany, deleteCompany, getReports, resolveReport } from '../../services/adminService';
import { COMPANY_STATUS } from '../../config/constants';
import { motion } from 'framer-motion';
import { ShieldAlert, Building2, ChevronLeft, CheckCircle, XCircle, Trash2, Shield, Filter, Search } from 'lucide-react';
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
    } catch (e) { setMessage(e.message || 'Failed to load data'); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [activeTab, filterStatus]);

  const handleVerify = async (id, action) => {
    setActionLoading(true); setMessage('');
    try {
      const res = await verifyCompany(id, action);
      if (res.success) {
        setMessage(`Company ${action === 'approve' ? 'approved' : 'rejected'}`);
        loadData();
      }
    } catch (e) { setMessage(e.message || 'Action failed'); } 
    finally { setActionLoading(false); }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Delete this company permanently?')) return;
    setActionLoading(true); setMessage('');
    try {
      const res = await deleteCompany(id);
      if (res.success) {
        setMessage('Company deleted');
        loadData();
      }
    } catch (e) { setMessage(e.message || 'Failed to delete'); } 
    finally { setActionLoading(false); }
  };

  const handleResolveReport = async (id, action) => {
    setActionLoading(true); setMessage('');
    try {
      const res = await resolveReport(id, action, resolutionTexts[id] || '');
      if (res.success) {
        setMessage(`Report ${action === 'approve' ? 'resolved' : 'dismissed'}`);
        setResolutionTexts(prev => ({ ...prev, [id]: '' }));
        loadData();
      }
    } catch (e) { setMessage(e.message || 'Failed to resolve report'); } 
    finally { setActionLoading(false); }
  };

  return (
    <div className="bento-subpage">
      <div className="bento-container-narrow" style={{maxWidth: '1000px'}}>
        
        <div className="bento-header">
          <button onClick={() => navigate(-1)} className="btn-bento-icon"><ChevronLeft size={20} /> Back</button>
          <div className="header-titles">
            <motion.h1 initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
              <Shield size={32} color="#0f172a"/> Super Admin
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}}>Manage companies, reports, and platform integrity</motion.p>
          </div>
        </div>

        {message && <motion.div className={`message ${message.includes('success') || message.includes('resolved') || message.includes('approved') ? 'success' : 'error'}`} initial={{opacity:0}} animate={{opacity:1}}>{message}</motion.div>}

        <div className="admin-bento-tabs">
          <button className={`admin-tab ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>
            <Building2 size={18}/> Companies Verification
          </button>
          <button className={`admin-tab ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
            <ShieldAlert size={18}/> Moderation Queue
          </button>
        </div>

        {loading ? (
          <div className="dashboard-loading"><div className="loader-pulse"></div></div>
        ) : (
          <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.3}}>
            
            {activeTab === 'companies' && (
              <div className="bento-card" style={{padding: '0', overflow: 'hidden'}}>
                <div className="admin-filter-bar">
                  <div className="input-wrapper" style={{maxWidth: '250px'}}>
                    <Filter className="input-icon" size={18}/>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="premium-select" style={{paddingLeft: '2.5rem', border: 'none', background: '#f8fafc'}}>
                      <option value="">All Statuses</option>
                      {Object.values(COMPANY_STATUS).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {companies.length > 0 ? (
                  <div className="admin-table">
                    <div className="th">Company Details</div>
                    <div className="th">Status</div>
                    <div className="th">Actions</div>
                    
                    {companies.map(company => (
                      <div key={company.id} className="tr">
                        <div className="td admin-company-info">
                          <div className="admin-avatar">{company.companyName.charAt(0)}</div>
                          <div>
                            <strong>{company.companyName}</strong>
                            <span>{company.email} • HR: {company.hrName}</span>
                          </div>
                        </div>
                        <div className="td">
                          <span className={`status-pill ${company.status.toLowerCase()}`}>{company.status}</span>
                        </div>
                        <div className="td admin-actions">
                          {company.status === 'Pending' && (
                            <>
                              <button onClick={() => handleVerify(company.id, 'approve')} disabled={actionLoading} className="btn-icon-approve" title="Approve"><CheckCircle size={18}/></button>
                              <button onClick={() => handleVerify(company.id, 'reject')} disabled={actionLoading} className="btn-icon-reject" title="Reject"><XCircle size={18}/></button>
                            </>
                          )}
                          <button onClick={() => handleDeleteCompany(company.id)} disabled={actionLoading} className="btn-icon-delete" title="Delete"><Trash2 size={18}/></button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-bento"><Search size={32} opacity={0.5}/><h3>No Companies Found</h3></div>
                )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="admin-reports-grid">
                {reports.length > 0 ? reports.map(report => (
                  <div key={report.id} className="bento-card report-admin-card">
                    <div className="report-admin-header">
                      <h3><ShieldAlert size={18} color="#ef4444"/> {report.reason}</h3>
                      <span className={`status-pill ${(report.status || 'pending').toLowerCase()}`}>{report.status || 'Pending'}</span>
                    </div>
                    {report.description && <div className="report-admin-desc">"{report.description}"</div>}
                    
                    {report.status === 'Pending' && (
                      <div className="report-admin-resolve">
                        <textarea placeholder="Write resolution note to the reporter..." value={resolutionTexts[report.id] || ''} onChange={(e) => setResolutionTexts(prev => ({...prev, [report.id]: e.target.value}))} rows="2"/>
                        <div className="report-admin-btns">
                          <button onClick={() => handleResolveReport(report.id, 'approve')} disabled={actionLoading} className="btn-bento-primary btn-sm"><CheckCircle size={16}/> Resolve</button>
                          <button onClick={() => handleResolveReport(report.id, 'dismiss')} disabled={actionLoading} className="btn-bento-secondary btn-sm"><XCircle size={16}/> Dismiss</button>
                        </div>
                      </div>
                    )}
                    
                    {report.resolution && (
                      <div className="report-admin-resolution">
                        <strong>Admin Note:</strong> {report.resolution}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="bento-card empty-bento" style={{gridColumn: '1/-1'}}><ShieldAlert size={32} opacity={0.5}/><h3>Clean Queue</h3><p>No pending reports to review.</p></div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelPage;
