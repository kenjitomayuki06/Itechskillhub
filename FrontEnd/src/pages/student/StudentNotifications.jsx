import { useState } from 'react';
import {
  Bell, CheckCircle, BookOpen, FileText,
  Award, AlertCircle, Megaphone, Trash2,
  CheckCheck, Filter, Clock
} from 'lucide-react';
import '../../styles/pages/student/StudentNotifications.css';

/* ── Mock data — replace with real API/websocket when backend is ready ── */
const INITIAL_NOTIFS = [
  {
    id: 1,
    type: 'grade',
    title: 'Assignment Graded',
    message: 'Your submission "OS Installation Documentation" has been graded. You scored 92/100.',
    course: 'CSS NC II',
    time: new Date(Date.now() - 1 * 3600000),
    unread: true,
  },
  {
    id: 2,
    type: 'deadline',
    title: 'Deadline Tomorrow',
    message: '"Lab Report: PC Assembly" is due tomorrow. Make sure to submit before the deadline.',
    course: 'PC Hardware',
    time: new Date(Date.now() - 3 * 3600000),
    unread: true,
  },
  {
    id: 3,
    type: 'announcement',
    title: 'Instructor Announcement',
    message: 'Lab session has been moved to Friday 2:00 PM. Please update your schedules accordingly.',
    course: 'NSC',
    time: new Date(Date.now() - 5 * 3600000),
    unread: true,
  },
  {
    id: 4,
    type: 'progress',
    title: 'Module Completed',
    message: 'Congratulations! You completed Module 3: Networking Fundamentals.',
    course: 'NSC',
    time: new Date(Date.now() - 8 * 3600000),
    unread: false,
  },
  {
    id: 5,
    type: 'certificate',
    title: 'Certificate Earned! 🎉',
    message: 'You have successfully completed PC Hardware Assembly & Troubleshooting. Your certificate is now available.',
    course: 'PC Hardware',
    time: new Date(Date.now() - 1 * 86400000),
    unread: false,
  },
  {
    id: 6,
    type: 'grade',
    title: 'Quiz Graded',
    message: 'Your quiz "Cable Types & Standards" has been graded. You scored 88/100.',
    course: 'NSC',
    time: new Date(Date.now() - 2 * 86400000),
    unread: false,
  },
  {
    id: 7,
    type: 'deadline',
    title: 'Upcoming Deadline',
    message: '"Quiz: OSI Model Layers" is due in 3 days. Start reviewing your notes.',
    course: 'NSC',
    time: new Date(Date.now() - 3 * 86400000),
    unread: false,
  },
  {
    id: 8,
    type: 'announcement',
    title: 'New Course Material Added',
    message: 'Your instructor has uploaded new reference materials for Module 4. Check it out!',
    course: 'CSS NC II',
    time: new Date(Date.now() - 4 * 86400000),
    unread: false,
  },
  {
    id: 9,
    type: 'progress',
    title: 'Streak Achievement!',
    message: 'You\'ve studied 5 days in a row. Keep it up to maintain your learning streak!',
    course: null,
    time: new Date(Date.now() - 5 * 86400000),
    unread: false,
  },
  {
    id: 10,
    type: 'grade',
    title: 'Assignment Graded',
    message: '"Cable Crimping Lab Report" was graded. You scored 89/100. Great work!',
    course: 'NSC',
    time: new Date(Date.now() - 6 * 86400000),
    unread: false,
  },
];

const FILTERS = ['All', 'Unread', 'Grades', 'Deadlines', 'Announcements', 'Progress'];

