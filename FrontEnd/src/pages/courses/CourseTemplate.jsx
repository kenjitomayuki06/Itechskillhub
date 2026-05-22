import React, { useState } from 'react';
import '../../styles/courses/CourseCSSNCII.css';

/* ── Icon set ── */
const PlayIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const CheckIcon = ({ s = 14 }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width={s} height={s}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ChevronD  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="6 9 12 15 18 9"/></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const UsersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
const BookIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const StarIcon  = ({ on }) => <svg viewBox="0 0 24 24" fill={on ? "var(--lms-orange)" : "none"} stroke="var(--lms-orange)" strokeWidth="2" width="13" height="13"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const LockIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="36" height="36"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const DlIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const FileIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const GridIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const ArrowR    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const UpIcon    = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const CertIcon  = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15l2 2 4-4"/></svg>;

/* ── ModuleList sidebar — defined outside to avoid re-mounts ── */
const ModuleList = ({ modules, currentLesson, expandedModules, toggleMod, setCurrentLesson, modPct }) => (
  <div className="crs-modlist">
    {modules.map(mod => (
      <div key={mod.id} className="crs-mod-block">
        <button className="crs-mod-hdr" onClick={() => toggleMod(mod.id)}>
          <span className="crs-mod-num">{mod.id}</span>
          <div className="crs-mod-info">
            <span className="crs-mod-name">{mod.title}</span>
            <span className="crs-mod-meta">{mod.lessons.length} lessons · {modPct(mod)}% complete</span>
          </div>
          <span className={`crs-chevron${expandedModules.includes(mod.id) ? ' open' : ''}`}>
            <ChevronD />
          </span>
        </button>

        {expandedModules.includes(mod.id) && (
          <div className="crs-lesson-list">
            {mod.lessons.map(l => (
              <button
                key={l.id}
                className={`crs-lesson-row${currentLesson.id === l.id ? ' active' : ''}${l.completed ? ' done' : ''}`}
                onClick={() => setCurrentLesson(l)}
              >
                <span className="crs-l-icon">
                  {l.completed ? <CheckIcon s={13} /> : <PlayIcon />}
                </span>
                <span className="crs-l-name">{l.name}</span>
                <span className="crs-l-dur">{l.duration}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════════
   CourseTemplate — reusable for ALL courses
   
   Props:
     courseOverview   — { title, description, duration, level,
                          prerequisites[], whatYouWillLearn[],
                          certification: { name, requirements[], benefits[] },
                          instructor: { name, bio, experience } }
     courseLessons    — { modules: [{ id, title, lessons: [{ id, name,
                          duration, videoUrl, description, pdfUrl, completed }] }] }
     assignmentsData  — [{ id, title, description, dueDate, points, status,
                           lessonId?, moduleId?, type, submissionType,
                           grade?, feedback?, studentSubmission? }]
     breadcrumbLabel  — string shown in breadcrumb, e.g. "Network Setup & Configuration"
     badgeLabel       — string shown in hero eyebrow, e.g. "TESDA NC II"
════════════════════════════════════════════════════════════ */
const CourseTemplate = ({
  courseOverview,
  courseLessons,
  assignmentsData,
  breadcrumbLabel,
  badgeLabel = 'TESDA NC II',
}) => {
  const [modules, setModules]             = useState(courseLessons.modules);
  const [currentLesson, setCurrentLesson] = useState(courseLessons.modules[0].lessons[0]);
  const [expandedModules, setExpandedModules] = useState([1]);
  const [assignments, setAssignments]     = useState(assignmentsData);
  const [activeTab, setActiveTab]         = useState('learn');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selAssign, setSelAssign]         = useState(null);
  const [subText, setSubText]             = useState('');
  const [subFile, setSubFile]             = useState(null);
  const [showRateModal, setShowRateModal] = useState(false);
  const [userRating, setUserRating]       = useState(0);
  const [hoverRating, setHoverRating]     = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [hasRated, setHasRated]           = useState(false);

  /* ── Computed ── */
  const allLessons    = modules.flatMap(m => m.lessons);
  const doneCount     = allLessons.filter(l => l.completed).length;
  const totalCount    = allLessons.length;
  const pct           = Math.round(doneCount / totalCount * 100);
  const doneMins      = allLessons.filter(l => l.completed).reduce((t, l) => t + parseInt(l.duration), 0);
  const durStr        = `${Math.floor(doneMins / 60)}h ${doneMins % 60}min`;
  const curMod        = () => modules.find(m => m.lessons.some(l => l.id === currentLesson.id));
  const lessonAssigns = () => assignments.filter(a => a.lessonId === currentLesson.id);
  const moduleAssigns = () => assignments.filter(a => a.moduleId === curMod()?.id);
  const modPct        = (mod) => Math.round(mod.lessons.filter(l => l.completed).length / mod.lessons.length * 100);
  const fmtDate       = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const statusBg      = { pending: '#f59e0b', submitted: '#3b82f6', graded: '#10b981' };

  /* ── Actions ── */
  const toggleMod = (id) =>
    setExpandedModules(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const markDone = (id) => {
    setModules(p => p.map(m => ({
      ...m,
      lessons: m.lessons.map(l => l.id === id ? { ...l, completed: true } : l)
    })));
    if (currentLesson.id === id) setCurrentLesson(p => ({ ...p, completed: true }));
  };

  const openAssign = (a) => {
    setSelAssign(a);
    setShowAssignModal(true);
    setSubText('');
    setSubFile(null);
  };

  const submitAssign = () => {
    setAssignments(p => p.map(a =>
      a.id === selAssign.id
        ? { ...a, status: 'submitted', studentSubmission: { submittedAt: new Date().toISOString() } }
        : a
    ));
    setShowAssignModal(false);
  };

  const submitRate = () => {
    if (!userRating) return;
    setHasRated(true);
    setShowRateModal(false);
    setUserRating(0);
    setRatingComment('');
  };

  return (
    <div className="crs-page">

      {/* ── HERO ── */}
      <div className="crs-hero">
        <div className="crs-hero-inner">
          <nav className="crs-breadcrumb">
            <a href="/course">Courses</a>
            <span>›</span>
            <span>{breadcrumbLabel || courseOverview.title}</span>
          </nav>

          <div className="crs-hero-layout">
            {/* Left: title + stats */}
            <div className="crs-hero-left">
              <div className="crs-hero-eyebrow">
                <span className="crs-dot" /> {badgeLabel}
              </div>
              <h1 className="crs-hero-title">{courseOverview.title}</h1>
              <p className="crs-hero-desc">{courseOverview.description}</p>
              <div className="crs-hero-stats">
                <span className="crs-stat-pill"><ClockIcon /> {courseOverview.duration}</span>
                <span className="crs-stat-pill"><UsersIcon /> 0 students</span>
                <span className="crs-stat-pill"><BookIcon /> {totalCount} lessons</span>
                <span className="crs-stat-pill"><StarIcon on={false} /> No ratings yet</span>
              </div>
            </div>

            {/* Right: progress card */}
            <div className="crs-prog-card">
              <div className="crs-prog-card-top">
                <span className="crs-prog-label">Your Progress</span>
                <span className="crs-prog-pct">{pct}%</span>
              </div>
              <div className="crs-prog-track">
                <div className="crs-prog-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="crs-prog-grid">
                <div className="crs-prog-item">
                  <span className="crs-prog-num">{doneCount}/{totalCount}</span>
                  <span className="crs-prog-lbl">Lessons Done</span>
                </div>
                <div className="crs-prog-item">
                  <span className="crs-prog-num">{durStr}</span>
                  <span className="crs-prog-lbl">Time Spent</span>
                </div>
                <div className="crs-prog-item">
                  <span className="crs-prog-num">{modules.length}</span>
                  <span className="crs-prog-lbl">Modules</span>
                </div>
                <div className="crs-prog-item">
                  <span className="crs-prog-num crs-pending-txt">{pct === 100 ? 'Earned!' : 'Pending'}</span>
                  <span className="crs-prog-lbl">Certificate</span>
                </div>
              </div>
              <button className="crs-rate-btn" onClick={() => !hasRated && setShowRateModal(true)}>
                <StarIcon on /> {hasRated ? 'Course Rated!' : 'Rate this Course'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="crs-body">

        {/* Tab Bar */}
        <div className="crs-tab-bar">
          {[
            ['learn', 'Learn', <PlayIcon key="play" />],
            ['overview', 'Overview', <BookIcon key="book" />],
            ['certificate', 'Certificate', <CertIcon key="cert" />],
          ].map(([key, label, icon]) => (
            <button
              key={key}
              className={`crs-tab${activeTab === key ? ' active' : ''}`}
              onClick={() => setActiveTab(key)}
            >
              {icon} {label}
            </button>
          ))}
          <button className="crs-tab-x" onClick={() => window.history.back()}>✕</button>
        </div>

        {/* ── LEARN TAB ── */}
        {activeTab === 'learn' && (
          <div className="crs-learn-layout">

            {/* Main content */}
            <div className="crs-learn-main">

              {/* Video */}
              <div className="crs-video-wrap">
                {currentLesson.videoUrl
                  ? <iframe
                      src={currentLesson.videoUrl}
                      title={currentLesson.name}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="crs-video"
                    />
                  : <div className="crs-no-video"><PlayIcon /><span>No video available</span></div>
                }
              </div>

              {/* Lesson info */}
              <div className="crs-lesson-info">
                <h2 className="crs-lesson-title">{currentLesson.name}</h2>
                <p className="crs-lesson-desc">{currentLesson.description}</p>
                <span className="crs-dur-chip"><ClockIcon /> {currentLesson.duration}</span>
              </div>

              {/* Action buttons */}
              <div className="crs-actions">
                {currentLesson.completed
                  ? <button className="crs-btn-done"><CheckIcon s={15} /> Completed</button>
                  : <button className="crs-btn-complete" onClick={() => markDone(currentLesson.id)}>
                      <CheckIcon s={15} /> Mark as Complete
                    </button>
                }
                {currentLesson.pdfUrl
                  ? <a href={currentLesson.pdfUrl} className="crs-btn-pdf" download target="_blank" rel="noopener noreferrer">
                      <DlIcon /> Download PDF
                    </a>
                  : <button className="crs-btn-pdf disabled" disabled><DlIcon /> No PDF Available</button>
                }
              </div>

              {/* Assignments */}
              {(lessonAssigns().length > 0 || moduleAssigns().length > 0) && (
                <div className="crs-assigns">
                  <h3 className="crs-assigns-title"><FileIcon /> Assignments</h3>

                  {[...lessonAssigns(), ...moduleAssigns()].map(a => (
                    <div key={a.id} className={`crs-assign-card${a.type === 'module' ? ' mod-type' : ''}`}>
                      <div className="crs-assign-top">
                        <div className="crs-assign-title-row">
                          {a.type === 'module' && <span className="crs-mod-badge">Module</span>}
                          <h4 className="crs-assign-name">{a.title}</h4>
                        </div>
                        <span className="crs-assign-status" style={{ background: statusBg[a.status] }}>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </div>
                      <p className="crs-assign-desc">{a.description}</p>
                      <div className="crs-assign-meta">
                        <span className="crs-due">Due: {fmtDate(a.dueDate)}</span>
                        <span className="crs-pts">{a.points} points</span>
                      </div>
                      {a.status === 'graded' && (
                        <div className="crs-grade-box">
                          <strong>Grade: {a.grade}/{a.points}</strong>
                          {a.feedback && <p>{a.feedback}</p>}
                        </div>
                      )}
                      <button className="crs-assign-btn" onClick={() => openAssign(a)}>
                        {a.status === 'pending' ? <><ArrowR /> Submit Assignment</> : 'View Submission'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="crs-learn-sidebar">
              <div className="crs-sidebar-hdr">
                <GridIcon />
                <span>Course Content</span>
                <span className="crs-sidebar-count">{doneCount}/{totalCount}</span>
              </div>
              <ModuleList
                modules={modules}
                currentLesson={currentLesson}
                expandedModules={expandedModules}
                toggleMod={toggleMod}
                setCurrentLesson={setCurrentLesson}
                modPct={modPct}
              />
            </div>
          </div>
        )}

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="crs-ov-layout">
            <div className="crs-ov-main">
              <div className="crs-ov-card">
                <h3 className="crs-ov-title">About This Course</h3>
                <p className="crs-ov-text">{courseOverview.description}</p>
              </div>
              <div className="crs-ov-card">
                <h3 className="crs-ov-title">What You'll Learn</h3>
                <div className="crs-learn-grid">
                  {courseOverview.whatYouWillLearn.map((item, i) => (
                    <div key={i} className="crs-learn-item">
                      <span className="crs-learn-chk"><CheckIcon s={11} /></span>{item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="crs-ov-card">
                <h3 className="crs-ov-title">Prerequisites</h3>
                <ul className="crs-prereq-list">
                  {courseOverview.prerequisites.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>

            <div className="crs-ov-side">
              <div className="crs-ov-card">
                <h3 className="crs-ov-title">Instructor</h3>
                <div className="crs-instructor-row">
                  <div className="crs-instr-avatar">{courseOverview.instructor.name.charAt(0)}</div>
                  <div>
                    <p className="crs-instr-name">{courseOverview.instructor.name}</p>
                    <p className="crs-instr-exp">{courseOverview.instructor.experience}</p>
                  </div>
                </div>
                <p className="crs-instr-bio">{courseOverview.instructor.bio}</p>
              </div>
              <div className="crs-ov-card">
                <h3 className="crs-ov-title">Course Stats</h3>
                <div className="crs-stats-rows">
                  <div className="crs-stats-row"><ClockIcon /><span>{courseOverview.duration} total</span></div>
                  <div className="crs-stats-row"><BookIcon /><span>{totalCount} lessons · {modules.length} modules</span></div>
                  <div className="crs-stats-row"><GridIcon /><span>{courseOverview.level}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CERTIFICATE TAB ── */}
        {activeTab === 'certificate' && (
          <div className="crs-cert-layout">
            <div className="crs-cert-main">
              <div className="crs-ov-card">
                <h3 className="crs-ov-title">Certification</h3>
                <p className="crs-cert-lead">{courseOverview.certification.name}</p>
                <p className="crs-ov-text">
                  Upon successful completion of this course, you will receive an official certificate
                  recognized by the industry.
                </p>
              </div>

              <div className="crs-cert-two-col">
                <div className="crs-ov-card">
                  <h3 className="crs-ov-title">Requirements</h3>
                  <ol className="crs-req-list">
                    {courseOverview.certification.requirements.map((r, i) => (
                      <li key={i}><span className="crs-req-n">{i + 1}</span>{r}</li>
                    ))}
                  </ol>
                </div>
                <div className="crs-ov-card">
                  <h3 className="crs-ov-title">Benefits</h3>
                  <ul className="crs-benefit-list">
                    {courseOverview.certification.benefits.map((b, i) => (
                      <li key={i}>
                        <span className="crs-benefit-chk"><CheckIcon s={11} /></span>{b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Progress side */}
            <div className="crs-cert-side">
              <div className="crs-ov-card crs-cert-prog-card">
                <h3 className="crs-ov-title">Your Progress</h3>

                <div className="crs-circular-wrap">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="var(--lms-border)" strokeWidth="9" />
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke="var(--lms-purple)"
                      strokeWidth="9"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  <div className="crs-circ-label">
                    <span className="crs-circ-pct">{pct}%</span>
                    <span className="crs-circ-sub">Complete</span>
                  </div>
                </div>

                <div className="crs-cert-stat-row">
                  <div className="crs-cert-stat">
                    <span className="crs-cert-sn">{doneCount}</span>
                    <span className="crs-cert-sl">Done</span>
                  </div>
                  <div className="crs-cert-stat">
                    <span className="crs-cert-sn">{totalCount - doneCount}</span>
                    <span className="crs-cert-sl">Left</span>
                  </div>
                </div>

                {pct === 100 ? (
                  <div className="crs-cert-unlocked">
                    <CheckIcon s={28} />
                    <p>Certificate unlocked!</p>
                    <button className="crs-dl-cert-btn"><DlIcon /> Download Certificate</button>
                  </div>
                ) : (
                  <div className="crs-cert-locked-state">
                    <LockIcon />
                    <p>{totalCount - doneCount} lessons remaining</p>
                    <button className="crs-continue-btn" onClick={() => setActiveTab('learn')}>
                      Continue Learning <ArrowR />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── ASSIGNMENT MODAL ── */}
      {showAssignModal && selAssign && (
        <div className="crs-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="crs-modal" onClick={e => e.stopPropagation()}>
            <div className="crs-modal-hdr">
              <h3>{selAssign.title}</h3>
              <button className="crs-modal-x" onClick={() => setShowAssignModal(false)}>✕</button>
            </div>
            <div className="crs-modal-body">
              <p className="crs-modal-desc">{selAssign.description}</p>
              <div className="crs-modal-meta">
                <span>Due: {fmtDate(selAssign.dueDate)}</span>
                <span>{selAssign.points} points</span>
              </div>

              {selAssign.status === 'pending' ? (
                <>
                  {selAssign.submissionType === 'text' && (
                    <textarea
                      className="crs-textarea"
                      value={subText}
                      onChange={e => setSubText(e.target.value)}
                      placeholder="Type your answer here..."
                      rows={6}
                    />
                  )}
                  {selAssign.submissionType === 'file' && (
                    <div className="crs-file-wrap">
                      <label className="crs-file-lbl">
                        <UpIcon /> Choose file
                        <input
                          type="file"
                          style={{ display: 'none' }}
                          onChange={e => setSubFile(e.target.files[0])}
                          accept=".pdf,.doc,.docx,.jpg,.png"
                        />
                      </label>
                      {subFile && <span className="crs-file-name">{subFile.name}</span>}
                    </div>
                  )}
                  {selAssign.submissionType === 'quiz' && (
                    <div className="crs-quiz-ph"><p>Quiz interface coming soon</p></div>
                  )}
                  <button
                    className="crs-modal-submit"
                    onClick={submitAssign}
                    disabled={
                      (selAssign.submissionType === 'text' && !subText) ||
                      (selAssign.submissionType === 'file' && !subFile)
                    }
                  >
                    Submit Assignment
                  </button>
                </>
              ) : (
                <div className="crs-sub-view">
                  <p>Submitted: {selAssign.studentSubmission?.submittedAt
                    ? new Date(selAssign.studentSubmission.submittedAt).toLocaleString()
                    : 'N/A'}
                  </p>
                  {selAssign.status === 'graded' && (
                    <div className="crs-grade-box">
                      <strong>Grade: {selAssign.grade}/{selAssign.points}</strong>
                      {selAssign.feedback && <p>{selAssign.feedback}</p>}
                    </div>
                  )}
                  {selAssign.status === 'submitted' && (
                    <p className="crs-waiting">Waiting for instructor to grade...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── RATING MODAL ── */}
      {showRateModal && (
        <div className="crs-overlay" onClick={() => setShowRateModal(false)}>
          <div className="crs-modal crs-rate-modal" onClick={e => e.stopPropagation()}>
            <div className="crs-modal-hdr">
              <h3>Rate this Course</h3>
              <button className="crs-modal-x" onClick={() => setShowRateModal(false)}>✕</button>
            </div>
            <div className="crs-modal-body">
              <p className="crs-modal-desc">How would you rate your learning experience?</p>
              <div className="crs-stars">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    className="crs-star-btn"
                    onClick={() => setUserRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <svg
                      viewBox="0 0 24 24" width="38" height="38"
                      fill={(hoverRating || userRating) >= s ? "var(--lms-orange)" : "none"}
                      stroke="var(--lms-orange)" strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="crs-rating-txt">{userRating} star{userRating > 1 ? 's' : ''} selected</p>
              )}
              <textarea
                className="crs-textarea"
                value={ratingComment}
                onChange={e => setRatingComment(e.target.value)}
                placeholder="Share your thoughts (optional)..."
                rows={4}
              />
              <button className="crs-modal-submit" onClick={submitRate} disabled={!userRating}>
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseTemplate;