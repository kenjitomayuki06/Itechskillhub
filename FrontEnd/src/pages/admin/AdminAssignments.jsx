import { useState } from 'react';
import { Plus, Clock, CheckCircle, XCircle, Eye, Download, Filter } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import '../../styles/admin/AdminAssignments.css'

export default function AdminAssignments() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Mock assignments data
  const assignments = [
    {
      id: 1,
      title: 'Network Configuration Lab',
      course: 'Network Setup',
      dueDate: '2026-02-20',
      submissions: 45,
      totalStudents: 67,
      status: 'active',
      graded: 30,
      pending: 15,
    },
    {
      id: 2,
      title: 'PC Hardware Assembly',
      course: 'PC Hardware',
      dueDate: '2026-02-18',
      submissions: 82,
      totalStudents: 89,
      status: 'active',
      graded: 70,
      pending: 12,
    },
    {
      id: 3,
      title: 'CSS Practical Exam',
      course: 'CSS NC II',
      dueDate: '2026-02-15',
      submissions: 120,
      totalStudents: 120,
      status: 'closed',
      graded: 120,
      pending: 0,
    },
    {
      id: 4,
      title: 'OS Installation Guide',
      course: 'OS Installation',
      dueDate: '2026-02-25',
      submissions: 23,
      totalStudents: 54,
      status: 'active',
      graded: 15,
      pending: 8,
    },
  ];

  // Mock submissions data
  const recentSubmissions = [
    {
      id: 1,
      studentName: 'Juan Dela Cruz',
      assignment: 'Network Configuration Lab',
      submittedAt: '2026-02-14 14:30',
      status: 'pending',
      score: null,
    },
    {
      id: 2,
      studentName: 'Maria Santos',
      assignment: 'PC Hardware Assembly',
      submittedAt: '2026-02-14 10:15',
      status: 'graded',
      score: 95,
    },
    {
      id: 3,
      studentName: 'Pedro Reyes',
      assignment: 'CSS Practical Exam',
      submittedAt: '2026-02-13 16:45',
      status: 'graded',
      score: 88,
    },
    {
      id: 4,
      studentName: 'Ana Garcia',
      assignment: 'Network Configuration Lab',
      submittedAt: '2026-02-13 09:20',
      status: 'pending',
      score: null,
    },
  ];

  const assignmentColumns = [
    {
      header: 'Assignment Title',
      accessor: (row) => row.title,
      sortable: true,
      render: (row) => (
        <div className="assignment-title-cell">
          <strong>{row.title}</strong>
          <span className="course-tag">{row.course}</span>
        </div>
      ),
    },
    {
      header: 'Due Date',
      accessor: (row) => row.dueDate,
      sortable: true,
      render: (row) => (
        <div className="due-date-cell">
          <Clock size={16} />
          <span>{row.dueDate}</span>
        </div>
      ),
    },
    {
      header: 'Submissions',
      accessor: (row) => row.submissions,
      sortable: true,
      render: (row) => (
        <div className="submission-progress">
          <span className="submission-count">{row.submissions}/{row.totalStudents}</span>
          <div className="mini-progress-bar">
            <div 
              className="mini-progress-fill"
              style={{ width: `${(row.submissions / row.totalStudents) * 100}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      header: 'Grading Status',
      accessor: (row) => row.graded,
      render: (row) => (
        <div className="grading-status">
          <div className="status-item graded">
            <CheckCircle size={16} />
            <span>{row.graded} Graded</span>
          </div>
          <div className="status-item pending">
            <Clock size={16} />
            <span>{row.pending} Pending</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => row.status,
      render: (row) => (
        <span className={`assignment-status ${row.status}`}>
          {row.status === 'active' ? 'Active' : 'Closed'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: () => null,
      sortable: false,
      render: (row) => (
        <div className="action-buttons">
          <button className="btn-icon btn-view" title="View Details">
            <Eye size={16} />
          </button>
          <button className="btn-icon btn-download" title="Download All">
            <Download size={16} />
          </button>
        </div>
      ),
    },
  ];

  const submissionColumns = [
    {
      header: 'Student',
      accessor: (row) => row.studentName,
      sortable: true,
    },
    {
      header: 'Assignment',
      accessor: (row) => row.assignment,
    },
    {
      header: 'Submitted At',
      accessor: (row) => row.submittedAt,
      sortable: true,
    },
    {
      header: 'Status',
      accessor: (row) => row.status,
      render: (row) => (
        <span className={`submission-status ${row.status}`}>
          {row.status === 'graded' ? (
            <>
              <CheckCircle size={14} />
              Graded
            </>
          ) : (
            <>
              <Clock size={14} />
              Pending
            </>
          )}
        </span>
      ),
    },
    {
      header: 'Score',
      accessor: (row) => row.score,
      render: (row) => (
        <span className="score-badge">
          {row.score !== null ? `${row.score}%` : '-'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: () => null,
      sortable: false,
      render: (row) => (
        <button 
          className="btn-grade"
          onClick={() => handleViewSubmission(row)}
        >
          {row.status === 'pending' ? 'Grade Now' : 'View Grade'}
        </button>
      ),
    },
  ];

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const filteredAssignments = selectedFilter === 'all' 
    ? assignments 
    : assignments.filter(a => a.status === selectedFilter);

  return (
    <div className="admin-assignments">
      {/* Header */}
      <div className="page-header">
        <div className="header-text">
          <h1>Assignment Management</h1>
          <p>Track and manage all course assignments</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          Create Assignment
        </button>
      </div>

      {/* Stats Overview */}
      <div className="assignments-stats">
        <div className="stat-box purple">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <span className="stat-value">{assignments.length}</span>
            <span className="stat-label">Total Assignments</span>
          </div>
        </div>
        <div className="stat-box blue">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-value">
              {assignments.reduce((sum, a) => sum + a.pending, 0)}
            </span>
            <span className="stat-label">Pending Grading</span>
          </div>
        </div>
        <div className="stat-box green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <span className="stat-value">
              {assignments.reduce((sum, a) => sum + a.graded, 0)}
            </span>
            <span className="stat-label">Graded</span>
          </div>
        </div>
        <div className="stat-box orange">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-value">87%</span>
            <span className="stat-label">Avg Completion</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="assignments-filters">
        <div className="filter-group">
          <Filter size={18} />
          <button 
            className={`filter-chip ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            All ({assignments.length})
          </button>
          <button 
            className={`filter-chip ${selectedFilter === 'active' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('active')}
          >
            Active ({assignments.filter(a => a.status === 'active').length})
          </button>
          <button 
            className={`filter-chip ${selectedFilter === 'closed' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('closed')}
          >
            Closed ({assignments.filter(a => a.status === 'closed').length})
          </button>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="assignments-section">
        <h3 className="section-title">All Assignments</h3>
        <DataTable
          columns={assignmentColumns}
          data={filteredAssignments}
          searchable={true}
          sortable={true}
        />
      </div>

      {/* Recent Submissions */}
      <div className="submissions-section">
        <h3 className="section-title">Recent Submissions</h3>
        <DataTable
          columns={submissionColumns}
          data={recentSubmissions}
          searchable={true}
          sortable={true}
          itemsPerPage={5}
        />
      </div>

      {/* Grading Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Grade Submission"
        size="medium"
      >
        {selectedSubmission && (
          <div className="grading-modal">
            <div className="modal-info">
              <div className="info-row">
                <strong>Student:</strong>
                <span>{selectedSubmission.studentName}</span>
              </div>
              <div className="info-row">
                <strong>Assignment:</strong>
                <span>{selectedSubmission.assignment}</span>
              </div>
              <div className="info-row">
                <strong>Submitted:</strong>
                <span>{selectedSubmission.submittedAt}</span>
              </div>
            </div>

            {selectedSubmission.status === 'pending' ? (
              <div className="grading-form">
                <div className="form-group">
                  <label>Score (%)</label>
                  <input type="number" min="0" max="100" placeholder="Enter score" />
                </div>
                <div className="form-group">
                  <label>Feedback</label>
                  <textarea rows="4" placeholder="Enter feedback for student"></textarea>
                </div>
                <button className="btn-submit-grade">Submit Grade</button>
              </div>
            ) : (
              <div className="grade-display">
                <div className="score-display">
                  <span className="score-large">{selectedSubmission.score}%</span>
                  <span className="score-label">Final Score</span>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}