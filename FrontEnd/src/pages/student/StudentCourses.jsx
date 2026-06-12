import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Play, Star, Clock, CheckCircle,
  Search, Filter, ChevronRight, Lock
} from 'lucide-react';
import '../../styles/pages/student/StudentCourses.css';

/* ── Mock data — replace with real API calls when backend is ready ── */
const MOCK_COURSES = [
  {
    id: 1,
    title: 'CSS NC II — Computer Systems Servicing',
    category: 'TESDA',
    modulesTotal: 5,
    modulesCompleted: 3,
    lastActivity: '2 hours ago',
    color: '#5B4A9E',
    icon: '🖥️',
    path: '/course/css-ncii',
    status: 'in-progress',
    description: 'Learn computer systems servicing, hardware installation, and troubleshooting techniques aligned with TESDA CSS NC II standards.',
    instructor: 'Juan dela Cruz',
    estimatedHours: 40,
  },
  {
    id: 2,
    title: 'Network Systems Cabling (NSC)',
    category: 'TESDA',
    modulesTotal: 4,
    modulesCompleted: 1,
    lastActivity: '3 days ago',
    color: '#3b82f6',
    icon: '🔌',
    path: '/course/network-setup',
    status: 'in-progress',
    description: 'Master structured cabling systems, LAN installation, and network troubleshooting for TESDA NSC certification.',
    instructor: 'Maria Santos',
    estimatedHours: 30,
  },
  {
    id: 3,
    title: 'PC Hardware Assembly & Troubleshooting',
    category: 'TESDA',
    modulesTotal: 6,
    modulesCompleted: 6,
    lastActivity: 'Completed',
    color: '#10b981',
    icon: '⚙️',
    path: '/course/pc-hardware',
    status: 'completed',
    description: 'Build and troubleshoot personal computers from scratch — covering components, assembly, BIOS setup, and OS installation.',
    instructor: 'Pedro Reyes',
    estimatedHours: 35,
  },
  {
    id: 4,
    title: 'OS Installation & Configuration (OSIC)',
    category: 'TESDA',
    modulesTotal: 5,
    modulesCompleted: 0,
    lastActivity: 'Not started',
    color: '#f59e0b',
    icon: '💿',
    path: '/course/os-installation',
    status: 'not-started',
    description: 'Install, configure, and maintain operating systems including Windows and Linux environments.',
    instructor: 'Ana Flores',
    estimatedHours: 25,
  },
];

const FILTER_OPTIONS = ['All', 'In Progress', 'Completed', 'Not Started'];

