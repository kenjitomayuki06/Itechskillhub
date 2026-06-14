import { useState, useEffect } from 'react';
import { apiFetch } from '../../services/authService';
import {
  Bell, BookOpen, Award, ClipboardCheck, Megaphone,
  Clock, AlertCircle, Loader, Inbox
} from 'lucide-react';
import '../../styles/pages/student/StudentNotifications.css';

/* ── Notification type → icon/color mapping ── */
const TYPE_CONFIG = {
  announcement:      { icon: Megaphone,       color: '#3b82f6', label: 'Announcement' },
  quiz_result:       { icon: ClipboardCheck,  color: '#5B4A9E', label: 'Quiz Result' },
  assignment_grade:  { icon: BookOpen,        color: '#10b981', label: 'Assignment' },
  certificate:       { icon: Award,           color: '#f59e0b', label: 'Certificate' },
};

const FILTERS = ['All', 'Announcement', 'Quiz Result', 'Assignment', 'Certificate'];

/* ── Helper: relative time formatting ── */
function getRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await apiFetch('/api/student/notifications');
        setNotifications(res?.notifications ?? []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setError('Hindi ma-load ang mga notification. Subukan ulit.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filtered = notifications.filter((n) => {
    if (filter === 'All') return true;
    return TYPE_CONFIG[n.type]?.label === filter;
  });

  return (
    <div className="sn-page">
      {/* Header */}
      <div className="sn-header">
        <div>
          <h1 className="sn-title">
            <Bell size={24} /> Notifications
          </h1>
          <p className="sn-subtitle">Stay updated on your courses, quizzes, and achievements</p>
        </div>
      </div>

      {error && (
        <div className="sn-error-banner">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Filters */}
      <div className="sn-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`sn-filter-btn ${filter === f ? 'sn-filter-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="sn-list">
        {loading ? (
          <div className="sn-loading">
            <Loader size={32} className="sn-spinner-icon" />
            <p>Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="sn-empty">
            <Inbox size={40} />
            <p>No notifications yet.</p>
            <span className="sn-empty-sub">
              You'll see updates here about announcements, quiz results, grades, and certificates.
            </span>
          </div>
        ) : (
          filtered.map((n, i) => {
            const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.announcement;
            const Icon = config.icon;
            return (
              <div key={`${n.type}-${n.ref_id}-${i}`} className="sn-item">
                <div className="sn-item-icon" style={{ background: config.color + '18', color: config.color }}>
                  <Icon size={20} />
                </div>
                <div className="sn-item-body">
                  <div className="sn-item-top">
                    <span className="sn-item-type" style={{ color: config.color }}>
                      {config.label}
                    </span>
                    <span className="sn-item-time">
                      <Clock size={12} /> {getRelativeTime(n.created_at)}
                    </span>
                  </div>
                  <h3 className="sn-item-title">{n.title}</h3>
                  <p className="sn-item-message">{n.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}