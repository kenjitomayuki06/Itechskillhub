import { useState, useEffect } from 'react';
import {
  TrendingUp, BookOpen, CheckCircle, Clock,
  Zap, Award, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { apiFetch } from '../../services/authService';
import '../../styles/pages/student/StudentProgress.css';

const COURSE_META = {
  1: { icon: '🖥️', color: '#5B4A9E' },
  2: { icon: '🔌', color: '#3b82f6' },
  3: { icon: '⚙️', color: '#10b981' },
  4: { icon: '💿', color: '#f59e0b' },
};

const EMPTY_WEEKLY = [
  { day: 'Mon', lessons: 0 },
  { day: 'Tue', lessons: 0 },
  { day: 'Wed', lessons: 0 },
  { day: 'Thu', lessons: 0 },
  { day: 'Fri', lessons: 0 },
  { day: 'Sat', lessons: 0 },
  { day: 'Sun', lessons: 0 },
];

export default function StudentProgress() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState('weekly');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    apiFetch('/api/student/dashboard')
      .then(data => {
        const enrolled = data.dashboardData?.enrolledCourses || [];
        const mapped = enrolled.map(c => {
          const meta = COURSE_META[c.id] || {};
          const completed = c.completed_lesson ? JSON.parse(c.completed_lesson || '[]').length : 0;
          return {
            id: c.id,
            title: c.title,
            icon: meta.icon || '📚',
            color: meta.color || '#5B4A9E',
            modulesTotal: 4,
            modulesCompleted: completed,
            quizAvg: 0,
            assignmentsSubmitted: 0,
            assignmentsTotal: 0,
            timeSpentHrs: 0,
          };
        });
        setCourses(mapped);
        setLoading(false);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="sp-page"><p style={{padding:'2rem'}}>Loading progress...</p></div>;

  const totalModules    = courses.reduce((s, c) => s + c.modulesTotal, 0);
  const doneModules     = courses.reduce((s, c) => s + c.modulesCompleted, 0);
  const overallProgress = totalModules > 0 ? Math.round((doneModules / totalModules) * 100) : 0;
  const completedCourses = courses.filter(c => c.modulesCompleted >= c.modulesTotal && c.modulesTotal > 0).length;
  const totalHours      = courses.reduce((s, c) => s + c.timeSpentHrs, 0);
  const allGrades       = courses.flatMap(c => []);
  const avgGrade        = allGrades.length ? Math.round(allGrades.reduce((s, g) => s + g, 0) / allGrades.length) : 0;

  return (
    <div className="sp-page">
      <div className="sp-header">
        <div>
          <h1 className="sp-title">My Progress</h1>
          <p className="sp-subtitle">Track your learning journey across all courses</p>
        </div>
      </div>

      <div className="sp-stats-grid">
        <div className="sp-stat sp-stat-purple">
          <div className="sp-stat-icon"><TrendingUp size={22} /></div>
          <div><div className="sp-stat-val">{overallProgress}%</div><div className="sp-stat-lbl">Overall Progress</div></div>
        </div>
        <div className="sp-stat sp-stat-blue">
          <div className="sp-stat-icon"><BookOpen size={22} /></div>
          <div><div className="sp-stat-val">{courses.length}</div><div className="sp-stat-lbl">Enrolled Courses</div></div>
        </div>
        <div className="sp-stat sp-stat-green">
          <div className="sp-stat-icon"><CheckCircle size={22} /></div>
          <div><div className="sp-stat-val">{completedCourses}</div><div className="sp-stat-lbl">Completed</div></div>
        </div>
        <div className="sp-stat sp-stat-orange">
          <div className="sp-stat-icon"><Clock size={22} /></div>
          <div><div className="sp-stat-val">{totalHours}h</div><div className="sp-stat-lbl">Study Hours</div></div>
        </div>
      </div>

      <div className="sp-chart-card">
        <div className="sp-chart-header">
          <h2><Zap size={18} /> Activity Overview</h2>
          <div className="sp-chart-toggle">
            <button className={chartView === 'weekly' ? 'sp-toggle-active' : ''} onClick={() => setChartView('weekly')}>Weekly</button>
            <button className={chartView === 'monthly' ? 'sp-toggle-active' : ''} onClick={() => setChartView('monthly')}>Monthly</button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={EMPTY_WEEKLY}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
            <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '11px' }} />
            <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} allowDecimals={false} />
            <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} formatter={v => [`${v} lessons`, 'Completed']} />
            <Line type="monotone" dataKey="lessons" stroke="#5B4A9E" strokeWidth={2.5} dot={{ fill: '#5B4A9E', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="sp-courses-section">
        <h2 className="sp-section-title"><BookOpen size={18} /> Course Progress</h2>
        {courses.length === 0 ? (
          <div className="sp-empty"><p>No courses enrolled yet.</p></div>
        ) : (
          <div className="sp-course-list">
            {courses.map(c => {
              const progress = c.modulesTotal > 0 ? Math.round((c.modulesCompleted / c.modulesTotal) * 100) : 0;
              const isExpanded = expandedId === c.id;
              return (
                <div key={c.id} className="sp-course-card">
                  <div className="sp-course-main">
                    <div className="sp-course-icon" style={{ background: c.color + '20', color: c.color }}>{c.icon}</div>
                    <div className="sp-course-info">
                      <h3 className="sp-course-title">{c.title}</h3>
                      <div className="sp-progress-row">
                        <div className="sp-progress-bar">
                          <div className="sp-progress-fill" style={{ width: `${progress}%`, background: c.color }} />
                        </div>
                        <span className="sp-progress-text">{progress}%</span>
                      </div>
                      <div className="sp-course-stats">
                        <span><CheckCircle size={11} /> {c.modulesCompleted}/{c.modulesTotal} modules</span>
                      </div>
                    </div>
                    <button className="sp-expand-btn" onClick={() => setExpandedId(isExpanded ? null : c.id)}>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="sp-course-expanded">
                      <div className="sp-module-grid">
                        {Array.from({ length: c.modulesTotal }, (_, i) => (
                          <div key={i} className={`sp-module-item ${i < c.modulesCompleted ? 'sp-module-done' : ''}`}>
                            {i < c.modulesCompleted ? <CheckCircle size={13} /> : <div className="sp-module-num">{i + 1}</div>}
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
    </div>
  );
}