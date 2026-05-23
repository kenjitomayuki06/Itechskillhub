import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, CheckCircle, Award, Clock,
  ChevronRight, AlertCircle, TrendingUp, Zap,
  Calendar, Star, Play
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { StudentDashboardSkeleton } from '../../components/common/SkeletonLoader';
import '../../styles/pages/student/StudentDashboard.css';

// ─────────────────────────────────────────────────────────────
// TODO (backend): replace this mock loader with a real API call
//
//   import { apiFetch } from '../../services/authService';
//
//   const data = await apiFetch('/api/student/dashboard');
//   setDashboard(data);
//
// Expected response shape:
//   {
//     enrolledCourses: [{
//       id, title, category, modulesTotal, modulesCompleted,
//       lastActivity, color, icon, path
//     }],
//     deadlines: [{ id, title, course, dueDate }],
//     activityFeed: [{ id, type, message, time }],
//     weeklyProgress: [{ day, lessons }],
//   }
// ─────────────────────────────────────────────────────────────

const MOCK_DATA = {
  enrolledCourses: [
    {
      id: 1,
      title: 'CSS NC II — Computer Systems Servicing',
      category: 'TESDA',
      modulesTotal: 5,
      modulesCompleted: 3,
      lastActivity: '2 hours ago',
      color: 'var(--color-primary)',
      icon: '🖥️',
      path: '/course/css-ncii',
    },
    {
      id: 2,
      title: 'Network Systems Cabling (NSC)',
      category: 'TESDA',
      modulesTotal: 4,
      modulesCompleted: 1,
      lastActivity: '3 days ago',
      color: 'var(--color-info)',
      icon: '🔌',
      path: '/course/network-setup',
    },
    {
      id: 3,
      title: 'PC Hardware Assembly & Troubleshooting',
      category: 'TESDA',
      modulesTotal: 6,
      modulesCompleted: 6,
      lastActivity: 'Completed',
      color: 'var(--color-success)',
      icon: '⚙️',
      path: '/course/pc-hardware',
    },
  ],
  deadlines: [
    { id: 1, title: 'Lab Report: PC Assembly',      course: 'PC Hardware', dueDate: new Date(Date.now() + 1 * 86400000) },
    { id: 2, title: 'Quiz: OSI Model Layers',        course: 'NSC',         dueDate: new Date(Date.now() + 3 * 86400000) },
    { id: 3, title: 'Assignment: Cable Crimping',    course: 'NSC',         dueDate: new Date(Date.now() + 5 * 86400000) },
    { id: 4, title: 'Final Project: Network Design', course: 'CSS NC II',   dueDate: new Date(Date.now() + 10 * 86400000) },
  ],
  activityFeed: [
    { id: 1, type: 'grade',    message: 'Your assignment "OS Installation" was graded: 92/100',    time: '1 hour ago' },
    { id: 2, type: 'complete', message: 'You completed Module 3: Networking Fundamentals',          time: '2 hours ago' },
    { id: 3, type: 'announce', message: 'Instructor posted: "Lab session moved to Friday 2PM"',    time: '1 day ago' },
    { id: 4, type: 'complete', message: 'You completed all modules in PC Hardware Assembly!',       time: '2 days ago' },
    { id: 5, type: 'grade',    message: 'Your quiz "Cable Types" was graded: 88/100',              time: '3 days ago' },
  ],
  weeklyProgress: [
    { day: 'Mon', lessons: 2 },
    { day: 'Tue', lessons: 1 },
    { day: 'Wed', lessons: 3 },
    { day: 'Thu', lessons: 0 },
    { day: 'Fri', lessons: 2 },
    { day: 'Sat', lessons: 1 },
    { day: 'Sun', lessons: 1 },
  ],
};

async function fetchStudentDashboard() {
  // Simulates network delay — remove when backend is ready
  await new Promise(r => setTimeout(r, 900));
  return MOCK_DATA;
}

/* ── Helpers ── */
function getDaysUntil(date) {
  const diff = Math.ceil((new Date(date) - Date.now()) / 86400000);
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
}

