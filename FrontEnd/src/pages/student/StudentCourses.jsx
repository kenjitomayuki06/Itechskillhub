import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Play, Star, Clock, CheckCircle,
  Search, Filter, ChevronRight, Lock
} from 'lucide-react';
import { apiFetch, getUser } from '../../services/authService';
import '../../styles/pages/student/StudentCourses.css';

const FILTER_OPTIONS = ['All', 'In Progress', 'Completed', 'Not Started'];

const COURSE_META = {
  1: { color: '#5B4A9E', icon: '🖥️', path: '/course/css-ncii' },
  2: { color: '#3b82f6', icon: '🔌', path: '/course/network-setup' },
  3: { color: '#10b981', icon: '⚙️', path: '/course/pc-hardware' },
  4: { color: '#f59e0b', icon: '💿', path: '/course/os-installation' },
};

export default function StudentCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
  const user = getUser(); // import getUser from authService
  const studentId = user?.id || user?.user_id;

  apiFetch('/api/courses/getAllCourses')
    .then(async (data) => {
      const courseList = data.courses || data || [];

      const mapped = await Promise.all(courseList.map(async (c) => {
        const meta = COURSE_META[c.course_Id] || {};
        let modulesCompleted = 0;
        let modulesTotal = 16;
        let status = 'not-started';
        let lastActivity = 'Not started';

        if (studentId) {
          try {
            const progressData = await apiFetch(
              `/api/courses/courseProgress/getProgress/${studentId}/${c.course_Id}`
            );
            if (progressData.success && progressData.data) {
              const p = progressData.data;
              const done = parseInt(p.lessonsDone?.split('/')[0]) || 0;
              const total = parseInt(p.lessonsDone?.split('/')[1]) || 16;
              modulesCompleted = done;
              modulesTotal = total;
              const pct = parseInt(p.courseCompletion) || 0;
              status = pct === 100 ? 'completed' : pct > 0 ? 'in-progress' : 'not-started';
              lastActivity = pct > 0 ? `${pct}% complete` : 'Not started';
            }
          } catch {
            // No progress yet — default values na lang
          }
        }

        return {
          id: c.course_Id,
          title: c.title,
          description: c.description || '',
          category: 'TESDA',
          difficulty: c.difficulty || 'Beginner',
          modulesTotal: modulesTotal,
          modulesCompleted,
          lastActivity,
          color: meta.color || '#5B4A9E',
          icon: meta.icon || '📚',
          path: meta.path || '/course',
          status,
        };
      }));

      setCourses(mapped);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);

  if (loading) return <div className="sc-page"><p style={{padding:'2rem'}}>Loading courses...</p></div>;
  if (error) return <div className="sc-page"><p style={{padding:'2rem'}}>⚠️ {error}</p></div>;

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      activeFilter === 'All' ||
      (activeFilter === 'In Progress' && c.status === 'in-progress') ||
      (activeFilter === 'Completed' && c.status === 'completed') ||
      (activeFilter === 'Not Started' && c.status === 'not-started');
    return matchSearch && matchFilter;
  });

  const inProgress = courses.filter(c => c.status === 'in-progress').length;
  const completed = courses.filter(c => c.status === 'completed').length;
  const notStarted = courses.filter(c => c.status === 'not-started').length;

  return (
    <div className="sc-page">
      <div className="sc-header">
        <div>
          <h1 className="sc-title">My Courses</h1>
          <p className="sc-subtitle">Track and continue your enrolled courses</p>
        </div>
        <button className="sc-browse-btn" onClick={() => navigate('/course')}>
          Browse More <ChevronRight size={15} />
        </button>
      </div>

      <div className="sc-stats-row">
        <div className="sc-stat sc-stat-blue">
          <BookOpen size={18} />
          <div>
            <div className="sc-stat-val">{courses.length}</div>
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

      {filtered.length === 0 ? (
        <div className="sc-empty">
          <BookOpen size={40} />
          <p>No courses found.</p>
        </div>
      ) : (
        <div className="sc-list">
          {filtered.map((course) => {
            const progress = course.modulesTotal > 0
              ? Math.round((course.modulesCompleted / course.modulesTotal) * 100)
              : 0;
            const isExpanded = expandedId === course.id;

            return (
              <div
                key={course.id}
                className={`sc-card ${course.status === 'completed' ? 'sc-card-done' : ''}`}
              >
                <div className="sc-card-main">
                  <div className="sc-course-icon" style={{ background: course.color + '20', color: course.color }}>
                    {course.icon}
                  </div>
                  <div className="sc-course-info">
                    <div className="sc-course-title-row">
                      <h3 className="sc-course-title">{course.title}</h3>
                      <span className={`sc-status-badge sc-status-${course.status}`}>
                        {course.status === 'in-progress' && '● In Progress'}
                        {course.status === 'completed' && '✓ Completed'}
                        {course.status === 'not-started' && '○ Not Started'}
                      </span>
                    </div>
                    <div className="sc-course-meta">
                      <span className="sc-category">{course.category}</span>
                      <span className="sc-dot">·</span>
                      <span className="sc-hours">🎯 {course.difficulty}</span>
                      <span className="sc-dot">·</span>
                      <span className="sc-last"><Clock size={11} /> {course.lastActivity}</span>
                    </div>
                    <div className="sc-progress-row">
                      <div className="sc-progress-bar">
                        <div className="sc-progress-fill" style={{ width: `${progress}%`, background: course.color }} />
                      </div>
                      <span className="sc-progress-text">{course.modulesCompleted}/{course.modulesTotal} modules · {progress}%</span>
                    </div>
                  </div>
                  <div className="sc-card-actions">
                    <button className="sc-expand-btn" onClick={() => setExpandedId(isExpanded ? null : course.id)}>
                      {isExpanded ? '▲' : '▼'}
                    </button>
                    <button className="sc-continue-btn" style={{ background: course.color }} onClick={() => navigate(course.path)}>
                      {course.status === 'completed' ? <><Star size={14} /> Review</> :
                       course.status === 'not-started' ? <><Play size={14} /> Start</> :
                       <><Play size={14} /> Continue</>}
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="sc-card-expanded">
                    <p className="sc-description">{course.description}</p>
                    <div className="sc-modules-list">
                      {Array.from({ length: course.modulesTotal }, (_, i) => (
                        <div key={i} className={`sc-module-item ${i < course.modulesCompleted ? 'sc-module-done' : ''}`}>
                          {i < course.modulesCompleted ? <CheckCircle size={14} /> : <div className="sc-module-num">{i + 1}</div>}
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