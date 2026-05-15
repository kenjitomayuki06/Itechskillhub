import { useState, useMemo } from 'react';
import {
  Users, BookOpen, TrendingUp, Award,
  Eye, MessageSquare, AlertCircle, CheckCircle,
  Clock, Star, Filter, Download, Search,
  ChevronDown, GraduationCap, Activity
} from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import '../../styles/instructor/InstructorStudents.css';

/* ─── Mock student data ─────────────────────────────── */
const mockStudents = [
  { id: 1,  name: 'Juan Dela Cruz',      email: 'juan@mail.com',    avatar: 'JD', course: 'CSS NC II',       progress: 45, score: 72, status: 'active',   submissions: 2, totalAssignments: 4, lastActive: 'Today',       grade: 'C+' },
  { id: 2,  name: 'Maria Santos',        email: 'maria@mail.com',   avatar: 'MS', course: 'PC Hardware',     progress: 80, score: 88, status: 'active',   submissions: 3, totalAssignments: 3, lastActive: 'Today',       grade: 'A-' },
  { id: 3,  name: 'Jose Reyes',          email: 'jose@mail.com',    avatar: 'JR', course: 'CSS NC II',       progress: 62, score: 76, status: 'active',   submissions: 3, totalAssignments: 4, lastActive: 'Yesterday',   grade: 'B' },
  { id: 4,  name: 'Ana Garcia',          email: 'ana@mail.com',     avatar: 'AG', course: 'Network Setup',   progress: 91, score: 95, status: 'active',   submissions: 3, totalAssignments: 3, lastActive: 'Today',       grade: 'A+' },
  { id: 5,  name: 'Pedro Lim',           email: 'pedro@mail.com',   avatar: 'PL', course: 'OS Installation', progress: 30, score: 58, status: 'at-risk',  submissions: 1, totalAssignments: 3, lastActive: '5 days ago',  grade: 'D+' },
  { id: 6,  name: 'Rosa Cruz',           email: 'rosa@mail.com',    avatar: 'RC', course: 'PC Hardware',     progress: 74, score: 82, status: 'active',   submissions: 2, totalAssignments: 3, lastActive: '2 days ago',  grade: 'B+' },
  { id: 7,  name: 'Carlo Mendoza',       email: 'carlo@mail.com',   avatar: 'CM', course: 'CSS NC II',       progress: 18, score: 45, status: 'at-risk',  submissions: 0, totalAssignments: 4, lastActive: '1 week ago',  grade: 'F' },
  { id: 8,  name: 'Liza Aquino',         email: 'liza@mail.com',    avatar: 'LA', course: 'Network Setup',   progress: 85, score: 91, status: 'active',   submissions: 3, totalAssignments: 3, lastActive: 'Today',       grade: 'A' },
  { id: 9,  name: 'Ramon Torres',        email: 'ramon@mail.com',   avatar: 'RT', course: 'OS Installation', progress: 55, score: 70, status: 'active',   submissions: 2, totalAssignments: 3, lastActive: '3 days ago',  grade: 'C+' },
  { id: 10, name: 'Elena Villanueva',    email: 'elena@mail.com',   avatar: 'EV', course: 'CSS NC II',       progress: 97, score: 98, status: 'completed', submissions: 4, totalAssignments: 4, lastActive: 'Today',       grade: 'A+' },
  { id: 11, name: 'Marco Bautista',      email: 'marco@mail.com',   avatar: 'MB', course: 'PC Hardware',     progress: 66, score: 74, status: 'active',   submissions: 2, totalAssignments: 3, lastActive: 'Yesterday',   grade: 'B-' },
  { id: 12, name: 'Sofia Hernandez',     email: 'sofia@mail.com',   avatar: 'SH', course: 'Network Setup',   progress: 42, score: 65, status: 'active',   submissions: 2, totalAssignments: 3, lastActive: '4 days ago',  grade: 'C' },
];

const courses = ['All Courses', 'CSS NC II', 'PC Hardware', 'Network Setup', 'OS Installation'];
const statuses = ['All Status', 'active', 'at-risk', 'completed'];

const gradeColor = (grade) => {
  if (grade.startsWith('A')) return 'grade-a';
  if (grade.startsWith('B')) return 'grade-b';
  if (grade.startsWith('C')) return 'grade-c';
  if (grade.startsWith('D')) return 'grade-d';
  return 'grade-f';
};