export default function StudentCourses() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);

  const toggleBookmark = (courseId, e) => {
    e.stopPropagation(); // Prevents clicking the star from accidentally opening the course page
    setBookmarkedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId) // Unpin
        : [...prev, courseId]                // Pin
    );
  };

  const filtered = MOCK_COURSES.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'All' ||
      (activeFilter === 'In Progress'  && c.status === 'in-progress')  ||
      (activeFilter === 'Completed'    && c.status === 'completed')     ||
      (activeFilter === 'Not Started'  && c.status === 'not-started');
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    const aPinned = bookmarkedCourses.includes(a.id);
    const bPinned = bookmarkedCourses.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });


  const inProgress  = MOCK_COURSES.filter((c) => c.status === 'in-progress').length;
  const completed   = MOCK_COURSES.filter((c) => c.status === 'completed').length;
  const notStarted  = MOCK_COURSES.filter((c) => c.status === 'not-started').length;

  return (
    <div className="sc-page">

      {/* ── Header ── */}
      <div className="sc-header">
        <div>
          <h1 className="sc-title">My Courses</h1>
          <p className="sc-subtitle">Track and continue your enrolled courses</p>
        </div>
        <button className="sc-browse-btn" onClick={() => navigate('/course')}>
          Browse More <ChevronRight size={15} />
        </button>
      </div>

      {/* ── Summary Stats ── */}
      <div className="sc-stats-row">
        <div className="sc-stat sc-stat-blue">
          <BookOpen size={18} />
          <div>
            <div className="sc-stat-val">{MOCK_COURSES.length}</div>
            <div className="sc-stat-lbl">Total Enrolled</div>
          </div>
        </div>
        <div className="sc-stat sc-stat-purple">
          <Play size={18} />
          <div>
            <div className="sc-stat-val">{inProgress}</div>
            <div className="sc-stat-lbl">In Progress</div>
          </div>
        </div>
        <div className="sc-stat sc-stat-green">
          <CheckCircle size={18} />
          <div>
            <div className="sc-stat-val">{completed}</div>
            <div className="sc-stat-lbl">Completed</div>
          </div>
        </div>
        <div className="sc-stat sc-stat-gray">
          <Lock size={18} />
          <div>
            <div className="sc-stat-val">{notStarted}</div>
            <div className="sc-stat-lbl">Not Started</div>
          </div>
        </div>
      </div>

      {/* ── Search & Filter ── */}
      <div className="sc-controls">
        <div className="sc-search">
          <Search size={15} className="sc-search-icon" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sc-search-input"
          />
        </div>
        <div className="sc-filters">
          <Filter size={14} className="sc-filter-icon" />
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              className={`sc-filter-btn ${activeFilter === f ? 'sc-filter-active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Course List ── */}
      {filtered.length === 0 ? (
        <div className="sc-empty">
          <BookOpen size={40} />
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="sc-list">
          {filtered.map((course) => {
            const progress = Math.round((course.modulesCompleted / course.modulesTotal) * 100);
            const isExpanded = expandedId === course.id;

            return (
              <div
                key={course.id}
                className={`sc-card ${course.status === 'completed' ? 'sc-card-done' : ''}`}
              >
                <div className="sc-card-main">
                  {/* Icon */}
                 <button 
                    className={`student-row-star-btn ${bookmarkedCourses.includes(course.id) ? 'active' : ''}`}
                    title={bookmarkedCourses.includes(course.id) ? "Unpin Course" : "Pin Course to Top"}
                    onClick={(e) => toggleBookmark(course.id, e)}
                  >
                    <Star size={16} fill={bookmarkedCourses.includes(course.id) ? "#f1c40f" : "none"} />
                  </button>

                  {/* Your original course icon template is right here */}
                  <div
                    className="sc-course-icon"
                    style={{ background: course.color + '20', color: course.color }}
                  >
                    {course.icon}
                  </div>
                  {/* Info */}
                  <div className="sc-course-info">
                    <div className="sc-course-title-row">
                      <h3 className="sc-course-title">{course.title}</h3>
                      <span className={`sc-status-badge sc-status-${course.status}`}>
                        {course.status === 'in-progress'  && '● In Progress'}
                        {course.status === 'completed'    && '✓ Completed'}
                        {course.status === 'not-started'  && '○ Not Started'}
                      </span>
                    </div>

                    <div className="sc-course-meta">
                      <span className="sc-category">{course.category}</span>
                      <span className="sc-dot">·</span>
                      <span className="sc-instructor">👤 {course.instructor}</span>
                      <span className="sc-dot">·</span>
                      <span className="sc-hours">🕒 {course.estimatedHours}h</span>
                      <span className="sc-dot">·</span>
                      <span className="sc-last">
                        <Clock size={11} /> {course.lastActivity}
                      </span>
                    </div>

                    <div className="sc-progress-row">
                      <div className="sc-progress-bar">
                        <div
                          className="sc-progress-fill"
                          style={{ width: `${progress}%`, background: course.color }}
                        />
                      </div>
                      <span className="sc-progress-text">
                        {course.modulesCompleted}/{course.modulesTotal} modules · {progress}%
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="sc-card-actions">
                    <button
                      className="sc-expand-btn"
                      onClick={() => setExpandedId(isExpanded ? null : course.id)}
                      aria-label="Toggle details"
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                    <button
                      className="sc-continue-btn"
                      style={{ background: course.color }}
                      onClick={() => navigate(course.path)}
                    >
                      {course.status === 'completed' ? (
                        <><Star size={14} /> Review</>
                      ) : course.status === 'not-started' ? (
                        <><Play size={14} /> Start</>
                      ) : (
                        <><Play size={14} /> Continue</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="sc-card-expanded">
                    <p className="sc-description">{course.description}</p>
                    <div className="sc-modules-list">
                      {Array.from({ length: course.modulesTotal }, (_, i) => (
                        <div
                          key={i}
                          className={`sc-module-item ${i < course.modulesCompleted ? 'sc-module-done' : ''}`}
                        >
                          {i < course.modulesCompleted
                            ? <CheckCircle size={14} />
                            : <div className="sc-module-num">{i + 1}</div>
                          }
                          <span>Module {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}