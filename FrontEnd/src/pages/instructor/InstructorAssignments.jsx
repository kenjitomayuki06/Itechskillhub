  import { useState, useEffect } from 'react';
  import {
    Plus, Clock, CheckCircle, Eye, Download,
    Filter, BookOpen, X, AlertCircle
  } from 'lucide-react';
  import DataTable from '../../components/common/DataTable';
  import Modal from '../../components/common/Modal';
  import { getToken, getUser } from '../../services/authService';
  import '../../styles/instructor/InstructorAssignments.css';

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  export default function InstructorAssignments() {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [scoreInput, setScoreInput] = useState('');
    const [feedbackInput, setFeedbackInput] = useState('');
    const [newAssignment, setNewAssignment] = useState({
      title: '', course: '', dueDate: '', description: '',
    });

    // ─── API State ───
    const [assignments, setAssignments] = useState([]);
    const [recentSubmissions, setRecentSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const myCourses = [
    { id: 5, name: 'Computer Systems Servicing NC II - Hardware' },
    { id: 6, name: 'OS Installation' },
    { id: 7, name: 'Network Configuration' },
    { id: 8, name: 'Preventive Maintenance' }
  ];

    // ─── Fetch assignments from backend on mount ───
    useEffect(() => {
      fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        const res = await fetch(`${BASE_URL}/api/assignments`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch assignments.');
        // Support both array response and { assignments: [...] } shape
        const list = Array.isArray(data) ? data : (data.assignments ?? []);
        setAssignments(list);
      } catch (err) {
        console.error('fetchAssignments error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    /* ─── Handlers ─── */
    const handleViewSubmission = (submission) => {
      setSelectedSubmission(submission);
      setScoreInput(submission.score ?? '');
      setFeedbackInput(submission.feedback ?? '');
      setIsModalOpen(true);
    };

    const handleSubmitGrade = () => {
      if (!scoreInput || scoreInput < 0 || scoreInput > 100) return;
      setRecentSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedSubmission.id
            ? { ...s, status: 'graded', score: Number(scoreInput), feedback: feedbackInput }
            : s
        )
      );
      setIsModalOpen(false);
    };

    const handleCreateAssignment = async () => {
      if (!newAssignment.title || !newAssignment.course || !newAssignment.dueDate) return;
      try {
        const token = getToken();
        const user = getUser();
        const res = await fetch(`${BASE_URL}/api/assignments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            assignment: newAssignment.title,
            module_id: newAssignment.course,
            user_id: user?.id ?? user?.user_id,
            dueDate: newAssignment.dueDate,
            description: newAssignment.description,
            role: 'instructor'
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create assignment.');

        // ✅ Re-fetch so new assignment appears in the list immediately
        await fetchAssignments();
        setNewAssignment({ title: '', course: '', dueDate: '', description: '' });
        setIsCreateModalOpen(false);
      } catch (err) {
        console.error('handleCreateAssignment error:', err);
        alert('Error creating assignment: ' + err.message);
      }
    };

    /* ─── Computed ─── */
    const filteredAssignments =
      selectedFilter === 'all'
        ? assignments
        : assignments.filter((a) => a.status === selectedFilter);

    const totalPending    = assignments.reduce((s, a) => s + (a.pending ?? 0), 0);
    const totalGraded     = assignments.reduce((s, a) => s + (a.graded ?? 0), 0);
    const totalSubs       = assignments.reduce((s, a) => s + (a.submissions ?? 0), 0);
    const totalMax        = assignments.reduce((s, a) => s + (a.totalStudents ?? 0), 0);
    const avgCompletion   = totalMax ? Math.round((totalSubs / totalMax) * 100) : 0;

    /* ─── Table columns ─── */
    const assignmentColumns = [
      {
        header: 'Assignment Title',
        accessor: (row) => row.title ?? row.assignment,
        sortable: true,
        render: (row) => (
          <div className="ia-title-cell">
            <strong>{row.title ?? row.assignment}</strong>
            <span className="ia-course-tag">
              <BookOpen size={12} /> {row.course ?? row.module_id}
            </span>
          </div>
        ),
      },
      {
        header: 'Due Date',
        accessor: (row) => row.dueDate,
        sortable: true,
        render: (row) => {
          const isOverdue = new Date(row.dueDate) < new Date() && row.status === 'active';
          return (
            <div className={`ia-due-date ${isOverdue ? 'overdue' : ''}`}>
              {isOverdue ? <AlertCircle size={15} /> : <Clock size={15} />}
              <span>{row.dueDate}</span>
            </div>
          );
        },
      },
      {
        header: 'Submissions',
        accessor: (row) => row.submissions,
        sortable: true,
        render: (row) => (
          <div className="ia-submission-progress">
            <span className="ia-sub-count">{row.submissions ?? 0}/{row.totalStudents ?? 0}</span>
            <div className="ia-mini-bar">
              <div
                className="ia-mini-fill"
                style={{ width: `${row.totalStudents ? (row.submissions / row.totalStudents) * 100 : 0}%` }}
              />
            </div>
          </div>
        ),
      },
      {
        header: 'Grading Status',
        accessor: (row) => row.graded,
        render: (row) => (
          <div className="ia-grading-status">
            <div className="ia-status-item graded">
              <CheckCircle size={14} />
              <span>{row.graded ?? 0} Graded</span>
            </div>
            <div className="ia-status-item pending">
              <Clock size={14} />
              <span>{row.pending ?? 0} Pending</span>
            </div>
          </div>
        ),
      },
      {
        header: 'Status',
        accessor: (row) => row.status,
        render: (row) => (
          <span className={`ia-badge ia-badge--${row.status ?? 'active'}`}>
            {row.status === 'closed' ? 'Closed' : 'Active'}
          </span>
        ),
      },
      {
        header: 'Actions',
        accessor: () => null,
        sortable: false,
        render: () => (
          <div className="ia-action-btns">
            <button className="ia-icon-btn ia-btn-view" title="View Details"><Eye size={15} /></button>
            <button className="ia-icon-btn ia-btn-download" title="Download Submissions"><Download size={15} /></button>
          </div>
        ),
      },
    ];

    const submissionColumns = [
      {
        header: 'Student',
        accessor: (row) => row.studentName,
        sortable: true,
        render: (row) => (
          <div className="ia-student-cell">
            <div className="ia-avatar">{row.studentName?.charAt(0)}</div>
            <span>{row.studentName}</span>
          </div>
        ),
      },
      {
        header: 'Assignment',
        accessor: (row) => row.assignment,
        render: (row) => (
          <div className="ia-title-cell">
            <span>{row.assignment}</span>
            <span className="ia-course-tag"><BookOpen size={12} /> {row.course}</span>
          </div>
        ),
      },
      {
        header: 'Submitted At',
        accessor: (row) => row.submittedAt,
        sortable: true,
        render: (row) => <span className="ia-submitted-at">{row.submittedAt}</span>,
      },
      {
        header: 'Status',
        accessor: (row) => row.status,
        render: (row) => (
          <span className={`ia-sub-status ia-sub-status--${row.status}`}>
            {row.status === 'graded' ? <><CheckCircle size={13} /> Graded</> : <><Clock size={13} /> Pending</>}
          </span>
        ),
      },
      {
        header: 'Score',
        accessor: (row) => row.score,
        render: (row) => (
          <span className={`ia-score-badge ${row.score !== null ? (row.score >= 75 ? 'pass' : 'fail') : ''}`}>
            {row.score !== null ? `${row.score}%` : '—'}
          </span>
        ),
      },
      {
        header: 'Actions',
        accessor: () => null,
        sortable: false,
        render: (row) => (
          <button
            className={`ia-btn-grade ${row.status === 'pending' ? 'urgent' : 'view'}`}
            onClick={() => handleViewSubmission(row)}
          >
            {row.status === 'pending' ? 'Grade Now' : 'View Grade'}
          </button>
        ),
      },
    ];

    /* ─── Render ─── */
    return (
      <div className="instructor-assignments">

        {/* Header */}
        <div className="ia-header">
          <div className="ia-header-text">
            <h1>Assignments</h1>
            <p>Manage and grade assignments for your courses</p>
          </div>
          <button className="ia-btn-primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus size={18} /> Create Assignment
          </button>
        </div>

        {loading && <p className="ia-loading">Loading assignments...</p>}
        {error && <p className="ia-error">Error: {error}</p>}

        {/* Stats */}
        {!loading && (
          <div className="ia-stats-grid">
            <div className="ia-stat-card purple">
              <div className="ia-stat-icon">📝</div>
              <div className="ia-stat-content">
                <span className="ia-stat-value">{assignments.length}</span>
                <span className="ia-stat-label">Total Assignments</span>
              </div>
            </div>
            <div className="ia-stat-card orange">
              <div className="ia-stat-icon">⏳</div>
              <div className="ia-stat-content">
                <span className="ia-stat-value">{totalPending}</span>
                <span className="ia-stat-label">Pending Grading</span>
              </div>
            </div>
            <div className="ia-stat-card green">
              <div className="ia-stat-icon">✅</div>
              <div className="ia-stat-content">
                <span className="ia-stat-value">{totalGraded}</span>
                <span className="ia-stat-label">Graded</span>
              </div>
            </div>
            <div className="ia-stat-card blue">
              <div className="ia-stat-icon">📊</div>
              <div className="ia-stat-content">
                <span className="ia-stat-value">{avgCompletion}%</span>
                <span className="ia-stat-label">Avg Completion</span>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="ia-filters">
          <Filter size={16} />
          {['all', 'active', 'closed'].map((f) => (
            <button
              key={f}
              className={`ia-chip ${selectedFilter === f ? 'active' : ''}`}
              onClick={() => setSelectedFilter(f)}
            >
              {f === 'all'
                ? `All (${assignments.length})`
                : f === 'active'
                ? `Active (${assignments.filter((a) => a.status === 'active').length})`
                : `Closed (${assignments.filter((a) => a.status === 'closed').length})`}
            </button>
          ))}
        </div>

        {/* Assignments Table */}
        {!loading && (
          <div className="ia-section">
            <h3 className="ia-section-title">My Assignments</h3>
            <DataTable columns={assignmentColumns} data={filteredAssignments} searchable sortable />
          </div>
        )}

        {/* Recent Submissions Table */}
        <div className="ia-section">
          <h3 className="ia-section-title">Recent Submissions</h3>
          <DataTable columns={submissionColumns} data={recentSubmissions} searchable sortable itemsPerPage={5} />
        </div>

        {/* ── Grade / View Modal ── */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
          title={selectedSubmission?.status === 'pending' ? 'Grade Submission' : 'View Grade'} size="medium">
          {selectedSubmission && (
            <div className="ia-grade-modal">
              <div className="ia-modal-info">
                <div className="ia-info-row"><strong>Student</strong><span>{selectedSubmission.studentName}</span></div>
                <div className="ia-info-row"><strong>Assignment</strong><span>{selectedSubmission.assignment}</span></div>
                <div className="ia-info-row"><strong>Course</strong><span>{selectedSubmission.course}</span></div>
                <div className="ia-info-row"><strong>Submitted</strong><span>{selectedSubmission.submittedAt}</span></div>
              </div>
              {selectedSubmission.status === 'pending' ? (
                <div className="ia-grading-form">
                  <div className="ia-form-group">
                    <label>Score <span className="ia-required">*</span></label>
                    <div className="ia-score-input-wrap">
                      <input type="number" min="0" max="100" placeholder="0 – 100"
                        value={scoreInput} onChange={(e) => setScoreInput(e.target.value)} />
                      <span className="ia-score-unit">%</span>
                    </div>
                  </div>
                  <div className="ia-form-group">
                    <label>Feedback</label>
                    <textarea rows="4" placeholder="Write feedback for the student…"
                      value={feedbackInput} onChange={(e) => setFeedbackInput(e.target.value)} />
                  </div>
                  <button className="ia-btn-submit-grade" onClick={handleSubmitGrade}>
                    <CheckCircle size={16} /> Submit Grade
                  </button>
                </div>
              ) : (
                <div className="ia-grade-display">
                  <div className={`ia-score-circle ${selectedSubmission.score >= 75 ? 'pass' : 'fail'}`}>
                    <span className="ia-score-number">{selectedSubmission.score}%</span>
                    <span className="ia-score-sub">Final Score</span>
                  </div>
                  {selectedSubmission.feedback && (
                    <div className="ia-feedback-box">
                      <strong>Feedback</strong>
                      <p>{selectedSubmission.feedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* ── Create Assignment Modal ── */}
        <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}
          title="Create New Assignment" size="medium">
          <div className="ia-create-form">
            <div className="ia-form-group">
              <label>Assignment Title <span className="ia-required">*</span></label>
              <input type="text" placeholder="e.g. Network Configuration Lab"
                value={newAssignment.title}
                onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} />
            </div>
           <div className="ia-form-group">
             <label>Course <span className="ia-required">*</span></label>
              <select 
               value={newAssignment.course}
               onChange={(e) => setNewAssignment({ ...newAssignment, course: e.target.value })}
             >
              <option value="">Select a course…</option>
              {/* Map through myCourses objects instead of just strings */}
              {myCourses.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option> 
               ))}
             </select>
           </div>
            <div className="ia-form-group">
              <label>Due Date <span className="ia-required">*</span></label>
              <input type="date" value={newAssignment.dueDate}
                onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
            </div>
            <div className="ia-form-group">
              <label>Description</label>
              <textarea rows="3" placeholder="Describe the assignment requirements…"
                value={newAssignment.description}
                onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })} />
            </div>
            <div className="ia-create-actions">
              <button className="ia-btn-cancel" onClick={() => setIsCreateModalOpen(false)}>
                <X size={15} /> Cancel
              </button>
              <button className="ia-btn-primary" onClick={handleCreateAssignment}>
                <Plus size={15} /> Create Assignment
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
