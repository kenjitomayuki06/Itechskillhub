import { useState } from 'react';
import { TrendingUp, Users, BookOpen, Award, Clock, Download, Calendar } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import '../../styles/admin/AdminAnalytics.css'

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('month');

  // Mock data for charts
  const studentGrowthData = [
    { month: 'Jan', students: 850 },
    { month: 'Feb', students: 920 },
    { month: 'Mar', students: 1050 },
    { month: 'Apr', students: 1150 },
    { month: 'May', students: 1234 },
  ];

  const coursePerformanceData = [
    { course: 'CSS NC II', completion: 68, avgScore: 85 },
    { course: 'PC Hardware', completion: 75, avgScore: 88 },
    { course: 'Network Setup', completion: 82, avgScore: 92 },
    { course: 'OS Installation', completion: 71, avgScore: 87 },
  ];

  const enrollmentByMonthData = [
    { month: 'Jan', enrollments: 145 },
    { month: 'Feb', enrollments: 189 },
    { month: 'Mar', enrollments: 234 },
    { month: 'Apr', enrollments: 198 },
    { month: 'May', enrollments: 267 },
  ];

  const certificatesByLevelData = [
    { name: 'Beginner', value: 450, color: '#5B4A9E' },
    { name: 'Intermediate', value: 380, color: '#7B6BBD' },
    { name: 'Advanced', value: 234, color: '#9B8BCD' },
  ];

  const activityHeatmapData = [
    { day: 'Mon', morning: 45, afternoon: 78, evening: 34 },
    { day: 'Tue', morning: 52, afternoon: 85, evening: 41 },
    { day: 'Wed', morning: 61, afternoon: 92, evening: 38 },
    { day: 'Thu', morning: 48, afternoon: 81, evening: 45 },
    { day: 'Fri', morning: 55, afternoon: 88, evening: 52 },
    { day: 'Sat', morning: 32, afternoon: 45, evening: 28 },
    { day: 'Sun', morning: 28, afternoon: 38, evening: 22 },
  ];

  const learningPathData = [
    { path: 'Full Stack', students: 456, avgTime: '6 months' },
    { path: 'Hardware Tech', students: 389, avgTime: '4 months' },
    { path: 'Network Admin', students: 267, avgTime: '5 months' },
    { path: 'System Admin', students: 122, avgTime: '3 months' },
  ];

  return (
    <div className="admin-analytics">
      {/* Header with Time Range Filter */}
      <div className="analytics-header">
        <div className="header-text">
          <h1>Analytics Dashboard</h1>
          <p>Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`time-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`time-btn ${timeRange === 'year' ? 'active' : ''}`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
          <button className="btn-export">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-card purple">
          <div className="metric-icon">
            <TrendingUp size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-value">+23.5%</span>
            <span className="metric-label">Growth Rate</span>
            <span className="metric-change positive">↑ 5.2% from last month</span>
          </div>
        </div>

        <div className="metric-card blue">
          <div className="metric-icon">
            <Users size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-value">1,234</span>
            <span className="metric-label">Active Students</span>
            <span className="metric-change positive">↑ 156 new this month</span>
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-icon">
            <Award size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-value">156</span>
            <span className="metric-label">Certificates Issued</span>
            <span className="metric-change positive">↑ 12 this week</span>
          </div>
        </div>

        <div className="metric-card orange">
          <div className="metric-icon">
            <Clock size={28} />
          </div>
          <div className="metric-content">
            <span className="metric-value">4.5 hrs</span>
            <span className="metric-label">Avg Study Time</span>
            <span className="metric-change neutral">→ Same as last week</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Student Growth Chart */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Student Growth Trend</h3>
            <span className="chart-subtitle">Total enrolled students over time</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={studentGrowthData}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5B4A9E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#5B4A9E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="month" stroke="#636e72" style={{ fontSize: '12px', fontWeight: '500' }} />
              <YAxis stroke="#636e72" style={{ fontSize: '12px', fontWeight: '500' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#5B4A9E',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(91, 74, 158, 0.3)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="students" 
                stroke="#5B4A9E" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorStudents)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Performance */}
        <div className="chart-card medium">
          <div className="chart-header">
            <h3>Course Performance</h3>
            <span className="chart-subtitle">Completion & average scores</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={coursePerformanceData}>
              <defs>
                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B4A9E" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#7B6BBD" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00b894" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#00d2a0" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="course" stroke="#636e72" style={{ fontSize: '11px' }} />
              <YAxis stroke="#636e72" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#5B4A9E',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Legend />
              <Bar dataKey="completion" fill="url(#colorCompletion)" radius={[8, 8, 0, 0]} name="Completion %" />
              <Bar dataKey="avgScore" fill="url(#colorScore)" radius={[8, 8, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Certificates by Level */}
        <div className="chart-card small">
          <div className="chart-header">
            <h3>Certificates by Level</h3>
            <span className="chart-subtitle">Distribution breakdown</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={certificatesByLevelData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {certificatesByLevelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#5B4A9E',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-legend">
            {certificatesByLevelData.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Enrollments */}
        <div className="chart-card medium">
          <div className="chart-header">
            <h3>Monthly Enrollments</h3>
            <span className="chart-subtitle">New student registrations</span>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={enrollmentByMonthData}>
              <defs>
                <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B6BBD" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7B6BBD" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis dataKey="month" stroke="#636e72" />
              <YAxis stroke="#636e72" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#5B4A9E',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="enrollments" 
                stroke="#5B4A9E" 
                strokeWidth={3}
                dot={{ fill: '#5B4A9E', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learning Paths Table */}
      <div className="learning-paths-section">
        <div className="section-header">
          <h3>Popular Learning Paths</h3>
          <span className="section-subtitle">Most enrolled career tracks</span>
        </div>
        <div className="paths-grid">
          {learningPathData.map((path, index) => (
            <div key={index} className="path-card">
              <div className="path-rank">#{index + 1}</div>
              <div className="path-content">
                <h4>{path.path}</h4>
                <div className="path-stats">
                  <span className="path-students">
                    <Users size={16} />
                    {path.students} students
                  </span>
                  <span className="path-time">
                    <Clock size={16} />
                    {path.avgTime}
                  </span>
                </div>
              </div>
              <div className="path-progress">
                <div 
                  className="path-bar"
                  style={{ width: `${(path.students / 500) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}