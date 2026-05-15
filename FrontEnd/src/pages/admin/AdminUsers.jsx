import { useState } from 'react';
import { UserPlus, Edit, Trash2, Eye } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { mockUsers } from '../../data/mockStats';
import '../../styles/admin/AdminUsers.css'

export default function AdminUsers() {
  const [selectedTab, setSelectedTab] = useState('students');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const students = mockUsers.filter(user => user.role === 'student');
  const instructors = mockUsers.filter(user => user.role === 'instructor');

  const studentColumns = [
    { 
      header: 'Name', 
      accessor: (row) => row.name,
      sortable: true 
    },
    { 
      header: 'Email', 
      accessor: (row) => row.email 
    },
    { 
      header: 'Enrolled Courses', 
      accessor: (row) => row.enrolledCourses.length,
      render: (row) => (
        <span className="badge">{row.enrolledCourses.length} courses</span>
      )
    },
    { 
      header: 'Progress', 
      accessor: (row) => row.progress,
      render: (row) => (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${row.progress}%` }}
          ></div>
          <span>{row.progress}%</span>
        </div>
      )
    },
    { 
      header: 'Status', 
      accessor: (row) => row.status,
      render: (row) => (
        <span className={`status-badge status-${row.status}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: () => null,
      sortable: false,
      render: (row) => (
        <div className="action-buttons">
          <button 
            className="btn-icon btn-view"
            onClick={() => handleViewUser(row)}
          >
            <Eye size={16} />
          </button>
          <button className="btn-icon btn-edit">
            <Edit size={16} />
          </button>
          <button className="btn-icon btn-delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  ];

  const instructorColumns = [
    { 
      header: 'Name', 
      accessor: (row) => row.name,
      sortable: true 
    },
    { 
      header: 'Email', 
      accessor: (row) => row.email 
    },
    { 
      header: 'Courses Teaching', 
      accessor: (row) => row.coursesTeaching.length,
      render: (row) => (
        <span className="badge">{row.coursesTeaching.length} courses</span>
      )
    },
    { 
      header: 'Total Students', 
      accessor: (row) => row.students 
    },
    { 
      header: 'Status', 
      accessor: (row) => row.status,
      render: (row) => (
        <span className={`status-badge status-${row.status}`}>
          {row.status}
        </span>
      )
    },
    { 
      header: 'Actions', 
      accessor: () => null,
      sortable: false,
      render: (row) => (
        <div className="action-buttons">
          <button 
            className="btn-icon btn-view"
            onClick={() => handleViewUser(row)}
          >
            <Eye size={16} />
          </button>
          <button className="btn-icon btn-edit">
            <Edit size={16} />
          </button>
          <button className="btn-icon btn-delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  ];

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

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
          <DataTable 
            columns={studentColumns}
            data={students}
            searchable={true}
            sortable={true}
          />
        ) : (
          <DataTable 
            columns={instructorColumns}
            data={instructors}
            searchable={true}
            sortable={true}
          />
        )}
      </div>

      {/* User Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedUser?.name}
        size="medium"
      >
        {selectedUser && (
          <div className="user-detail">
            <div className="detail-row">
              <strong>Email:</strong> {selectedUser.email}
            </div>
            <div className="detail-row">
              <strong>Role:</strong> {selectedUser.role}
            </div>
            {selectedUser.role === 'student' && (
              <>
                <div className="detail-row">
                  <strong>Enrolled Courses:</strong>
                  <ul>
                    {selectedUser.enrolledCourses.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail-row">
                  <strong>Overall Progress:</strong> {selectedUser.progress}%
                </div>
              </>
            )}
            {selectedUser.role === 'instructor' && (
              <>
                <div className="detail-row">
                  <strong>Courses Teaching:</strong>
                  <ul>
                    {selectedUser.coursesTeaching.map((course, index) => (
                      <li key={index}>{course}</li>
                    ))}
                  </ul>
                </div>
                <div className="detail-row">
                  <strong>Total Students:</strong> {selectedUser.students}
                </div>
              </>
            )}
            <div className="detail-row">
              <strong>Last Login:</strong> {selectedUser.lastLogin}
            </div>
            <div className="detail-row">
              <strong>Status:</strong> 
              <span className={`status-badge status-${selectedUser.status}`}>
                {selectedUser.status}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}