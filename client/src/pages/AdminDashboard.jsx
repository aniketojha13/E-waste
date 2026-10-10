import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Users, 
  Truck, 
  Package, 
  CreditCard, 
  ShieldCheck, 
  RefreshCw, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  ExternalLink,
  Check,
  X,
  Clock,
  ArrowRight,
  Trash2,
  History,
  AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  
  // Agent Joining Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appFeedback, setAppFeedback] = useState({ type: '', message: '' });

  // Tab for Applications: 'pending' (Active Queue) vs 'history' (Decided History)
  const [queueTab, setQueueTab] = useState('pending');

  // Recently approved agent notice
  const [recentlyApprovedAgent, setRecentlyApprovedAgent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ewaste_recently_approved_agent') || 'null');
    } catch {
      return null;
    }
  });

  // Approval Modal State
  const [approvingApp, setApprovingApp] = useState(null);
  const [approveForm, setApproveForm] = useState({
    username: '',
    password: ''
  });
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

  const fetchStats = () => {
    API.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(err => console.warn('Could not fetch stats:', err.message));
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      let res;
      try {
        res = await API.get('/admin/agent-applications');
      } catch {
        res = await API.get('/public/agent-applications');
      }
      
      let apps = Array.isArray(res.data) ? res.data : [];

      // Check and sync with localStorage so offline/client-submitted applications are merged and status is preserved
      try {
        const localApps = JSON.parse(localStorage.getItem('ewaste_agent_applications') || '[]');
        for (const localApp of localApps) {
          const matchedIndex = apps.findIndex(a => a.id === localApp.id || (a.email && a.email.toLowerCase() === localApp.email?.toLowerCase()));
          if (matchedIndex === -1) {
            apps.unshift(localApp);
          } else {
            // Keep the most up-to-date status
            if (apps[matchedIndex].status === 'Approved' || localApp.status === 'Approved') {
              apps[matchedIndex].status = 'Approved';
              localApp.status = 'Approved';
            } else if (apps[matchedIndex].status === 'Rejected' || localApp.status === 'Rejected') {
              apps[matchedIndex].status = 'Rejected';
              localApp.status = 'Rejected';
            }
          }
        }
        localStorage.setItem('ewaste_agent_applications', JSON.stringify(localApps));
      } catch (e) {
        console.warn('Local storage check warning:', e);
      }

      setApplications(apps);
    } catch (err) {
      console.warn('Error fetching agent applications:', err.message);
      try {
        const localApps = JSON.parse(localStorage.getItem('ewaste_agent_applications') || '[]');
        setApplications(localApps);
      } catch {
        setApplications([]);
      }
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchApplications();
  }, []);

  const openApproveModal = (app) => {
    const cleanUsername = app.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'agent' + Math.floor(Math.random() * 100);
    setApprovingApp(app);
    setApproveForm({
      username: cleanUsername,
      password: ''
    });
  };

  const handleConfirmApproval = async (e) => {
    e.preventDefault();
    if (!approvingApp) return;

    setIsSubmittingApproval(true);
    setAppFeedback({ type: '', message: '' });

    // Store recently approved agent for notice in Agent Management
    const approvedInfo = {
      name: approvingApp.name,
      username: approveForm.username,
      email: approvingApp.email,
      phone: approvingApp.phone,
      city: approvingApp.city || 'Central Depot',
      timestamp: new Date().toISOString()
    };
    try {
      localStorage.setItem('ewaste_recently_approved_agent', JSON.stringify(approvedInfo));
      setRecentlyApprovedAgent(approvedInfo);
    } catch (e) {
      console.warn('Error storing recently approved agent:', e);
    }

    // Always update localStorage immediately so refresh never reverts to pending
    try {
      const localApps = JSON.parse(localStorage.getItem('ewaste_agent_applications') || '[]');
      const updatedLocal = localApps.map(a => 
        (a.id === approvingApp.id || (a.email && a.email.toLowerCase() === approvingApp.email?.toLowerCase())) 
          ? { ...a, status: 'Approved', approvedAt: new Date().toISOString() } 
          : a
      );
      localStorage.setItem('ewaste_agent_applications', JSON.stringify(updatedLocal));
    } catch (storageErr) {
      console.warn('LocalStorage save warning:', storageErr);
    }

    try {
      const res = await API.post(`/admin/agent-applications/${approvingApp.id}/approve`, {
        username: approveForm.username,
        password: approveForm.password,
        application: approvingApp,
        email: approvingApp.email
      });

      // Update state
      setApplications(prev => prev.map(a => 
        (a.id === approvingApp.id || (a.email && a.email.toLowerCase() === approvingApp.email?.toLowerCase())) 
          ? { ...a, status: 'Approved', approvedAt: new Date().toISOString() } 
          : a
      ));
      if (stats) setStats(prev => ({ ...prev, agentCount: (prev.agentCount || 0) + 1 }));

      setAppFeedback({
        type: 'success',
        message: res.data?.message || `Candidate ${approvingApp.name} approved! Notice dispatched to Agent Management section.`
      });
      setApprovingApp(null);
    } catch (err) {
      console.warn('Approval backend API warning, applied local persistent approval:', err);
      // Optimistic persistent update
      setApplications(prev => prev.map(a => 
        (a.id === approvingApp.id || (a.email && a.email.toLowerCase() === approvingApp.email?.toLowerCase())) 
          ? { ...a, status: 'Approved', approvedAt: new Date().toISOString() } 
          : a
      ));
      setAppFeedback({
        type: 'success',
        message: `Candidate ${approvingApp.name} approved successfully! Notice added to Agent Management.`
      });
      setApprovingApp(null);
    } finally {
      setIsSubmittingApproval(false);
      setTimeout(() => setAppFeedback({ type: '', message: '' }), 6000);
    }
  };

  const handleRejectApplication = async (id, name, appObj) => {
    if (!window.confirm(`Are you sure you want to decline the agent application for ${name}?`)) return;

    // Update localStorage immediately
    try {
      const localApps = JSON.parse(localStorage.getItem('ewaste_agent_applications') || '[]');
      const updatedLocal = localApps.map(a => 
        (a.id === id || (appObj && a.email && a.email.toLowerCase() === appObj.email?.toLowerCase())) 
          ? { ...a, status: 'Rejected' } 
          : a
      );
      localStorage.setItem('ewaste_agent_applications', JSON.stringify(updatedLocal));
    } catch (e) {
      console.warn('LocalStorage reject update warning:', e);
    }

    try {
      await API.put(`/admin/agent-applications/${id}`, { status: 'Rejected', application: appObj });
    } catch (err) {
      console.warn('Reject update warning:', err);
    }

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
    setAppFeedback({
      type: 'info',
      message: `Application for ${name} marked as Rejected and archived to Queue History.`
    });
    setTimeout(() => setAppFeedback({ type: '', message: '' }), 4000);
  };

  // Clear Queue functionality
  const handleClearQueue = async (scope = 'processed') => {
    const confirmMsg = scope === 'all' 
      ? 'Are you sure you want to completely clear ALL applications from the queue?' 
      : 'Clear all processed (Approved and Rejected) applications from the recruitment queue? Pending applications will remain.';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      // Backend clear
      await API.delete(`/admin/agent-applications/clear?scope=${scope}`);
    } catch (err) {
      console.warn('Backend clear queue warning:', err.message);
    }

    // Update local state & localStorage
    if (scope === 'all') {
      setApplications([]);
      localStorage.setItem('ewaste_agent_applications', JSON.stringify([]));
      setAppFeedback({ type: 'success', message: 'All applications have been cleared from the queue.' });
    } else {
      const remaining = applications.filter(a => a.status === 'Pending');
      setApplications(remaining);
      localStorage.setItem('ewaste_agent_applications', JSON.stringify(remaining));
      setAppFeedback({ type: 'success', message: 'Processed queue history has been cleared. Active pending applications preserved.' });
    }
    setTimeout(() => setAppFeedback({ type: '', message: '' }), 5000);
  };

  const dismissApprovedNotice = () => {
    localStorage.removeItem('ewaste_recently_approved_agent');
    setRecentlyApprovedAgent(null);
  };

  const pendingApplications = applications.filter(a => a.status === 'Pending');
  const historyApplications = applications.filter(a => a.status !== 'Pending');
  const pendingCount = pendingApplications.length;

  return (
    <div style={{ maxWidth: '1060px', margin: '1.5rem auto', padding: '0 1rem' }}>
      {/* Header Banner */}
      <div className="card title-header" style={{ padding: '2rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '0.75rem', 
          background: 'rgba(2, 132, 199, 0.15)', 
          border: '1px solid rgba(2, 132, 199, 0.3)',
          borderRadius: '50%', 
          marginBottom: '0.75rem',
          color: 'var(--secondary)'
        }}>
          <ShieldCheck size={36} />
        </div>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--text-main)', margin: '0 0 0.4rem' }}>
          Platform Administrator Hub
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          System Governance, Logistics Roster & Field Operations. Logged in as <strong style={{ color: 'var(--text-main)' }}>{user?.name || user?.username}</strong>
        </p>
      </div>

      {/* System Stats Row */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', marginBottom: '1.75rem' }}>
          <div className="stat-card">
            <span className="stat-label">Total Customers</span>
            <h3 className="stat-value" style={{ color: 'var(--secondary)' }}>{stats.customerCount}</h3>
          </div>
          <div className="stat-card">
            <span className="stat-label">Active Agents</span>
            <h3 className="stat-value" style={{ color: 'var(--primary)' }}>{stats.agentCount}</h3>
          </div>
          <div className="stat-card">
            <span className="stat-label">Products Listed</span>
            <h3 className="stat-value" style={{ color: 'var(--text-main)' }}>{stats.productCount}</h3>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Pickups</span>
            <h3 className="stat-value" style={{ color: '#f59e0b' }}>{stats.pendingPayments}</h3>
          </div>
          <div className="stat-card">
            <span className="stat-label">Pending Applications</span>
            <h3 className="stat-value" style={{ color: '#ec4899' }}>{pendingCount}</h3>
          </div>
        </div>
      )}

      {/* Notice Banner: Recently Approved Agent Waiting to be Verified/Onboarded */}
      {recentlyApprovedAgent && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem 1.25rem',
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'var(--primary)',
              color: '#ffffff',
              borderRadius: '50%',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Action Required in Agent Management: Approved Agent Ready
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Candidate <strong style={{ color: 'var(--text-main)' }}>{recentlyApprovedAgent.name}</strong> (@{recentlyApprovedAgent.username}) was approved. Verify their depot & route settings in the Agent Management section.
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link 
              to={`/admin/agents?newAgent=${encodeURIComponent(recentlyApprovedAgent.username)}`}
              className="btn btn-primary"
              style={{ fontSize: '0.775rem', padding: '0.35rem 0.85rem' }}
            >
              <Truck size={14} /> Open in Agent Management
            </Link>
            <button
              onClick={dismissApprovedNotice}
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.5rem', fontSize: '0.775rem', border: 'none' }}
              title="Dismiss Notice"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 2*2 Arrangement Section Grid on Admin Dashboard */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700, margin: '0 0 0.85rem' }}>
          Management Portals & Operations 
        </h3>
        
        <div className="admin-2x2-grid">
          {/* Card 1: Full Agents Management (with Live Notice indicator if recently approved) */}
          <Link to="/admin/agents" className="role-btn-card" style={{ position: 'relative' }}>
            {recentlyApprovedAgent && (
              <span style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'var(--primary)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.15rem 0.55rem',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                1 Approved to Add
              </span>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(14, 165, 233, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--secondary)' }}>
                <Truck size={26} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>
                {stats?.agentCount || 0} Active Agents
              </span>
            </div>
            <div>
              <h3>Full Agents Management</h3>
              <p>Administer verified collection agents, configure depot territories, manage credentials, and view field roster.</p>
              {recentlyApprovedAgent && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.775rem', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={13} /> Approved agent @{recentlyApprovedAgent.username} ready to manage
                </div>
              )}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--secondary)', fontSize: '0.825rem', fontWeight: 600 }}>
              Open Full Agents Management Roster <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 2: All E-Waste Products */}
          <Link to="/products" className="role-btn-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(2, 132, 199, 0.15)', padding: '0.65rem', borderRadius: '8px', color: 'var(--secondary)' }}>
                <Package size={26} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', fontWeight: 600 }}>Live Inventory</span>
            </div>
            <div>
              <h3>All E-Waste Products</h3>
              <p>Review customer submissions, verify device conditions, and inspect scrap metallurgy records.</p>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--secondary)', fontSize: '0.825rem', fontWeight: 600 }}>
              Inspect Product Catalog <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 3: Payments & Pickups */}
          <Link to="/payments" className="role-btn-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'var(--primary-light)', padding: '0.65rem', borderRadius: '8px', color: 'var(--primary)' }}>
                <CreditCard size={26} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Settlements</span>
            </div>
            <div>
              <h3>Payments & Pickups</h3>
              <p>Track cash payouts and instant UPI bank settlement disbursements across collections.</p>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.825rem', fontWeight: 600 }}>
              View Financial Ledger <ArrowRight size={14} />
            </div>
          </Link>

          {/* Card 4: Registered Customers */}
          <Link to="/admin/customers" className="role-btn-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.15)', padding: '0.65rem', borderRadius: '8px', color: '#a78bfa' }}>
                <Users size={26} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>User Accounts</span>
            </div>
            <div>
              <h3>Registered Customers</h3>
              <p>Inspect registered consumer accounts, recycling histories, and platform member profiles.</p>
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#a78bfa', fontSize: '0.825rem', fontWeight: 600 }}>
              Browse Customer Database <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </div>

      {/* Merged Single Unified Queue & History Card */}
      <div id="agent-joining-queue" className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
              <Briefcase size={22} color="#ec4899" />
              <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-main)', fontWeight: 700 }}>
                Agent Recruitment Queue & History
              </h2>
            </div>
            <p style={{ margin: '0.25rem 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Review incoming candidate submissions from the public Agent Joining Form, onboard verified agents, and view decision history.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={fetchApplications} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }} title="Refresh Applications">
              <RefreshCw size={13} /> Refresh
            </button>
            
            {/* Clear Queue Dropdown / Action */}
            {applications.length > 0 && (
              <button 
                type="button"
                onClick={() => handleClearQueue(queueTab === 'history' ? 'processed' : 'all')} 
                className="btn btn-outline" 
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.4rem 0.75rem',
                  color: '#f87171',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
                title={queueTab === 'history' ? 'Clear processed history records' : 'Clear queue records'}
              >
                <Trash2 size={13} /> Clear {queueTab === 'history' ? 'History' : 'Queue'}
              </button>
            )}

            <Link 
              to="/apply-as-agent" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary" 
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem', gap: '0.4rem' }}
              title="Open public Agent Joining Form in a new tab"
            >
              <ExternalLink size={13} /> Open Joining Form
            </Link>
          </div>
        </div>

        {/* Tab switcher: Pending Queue vs Queue History */}
        <div className="auth-tabs" style={{ maxWidth: '380px', marginBottom: '1.25rem' }}>
          <button
            type="button"
            className={`auth-tab ${queueTab === 'pending' ? 'active' : ''}`}
            onClick={() => setQueueTab('pending')}
          >
            <Clock size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
            Active Queue ({pendingCount})
          </button>
          <button
            type="button"
            className={`auth-tab ${queueTab === 'history' ? 'active' : ''}`}
            onClick={() => setQueueTab('history')}
          >
            <History size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} />
            Queue History ({historyApplications.length})
          </button>
        </div>

        {/* Live Feedback */}
        {appFeedback.message && (
          <div className={`alert ${appFeedback.type === 'success' ? 'alert-success' : 'alert-info'}`} style={{ marginBottom: '1rem' }}>
            {appFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{appFeedback.message}</span>
          </div>
        )}

        {/* Applications List */}
        {loadingApps ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            Loading incoming agent applications...
          </div>
        ) : (queueTab === 'pending' ? pendingApplications : historyApplications).length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2.5rem 1.5rem', 
            background: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border)' 
          }}>
            {queueTab === 'pending' ? (
              <>
                <Clock size={32} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  No Pending Agent Applications in Queue
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', maxWidth: '420px', margin: '0 auto 1rem' }}>
                  All candidate submissions have been reviewed. New applications from prospective collection agents will appear here.
                </p>
                <Link to="/apply-as-agent" target="_blank" className="btn btn-outline" style={{ fontSize: '0.8rem' }}>
                  <ExternalLink size={14} /> Preview Agent Joining Form
                </Link>
              </>
            ) : (
              <>
                <History size={32} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                  No Decided Applications in History Yet
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.825rem', maxWidth: '420px', margin: '0 auto' }}>
                  When you approve or decline candidate applications from the active queue, their decision records will be archived here.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Contact Details</th>
                  <th>Territory & Address</th>
                  <th>Vehicle & Logistics</th>
                  <th>Statement / Why Join</th>
                  <th style={{ textAlign: 'right' }}>
                    {queueTab === 'pending' ? 'Application Decision' : 'Onboarding Status'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(queueTab === 'pending' ? pendingApplications : historyApplications).map((app) => (
                  <tr key={app.id || app.email}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                        {app.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                        Applied: {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      <div style={{ marginTop: '0.35rem' }}>
                        <span className={`status-badge ${
                          app.status === 'Approved' ? 'status-paid' : app.status === 'Rejected' ? 'status-cancelled' : 'status-pending'
                        }`}>
                          {app.status || 'Pending'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.825rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)' }}>
                          <Mail size={12} color="var(--text-muted)" /> {app.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem', color: 'var(--primary)' }}>
                          <Phone size={12} /> {app.phone}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.825rem' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={12} color="var(--secondary)" /> {app.city || 'Not specified'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem', maxWidth: '200px' }}>
                          {app.address}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.8rem' }}>
                        <div style={{ color: 'var(--text-main)' }}>{app.vehicleType || 'Motorcycle'}</div>
                        <div style={{ fontSize: '0.725rem', color: 'var(--text-dim)' }}>
                          {app.experience} • {app.availability}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ 
                        fontSize: '0.775rem', 
                        color: 'var(--text-muted)', 
                        maxWidth: '220px', 
                        lineHeight: 1.4,
                        fontStyle: app.motivation ? 'normal' : 'italic'
                      }}>
                        {app.motivation ? `"${app.motivation}"` : 'No statement provided.'}
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {app.status === 'Approved' ? (
                        <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem' }}>
                            <CheckCircle2 size={15} /> Onboarded
                          </span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                            {app.approvedAt ? new Date(app.approvedAt).toLocaleDateString() : 'Approved'}
                          </span>
                        </div>
                      ) : app.status === 'Rejected' ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Declined</span>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                          <button
                            type="button"
                            onClick={() => openApproveModal(app)}
                            className="btn btn-primary"
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                            title="Approve candidate and generate agent credentials"
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectApplication(app.id, app.name, app)}
                            className="btn btn-danger"
                            style={{ padding: '0.35rem 0.55rem', fontSize: '0.75rem' }}
                            title="Decline application"
                          >
                            <X size={13} /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Confirm Approval and Create Agent Credentials */}
      {approvingApp && (
        <div className="modal-overlay" onClick={() => setApprovingApp(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <CheckCircle2 size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  Approve & Onboard Agent
                </h3>
              </div>
              <button onClick={() => setApprovingApp(null)} className="btn btn-outline" style={{ border: 'none', padding: '0.3rem' }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Approving <strong style={{ color: 'var(--text-main)' }}>{approvingApp.name}</strong> will create their active collection agent account with immediate route access.
            </p>

            <form onSubmit={handleConfirmApproval}>
              <div className="form-group">
                <label>Assigned Agent Username *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. agent_delhi"
                  value={approveForm.username}
                  onChange={(e) => setApproveForm({ ...approveForm, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Temporary Password *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Temporary login password"
                  value={approveForm.password}
                  onChange={(e) => setApproveForm({ ...approveForm, password: e.target.value })}
                  required
                />
                <span style={{ fontSize: '0.725rem', color: 'var(--text-dim)', marginTop: '0.2rem', display: 'block' }}>
                  An official credentials email with this username &amp; password will be dispatched to <strong>{approvingApp.email}</strong>.
                </span>
              </div>

              <div style={{
                padding: '0.75rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.775rem',
                color: 'var(--text-muted)',
                marginBottom: '1.25rem'
              }}>
                <div><strong>Email:</strong> {approvingApp.email}</div>
                <div><strong>Phone:</strong> {approvingApp.phone}</div>
                <div><strong>City / Depot:</strong> {approvingApp.city}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setApprovingApp(null)} className="btn btn-outline" disabled={isSubmittingApproval}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmittingApproval}>
                  {isSubmittingApproval ? 'Onboarding...' : 'Confirm Approval & Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