const TYPE_MAP = {
  grade:        { icon: FileText,   color: '#5B4A9E', bg: '#ede9fe', label: 'Grade'        },
  deadline:     { icon: AlertCircle, color: '#ef4444', bg: '#fef2f2', label: 'Deadline'     },
  announcement: { icon: Megaphone,  color: '#f59e0b', bg: '#fffbeb', label: 'Announcement' },
  progress:     { icon: BookOpen,   color: '#3b82f6', bg: '#eff6ff', label: 'Progress'      },
  certificate:  { icon: Award,      color: '#10b981', bg: '#f0fdf4', label: 'Certificate'   },
};

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date) / 1000);
  if (diff < 60)              return 'Just now';
  if (diff < 3600)            return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)           return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7)       return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export default function StudentNotifications() {
  const [notifs, setNotifs]           = useState(INITIAL_NOTIFS);
  const [activeFilter, setActiveFilter] = useState('All');

  const unreadCount = notifs.filter((n) => n.unread).length;

  const filtered = notifs.filter((n) => {
    if (activeFilter === 'All')           return true;
    if (activeFilter === 'Unread')        return n.unread;
    if (activeFilter === 'Grades')        return n.type === 'grade';
    if (activeFilter === 'Deadlines')     return n.type === 'deadline';
    if (activeFilter === 'Announcements') return n.type === 'announcement';
    if (activeFilter === 'Progress')      return n.type === 'progress' || n.type === 'certificate';
    return true;
  });

  function markRead(id) {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  }

  function markAllRead() {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  function deleteNotif(id) {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }

  function clearAll() {
    setNotifs([]);
  }

  return (
    <div className="sn-page">

      {/* ── Header ── */}
      <div className="sn-header">
        <div>
          <h1 className="sn-title">Notifications</h1>
          <p className="sn-subtitle">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="sn-header-actions">
          {unreadCount > 0 && (
            <button className="sn-mark-all-btn" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark all as read
            </button>
          )}
          {notifs.length > 0 && (
            <button className="sn-clear-btn" onClick={clearAll}>
              <Trash2 size={14} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="sn-stats-row">
        {Object.entries(TYPE_MAP).map(([type, meta]) => {
          const Icon = meta.icon;
          const count = notifs.filter((n) => n.type === type).length;
          return (
            <div
              key={type}
              className="sn-stat"
              style={{ borderColor: meta.color + '30' }}
              onClick={() => {
                const filterMap = {
                  grade: 'Grades', deadline: 'Deadlines',
                  announcement: 'Announcements', progress: 'Progress', certificate: 'Progress',
                };
                setActiveFilter(filterMap[type] || 'All');
              }}
            >
              <div className="sn-stat-icon" style={{ background: meta.bg, color: meta.color }}>
                <Icon size={16} />
              </div>
              <div>
                <div className="sn-stat-val">{count}</div>
                <div className="sn-stat-lbl">{meta.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="sn-filters">
        <Filter size={14} className="sn-filter-icon" />
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`sn-filter-btn ${activeFilter === f ? 'sn-filter-active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
            {f === 'Unread' && unreadCount > 0 && (
              <span className="sn-filter-badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Notifications List ── */}
      {filtered.length === 0 ? (
        <div className="sn-empty">
          <Bell size={40} />
          <p>No notifications here.</p>
          <span>Check back later!</span>
        </div>
      ) : (
        <div className="sn-list">
          {filtered.map((notif) => {
            const meta = TYPE_MAP[notif.type] || TYPE_MAP.progress;
            const Icon = meta.icon;

            return (
              <div
                key={notif.id}
                className={`sn-item ${notif.unread ? 'sn-item-unread' : ''}`}
                onClick={() => markRead(notif.id)}
              >
                {/* Unread dot */}
                {notif.unread && <div className="sn-unread-dot" />}

                {/* Icon */}
                <div
                  className="sn-item-icon"
                  style={{ background: meta.bg, color: meta.color }}
                >
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="sn-item-content">
                  <div className="sn-item-top">
                    <span className="sn-item-title">{notif.title}</span>
                    <span
                      className="sn-item-type-badge"
                      style={{ background: meta.bg, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <p className="sn-item-message">{notif.message}</p>
                  <div className="sn-item-meta">
                    {notif.course && (
                      <span className="sn-item-course">
                        <BookOpen size={11} /> {notif.course}
                      </span>
                    )}
                    <span className="sn-item-time">
                      <Clock size={11} /> {timeAgo(notif.time)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="sn-item-actions">
                  {notif.unread && (
                    <button
                      className="sn-read-btn"
                      title="Mark as read"
                      onClick={(e) => { e.stopPropagation(); markRead(notif.id); }}
                    >
                      <CheckCircle size={15} />
                    </button>
                  )}
                  <button
                    className="sn-delete-btn"
                    title="Delete"
                    onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}