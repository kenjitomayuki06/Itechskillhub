import { BookOpen, Users, FileText, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/common/StatCard';
import '../../styles/instructor/InstructorDashboard.css';

const instructorStats = {
  myCourses: 3,
  totalStudents: 87,
  assignments: 8,
  completionRate: 74,
  studentProgress: [
    { date: 'Feb 14', count: 12 },
    { date: 'Feb 15', count: 18 },
    { date: 'Feb 16', count: 9 },
    { date: 'Feb 17', count: 22 },
    { date: 'Feb 18', count: 15 },
    { date: 'Feb 19', count: 27 },
    { date: 'Feb 20', count: 20 },
  ],
  assignmentSubmissions: [
    { course: 'CSS NC II', submitted: 28, total: 35 },
    { course: 'PC Hardware', submitted: 22, total: 30 },
    { course: 'Network Setup', submitted: 18, total: 22 },
  ],
};

export default function InstructorDashboard() {
  const userName = sessionStorage.getItem("userName") || "Instructor";
  const userEmail = sessionStorage.getItem("userEmail") || "instructor@email.com";
  
  return (
    
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <p>Welcome back! Here's an overview of your courses and students.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="My Courses"
          value={instructorStats.myCourses}
          icon={BookOpen}
          trend={0}
          color="purple"
        />
        <StatCard
          title="Total Students"
          value={instructorStats.totalStudents}
          icon={Users}
          trend={5.2}
          color="blue"
        />
        <StatCard
          title="Assignments"
          value={instructorStats.assignments}
          icon={FileText}
          trend={0}
          color="green"
        />
        <StatCard
          title="Completion Rate"
          value={`${instructorStats.completionRate}%`}
          icon={TrendingUp}
          trend={3.8}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Student Activity Chart */}
        <div className="chart-card">
          <h3>Student Activity (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={instructorStats.studentProgress}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B6BBD" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7B6BBD" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis
                dataKey="date"
                stroke="#636e72"
                style={{ fontSize: '12px', fontWeight: '500' }}
              />
              <YAxis
                stroke="#636e72"
                style={{ fontSize: '12px', fontWeight: '500' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#5B4A9E',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(91, 74, 158, 0.3)'
                }}
                labelStyle={{ color: 'white', fontWeight: '600' }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#5B4A9E"
                strokeWidth={3}
                dot={{ fill: '#5B4A9E', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#7B6BBD', stroke: '#fff', strokeWidth: 2 }}
                fill="url(#colorProgress)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Assignment Submissions Chart */}
        <div className="chart-card">
          <h3>Assignment Submissions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={instructorStats.assignmentSubmissions}>
              <defs>
                <linearGradient id="colorSubmitted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B4A9E" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#7B6BBD" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c8c0e8" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#ddd8f5" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
              <XAxis
                dataKey="course"
                stroke="#636e72"
                style={{ fontSize: '11px', fontWeight: '500' }}
              />
              <YAxis
                stroke="#636e72"
                style={{ fontSize: '12px', fontWeight: '500' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#5B4A9E',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(91, 74, 158, 0.3)'
                }}
                labelStyle={{ color: 'white', fontWeight: '600' }}
                cursor={{ fill: 'rgba(91, 74, 158, 0.1)' }}
              />
              <Bar dataKey="total" fill="url(#colorTotal)" radius={[8, 8, 0, 0]} maxBarSize={50} name="Total" />
              <Bar dataKey="submitted" fill="url(#colorSubmitted)" radius={[8, 8, 0, 0]} maxBarSize={50} name="Submitted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-card">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <p><strong>Juan Dela Cruz</strong> submitted <strong>Network Lab Assignment</strong></p>
              <span className="activity-time">1 hour ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">✅</div>
            <div className="activity-content">
              <p><strong>Maria Santos</strong> completed <strong>PC Hardware Module 3</strong></p>
              <span className="activity-time">3 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">🎓</div>
            <div className="activity-content">
              <p><strong>3 new students</strong> enrolled in <strong>CSS NC II</strong></p>
              <span className="activity-time">Yesterday</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">⚠️</div>
            <div className="activity-content">
              <p><strong>5 students</strong> have not submitted <strong>OS Installation Quiz</strong></p>
              <span className="activity-time">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}