function getDeadlineClass(date) {
  const diff = Math.ceil((new Date(date) - Date.now()) / 86400000);
  if (diff <= 1) return 'deadline-urgent';
  if (diff <= 3) return 'deadline-soon';
  return 'deadline-normal';
}

function getActivityIcon(type) {
  if (type === 'grade')    return '📝';
  if (type === 'complete') return '✅';
  if (type === 'announce') return '📢';
  return '🔔';
}

/* ── Main Component ── */
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [greeting, setGreeting]   = useState('Good morning');

  useEffect(() => {
    // Load user info
    const stored = localStorage.getItem('user');
    try { setCurrentUser(stored ? JSON.parse(stored) : null); }
    catch { setCurrentUser(null); }

    // Set greeting
    const hour = new Date().getHours();
    if (hour < 12)      setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else                setGreeting('Good evening');

    // Load dashboard data
    let cancelled = false;
    setLoading(true);

    fetchStudentDashboard()
      .then(data => { if (!cancelled) { setDashboard(data); setLoading(false); } })
      .catch(err  => { if (!cancelled) { setError(err.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, []);

  if (loading) return <StudentDashboardSkeleton />;

  if (error) return (
    <div className="student-dashboard">
      <div className="dashboard-error">
        <p>⚠️ Failed to load dashboard: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );

  const { enrolledCourses, deadlines, activityFeed, weeklyProgress } = dashboard;

  const completedCourses       = enrolledCourses.filter(c => c.modulesCompleted === c.modulesTotal).length;
  const totalLessonsCompleted  = enrolledCourses.reduce((s, c) => s + c.modulesCompleted, 0);
  const totalLessons           = enrolledCourses.reduce((s, c) => s + c.modulesTotal, 0);
  const overallProgress        = Math.round((totalLessonsCompleted / totalLessons) * 100);
  const firstName              = currentUser?.name?.split(' ')[0] || 'Student';
  const upcomingThisWeek       = deadlines.filter(d => Math.ceil((new Date(d.dueDate) - Date.now()) / 86400000) <= 7).length;

  return (
    <div className="student-dashboard">

      {/* Welcome Banner */}
      <div className="student-welcome-banner">
        <div className="welcome-text">
          <p className="welcome-greeting">{greeting},</p>
          <h1 className="welcome-name">{firstName}! 👋</h1>
          <p className="welcome-sub">
            You have{' '}
            <strong>{upcomingThisWeek} deadline{upcomingThisWeek !== 1 ? 's' : ''}</strong>{' '}
            this week. Keep it up!
          </p>
        </div>
        <div className="welcome-stats-mini">
          <div className="mini-stat">
            <div className="mini-stat-value">{overallProgress}%</div>
            <div className="mini-stat-label">Overall Progress</div>
          </div>
          <div className="mini-stat-divider" />
          <div className="mini-stat">
            <div className="mini-stat-value">{totalLessonsCompleted}</div>
            <div className="mini-stat-label">Lessons Done</div>
          </div>
          <div className="mini-stat-divider" />
          <div className="mini-stat">
            <div className="mini-stat-value">{completedCourses}</div>
            <div className="mini-stat-label">Courses Finished</div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="student-stats-grid">
        <div className="student-stat-card student-stat-blue">
          <div className="sstat-icon"><BookOpen size={22} /></div>
          <div className="sstat-body">
            <div className="sstat-value">{enrolledCourses.length}</div>
            <div className="sstat-label">Enrolled Courses</div>
          </div>
        </div>
        <div className="student-stat-card student-stat-green">
          <div className="sstat-icon"><CheckCircle size={22} /></div>
          <div className="sstat-body">
            <div className="sstat-value">{completedCourses}</div>
            <div className="sstat-label">Courses Completed</div>
          </div>
        </div>
        <div className="student-stat-card student-stat-purple">
          <div className="sstat-icon"><TrendingUp size={22} /></div>
          <div className="sstat-body">
            <div className="sstat-value">{overallProgress}%</div>
            <div className="sstat-label">Avg. Progress</div>
          </div>
        </div>
        <div className="student-stat-card student-stat-orange">
          <div className="sstat-icon"><Award size={22} /></div>
          <div className="sstat-body">
            <div className="sstat-value">{completedCourses}</div>
            <div className="sstat-label">Certificates Earned</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="student-main-grid">

        {/* LEFT COLUMN */}
        <div className="student-left-col">

          {/* My Courses */}
          <div className="student-card">
            <div className="student-card-header">
              <h2><BookOpen size={18} /> My Courses</h2>
              <button className="student-card-link" onClick={() => navigate('/student/courses')}>
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="courses-list">
              {enrolledCourses.map((course) => {
                const progress    = Math.round((course.modulesCompleted / course.modulesTotal) * 100);
                const isCompleted = course.modulesCompleted === course.modulesTotal;
                return (
                  <div
                    key={course.id}
                    className={`course-item ${isCompleted ? 'course-item-completed' : ''}`}
                    onClick={() => navigate(course.path)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && navigate(course.path)}
                  >
                    <div className="course-icon" style={{ background: course.color + '20', color: course.color }}>
                      <span>{course.icon}</span>
                    </div>
                    <div className="course-info">
                      <div className="course-title-row">
                        <h3 className="course-title">{course.title}</h3>
                        {isCompleted && <span className="course-badge-done">✓ Done</span>}
                      </div>
                      <div className="course-meta">
                        <span className="course-category">{course.category}</span>
                        <span className="course-activity"><Clock size={11} /> {course.lastActivity}</span>
                      </div>
                      <div className="course-progress-row">
                        <div className="course-progress-bar">
                          <div className="course-progress-fill" style={{ width: `${progress}%`, background: course.color }} />
                        </div>
                        <span className="course-progress-text">{course.modulesCompleted}/{course.modulesTotal} modules</span>
                      </div>
                    </div>
                    <button
                      className="course-continue-btn"
                      style={{ background: course.color }}
                      onClick={(e) => { e.stopPropagation(); navigate(course.path); }}
                      aria-label={isCompleted ? 'Review course' : 'Continue course'}
                    >
                      {isCompleted ? <Star size={14} /> : <Play size={14} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="student-card">
            <div className="student-card-header">
              <h2><Zap size={18} /> This Week's Activity</h2>
              <span className="student-card-badge">Last 7 days</span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '11px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e8e4f8', fontSize: '12px' }}
                  formatter={(v) => [`${v} lessons`, 'Completed']}
                />
                <Line
                  type="monotone"
                  dataKey="lessons"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--color-primary)', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="student-right-col">

          {/* Upcoming Deadlines */}
          <div className="student-card">
            <div className="student-card-header">
              <h2><AlertCircle size={18} /> Upcoming Deadlines</h2>
              <span className="student-card-badge">{deadlines.length} items</span>
            </div>
            <div className="deadlines-list">
              {deadlines.map((item) => (
                <div key={item.id} className={`deadline-item ${getDeadlineClass(item.dueDate)}`}>
                  <div className="deadline-dot" />
                  <div className="deadline-content">
                    <div className="deadline-title">{item.title}</div>
                    <div className="deadline-course">{item.course}</div>
                  </div>
                  <div className="deadline-due">
                    <Calendar size={11} />{getDaysUntil(item.dueDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="student-card">
            <div className="student-card-header">
              <h2><Clock size={18} /> Recent Activity</h2>
            </div>
            <div className="activity-list">
              {activityFeed.map((item) => (
                <div key={item.id} className="activity-item">
                  <span className="activity-emoji" aria-hidden="true">{getActivityIcon(item.type)}</span>
                  <div className="activity-content">
                    <p className="activity-message">{item.message}</p>
                    <span className="activity-time">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Games Promo */}
          <div className="student-card student-card-promo">
            <div className="promo-content">
              <div className="promo-icon">🎮</div>
              <div>
                <h3>Practice with Quiz Games</h3>
                <p>Test your knowledge with interactive challenges across all modules.</p>
              </div>
            </div>
            <button className="promo-btn" onClick={() => navigate('/games')}>
              Play Now <ChevronRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}