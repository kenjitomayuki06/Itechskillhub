import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Users, Clock, BookOpen, TrendingUp, Award } from 'lucide-react';
import Lottie from 'lottie-react';
import Modal from '../../components/common/Modal';
import coursesData from "../courses/coursesData";
import '../../styles/admin/AdminCourses.css'

export default function AdminCourses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [filterStatus, setFilterStatus] = useState('all'); // all, free, paid

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  // Lottie animation data (inline for simplicity)
  const emptyStateAnimation = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 300,
    h: 300,
    nm: "Empty",
    ddd: 0,
    assets: [],
    layers: []
  };

  return (
    <div className="admin-courses">
      {/* Header with Stats */}
      <div className="courses-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Course Management</h1>
            <p>Manage and organize all your courses</p>
          </div>
          <button className="btn-add-course">
            <Plus size={20} />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Stats Overview */}
        <div className="courses-stats">
          <div className="stat-box">
            <div className="stat-icon blue">
              <BookOpen size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Courses</span>
              <span className="stat-value">{coursesData.length}</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon green">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">
                {coursesData.reduce((sum, course) => sum + parseInt(course.students || 0), 0)}
              </span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon purple">
              <TrendingUp size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Active Courses</span>
              <span className="stat-value">{coursesData.length}</span>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon orange">
              <Award size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">Completion Rate</span>
              <span className="stat-value">73%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="courses-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Courses ({coursesData.length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'free' ? 'active' : ''}`}
            onClick={() => setFilterStatus('free')}
          >
            Free ({coursesData.filter(c => c.free).length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'paid' ? 'active' : ''}`}
            onClick={() => setFilterStatus('paid')}
          >
            Paid ({coursesData.filter(c => !c.free).length})
          </button>
        </div>

        <div className="view-toggle">
          <button 
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="2" width="7" height="7" rx="1"/>
              <rect x="11" y="2" width="7" height="7" rx="1"/>
              <rect x="2" y="11" width="7" height="7" rx="1"/>
              <rect x="11" y="11" width="7" height="7" rx="1"/>
            </svg>
          </button>
          <button 
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="3" width="16" height="3" rx="1"/>
              <rect x="2" y="8.5" width="16" height="3" rx="1"/>
              <rect x="2" y="14" width="16" height="3" rx="1"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Courses Grid/List */}
      <div className={`courses-container ${viewMode}`}>
        {coursesData.map((course, index) => (
          <div 
            key={course.id} 
            className="premium-course-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-image-wrapper">
              <img src={course.image} alt={course.title} className="card-image" />
              <div className="card-overlay">
                <button 
                  className="quick-view-btn"
                  onClick={() => handleViewCourse(course)}
                >
                  <Eye size={18} />
                  Quick View
                </button>
              </div>
              {course.badge && (
                <span className={`premium-badge ${course.badge.toLowerCase()}`}>
                  {course.badge}
                </span>
              )}
              {course.free && (
                <span className="free-badge">FREE</span>
              )}
            </div>

            <div className="card-body">
              <div className="card-header-section">
                <span className="course-category">{course.level}</span>
                <div className="rating-stars">
                  ⭐ {course.rating || 'New'}
                </div>
              </div>

              <h3 className="card-title">{course.title}</h3>
              <p className="card-description">{course.description}</p>

              <div className="card-meta-info">
                <div className="meta-item">
                  <Users size={16} />
                  <span>{course.students} students</span>
                </div>
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{course.hours}</span>
                </div>
                <div className="meta-item">
                  <BookOpen size={16} />
                  <span>{course.lessons}</span>
                </div>
              </div>

              <div className="card-footer-section">
                <div className="course-price-tag">
                  {course.free ? (
                    <span className="price-free">FREE</span>
                  ) : (
                    <span className="price-amount">₱{course.price}</span>
                  )}
                </div>

                <div className="action-buttons-group">
                  <button className="action-btn edit-btn" title="Edit Course">
                    <Edit size={16} />
                  </button>
                  <button className="action-btn delete-btn" title="Delete Course">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCourse?.title}
        size="large"
      >
        {selectedCourse && (
          <div className="premium-course-detail">
            <div className="detail-hero">
              <img 
                src={selectedCourse.image} 
                alt={selectedCourse.title}
                className="detail-hero-image"
              />
              <div className="detail-hero-overlay">
                <span className="detail-level">{selectedCourse.level}</span>
                <div className="detail-rating">⭐ {selectedCourse.rating || 'New'}</div>
              </div>
            </div>

            <div className="detail-content-grid">
              <div className="detail-main">
                <div className="detail-section">
                  <h4>About This Course</h4>
                  <p>{selectedCourse.description}</p>
                </div>

                <div className="detail-section">
                  <h4>Course Structure</h4>
                  <div className="structure-grid">
                    <div className="structure-item">
                      <BookOpen size={20} />
                      <div>
                        <strong>{selectedCourse.modules}</strong>
                        <span>Modules</span>
                      </div>
                    </div>
                    <div className="structure-item">
                      <FileText size={20} />
                      <div>
                        <strong>{selectedCourse.lessons}</strong>
                        <span>Lessons</span>
                      </div>
                    </div>
                    <div className="structure-item">
                      <Clock size={20} />
                      <div>
                        <strong>{selectedCourse.hours}</strong>
                        <span>Duration</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-sidebar">
                <div className="sidebar-card">
                  <h4>Course Information</h4>
                  <div className="info-list">
                    <div className="info-item">
                      <span className="info-label">Students Enrolled</span>
                      <span className="info-value">{selectedCourse.students}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Level</span>
                      <span className="info-value">{selectedCourse.level}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Price</span>
                      <span className="info-value price-highlight">
                        {selectedCourse.free ? 'FREE' : `₱${selectedCourse.price}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-actions-sidebar">
                  <button className="btn-primary-large">
                    <Edit size={18} />
                    Edit Course
                  </button>
                  <button className="btn-secondary-large">
                    <BookOpen size={18} />
                    View Content
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