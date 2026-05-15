import { useState } from 'react';
import { Eye, Edit, Users, Clock, BookOpen, TrendingUp, Award, Search, LayoutGrid, List, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '../../components/common/Modal';
import coursesData from '../courses/coursesData';
import '../../styles/instructor/InstructorMyCourses.css';

// Instructor-specific course data (extending base coursesData)
const instructorCourseData = [
  {
    ...coursesData[0],
    status: 'Active',
    studentsEnrolled: 35,
    completionRate: 68,
    avgScore: 82,
    submittedAssignments: 28,
    totalAssignments: 4,
    lastUpdated: 'Feb 18, 2026',
  },
  {
    ...coursesData[1],
    status: 'Active',
    studentsEnrolled: 30,
    completionRate: 75,
    avgScore: 78,
    submittedAssignments: 22,
    totalAssignments: 3,
    lastUpdated: 'Feb 15, 2026',
  },
  {
    ...coursesData[2],
    status: 'Active',
    studentsEnrolled: 22,
    completionRate: 82,
    avgScore: 88,
    submittedAssignments: 18,
    totalAssignments: 3,
    lastUpdated: 'Feb 20, 2026',
  },
  {
    ...coursesData[3],
    status: 'Active',
    studentsEnrolled: 28,
    completionRate: 71,
    avgScore: 80,
    submittedAssignments: 20,
    totalAssignments: 3,
    lastUpdated: 'Feb 19, 2026',
  },
];

export default function InstructorMyCourses() {
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtered = instructorCourseData.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = instructorCourseData.reduce((s, c) => s + c.studentsEnrolled, 0);
  const avgCompletion = Math.round(
    instructorCourseData.reduce((s, c) => s + c.completionRate, 0) / instructorCourseData.length
  );

  const handleView = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div className="instructor-courses">

      {/* Header */}
      <div className="ic-header">
        <div className="ic-header-text">
          <h1>My Courses</h1>
          <p>Manage and monitor your assigned courses</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="ic-stats-row">
        <div className="ic-stat-box">
          <div className="ic-stat-icon purple"><BookOpen size={22} /></div>
          <div className="ic-stat-info">
            <span className="ic-stat-label">Total Courses</span>
            <span className="ic-stat-value">{instructorCourseData.length}</span>
          </div>
        </div>
        <div className="ic-stat-box">
          <div className="ic-stat-icon blue"><Users size={22} /></div>
          <div className="ic-stat-info">
            <span className="ic-stat-label">Total Students</span>
            <span className="ic-stat-value">{totalStudents}</span>
          </div>
        </div>
        <div className="ic-stat-box">
          <div className="ic-stat-icon green"><TrendingUp size={22} /></div>
          <div className="ic-stat-info">
            <span className="ic-stat-label">Avg Completion</span>
            <span className="ic-stat-value">{avgCompletion}%</span>
          </div>
        </div>
        <div className="ic-stat-box">
          <div className="ic-stat-icon orange"><Award size={22} /></div>
          <div className="ic-stat-info">
            <span className="ic-stat-label">Active Courses</span>
            <span className="ic-stat-value">{instructorCourseData.filter(c => c.status === 'Active').length}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="ic-controls">
        <div className="ic-search-wrapper">
          <Search size={18} className="ic-search-icon" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ic-search-input"
          />
        </div>
        <div className="ic-view-toggle">
          <button
            className={`ic-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            className={`ic-view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Course Cards */}
      <div className={`ic-courses-container ${viewMode}`}>
        {filtered.map((course, index) => (
          <div
            key={course.id}
            className="ic-course-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image */}
            <div className="ic-card-image-wrapper">
              <img src={course.image} alt={course.title} className="ic-card-image" />
              <div className="ic-card-overlay">
                <button className="ic-quick-view-btn" onClick={() => handleView(course)}>
                  <Eye size={16} /> Quick View
                </button>
              </div>
              <span className={`ic-status-badge ${course.status.toLowerCase()}`}>
                {course.status === 'Active' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                {course.status}
              </span>
              {course.badge && (
                <span className="ic-course-badge">{course.badge}</span>
              )}
            </div>

            {/* Body */}
            <div className="ic-card-body">
              <div className="ic-card-top">
                <span className="ic-course-level">{course.level}</span>
                <span className="ic-last-updated">Updated {course.lastUpdated}</span>
              </div>

              <h3 className="ic-card-title">{course.title}</h3>
              <p className="ic-card-desc">{course.description}</p>

              {/* Meta */}
              <div className="ic-card-meta">
                <div className="ic-meta-item">
                  <Users size={15} />
                  <span>{course.studentsEnrolled} students</span>
                </div>
                <div className="ic-meta-item">
                  <Clock size={15} />
                  <span>{course.hours}</span>
                </div>
                <div className="ic-meta-item">
                  <BookOpen size={15} />
                  <span>{course.lessons}</span>
                </div>
              </div>

              {/* Completion Progress */}
              <div className="ic-progress-section">
                <div className="ic-progress-label">
                  <span>Completion Rate</span>
                  <span className="ic-progress-value">{course.completionRate}%</span>
                </div>
                <div className="ic-progress-bar">
                  <div
                    className="ic-progress-fill"
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Avg Score */}
              <div className="ic-progress-section">
                <div className="ic-progress-label">
                  <span>Avg. Score</span>
                  <span className="ic-progress-value">{course.avgScore}%</span>
                </div>
                <div className="ic-progress-bar">
                  <div
                    className="ic-progress-fill score"
                    style={{ width: `${course.avgScore}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="ic-card-footer">
                <div className="ic-assignments-info">
                  <span>{course.submittedAssignments}/{course.totalAssignments * course.studentsEnrolled} submissions</span>
                </div>
                <div className="ic-card-actions">
                  <button className="ic-action-btn view" onClick={() => handleView(course)} title="View">
                    <Eye size={15} />
                  </button>
                  <button className="ic-action-btn edit" title="Edit">
                    <Edit size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="ic-empty-state">
            <BookOpen size={48} />
            <h3>No courses found</h3>
            <p>Try adjusting your search.</p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCourse?.title}
        size="large"
      >
        {selectedCourse && (
          <div className="ic-modal-content">
            <div className="ic-modal-hero">
              <img src={selectedCourse.image} alt={selectedCourse.title} />
              <div className="ic-modal-hero-overlay">
                <span className="ic-modal-level">{selectedCourse.level}</span>
                <span className={`ic-modal-status ${selectedCourse.status.toLowerCase()}`}>
                  {selectedCourse.status}
                </span>
              </div>
            </div>

            <div className="ic-modal-grid">
              <div className="ic-modal-main">
                <div className="ic-modal-section">
                  <h4>About This Course</h4>
                  <p>{selectedCourse.description}</p>
                </div>

                <div className="ic-modal-section">
                  <h4>Course Structure</h4>
                  <div className="ic-structure-grid">
                    <div className="ic-structure-item">
                      <BookOpen size={20} />
                      <div>
                        <strong>{selectedCourse.modules}</strong>
                        <span>Modules</span>
                      </div>
                    </div>
                    <div className="ic-structure-item">
                      <Clock size={20} />
                      <div>
                        <strong>{selectedCourse.hours}</strong>
                        <span>Duration</span>
                      </div>
                    </div>
                    <div className="ic-structure-item">
                      <Users size={20} />
                      <div>
                        <strong>{selectedCourse.studentsEnrolled}</strong>
                        <span>Students</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ic-modal-section">
                  <h4>Performance</h4>
                  <div className="ic-modal-progress-list">
                    <div className="ic-progress-section">
                      <div className="ic-progress-label">
                        <span>Completion Rate</span>
                        <span className="ic-progress-value">{selectedCourse.completionRate}%</span>
                      </div>
                      <div className="ic-progress-bar">
                        <div className="ic-progress-fill" style={{ width: `${selectedCourse.completionRate}%` }} />
                      </div>
                    </div>
                    <div className="ic-progress-section">
                      <div className="ic-progress-label">
                        <span>Average Score</span>
                        <span className="ic-progress-value">{selectedCourse.avgScore}%</span>
                      </div>
                      <div className="ic-progress-bar">
                        <div className="ic-progress-fill score" style={{ width: `${selectedCourse.avgScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ic-modal-sidebar">
                <div className="ic-sidebar-card">
                  <h4>Course Info</h4>
                  <div className="ic-info-list">
                    <div className="ic-info-item">
                      <span>Students</span>
                      <strong>{selectedCourse.studentsEnrolled}</strong>
                    </div>
                    <div className="ic-info-item">
                      <span>Assignments</span>
                      <strong>{selectedCourse.totalAssignments}</strong>
                    </div>
                    <div className="ic-info-item">
                      <span>Submissions</span>
                      <strong>{selectedCourse.submittedAssignments}</strong>
                    </div>
                    <div className="ic-info-item">
                      <span>Last Updated</span>
                      <strong>{selectedCourse.lastUpdated}</strong>
                    </div>
                    <div className="ic-info-item">
                      <span>Status</span>
                      <strong className="ic-info-status active">{selectedCourse.status}</strong>
                    </div>
                  </div>
                </div>

                <div className="ic-modal-actions">
                  <button className="ic-btn-primary">
                    <Edit size={16} /> Edit Course
                  </button>
                  <button className="ic-btn-secondary">
                    <Users size={16} /> View Students
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}