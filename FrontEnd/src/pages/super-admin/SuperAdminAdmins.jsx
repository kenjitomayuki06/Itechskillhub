import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ShieldCheck, Plus, X, Loader, AlertCircle,
  CheckCircle, XCircle, Trash2, UserPlus
} from 'lucide-react';
import { apiFetch } from '../../services/authService';
import '../../styles/admin/SuperAdminAdmins.css';

export default function SuperAdminAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'admin' });
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/api/super-admin/admins');
      setAdmins(res?.admins ?? []);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setError('Hindi ma-load ang listahan ng admins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.password) {
      toast.error('Punan lahat ng required fields.');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Dapat 8+ characters ang password.');
      return;
    }
    setCreating(true);
    try {
      await apiFetch('/api/super-admin/admins', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      toast.success('Admin account created!');
      setShowCreateModal(false);
      setForm({ fullName: '', email: '', password: '', role: 'admin' });
      fetchAdmins();
    } catch (err) {
      console.error('Failed to create admin:', err);
      toast.error(err.message || 'Hindi nagawa ang admin account.');
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleStatus(admin) {
    setActionLoadingId(admin.id);
    try {
      const nextActive = !admin.is_active;
      await apiFetch(`/api/super-admin/admins/${admin.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: nextActive }),
      });
      setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, is_active: nextActive ? 1 : 0 } : a));
      toast.success(nextActive ? 'Admin enabled.' : 'Admin disabled.');
    } catch (err) {
      console.error('Failed to toggle admin status:', err);
      toast.error('Hindi na-update ang status.');
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleDelete(admin) {
    if (admin.role === 'super_admin') {
      toast.error('Hindi pwedeng burahin ang Super Admin account.');
      return;
    }
    if (!window.confirm(`Sigurado ka bang burahin ang account ni ${admin.full_name}?`)) return;

    setActionLoadingId(admin.id);
    try {
      await apiFetch(`/api/super-admin/admins/${admin.id}`, { method: 'DELETE' });
      setAdmins(prev => prev.filter(a => a.id !== admin.id));
      toast.success('Admin account deleted.');
    } catch (err) {
      console.error('Failed to delete admin:', err);
      toast.error('Hindi nabura ang account.');
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="saa-page">
      <div className="saa-header">
        <div>
          <h1 className="saa-title">
            <ShieldCheck size={24} /> Manage Admins
          </h1>
          <p className="saa-subtitle">Create and manage admin accounts for the platform</p>
        </div>
        <button className="saa-create-btn" onClick={() => setShowCreateModal(true)}>
          <UserPlus size={16} /> New Admin
        </button>
      </div>

      {error && (
        <div className="saa-error-banner">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="saa-table-wrap">
        {loading ? (
          <div className="saa-loading">
            <Loader size={28} className="saa-spin" />
            <p>Loading admins...</p>
          </div>
        ) : admins.length === 0 ? (
          <div className="saa-empty">
            <ShieldCheck size={32} />
            <p>No admin accounts yet.</p>
          </div>
        ) : (
          <table className="saa-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="saa-name-cell">{admin.full_name}</td>
                  <td>{admin.email}</td>
                  <td>
                    <span className={`saa-role-badge ${admin.role === 'super_admin' ? 'saa-role-super' : 'saa-role-admin'}`}>
                      {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td>
                    <span className={`saa-status-badge ${admin.is_active ? 'saa-status-active' : 'saa-status-inactive'}`}>
                      {admin.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {admin.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="saa-date-cell">
                    {new Date(admin.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <div className="saa-actions">
                      {admin.role !== 'super_admin' && (
                        <>
                          <button
                            className={`saa-action-btn ${admin.is_active ? 'saa-btn-disable' : 'saa-btn-enable'}`}
                            onClick={() => handleToggleStatus(admin)}
                            disabled={actionLoadingId === admin.id}
                          >
                            {actionLoadingId === admin.id ? <Loader size={13} className="saa-spin" /> : (admin.is_active ? <XCircle size={13} /> : <CheckCircle size={13} />)}
                            {admin.is_active ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            className="saa-action-btn saa-btn-delete"
                            onClick={() => handleDelete(admin)}
                            disabled={actionLoadingId === admin.id}
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                      {admin.role === 'super_admin' && (
                        <span className="saa-protected-label">Protected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="saa-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="saa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="saa-modal-header">
              <h3><Plus size={18} /> New Admin Account</h3>
              <button className="saa-modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="saa-modal-form">
              <div className="saa-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Juan Dela Cruz"
                  required
                />
              </div>
              <div className="saa-form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@itechskillshub.me"
                  required
                />
              </div>
              <div className="saa-form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div className="saa-form-group">
                <label>Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
              <div className="saa-modal-actions">
                <button type="button" className="saa-modal-cancel" onClick={() => setShowCreateModal(false)} disabled={creating}>
                  Cancel
                </button>
                <button type="submit" className="saa-modal-submit" disabled={creating}>
                  {creating ? <Loader size={14} className="saa-spin" /> : <Plus size={14} />}
                  {creating ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}