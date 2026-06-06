import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyReports } from '../../services/reportService';
import { motion } from 'framer-motion';
import { ChevronLeft, Flag, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';
import '../Employee/AddEmployeePage.css';

const ReportsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      const res = await getMyReports();
      if (res.success) setReports(res.reports);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'Resolved': return { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={14}/> };
      case 'Dismissed': return { color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14}/> };
      default: return { color: '#f59e0b', bg: '#fffbeb', icon: <Clock size={14}/> };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bento-subpage">
      <div className="bento-container-narrow">
        
        <div className="bento-header">
          <button onClick={() => navigate(-1)} className="btn-bento-icon"><ChevronLeft size={20} /> Back</button>
          <div className="header-titles">
            <motion.h1 initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}>My Reports</motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}}>Track moderation flags you've submitted</motion.p>
          </div>
        </div>

        {loading ? (
          <div className="dashboard-loading"><div className="loader-pulse"></div></div>
        ) : reports.length > 0 ? (
          <motion.div className="bento-form-layout" variants={containerVariants} initial="hidden" animate="visible">
            {reports.map(report => {
              const status = getStatusInfo(report.status);
              return (
                <motion.div key={report.id} className="bento-card" variants={itemVariants} style={{padding: '1.5rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                    <div>
                      <h3 style={{margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <AlertTriangle size={18} color="#ef4444"/> {report.reason}
                      </h3>
                      <span style={{fontSize: '0.85rem', color: '#64748b'}}>Submitted: {new Date(report.created_at || report.createdAt).toLocaleDateString()}</span>
                    </div>
                    <span style={{display: 'flex', alignItems: 'center', gap: '0.35rem', background: status.bg, color: status.color, padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700}}>
                      {status.icon} {report.status || 'Pending'}
                    </span>
                  </div>
                  
                  {report.description && (
                    <p style={{background: '#f8fafc', padding: '1rem', borderRadius: '12px', fontSize: '0.95rem', color: '#475569', margin: '0 0 1rem 0'}}>
                      "{report.description}"
                    </p>
                  )}
                  
                  {report.resolution && (
                    <div style={{borderLeft: '3px solid #3b82f6', paddingLeft: '1rem'}}>
                      <strong style={{fontSize: '0.85rem', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em'}}>Admin Response</strong>
                      <p style={{margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: '#1e293b'}}>{report.resolution}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div className="bento-card" initial={{opacity:0}} animate={{opacity:1}} style={{textAlign: 'center', padding: '4rem 2rem'}}>
            <Flag size={48} color="#94a3b8" style={{marginBottom: '1rem', opacity: 0.5}} />
            <h3 style={{fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem'}}>No Reports Yet</h3>
            <p style={{color: '#64748b', margin: 0}}>You haven't submitted any moderation flags.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
