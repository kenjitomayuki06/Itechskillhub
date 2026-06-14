import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Users, GraduationCap, ShieldCheck, BookOpen,
  ClipboardList, Award, Power, AlertTriangle, Loader
} from 'lucide-react';
import { getUser, logout, apiFetch } from '../../services/authService';
import '../../styles/admin/SuperAdminDashboard.css';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || user.role !== 'super_admin') {
      navigate('/');
      return;
    }
    setAdmin(user);

    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await apiFetch('/api/super-admin/overview');
        setStats(res?.stats ?? null);
        setMaintenanceMode(!!res?.maintenanceMode);
      } catch (err) {
        console.error('Failed to fetch overview:', err);
        setError('Hindi ma-load ang system overview.');
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/sys_superadmin_ItechSkillsHubphpAccess2026_v2');
  };

  const handleToggleMaintenance = async () => {
    setToggling(true);
    try {
      const next = !maintenanceMode;
      const res = await apiFetch('/api/super-admin/maintenance', {
        method: 'POST',
        body: JSON.stringify({ enabled: next }),
      });
      setMaintenanceMode(res.maintenanceMode);
      toast.success(res.message || 'Maintenance mode updated.');
      setShowConfirm(false);
    } catch (err) {
      console.error('Failed to toggle maintenance:', err);
      toast.error('Hindi na-update ang maintenance mode.');
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="sa-page">
      {/* Header */}
      <div className="sa-header">
        <div>
          <h1 className="sa-title">Super Admin Dashboard</h1>
          <p className="sa-subtitle">
            Welcome back{admin?.full_name ? `, ${admin.full_name}` : ''}! Full system control center.
          </p>
        </div>
      </div>

      {error && (
        <div className="sa-error-banner">
          <AlertTriangle size={16} /> {error}
        </div>
      )}

      {/* Maintenance Mode Card */}
      <div className={`sa-maintenance-card ${maintenanceMode ? 'sa-maintenance-on' : ''}`}>
        <div className="sa-maintenance-info">
          <div className="sa-maintenance-icon">
            <Power size={24} />
          </div>
          <div>
            <h3>Maintenance Mode</h3>
            <p>
              {maintenanceMode
                ? 'The system is currently OFFLINE for all users. Only Super Admins can access the system.'
                : 'The system is LIVE and accessible to everyone.'}
            </p>
          </div>
        </div>

        <div className="sa-maintenance-action">
          <span className={`sa-status-badge ${maintenanceMode ? 'sa-status-on' : 'sa-status-off'}`}>
            {maintenanceMode ? '● Under Maintenance' : '● System Live'}
          </span>
          <button
            className={`sa-toggle-btn ${maintenanceMode ? 'sa-toggle-off' : 'sa-toggle-on'}`}
            onClick={() => setShowConfirm(true)}
            disabled={toggling || loading}
          >
            {toggling ? <Loader size={15} className="sa-spin" /> : <Power size={15} />}
            {maintenanceMode ? 'Turn Off Maintenance' : 'Turn On Maintenance'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="sa-stats-grid">
        <StatBox icon={Users} label="Total Students" value={stats?.totalStudents} loading={loading} color="#3b82f6" />
        <StatBox icon={GraduationCap} label="Total Instructors" value={stats?.totalInstructors} loading={loading} color="#10b981" />
        <StatBox icon={ShieldCheck} label="Total Admins" value={stats?.totalAdmins} loading={loading} color="#5B4A9E" />
        <StatBox icon={BookOpen} label="Total Courses" value={stats?.totalCourses} loading={loading} color="#f59e0b" />
        <StatBox icon={ClipboardList} label="Total Quizzes" value={stats?.totalQuizzes} loading={loading} color="#ec4899" />
        <StatBox icon={ClipboardList} label="Quiz Attempts" value={stats?.totalQuizAttempts} loading={loading} color="#06b6d4" />
        <StatBox icon={Award} label="Certificates Issued" value={stats?.totalCertificates} loading={loading} color="#84cc16" />
      </div>

      {/* Quick Links */}
      <div className="sa-quick-links">
        <h3 className="sa-section-title">Manage System</h3>
        <div className="sa-links-grid">
          <button className="sa-link-card" onClick={() => navigate('/super-admin/admins')}>
            <ShieldCheck size={22} />
            <div>
              <h4>Manage Admins</h4>
              <p>Create, enable, or disable admin accounts</p>
            </div>
          </button>
          <button className="sa-link-card" onClick={() => navigate('/super-admin/users')}>
            <Users size={22} />
            <div>
              <h4>Manage Users</h4>
              <p>View and moderate students &amp; instructors</p>
            </div>
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="sa-confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="sa-confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={36} className="sa-confirm-icon" />
            <h3>
              {maintenanceMode ? 'Turn off Maintenance Mode?' : 'Turn on Maintenance Mode?'}
            </h3>
            <p>
              {maintenanceMode
                ? 'The system will become accessible to all students, instructors, and admins again.'
                : 'All students, instructors, and admins will see a "System Under Maintenance" page. Only Super Admins can bypass this.'}
            </p>
            <div className="sa-confirm-actions">
              <button className="sa-confirm-cancel" onClick={() => setShowConfirm(false)} disabled={toggling}>
                Cancel
              </button>
              <button
                className={`sa-confirm-submit ${maintenanceMode ? 'sa-confirm-danger' : 'sa-confirm-warn'}`}
                onClick={handleToggleMaintenance}
                disabled={toggling}
              >
                {toggling ? <Loader size={14} className="sa-spin" /> : null}
                {maintenanceMode ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, label, value, loading, color }) {
  return (
    <div className="sa-stat-box">
      <div className="sa-stat-icon" style={{ background: color + '18', color }}>
        <Icon size={20} />
      </div>
      <div>
        <div className="sa-stat-value">{loading ? '—' : (value ?? 0).toLocaleString()}</div>
        <div className="sa-stat-label">{label}</div>
      </div>
    </div>
  );
}