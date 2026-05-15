import { useState } from 'react';
import { Download, TrendingUp, Users, Award, BookOpen, Clock, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import '../../styles/instructor/InstructorReports.css';

export default function InstructorReports() {
  const [timeRange, setTimeRange] = useState('month');

  /* ── Mock Data ── */
  const submissionTrendData = {
    week: [
      { label: 'Mon', submitted: 8, graded: 6 },
      { label: 'Tue', submitted: 12, graded: 10 },
      { label: 'Wed', submitted: 7, graded: 7 },
      { label: 'Thu', submitted: 15, graded: 11 },
      { label: 'Fri', submitted: 10, graded: 9 },
      { label: 'Sat', submitted: 5, graded: 4 },
      { label: 'Sun', submitted: 3, graded: 3 },
    ],
    month: [
      { label: 'Week 1', submitted: 45, graded: 38 },
      { label: 'Week 2', submitted: 62, graded: 55 },
      { label: 'Week 3', submitted: 53, graded: 50 },
      { label: 'Week 4', submitted: 70, graded: 62 },
    ],
    year: [
      { label: 'Jan', submitted: 120, graded: 110 },
      { label: 'Feb', submitted: 145, graded: 130 },
      { label: 'Mar', submitted: 180, graded: 170 },
      { label: 'Apr', submitted: 160, graded: 155 },
      { label: 'May', submitted: 200, graded: 188 },
      { label: 'Jun', submitted: 175, graded: 168 },
    ],
  };

  const coursePerformanceData = [
    { course: 'CSS NC II',       completion: 68, avgScore: 85, students: 30 },
    { course: 'PC Hardware',     completion: 75, avgScore: 88, students: 28 },
    { course: 'Network Setup',   completion: 82, avgScore: 92, students: 35 },
    { course: 'OS Installation', completion: 71, avgScore: 87, students: 22 },
  ];

  const scoreDistributionData = [
    { name: '90–100', value: 34, color: '#27ae60' },
    { name: '80–89',  value: 48, color: '#5B4A9E' },
    { name: '70–79',  value: 22, color: '#f39c12' },
    { name: 'Below 70', value: 11, color: '#e74c3c' },
  ];

  const studentEngagementData = [
    { label: 'Jan', active: 88, inactive: 12 },
    { label: 'Feb', active: 91, inactive: 9 },
    { label: 'Mar', active: 85, inactive: 15 },
    { label: 'Apr', active: 93, inactive: 7 },
    { label: 'May', active: 96, inactive: 4 },
    { label: 'Jun', active: 90, inactive: 10 },
  ];

  const topStudents = [
    { rank: 1, name: 'Maria Santos',   course: 'Network Setup',   avgScore: 98, submitted: 12, badge: '🥇' },
    { rank: 2, name: 'Pedro Reyes',    course: 'CSS NC II',       avgScore: 95, submitted: 11, badge: '🥈' },
    { rank: 3, name: 'Ana Garcia',     course: 'PC Hardware',     avgScore: 93, submitted: 10, badge: '🥉' },
    { rank: 4, name: 'Carlos Mendoza', course: 'OS Installation', avgScore: 91, submitted: 10, badge: '' },
    { rank: 5, name: 'Luz Bautista',   course: 'Network Setup',   avgScore: 89, submitted: 9,  badge: '' },
  ];

  const keyMetrics = [
    { icon: <Users size={22} />,     label: 'Total Students',    value: '115',  change: '+8%',  up: true,  color: 'purple' },
    { icon: <Award size={22} />,     label: 'Avg Score',         value: '88%',  change: '+3%',  up: true,  color: 'green'  },
    { icon: <TrendingUp size={22} />, label: 'Completion Rate',  value: '74%',  change: '-2%',  up: false, color: 'orange' },
    { icon: <FileText size={22} />,  label: 'Assignments Graded', value: '235', change: '+12%', up: true,  color: 'blue'   },
  ];

  const tooltipStyle = {
    backgroundColor: '#5B4A9E',
    border: 'none',
    borderRadius: '12px',
    color: 'white',
    boxShadow: '0 4px 12px rgba(91,74,158,.3)',
  };

  return (
    <div className="instructor-reports">

      {/* Header */}
      <div className="ir-header">
        <div className="ir-header-text">
          <h1>Reports</h1>
          <p>Performance insights for your courses and students</p>
        </div>
        <div className="ir-header-actions">
          <div className="ir-time-selector">
            {['week', 'month', 'year'].map((t) => (
              <button
                key={t}
                className={`ir-time-btn ${timeRange === t ? 'active' : ''}`}
                onClick={() => setTimeRange(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <button className="ir-btn-export">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="ir-metrics-grid">
        {keyMetrics.map((m, i) => (
          <div key={i} className={`ir-metric-card ir-metric--${m.color}`}>
            <div className="ir-metric-icon">{m.icon}</div>
            <div className="ir-metric-content">
              <span className="ir-metric-value">{m.value}</span>
              <span className="ir-metric-label">{m.label}</span>
              <span className={`ir-metric-change ${m.up ? 'up' : 'down'}`}>
                {m.up ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                {m.change} vs last period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="ir-charts-grid">

        {/* Submission Trend – large */}
        <div className="ir-chart-card ir-card--large">
          <div className="ir-chart-header">
            <div>
              <h3>Submission Trend</h3>
              <span className="ir-chart-sub">Submitted vs Graded over time</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={submissionTrendData[timeRange]}>
              <defs>
                <linearGradient id="gradSubmitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#5B4A9E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#5B4A9E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGraded" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#27ae60" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#27ae60" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="label" stroke="#636e72" style={{ fontSize: '12px' }} />
              <YAxis stroke="#636e72" style={{ fontSize: '12px' }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="submitted" name="Submitted" stroke="#5B4A9E" strokeWidth={3} fill="url(#gradSubmitted)" />
              <Area type="monotone" dataKey="graded"    name="Graded"    stroke="#27ae60" strokeWidth={3} fill="url(#gradGraded)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution – small */}
        <div className="ir-chart-card ir-card--small">
          <div className="ir-chart-header">
            <div>
              <h3>Score Distribution</h3>
              <span className="ir-chart-sub">Grade range breakdown</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={scoreDistributionData}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {scoreDistributionData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="ir-pie-legend">
            {scoreDistributionData.map((item, i) => (
              <div key={i} className="ir-legend-item">
                <span className="ir-legend-dot" style={{ backgroundColor: item.color }} />
                <span className="ir-legend-label">{item.name}</span>
                <span className="ir-legend-val">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="ir-charts-grid">

        {/* Course Performance */}
        <div className="ir-chart-card ir-card--medium">
          <div className="ir-chart-header">
            <div>
              <h3>Course Performance</h3>
              <span className="ir-chart-sub">Completion rate & avg score per course</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={coursePerformanceData} barGap={4}>
              <defs>
                <linearGradient id="barCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#5B4A9E" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7B6BBD" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="barScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#27ae60" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2ecc71" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="course" stroke="#636e72" style={{ fontSize: '11px' }} />
              <YAxis stroke="#636e72" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="completion" name="Completion %" fill="url(#barCompletion)" radius={[8,8,0,0]} />
              <Bar dataKey="avgScore"   name="Avg Score"    fill="url(#barScore)"      radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Student Engagement */}
        <div className="ir-chart-card ir-card--medium">
          <div className="ir-chart-header">
            <div>
              <h3>Student Engagement</h3>
              <span className="ir-chart-sub">Active vs inactive students (%)</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={studentEngagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="label" stroke="#636e72" style={{ fontSize: '12px' }} />
              <YAxis stroke="#636e72" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="active"   name="Active %"   stroke="#5B4A9E" strokeWidth={3} dot={{ fill: '#5B4A9E', r: 5 }} activeDot={{ r: 7 }} />
              <Line type="monotone" dataKey="inactive" name="Inactive %"  stroke="#e74c3c" strokeWidth={2} strokeDasharray="5 3" dot={{ fill: '#e74c3c', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Cards */}
      <div className="ir-section">
        <div className="ir-section-header">
          <h3>Course Summary</h3>
          <span className="ir-section-sub">Overview of each course's performance</span>
        </div>
        <div className="ir-course-cards">
          {coursePerformanceData.map((c, i) => (
            <div key={i} className="ir-course-card">
              <div className="ir-course-icon">
                <BookOpen size={20} />
              </div>
              <div className="ir-course-info">
                <h4>{c.course}</h4>
                <span className="ir-course-students">
                  <Users size={13} /> {c.students} students
                </span>
              </div>
              <div className="ir-course-stats">
                <div className="ir-course-stat">
                  <span className="ir-course-stat-val" style={{ color: '#5B4A9E' }}>{c.completion}%</span>
                  <span className="ir-course-stat-label">Completion</span>
                </div>
                <div className="ir-divider" />
                <div className="ir-course-stat">
                  <span className="ir-course-stat-val" style={{ color: '#27ae60' }}>{c.avgScore}%</span>
                  <span className="ir-course-stat-label">Avg Score</span>
                </div>
              </div>
              <div className="ir-course-bar-wrap">
                <div className="ir-course-bar" style={{ width: `${c.completion}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Students Table */}
      <div className="ir-section">
        <div className="ir-section-header">
          <h3>Top Performing Students</h3>
          <span className="ir-section-sub">Ranked by average score across all assignments</span>
        </div>
        <div className="ir-top-students">
          <div className="ir-table-header">
            <span>Rank</span>
            <span>Student</span>
            <span>Course</span>
            <span>Assignments</span>
            <span>Avg Score</span>
          </div>
          {topStudents.map((s) => (
            <div key={s.rank} className={`ir-table-row ${s.rank <= 3 ? 'top-three' : ''}`}>
              <span className="ir-rank">
                {s.badge ? s.badge : <span className="ir-rank-num">#{s.rank}</span>}
              </span>
              <div className="ir-student-info">
                <div className="ir-student-avatar">{s.name.charAt(0)}</div>
                <span>{s.name}</span>
              </div>
              <span className="ir-course-tag-sm">{s.course}</span>
              <span className="ir-assignments-count">
                <Clock size={13} /> {s.submitted} submitted
              </span>
              <span className={`ir-score-pill ${s.avgScore >= 90 ? 'excellent' : s.avgScore >= 80 ? 'good' : 'average'}`}>
                {s.avgScore}%
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}