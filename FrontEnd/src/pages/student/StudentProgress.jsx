import { useState } from 'react';
import {
  TrendingUp, BookOpen, CheckCircle, Clock,
  Zap, Award, ChevronDown, ChevronUp, Calendar
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import '../../styles/pages/student/StudentProgress.css';

/* ── Mock data — replace with real API calls when backend is ready ── */
const MOCK_COURSES = [
  {
    id: 1,
    title: 'CSS NC II — Computer Systems Servicing',
    icon: '🖥️',
    color: '#5B4A9E',
    modulesTotal: 5,
    modulesCompleted: 3,
    quizAvg: 88,
    assignmentsSubmitted: 3,
    assignmentsTotal: 4,
    timeSpentHrs: 14,
  },
  {
    id: 2,
    title: 'Network Systems Cabling (NSC)',
    icon: '🔌',
    color: '#3b82f6',
    modulesTotal: 4,
    modulesCompleted: 1,
    quizAvg: 75,
    assignmentsSubmitted: 1,
    assignmentsTotal: 3,
    timeSpentHrs: 6,
  },
  {
    id: 3,
    title: 'PC Hardware Assembly & Troubleshooting',
    icon: '⚙️',
    color: '#10b981',
    modulesTotal: 6,
    modulesCompleted: 6,
    quizAvg: 94,
    assignmentsSubmitted: 5,
    assignmentsTotal: 5,
    timeSpentHrs: 22,
  },
];

const MOCK_WEEKLY = [
  { day: 'Mon', lessons: 2 },
  { day: 'Tue', lessons: 1 },
  { day: 'Wed', lessons: 3 },
  { day: 'Thu', lessons: 0 },
  { day: 'Fri', lessons: 2 },
  { day: 'Sat', lessons: 1 },
  { day: 'Sun', lessons: 1 },
];

const MOCK_MONTHLY = [
  { week: 'Week 1', lessons: 8 },
  { week: 'Week 2', lessons: 12 },
  { week: 'Week 3', lessons: 7 },
  { week: 'Week 4', lessons: 10 },
];

const MOCK_GRADES = [
  { label: 'Quiz: Cable Types',           course: 'NSC',          score: 88,  total: 100, date: 'May 18' },
  { label: 'Assignment: OS Installation', course: 'CSS NC II',    score: 92,  total: 100, date: 'May 16' },
  { label: 'Quiz: PC Components',         course: 'PC Hardware',  score: 95,  total: 100, date: 'May 14' },
  { label: 'Lab Report: Assembly',        course: 'PC Hardware',  score: 89,  total: 100, date: 'May 12' },
  { label: 'Quiz: OSI Layers',            course: 'NSC',          score: 76,  total: 100, date: 'May 10' },
];

export default function StudentProgress() {
  const [chartView, setChartView] = useState('weekly');
  const [expandedId, setExpandedId] = useState(null);

  const totalModules    = MOCK_COURSES.reduce((s, c) => s + c.modulesTotal, 0);
  const doneModules     = MOCK_COURSES.reduce((s, c) => s + c.modulesCompleted, 0);
  const overallPct      = Math.round((doneModules / totalModules) * 100);
  const totalHours      = MOCK_COURSES.reduce((s, c) => s + c.timeSpentHrs, 0);
  const avgQuiz         = Math.round(MOCK_COURSES.reduce((s, c) => s + c.quizAvg, 0) / MOCK_COURSES.length);

  const chartData = chartView === 'weekly' ? MOCK_WEEKLY : MOCK_MONTHLY;
  const chartKey  = chartView === 'weekly' ? 'day' : 'week';

  function getScoreColor(score) {
    if (score >= 90) return '#10b981';
    if (score >= 75) return '#f59e0b';
    return '#ef4444';
  }

  return (
    <div className="sp-page">

      {/* ── Header ── */}
      <div className="sp-header">
        <div>
          <h1 className="sp-title">My Progress</h1>
          <p className="sp-subtitle">Track your learning journey across all courses</p>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="sp-stats-grid">
        <div className="sp-stat sp-stat-purple">
          <div className="sp-stat-icon"><TrendingUp size={20} /></div>
          <div>
            <div className="sp-stat-val">{overallPct}%</div>
            <div className="sp-stat-lbl">Overall Progress</div>
          </div>
        </div>
        <div className="sp-stat sp-stat-blue">
          <div className="sp-stat-icon"><BookOpen size={20} /></div>
          <div>
            <div className="sp-stat-val">{doneModules}/{totalModules}</div>
            <div className="sp-stat-lbl">Modules Done</div>
          </div>
        </div>
        <div className="sp-stat sp-stat-orange">
          <div className="sp-stat-icon"><Zap size={20} /></div>
          <div>
            <div className="sp-stat-val">{avgQuiz}%</div>
            <div className="sp-stat-lbl">Avg. Quiz Score</div>
          </div>
        </div>
        <div className="sp-stat sp-stat-green">
          <div className="sp-stat-icon"><Clock size={20} /></div>
          <div>
            <div className="sp-stat-val">{totalHours}h</div>
            <div className="sp-stat-lbl">Total Study Time</div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="sp-main-grid">

        {/* LEFT */}
        <div className="sp-left">

          {/* Overall Progress Bar */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h2><TrendingUp size={16} /> Overall Progress</h2>
            </div>
            <div className="sp-overall-wrap">
              <div className="sp-overall-ring-wrap">
                <svg viewBox="0 0 100 100" className="sp-ring">
                  <circle cx="50" cy="50" r="40" className="sp-ring-bg" />
                  <circle
                    cx="50" cy="50" r="40"
                    className="sp-ring-fill"
                    strokeDasharray={`${overallPct * 2.51} 251`}
                  />
                </svg>
                <div className="sp-ring-label">
                  <span className="sp-ring-pct">{overallPct}%</span>
                  <span className="sp-ring-sub">complete</span>
                </div>
              </div>
              <div className="sp-course-bars">
                {MOCK_COURSES.map((c) => {
                  const pct = Math.round((c.modulesCompleted / c.modulesTotal) * 100);
                  return (
                    <div key={c.id} className="sp-course-bar-row">
                      <div className="sp-course-bar-label">
                        <span>{c.icon}</span>
                        <span className="sp-course-bar-name">{c.title}</span>
                        <span className="sp-course-bar-pct" style={{ color: c.color }}>{pct}%</span>
                      </div>
                      <div className="sp-bar">
                        <div
                          className="sp-bar-fill"
                          style={{ width: `${pct}%`, background: c.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h2><Calendar size={16} /> Learning Activity</h2>
              <div className="sp-chart-toggle">
                <button
                  className={`sp-toggle-btn ${chartView === 'weekly' ? 'sp-toggle-active' : ''}`}
                  onClick={() => setChartView('weekly')}
                >
                  Weekly
                </button>
                <button
                  className={`sp-toggle-btn ${chartView === 'monthly' ? 'sp-toggle-active' : ''}`}
                  onClick={() => setChartView('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" vertical={false} />
                <XAxis dataKey={chartKey} stroke="#94a3b8" style={{ fontSize: '11px' }} />
                <YAxis stroke="#94a3b8" style={{ fontSize: '11px' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e8e4f8', fontSize: '12px' }}
                  formatter={(v) => [`${v} lessons`, 'Completed']}
                />
                <Bar dataKey="lessons" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i % 2 === 0 ? '#5B4A9E' : '#8b7dd4'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sp-right">

          {/* Per-Course Breakdown */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h2><BookOpen size={16} /> Course Breakdown</h2>
            </div>
            <div className="sp-breakdown-list">
              {MOCK_COURSES.map((c) => {
                const pct = Math.round((c.modulesCompleted / c.modulesTotal) * 100);
                const isOpen = expandedId === c.id;
                return (
                  <div key={c.id} className="sp-breakdown-item">
                    <div
                      className="sp-breakdown-header"
                      onClick={() => setExpandedId(isOpen ? null : c.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && setExpandedId(isOpen ? null : c.id)}
                    >
                      <span className="sp-breakdown-icon" style={{ background: c.color + '20' }}>
                        {c.icon}
                      </span>
                      <div className="sp-breakdown-info">
                        <span className="sp-breakdown-name">{c.title}</span>
                        <div className="sp-breakdown-bar">
                          <div className="sp-breakdown-bar-fill" style={{ width: `${pct}%`, background: c.color }} />
                        </div>
                      </div>
                      <span className="sp-breakdown-pct" style={{ color: c.color }}>{pct}%</span>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                    {isOpen && (
                      <div className="sp-breakdown-details">
                        <div className="sp-detail-row">
                          <span>Modules</span>
                          <span>{c.modulesCompleted}/{c.modulesTotal}</span>
                        </div>
                        <div className="sp-detail-row">
                          <span>Quiz Avg.</span>
                          <span style={{ color: getScoreColor(c.quizAvg) }}>{c.quizAvg}%</span>
                        </div>
                        <div className="sp-detail-row">
                          <span>Assignments</span>
                          <span>{c.assignmentsSubmitted}/{c.assignmentsTotal}</span>
                        </div>
                        <div className="sp-detail-row">
                          <span>Time Spent</span>
                          <span>{c.timeSpentHrs}h</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Grades */}
          <div className="sp-card">
            <div className="sp-card-header">
              <h2><Award size={16} /> Recent Grades</h2>
            </div>
            <div className="sp-grades-list">
              {MOCK_GRADES.map((g, i) => (
                <div key={i} className="sp-grade-row">
                  <div className="sp-grade-info">
                    <span className="sp-grade-label">{g.label}</span>
                    <span className="sp-grade-course">{g.course} · {g.date}</span>
                  </div>
                  <div
                    className="sp-grade-score"
                    style={{ color: getScoreColor(g.score) }}
                  >
                    {g.score}<span className="sp-grade-total">/{g.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