const avatarColors = [
  '#5B4A9E','#2980b9','#27ae60','#e67e22','#e74c3c',
  '#8e44ad','#16a085','#d35400','#2c3e50','#c0392b',
];

export default function InstructorStudents() {
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen]         = useState(false);

  /* ─── Filtered data ── */
  const filtered = useMemo(() => {
    return mockStudents.filter(s => {
      const matchCourse = selectedCourse === 'All Courses' || s.course === selectedCourse;
      const matchStatus = selectedStatus === 'All Status'  || s.status === selectedStatus;
      return matchCourse && matchStatus;
    });
  }, [selectedCourse, selectedStatus]);

  /* ─── Summary stats ── */
  const totalStudents   = mockStudents.length;
  const activeStudents  = mockStudents.filter(s => s.status === 'active').length;
  const atRiskStudents  = mockStudents.filter(s => s.status === 'at-risk').length;
  const avgProgress     = Math.round(mockStudents.reduce((a, s) => a + s.progress, 0) / totalStudents);

  /* ─── Table columns ── */
  const columns = [
    {
      header: 'Student',
      accessor: (row) => row.name,
      sortable: true,
      render: (row) => (
        <div className="is-student-cell">
          <div
            className="is-avatar"
            style={{ background: avatarColors[row.id % avatarColors.length] }}
          >
            {row.avatar}
          </div>
          <div className="is-student-info">
            <span className="is-student-name">{row.name}</span>
            <span className="is-student-email">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Course',
      accessor: (row) => row.course,
      sortable: true,
      render: (row) => (
        <span className="is-course-tag">
          <BookOpen size={13} />
          {row.course}
        </span>
      ),
    },
    {
      header: 'Progress',
      accessor: (row) => row.progress,
      sortable: true,
      render: (row) => (
        <div className="is-progress-cell">
          <div className="is-mini-bar">
            <div
              className={`is-mini-fill ${row.status === 'at-risk' ? 'risk' : row.status === 'completed' ? 'done' : ''}`}
              style={{ width: `${row.progress}%` }}
            />
          </div>
          <span className="is-progress-pct">{row.progress}%</span>
        </div>
      ),
    },
    {
      header: 'Avg Score',
      accessor: (row) => row.score,
      sortable: true,
      render: (row) => (
        <span className={`is-grade-badge ${gradeColor(row.grade)}`}>
          {row.grade} <small>({row.score}%)</small>
        </span>
      ),
    },
    {
      header: 'Submissions',
      accessor: (row) => row.submissions,
      sortable: true,
      render: (row) => (
        <span className={`is-submission-tag ${row.submissions < row.totalAssignments ? 'incomplete' : 'complete'}`}>
          {row.submissions}/{row.totalAssignments}
        </span>
      ),
    },
    {
      header: 'Last Active',
      accessor: (row) => row.lastActive,
      render: (row) => (
        <span className="is-last-active">
          <Clock size={13} />
          {row.lastActive}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (row) => row.status,
      sortable: true,
      render: (row) => (
        <span className={`is-status-badge is-status-${row.status}`}>
          {row.status === 'active'    && <CheckCircle size={12} />}
          {row.status === 'at-risk'   && <AlertCircle size={12} />}
          {row.status === 'completed' && <Star size={12} />}
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: () => null,
      sortable: false,
      render: (row) => (
        <div className="action-buttons">
          <button
            className="btn-icon btn-view"
            title="View Student"
            onClick={() => { setSelectedStudent(row); setIsModalOpen(true); }}
          >
            <Eye size={15} />
          </button>
          <button className="btn-icon btn-edit" title="Message Student">
            <MessageSquare size={15} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="instructor-students">

      {/* ── Header ── */}
      <div className="is-header">
        <div className="is-header-text">
          <h1>My Students</h1>
          <p>Monitor student progress and performance across your courses</p>
        </div>
        <button className="is-export-btn">
          <Download size={16} />
          Export
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="is-stats-row">
        <div className="is-stat-box">
          <div className="is-stat-icon purple"><Users size={22} /></div>
          <div className="is-stat-info">
            <span className="is-stat-label">Total Students</span>
            <span className="is-stat-value">{totalStudents}</span>
          </div>
        </div>
        <div className="is-stat-box">
          <div className="is-stat-icon green"><Activity size={22} /></div>
          <div className="is-stat-info">
            <span className="is-stat-label">Active</span>
            <span className="is-stat-value">{activeStudents}</span>
          </div>
        </div>
        <div className="is-stat-box">
          <div className="is-stat-icon red"><AlertCircle size={22} /></div>
          <div className="is-stat-info">
            <span className="is-stat-label">At Risk</span>
            <span className="is-stat-value">{atRiskStudents}</span>
          </div>
        </div>
        <div className="is-stat-box">
          <div className="is-stat-icon blue"><TrendingUp size={22} /></div>
          <div className="is-stat-info">
            <span className="is-stat-label">Avg Progress</span>
            <span className="is-stat-value">{avgProgress}%</span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="is-filters">
        <div className="is-filter-group">
          <Filter size={16} className="is-filter-icon" />
          <div className="is-select-wrapper">
            <select
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="is-select"
            >
              {courses.map(c => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={15} className="is-select-arrow" />
          </div>
          <div className="is-select-wrapper">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="is-select"
            >
              {statuses.map(s => <option key={s} value={s}>{s === 'All Status' ? s : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <ChevronDown size={15} className="is-select-arrow" />
          </div>
        </div>
        <span className="is-result-count">{filtered.length} student{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* ── Table ── */}
      <div className="is-table-section">
        <DataTable
          columns={columns}
          data={filtered}
          searchable={true}
          sortable={true}
          itemsPerPage={8}
        />
      </div>

      {/* ── Student Detail Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStudent?.name}
        size="medium"
      >
        {selectedStudent && (
          <div className="is-modal-body">

            {/* Profile header */}
            <div className="is-modal-profile">
              <div
                className="is-modal-avatar"
                style={{ background: avatarColors[selectedStudent.id % avatarColors.length] }}
              >
                {selectedStudent.avatar}
              </div>
              <div className="is-modal-profile-info">
                <h3>{selectedStudent.name}</h3>
                <p>{selectedStudent.email}</p>
                <span className={`is-status-badge is-status-${selectedStudent.status}`}>
                  {selectedStudent.status === 'active'    && <CheckCircle size={12} />}
                  {selectedStudent.status === 'at-risk'   && <AlertCircle size={12} />}
                  {selectedStudent.status === 'completed' && <Star size={12} />}
                  {selectedStudent.status}
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="is-modal-stats">
              <div className="is-modal-stat">
                <GraduationCap size={20} />
                <span className="is-modal-stat-val">{selectedStudent.grade}</span>
                <span className="is-modal-stat-lbl">Grade</span>
              </div>
              <div className="is-modal-stat">
                <TrendingUp size={20} />
                <span className="is-modal-stat-val">{selectedStudent.progress}%</span>
                <span className="is-modal-stat-lbl">Progress</span>
              </div>
              <div className="is-modal-stat">
                <Star size={20} />
                <span className="is-modal-stat-val">{selectedStudent.score}%</span>
                <span className="is-modal-stat-lbl">Avg Score</span>
              </div>
              <div className="is-modal-stat">
                <BookOpen size={20} />
                <span className="is-modal-stat-val">{selectedStudent.submissions}/{selectedStudent.totalAssignments}</span>
                <span className="is-modal-stat-lbl">Submitted</span>
              </div>
            </div>

            {/* Course + progress */}
            <div className="is-modal-detail-card">
              <div className="is-modal-detail-row">
                <span className="is-modal-detail-label">Enrolled Course</span>
                <span className="is-course-tag"><BookOpen size={13} />{selectedStudent.course}</span>
              </div>
              <div className="is-modal-detail-row">
                <span className="is-modal-detail-label">Last Active</span>
                <span className="is-last-active"><Clock size={13} />{selectedStudent.lastActive}</span>
              </div>
              <div className="is-modal-detail-row">
                <span className="is-modal-detail-label">Course Progress</span>
                <span className="is-progress-pct">{selectedStudent.progress}%</span>
              </div>
              <div className="is-modal-bar-wrapper">
                <div className="is-mini-bar large">
                  <div
                    className={`is-mini-fill ${selectedStudent.status === 'at-risk' ? 'risk' : selectedStudent.status === 'completed' ? 'done' : ''}`}
                    style={{ width: `${selectedStudent.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* At-risk warning */}
            {selectedStudent.status === 'at-risk' && (
              <div className="is-modal-warning">
                <AlertCircle size={18} />
                <div>
                  <strong>Student needs attention</strong>
                  <p>This student has low progress and/or missing submissions. Consider reaching out.</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="is-modal-actions">
              <button className="is-btn-primary">
                <MessageSquare size={16} /> Send Message
              </button>
              <button className="is-btn-secondary">
                <Activity size={16} /> View Full Report
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}