import { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Edit3,
  Camera, Save, X, Lock, Eye, EyeOff,
  BookOpen, Award, TrendingUp, Clock,
  CheckCircle, AlertCircle, Shield
} from 'lucide-react';
import { getUser, setUser, apiFetch } from '../../services/authService';
import toast from 'react-hot-toast';
import '../../styles/pages/student/StudentProfile.css';


/* ── Mock enrolled course stats — replace with real API call ── */
const MOCK_STATS = {
  enrolledCourses: 3,
  completedCourses: 1,
  certificates: 1,
  avgProgress: 67,
  totalStudyHours: 42,
  avgGrade: 91,
};

const MOCK_RECENT_COURSES = [
  { id: 1, title: 'CSS NC II — Computer Systems Servicing', icon: '🖥️', color: '#5B4A9E', progress: 60 },
  { id: 2, title: 'Network Systems Cabling (NSC)',          icon: '🔌', color: '#3b82f6', progress: 25 },
  { id: 3, title: 'PC Hardware Assembly & Troubleshooting', icon: '⚙️', color: '#10b981', progress: 100 },
];

export default function StudentProfile() {
  const [currentUser, setCurrentUser]     = useState(null);
  const [activeTab, setActiveTab]         = useState('profile');
  const [isEditing, setIsEditing]         = useState(false);
  const [saving, setSaving]               = useState(false);
  const [saveError, setSaveError]         = useState('');
  const [saveSuccess, setSaveSuccess]     = useState('');
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarRef = useRef();

  /* ── Password fields ── */
  const [pwForm, setPwForm]       = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw]       = useState({ current: false, newPw: false, confirm: false });
  const [pwSaving, setPwSaving]   = useState(false);
  const [pwError, setPwError]     = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  /* ── Profile form ── */
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', bio: '', birthday: '',
  });

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user);
    if (user) {
      setForm({
        name:     user.name     || '',
        email:    user.email    || '',
        phone:    user.phone    || '',
        address:  user.address  || '',
        bio:      user.bio      || '',
        birthday: user.birthday || '',
      });
    }
  }, []);

  /* ── Avatar change ── */
  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  /* ── Save profile ── */
  async function handleSave() {
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const token = getToken();
      // Replace this block with a real PATCH /api/auth/me call when backend is ready
      await new Promise((r) => setTimeout(r, 900));
      const updated = {
        ...currentUser,
        ...form,
        ...(avatarPreview ? { avatar: avatarPreview } : {}),
      };
      setUser(updated);
      setCurrentUser(updated);
      setSaveSuccess('Profile updated successfully!');
      setIsEditing(false);
      setAvatarPreview(null);
    } catch (err) {
      setSaveError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    const user = getUser();
    setForm({
      name:     user?.name     || '',
      email:    user?.email    || '',
      phone:    user?.phone    || '',
      address:  user?.address  || '',
      bio:      user?.bio      || '',
      birthday: user?.birthday || '',
    });
    setAvatarPreview(null);
    setIsEditing(false);
    setSaveError('');
  }

  /* ── Change password ── */
  async function handleChangePassword() {
    setPwError('');
    setPwSuccess('');
    if (!pwForm.current)  { setPwError('Enter your current password.'); return; }
    if (pwForm.newPw.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (pwForm.newPw !== pwForm.confirm) { setPwError('Passwords do not match.'); return; }
    setPwSaving(true);
    try {
      // Replace with real PATCH /api/auth/change-password call when backend is ready
      await new Promise((r) => setTimeout(r, 900));
      setPwSuccess('Password changed successfully!');
      setPwForm({ current: '', newPw: '', confirm: '' });
    } catch (err) {
      setPwError(err.message || 'Failed to change password.');
    } finally {
      setPwSaving(false);
    }
  }

  const avatarSrc =
    avatarPreview ||
    currentUser?.avatar ||
    currentUser?.picture ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'Student')}&background=5B4A9E&color=fff&size=128`;

  return (
    <div className="sp2-page">

      {/* ── Header Card ── */}
      <div className="sp2-hero">
        <div className="sp2-hero-bg" />
        <div className="sp2-hero-content">

          {/* Avatar */}
          <div className="sp2-avatar-wrap">
            <img src={avatarSrc} alt="Profile" className="sp2-avatar" />
            {isEditing && (
              <button
                className="sp2-avatar-change"
                onClick={() => avatarRef.current?.click()}
                title="Change photo"
              >
                <Camera size={14} />
              </button>
            )}
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              className="sp2-avatar-input"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Name & role */}
          <div className="sp2-hero-info">
            <h1 className="sp2-hero-name">{currentUser?.name || 'Student'}</h1>
            <p className="sp2-hero-role">
              <Shield size={13} /> Student · ITechSkillsHub
            </p>
            {currentUser?.email && (
              <p className="sp2-hero-email"><Mail size={13} /> {currentUser.email}</p>
            )}
          </div>

          {/* Edit button */}
          <div className="sp2-hero-actions">
            {!isEditing ? (
              <button className="sp2-edit-btn" onClick={() => setIsEditing(true)}>
                <Edit3 size={15} /> Edit Profile
              </button>
            ) : (
              <div className="sp2-edit-actions">
                <button className="sp2-cancel-btn" onClick={handleCancel}>
                  <X size={14} /> Cancel
                </button>
                <button className="sp2-save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="sp2-spinner" /> : <Save size={14} />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats strip */}
        <div className="sp2-stats-strip">
          <div className="sp2-strip-stat">
            <BookOpen size={16} />
            <div>
              <span className="sp2-strip-val">{MOCK_STATS.enrolledCourses}</span>
              <span className="sp2-strip-lbl">Courses</span>
            </div>
          </div>
          <div className="sp2-strip-divider" />
          <div className="sp2-strip-stat">
            <Award size={16} />
            <div>
              <span className="sp2-strip-val">{MOCK_STATS.certificates}</span>
              <span className="sp2-strip-lbl">Certificates</span>
            </div>
          </div>
          <div className="sp2-strip-divider" />
          <div className="sp2-strip-stat">
            <TrendingUp size={16} />
            <div>
              <span className="sp2-strip-val">{MOCK_STATS.avgProgress}%</span>
              <span className="sp2-strip-lbl">Avg. Progress</span>
            </div>
          </div>
          <div className="sp2-strip-divider" />
          <div className="sp2-strip-stat">
            <Clock size={16} />
            <div>
              <span className="sp2-strip-val">{MOCK_STATS.totalStudyHours}h</span>
              <span className="sp2-strip-lbl">Study Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="sp2-tabs">
        {['profile', 'security', 'courses'].map((tab) => (
          <button
            key={tab}
            className={`sp2-tab ${activeTab === tab ? 'sp2-tab-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'profile'  && <><User size={14} /> Profile Info</>}
            {tab === 'security' && <><Lock size={14} /> Security</>}
            {tab === 'courses'  && <><BookOpen size={14} /> My Courses</>}
          </button>
        ))}
      </div>

      {/* ── Tab: Profile Info ── */}
      {activeTab === 'profile' && (
        <div className="sp2-section">
          {saveSuccess && (
            <div className="sp2-alert sp2-alert-success">
              <CheckCircle size={15} /> {saveSuccess}
            </div>
          )}
          {saveError && (
            <div className="sp2-alert sp2-alert-error">
              <AlertCircle size={15} /> {saveError}
            </div>
          )}

          <div className="sp2-form-grid">
            {/* Full Name */}
            <div className="sp2-form-group">
              <label><User size={13} /> Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Juan dela Cruz"
                />
              ) : (
                <div className="sp2-field-val">{form.name || <span className="sp2-empty">Not set</span>}</div>
              )}
            </div>

            {/* Email */}
            <div className="sp2-form-group">
              <label><Mail size={13} /> Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="juan@email.com"
                />
              ) : (
                <div className="sp2-field-val">{form.email || <span className="sp2-empty">Not set</span>}</div>
              )}
            </div>

            {/* Phone */}
            <div className="sp2-form-group">
              <label><Phone size={13} /> Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+63 9XX XXX XXXX"
                />
              ) : (
                <div className="sp2-field-val">{form.phone || <span className="sp2-empty">Not set</span>}</div>
              )}
            </div>

            {/* Birthday */}
            <div className="sp2-form-group">
              <label><Calendar size={13} /> Birthday</label>
              {isEditing ? (
                <input
                  type="date"
                  value={form.birthday}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                />
              ) : (
                <div className="sp2-field-val">
                  {form.birthday
                    ? new Date(form.birthday).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
                    : <span className="sp2-empty">Not set</span>}
                </div>
              )}
            </div>

            {/* Address — full width */}
            <div className="sp2-form-group sp2-form-full">
              <label><MapPin size={13} /> Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Quezon City, Philippines"
                />
              ) : (
                <div className="sp2-field-val">{form.address || <span className="sp2-empty">Not set</span>}</div>
              )}
            </div>

            {/* Bio — full width */}
            <div className="sp2-form-group sp2-form-full">
              <label><Edit3 size={13} /> Bio</label>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Tell us a little about yourself..."
                />
              ) : (
                <div className="sp2-field-val sp2-field-bio">
                  {form.bio || <span className="sp2-empty">No bio yet.</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Security ── */}
      {activeTab === 'security' && (
        <div className="sp2-section">
          <div className="sp2-security-card">
            <h3 className="sp2-security-title"><Lock size={16} /> Change Password</h3>
            <p className="sp2-security-sub">Use a strong password that you don't use anywhere else.</p>

            {pwSuccess && (
              <div className="sp2-alert sp2-alert-success">
                <CheckCircle size={15} /> {pwSuccess}
              </div>
            )}
            {pwError && (
              <div className="sp2-alert sp2-alert-error">
                <AlertCircle size={15} /> {pwError}
              </div>
            )}

            <div className="sp2-pw-group">
              <label>Current Password</label>
              <div className="sp2-pw-input-wrap">
                <input
                  type={showPw.current ? 'text' : 'password'}
                  value={pwForm.current}
                  onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                  placeholder="Enter current password"
                />
                <button
                  className="sp2-pw-toggle"
                  onClick={() => setShowPw({ ...showPw, current: !showPw.current })}
                  type="button"
                >
                  {showPw.current ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="sp2-pw-group">
              <label>New Password</label>
              <div className="sp2-pw-input-wrap">
                <input
                  type={showPw.newPw ? 'text' : 'password'}
                  value={pwForm.newPw}
                  onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                  placeholder="At least 8 characters"
                />
                <button
                  className="sp2-pw-toggle"
                  onClick={() => setShowPw({ ...showPw, newPw: !showPw.newPw })}
                  type="button"
                >
                  {showPw.newPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Password strength indicator */}
              {pwForm.newPw && (
                <div className="sp2-pw-strength">
                  {['Weak', 'Fair', 'Strong', 'Very Strong'].map((label, i) => (
                    <div
                      key={i}
                      className={`sp2-pw-bar ${
                        pwForm.newPw.length >= (i + 1) * 3 ? `sp2-pw-bar-${label.toLowerCase().replace(' ', '')}` : ''
                      }`}
                    />
                  ))}
                  <span className="sp2-pw-strength-label">
                    {pwForm.newPw.length < 6   ? 'Weak'
                    : pwForm.newPw.length < 10  ? 'Fair'
                    : pwForm.newPw.length < 14  ? 'Strong'
                    : 'Very Strong'}
                  </span>
                </div>
              )}
            </div>

            <div className="sp2-pw-group">
              <label>Confirm New Password</label>
              <div className="sp2-pw-input-wrap">
                <input
                  type={showPw.confirm ? 'text' : 'password'}
                  value={pwForm.confirm}
                  onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                  placeholder="Repeat new password"
                />
                <button
                  className="sp2-pw-toggle"
                  onClick={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
                  type="button"
                >
                  {showPw.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {pwForm.confirm && pwForm.newPw && (
                <span className={`sp2-pw-match ${pwForm.newPw === pwForm.confirm ? 'match' : 'no-match'}`}>
                  {pwForm.newPw === pwForm.confirm
                    ? <><CheckCircle size={12} /> Passwords match</>
                    : <><AlertCircle size={12} /> Passwords don't match</>}
                </span>
              )}
            </div>

            <button
              className="sp2-pw-save-btn"
              onClick={handleChangePassword}
              disabled={pwSaving}
            >
              {pwSaving ? <><span className="sp2-spinner" /> Saving...</> : <><Lock size={15} /> Update Password</>}
            </button>
          </div>
        </div>
      )}

      {/* ── Tab: My Courses ── */}
      {activeTab === 'courses' && (
        <div className="sp2-section">
          <div className="sp2-courses-summary">
            <div className="sp2-cs-stat sp2-cs-purple">
              <span className="sp2-cs-val">{MOCK_STATS.enrolledCourses}</span>
              <span className="sp2-cs-lbl">Enrolled</span>
            </div>
            <div className="sp2-cs-stat sp2-cs-green">
              <span className="sp2-cs-val">{MOCK_STATS.completedCourses}</span>
              <span className="sp2-cs-lbl">Completed</span>
            </div>
            <div className="sp2-cs-stat sp2-cs-orange">
              <span className="sp2-cs-val">{MOCK_STATS.avgGrade}%</span>
              <span className="sp2-cs-lbl">Avg. Grade</span>
            </div>
          </div>

          <div className="sp2-courses-list">
            {MOCK_RECENT_COURSES.map((c) => (
              <div key={c.id} className="sp2-course-row">
                <div
                  className="sp2-course-icon"
                  style={{ background: c.color + '18', color: c.color }}
                >
                  {c.icon}
                </div>
                <div className="sp2-course-info">
                  <div className="sp2-course-title">{c.title}</div>
                  <div className="sp2-course-bar-wrap">
                    <div className="sp2-course-bar">
                      <div
                        className="sp2-course-fill"
                        style={{ width: `${c.progress}%`, background: c.color }}
                      />
                    </div>
                    <span className="sp2-course-pct" style={{ color: c.color }}>{c.progress}%</span>
                  </div>
                </div>
                {c.progress === 100 && (
                  <span className="sp2-course-done"><CheckCircle size={15} /> Done</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}