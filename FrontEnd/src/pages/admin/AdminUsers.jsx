import { useState } from 'react';
import { UserPlus, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { mockUsers } from '../../data/mockStats';
import { apiFetch } from '../../services/authService';
import toast from 'react-hot-toast';
import '../../styles/admin/AdminUsers.css';

export default function AdminUsers() {
  const [selectedTab, setSelectedTab]     = useState('students');
  const [users, setUsers]                 = useState(mockUsers);

  /* ── View modal ── */
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser]   = useState(null);

  /* ── Edit modal ── */
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm]           = useState({ name: '', email: '', status: 'active' });
  const [editSaving, setEditSaving]       = useState(false);

  /* ── Delete confirm modal ── */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget]       = useState(null);
  const [deleteLoading, setDeleteLoading]     = useState(false);

  const students    = users.filter(u => u.role === 'student');
  const instructors = users.filter(u => u.role === 'instructor');

  /* ─── Handlers ─── */
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, status: user.status });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    setEditSaving(true);
    try {
      await apiFetch(`/api/auth/updateAccount/${selectedUser.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          fullname:      editForm.name,
          email_address: editForm.email,
        }),
      });
      setUsers(prev =>
        prev.map(u =>
          u.id === selectedUser.id
            ? { ...u, name: editForm.name, email: editForm.email, status: editForm.status }
            : u
        )
      );
      toast.success('User updated successfully!');
      setEditModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update user.');
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteTarget(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await apiFetch(`/api/auth/deleteAccount/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
      toast.success(`${deleteTarget.name} has been removed.`);
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user.');
    } finally {
      setDeleteLoading(false);
    }
  };

  /* ─── Column definitions ─── */
  const actionButtons = (row) => (
    <div className="action-buttons">
      <button
        className="btn-icon btn-view"
        onClick={() => handleViewUser(row)}
        title="View details"
      >
        <Eye size={16} />
      </button>
      <button
        className="btn-icon btn-edit"
        onClick={() => handleEditUser(row)}
        title="Edit user"
      >
        <Edit size={16} />
      </button>
      <button
        className="btn-icon btn-delete"
        onClick={() => handleDeleteClick(row)}
        title="Delete user"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  const studentColumns = [
    { header: 'Name',             accessor: (row) => row.name,                     sortable: true },
    { header: 'Email',            accessor: (row) => row.email },
    {
      header: 'Enrolled Courses',
      accessor: (row) => row.enrolledCourses.length,
      render: (row) => <span className="badge">{row.enrolledCourses.length} courses</span>,
    },
    {
      header: 'Progress',
      accessor: (row) => row.progress,
      render: (row) => (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${row.progress}%` }} />
          <span>{row.progress}%</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => row.status,
      render: (row) => (
        <span className={`status-badge status-${row.status}`}>{row.status}</span>
      ),
    },
    { header: 'Actions', accessor: () => null, sortable: false, render: actionButtons },
  ];

  const instructorColumns = [
    { header: 'Name',             accessor: (row) => row.name,                     sortable: true },
    { header: 'Email',            accessor: (row) => row.email },
    {
      header: 'Courses Teaching',
      accessor: (row) => row.coursesTeaching.length,
      render: (row) => <span className="badge">{row.coursesTeaching.length} courses</span>,
    },
    { header: 'Total Students',   accessor: (row) => row.students },
    {
      header: 'Status',
      accessor: (row) => row.status,
      render: (row) => (
        <span className={`status-badge status-${row.status}`}>{row.status}</span>
      ),
    },
    { header: 'Actions', accessor: () => null, sortable: false, render: actionButtons },
  ];

  return (
    <div className="admin-users">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>Manage students and instructors</p>
        </div>
        <button className="btn-primary">
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${selectedTab === 'students' ? 'active' : ''}`}
          onClick={() => setSelectedTab('students')}
        >
          Students ({students.length})
        </button>
        <button
          className={`tab ${selectedTab === 'instructors' ? 'active' : ''}`}
          onClick={() => setSelectedTab('instructors')}
        >
          Instructors ({instructors.length})
        </button>
      </div>

      {/* Table */}
      <div className="table-section">
        {selectedTab === 'students' ? (
          <DataTable columns={studentColumns} data={students} searchable sortable />
        ) : (
          <DataTable columns={instructorColumns} data={instructors} searchable sortable />
        )}
      </div>

      {/* ── View Modal ── */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedUser?.name}
        size="medium"
      >
        {selectedUser && (
          <div className="user-detail">
            <div className="detail-row"><strong>Email:</strong> {selectedUser.email}</div>
            <div className="detail-row"><strong>Role:</strong> {selectedUser.role}</div>
            {selectedUser.role === 'student' && (
              <>
                <div className="detail-row">
                  <strong>Enrolled Courses:</strong>
                  <ul>{selectedUser.enrolledCourses.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
                <div className="detail-row"><strong>Overall Progress:</strong> {selectedUser.progress}%</div>
              </>
            )}
            {selectedUser.role === 'instructor' && (
              <>
                <div className="detail-row">
                  <strong>Courses Teaching:</strong>
                  <ul>{selectedUser.coursesTeaching.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
                <div className="detail-row"><strong>Total Students:</strong> {selectedUser.students}</div>
              </>
            )}
            <div className="detail-row"><strong>Last Login:</strong> {selectedUser.lastLogin}</div>
            <div className="detail-row">
              <strong>Status:</strong>{' '}
              <span className={`status-badge status-${selectedUser.status}`}>{selectedUser.status}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit — ${selectedUser?.name}`}
        size="medium"
      >
        <div className="user-detail">
          <div className="detail-row">
            <label><strong>Full Name</strong></label>
            <input
              type="text"
              value={editForm.name}
              onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)', fontFamily: 'inherit', fontSize: '14px', marginTop: '4px' }}
            />
          </div>
          <div className="detail-row">
            <label><strong>Email</strong></label>
            <input
              type="email"
              value={editForm.email}
              onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)', fontFamily: 'inherit', fontSize: '14px', marginTop: '4px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setEditModalOpen(false)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)', background: 'transparent', cursor: 'pointer', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={editSaving}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#5B4A9E', color: '#fff', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={15} />
              {editSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        size="small"
      >
        <div className="user-detail">
          <p style={{ marginBottom: '16px', color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
            Are you sure you want to remove <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setDeleteModalOpen(false)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border-tertiary)', background: 'transparent', cursor: 'pointer', fontSize: '14px' }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Trash2 size={15} />
              {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}