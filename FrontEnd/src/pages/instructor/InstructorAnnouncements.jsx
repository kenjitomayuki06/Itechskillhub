import { useState } from 'react';
import { Megaphone, Send, Clock, BookOpen, Trash2, AlertCircle, User } from 'lucide-react';
import '../../styles/instructor/InstructorAnnouncements.css';

const AVAILABLE_COURSES = [
  { id: 'all', title: 'All Enrolled Students' },
  { id: 1, title: 'CSS NC II — Computer Systems Servicing' },
  { id: 2, title: 'Network Systems Cabling (NSC)' },
  { id: 3, title: 'PC Hardware Assembly & Troubleshooting' },
  { id: 4, title: 'OS Installation & Configuration (OSIC)' }
];

const MOCK_STUDENTS = [
  { id: 's1', name: 'John Doe', course: 'CSS NC II — Computer Systems Servicing' },
  { id: 's2', name: 'Jane Smith', course: 'Network Systems Cabling (NSC)' },
  { id: 's3', name: 'Mark Ramos', course: 'PC Hardware Assembly & Troubleshooting' },
  { id: 's4', name: 'Ace Flores', course: 'OS Installation & Configuration (OSIC)' }
];

export default function InstructorAnnouncements() {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Upcoming Assessment Schedule Notice',
      targetType: 'course',
      targetName: 'CSS NC II — Computer Systems Servicing',
      content: 'Please prepare for our upcoming practical laboratory assessment covering computer assembly scheduled on Monday.',
      date: 'Jun 11, 2026 · 02:30 PM'
    }
  ]);

  const [broadcastMode, setBroadcastMode] = useState('course'); // 'course' or 'student'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetCourse, setTargetCourse] = useState('all');
  const [targetStudent, setTargetStudent] = useState(MOCK_STUDENTS[0].id);

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    let targetName = '';
    if (broadcastMode === 'course') {
      const selectedTarget = AVAILABLE_COURSES.find(c => c.id.toString() === targetCourse.toString());
      targetName = selectedTarget ? selectedTarget.title : 'All Students';
    } else {
      const selectedTarget = MOCK_STUDENTS.find(s => s.id === targetStudent);
      targetName = selectedTarget ? `👤 ${selectedTarget.name}` : 'Specific Student';
    }

    const newAnnouncement = {
      id: Date.now(),
      title,
      targetType: broadcastMode,
      targetName,
      content,
      date: new Date().toLocaleString('en-US', { 
        month: 'short', day: 'numeric', year: 'numeric', 
        hour: '2-digit', minute: '2-digit', hour12: true 
      })
    };

    setAnnouncements([newAnnouncement, ...announcements]);
    setTitle('');
    setContent('');
  };

  const handleDelete = (id) => {
    setAnnouncements(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="ia-page">
      <div className="ia-header">
        <h1 className="ia-title">Broadcast Announcements</h1>
        <p className="ia-subtitle">Publish critical news updates or message specific students instantly</p>
      </div>

      <div className="ia-workspace-grid">
        <form onSubmit={handlePublish} className="ia-form-card">
          <h3 className="ia-section-heading"><Send size={16} /> Compose Broadcast</h3>
          
          <div className="ia-mode-toggle">
            <button
              type="button"
              className={`ia-toggle-btn ${broadcastMode === 'course' ? 'active' : ''}`}
              onClick={() => setBroadcastMode('course')}
            >
              <BookOpen size={14} /> Course Group
            </button>
            <button
              type="button"
              className={`ia-toggle-btn ${broadcastMode === 'student' ? 'active' : ''}`}
              onClick={() => setBroadcastMode('student')}
            >
              <User size={14} /> Specific Student
            </button>
          </div>

          <div className="ia-field-group">
            <label className="ia-label">Subject Title</label>
            <input 
              type="text" 
              placeholder="e.g., Extended Deadline for Assignment 2"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="ia-input"
              required
            />
          </div>

          {broadcastMode === 'course' ? (
            <div className="ia-field-group">
              <label className="ia-label">Target Course Audience</label>
              <select value={targetCourse} onChange={e => setTargetCourse(e.target.value)} className="ia-select">
                {AVAILABLE_COURSES.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="ia-field-group">
              <label className="ia-label">Select Target Student</label>
              <select value={targetStudent} onChange={e => setTargetStudent(e.target.value)} className="ia-select">
                {MOCK_STUDENTS.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.course})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="ia-field-group">
            <label className="ia-label">Message Body</label>
            <textarea 
              placeholder="Write your details or student message notes here..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="ia-textarea"
              rows={5}
              required
            />
          </div>

          <button type="submit" className="ia-publish-btn">
            <Megaphone size={16} /> Send Announcement Notification
          </button>
        </form>

        <div className="ia-history-card">
          <h3 className="ia-section-heading"><Clock size={16} /> Sent Message Logs</h3>
          
          <div className="ia-stream-list">
            {announcements.length === 0 ? (
              <div className="ia-empty">
                <AlertCircle size={32} />
                <p>No messages pushed yet during this term session.</p>
              </div>
            ) : (
              announcements.map(item => (
                <div key={item.id} className="ia-stream-item">
                  <div className="ia-stream-item-header">
                    <div>
                      <h4 className="ia-stream-item-title">{item.title}</h4>
                      <div className="ia-stream-meta">
                        <span className={`ia-stream-badge ${item.targetType === 'student' ? 'direct' : ''}`}>
                          {item.targetType === 'student' ? <User size={11} /> : <BookOpen size={11} />} 
                          {item.targetName}
                        </span>
                        <span className="ia-stream-date">🕒 {item.date}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="ia-delete-btn">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="ia-stream-text">{item.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}