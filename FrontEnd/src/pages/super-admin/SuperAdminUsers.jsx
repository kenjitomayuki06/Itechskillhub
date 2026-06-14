import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Users, Loader, AlertCircle, CheckCircle, XCircle,
  Trash2, GraduationCap, User
} from 'lucide-react';
import { apiFetch } from '../../services/authService';
import '../../styles/admin/SuperAdminUsers.css';

const FILTERS = ['All', 'Student', 'Instructor'];

const STATUS_STYLE = {
  active:     { label: 'Active',     className: 'sau-status-active' },
  pending:    { label: 'Pending',    className: 'sau-status-pending' },
  rejected:   { label: 'Rejected',   className: 'sau-status-rejected' },
  unverified: { label: 'Unverified', className: 'sau-status-unverified' },
};

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/super-admin/users');
      setUsers(res?.users ?? []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Hindi ma-load ang listahan ng users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (filter === 'All') return true;
    return u.role === filter.toLowerCase();
  });

  async function handleToggleStatus(user) {
    const nextStatus = user.status === 'active' ? 'rejected' : 'active';
    setActionLoadingId(user.id);
    try {
      await apiFetch(`/api/super-admin/users/${user.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
      toast.success(nextStatus === 'active' ? 'Account activated.' : 'Account disabled.');
    } catch (err) {
      console.error('Failed to update user status:', err);
      toast.error('Hindi na-update ang status.');
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Sigurado ka bang burahin ang account ni ${user.fullname}? Permanent ito.`)) return;
    setActionLoadingId(user.id);
    try {
      await apiFetch(`/api/super-admin/users/${user.id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast.success('Account deleted.');
    } catch (err) {
      console.error('Failed to delete user:', err);
      toast.error('Hindi nabura ang account.');
    } finally {
      setActionLoadingId(null);
    }
  }

  const studentCount = users.filter(u => u.role === 'student').length;
  const instructorCount = users.filter(u => u.role === 'instructor').length;

  return (
    <div className="sau-page">
      <div className="sau-header">
        <div>
          <h1 className="sau-title">
            <Users size={24} /> Manage Users
          </h1>
          <p className="sau-subtitle">View and moderate student and instructor accounts</p>
        </div>
      </div>

      {error && (
        <div className="sau-error-banner">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stats */}
      <div className="sau-stats-row">
        <div className="sau-stat">
          <GraduationCap size={18} />
          <div>
            <div className="sau-stat-val">{loading ? '—' : studentCount}</div>
            <div className="sau-stat-lbl">Students</div>
          </div>
        </div>
        <div className="sau-stat">
          <User size={18} />
          <div>
            <div className="sau-stat-val">{loading ? '—' : instructorCount}</div>
            <div className="sau-stat-lbl">Instructors</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sau-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`sau-filter-btn ${filter === f ? 'sau-filter-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="sau-table-wrap">
        {loading ? (
          <div className="sau-loading">
            <Loader size={28} className="sau-spin" />
            <p>Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="sau-empty">
            <Users size={32} />
            <p>No users found.</p>
          </div>
        ) : (
          <table className="sau-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => {
                const statusInfo = STATUS_STYLE[user.status] || STATUS_STYLE.unverified;
                return (
                  <tr key={user.id}>
                    <td className="sau-name-cell">{user.fullname}</td>
                    <td>{user.email_address}</td>
                    <td>
                      <span className={`sau-role-badge sau-role-${user.role}`}>
                        {user.role === 'student' ? 'Student' : 'Instructor'}
                      </span>
                    </td>
                    <td>
                      <span className={`sau-status-badge ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="sau-date-cell">
                      {new Date(user.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <div className="sau-actions">
                        <button
                          className={`sau-action-btn ${user.status === 'active' ? 'sau-btn-disable' : 'sau-btn-enable'}`}
                          onClick={() => handleToggleStatus(user)}
                          disabled={actionLoadingId === user.id}
                        >
                          {actionLoadingId === user.id ? <Loader size={13} className="sau-spin" /> : (user.status === 'active' ? <XCircle size={13} /> : <CheckCircle size={13} />)}
                          {user.status === 'active' ? 'Disable' : 'Activate'}
                        </button>
                        <button
                          className="sau-action-btn sau-btn-delete"
                          onClick={() => handleDelete(user)}
                          disabled={actionLoadingId === user.id}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}