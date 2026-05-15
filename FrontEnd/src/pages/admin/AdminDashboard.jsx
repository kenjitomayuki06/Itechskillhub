import { Users, BookOpen, GraduationCap, Award } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { adminStats } from '../../data/mockStats';
import '../../styles/admin/AdminDashboard.css'

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Students"
          value={adminStats.totalStudents.toLocaleString()}
          icon={Users}
          trend={8.5}
          color="blue"
        />
        <StatCard
          title="Active Courses"
          value={adminStats.activeCourses}
          icon={BookOpen}
          trend={0}
          color="green"
        />
        <StatCard
          title="Instructors"
          value={adminStats.totalInstructors}
          icon={GraduationCap}
          trend={12.5}
          color="purple"
        />
        <StatCard
          title="Certificates Issued"
          value={adminStats.totalCertificates}
          icon={Award}
          trend={8.2}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <h3>Recent Enrollments (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={adminStats.recentEnrollments}>
              <defs>
                <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7B6BBD" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7B6BBD" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: '500' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: '500' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#5B4A9E',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(91,74,158,0.3)'
                }}
                labelStyle={{ color: 'white', fontWeight: '600' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#5B4A9E"
                strokeWidth={2.5}
                dot={{ fill: '#5B4A9E', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#7B6BBD', stroke: '#fff', strokeWidth: 2 }}
                fill="url(#colorEnrollment)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Course Completion Rates</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={adminStats.courseCompletionRates}>
              <defs>
                <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#5B4A9E" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#9B8BCD" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
              <XAxis dataKey="course" stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: '500' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '11px', fontWeight: '500' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#5B4A9E',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(91,74,158,0.3)'
                }}
                labelStyle={{ color: 'white', fontWeight: '600' }}
                cursor={{ fill: 'rgba(91,74,158,0.07)' }}
              />
              <Bar dataKey="rate" fill="url(#colorBar)" radius={[6,6,0,0]} maxBarSize={52} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity — Premium LMS */}
      <div className="activity-card">
        <h3>
          Recent Activity
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            color: '#7B6BBD',
            background: 'rgba(91,74,158,0.08)',
            padding: '4px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.4px'
          }}>View All</span>
        </h3>

        <div className="activity-list">
          {/* Item 1 */}
          <div className="activity-item">
            <div className="activity-icon">👤</div>
            <div className="activity-content">
              <p>
                <strong>Maria Santos</strong> completed <strong>PC Hardware Module 2</strong>
              </p>
              <div className="activity-meta">
                <span className="activity-time">2 hours ago</span>
                <span style={{
                  fontSize: '10.5px', fontWeight: 700,
                  padding: '2px 8px', borderRadius: '20px',
                  background: 'rgba(16,185,129,0.1)', color: '#059669',
                  textTransform: 'uppercase', letterSpacing: '0.4px'
                }}>Completed</span>
              </div>
            </div>
          </div>

          {/* Item 2 */}
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <p>
                <strong>Juan Dela Cruz</strong> submitted <strong>Network Lab Assignment</strong>
              </p>
              <div className="activity-meta">
                <span className="activity-time">4 hours ago</span>
                <span style={{
                  fontSize: '10.5px', fontWeight: 700,
                  padding: '2px 8px', borderRadius: '20px',
                  background: 'rgba(14,165,233,0.1)', color: '#0284c7',
                  textTransform: 'uppercase', letterSpacing: '0.4px'
                }}>Submitted</span>
              </div>
            </div>
          </div>

          {/* Item 3 */}
          <div className="activity-item">
            <div className="activity-icon">🎓</div>
            <div className="activity-content">
              <p>
                <strong>5 new students</strong> enrolled in <strong>CSS NC II</strong>
              </p>
              <div className="activity-meta">
                <span className="activity-time">1 day ago</span>
                <span style={{
                  fontSize: '10.5px', fontWeight: 700,
                  padding: '2px 8px', borderRadius: '20px',
                  background: 'rgba(91,74,158,0.1)', color: '#5B4A9E',
                  textTransform: 'uppercase', letterSpacing: '0.4px'
                }}>Enrolled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}