import { useState, useRef } from 'react';
import {
  FileText, Clock, CheckCircle, AlertCircle,
  Upload, X, Eye, ChevronDown, ChevronUp,
  Calendar, BookOpen, Award, Paperclip
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import '../../styles/pages/student/StudentAssignments.css';
import toast from 'react-hot-toast';

/* ── Mock data — replace with real API calls when backend is ready ── */
const MOCK_ASSIGNMENTS = [
  {
    id: 1,
    title: 'Lab Report: PC Assembly',
    course: 'PC Hardware Assembly & Troubleshooting',
    courseColor: '#10b981',
    courseIcon: '⚙️',
    description: 'Write a detailed lab report documenting your PC assembly process. Include step-by-step photos, component specifications, and a troubleshooting section.',
    dueDate: new Date(Date.now() + 1 * 86400000),
    points: 100,
    status: 'pending',
    submission: null,
    grade: null,
    feedback: null,
  },
  {
    id: 2,
    title: 'Quiz: OSI Model Layers',
    course: 'Network Systems Cabling (NSC)',
    courseColor: '#3b82f6',
    courseIcon: '🔌',
    description: 'Answer all questions about the OSI model layers. Include examples for each layer and explain how data travels through the network stack.',
    dueDate: new Date(Date.now() + 3 * 86400000),
    points: 50,
    status: 'pending',
    submission: null,
    grade: null,
    feedback: null,
  },
  {
    id: 3,
    title: 'Assignment: Cable Crimping',
    course: 'Network Systems Cabling (NSC)',
    courseColor: '#3b82f6',
    courseIcon: '🔌',
    description: 'Submit photos and documentation of your cable crimping activity. Include both straight-through and crossover cable configurations.',
    dueDate: new Date(Date.now() + 5 * 86400000),
    points: 75,
    status: 'submitted',
    submission: { fileName: 'cable_crimping_report.pdf', submittedAt: 'May 20, 2026 · 3:45 PM' },
    grade: null,
    feedback: null,
  },
  {
    id: 4,
    title: 'Final Project: Network Design',
    course: 'CSS NC II — Computer Systems Servicing',
    courseColor: '#5B4A9E',
    courseIcon: '🖥️',
    description: 'Design a complete small office network. Submit a network diagram, IP addressing scheme, and equipment list with justifications.',
    dueDate: new Date(Date.now() + 10 * 86400000),
    points: 150,
    status: 'pending',
    submission: null,
    grade: null,
    feedback: null,
  },
  {
    id: 5,
    title: 'OS Installation Documentation',
    course: 'CSS NC II — Computer Systems Servicing',
    courseColor: '#5B4A9E',
    courseIcon: '🖥️',
    description: 'Document the complete OS installation process with screenshots. Include pre-installation checklist, installation steps, and post-installation configuration.',
    dueDate: new Date(Date.now() - 2 * 86400000),
    points: 100,
    status: 'graded',
    submission: { fileName: 'os_installation_docs.pdf', submittedAt: 'May 18, 2026 · 9:20 AM' },
    grade: 92,
    feedback: 'Excellent documentation! Very detailed screenshots and clear step-by-step instructions. Minor deduction for missing the post-install driver update section.',
  },
  {
    id: 6,
    title: 'Quiz: Cable Types & Standards',
    course: 'Network Systems Cabling (NSC)',
    courseColor: '#3b82f6',
    courseIcon: '🔌',
    description: 'Written quiz covering all cable types, their specifications, maximum lengths, and appropriate use cases.',
    dueDate: new Date(Date.now() - 5 * 86400000),
    points: 50,
    status: 'graded',
    submission: { fileName: 'cable_types_quiz.pdf', submittedAt: 'May 15, 2026 · 2:10 PM' },
    grade: 88,
    feedback: 'Good work! You have a solid understanding of cable standards. Review the fiber optic specifications for future reference.',
  },
];

const FILTERS = ['All', 'Pending', 'Submitted', 'Graded', 'Overdue'];

/* ── Helpers ── */
function getDaysUntil(date) {
  const diff = Math.ceil((date - Date.now()) / 86400000);
  if (diff < 0)  return `${Math.abs(diff)} day${Math.abs(diff) !== 1 ? 's' : ''} overdue`;
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
}

function getDueBadgeClass(date, status) {
  if (status === 'graded' || status === 'submitted') return 'due-done';
  const diff = Math.ceil((date - Date.now()) / 86400000);
  if (diff < 0)  return 'due-overdue';
  if (diff <= 1) return 'due-urgent';
  if (diff <= 3) return 'due-soon';
  return 'due-normal';
}

function getScoreColor(score) {
  if (score >= 90) return '#10b981';
  if (score >= 75) return '#f59e0b';
  return '#ef4444';
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [activeFilter, setActiveFilter]   = useState('All');
  const [expandedId, setExpandedId]       = useState(null);
  const [submitModalId, setSubmitModalId] = useState(null);
  const [viewModalId, setViewModalId]     = useState(null);
  const [dragOver, setDragOver]           = useState(false);
  const [selectedFile, setSelectedFile]   = useState(null);
  const [note, setNote]                   = useState('');
  const [submitting, setSubmitting]       = useState(false);
  const fileRef = useRef();

  /* ── Derived ── */
  const pending   = assignments.filter((a) => a.status === 'pending' && new Date(a.dueDate) >= new Date()).length;
  const submitted = assignments.filter((a) => a.status === 'submitted').length;
  const graded    = assignments.filter((a) => a.status === 'graded').length;
  const overdue   = assignments.filter((a) => a.status === 'pending' && new Date(a.dueDate) < new Date()).length;
  const avgGrade  = (() => {
    const g = assignments.filter((a) => a.grade !== null);
    return g.length ? Math.round(g.reduce((s, a) => s + a.grade, 0) / g.length) : null;
  })();

  const filtered = assignments.filter((a) => {
    if (activeFilter === 'All')       return true;
    if (activeFilter === 'Pending')   return a.status === 'pending' && new Date(a.dueDate) >= new Date();
    if (activeFilter === 'Submitted') return a.status === 'submitted';
    if (activeFilter === 'Graded')    return a.status === 'graded';
    if (activeFilter === 'Overdue')   return a.status === 'pending' && new Date(a.dueDate) < new Date();
    return true;
  });

  const submitTarget = assignments.find((a) => a.id === submitModalId);
  const viewTarget   = assignments.find((a) => a.id === viewModalId);

  /* ── Handlers ── */
  function handleFileSelect(file) {
    if (!file) return;
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png', 'application/zip'];
    if (!allowed.includes(file.type)) {
      toast.error('File type not supported. Please upload PDF, DOC, DOCX, JPG, PNG, or ZIP.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File is too large. Maximum size is 10MB.');
      return;
    }
    setSelectedFile(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  }

  async function handleSubmit() {
    if (!selectedFile) return;
    setSubmitting(true);
    // Simulate API call — replace with real fetch when backend is ready
    await new Promise((r) => setTimeout(r, 1200));
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === submitModalId
          ? {
              ...a,
              status: 'submitted',
              submission: {
                fileName: selectedFile.name,
                submittedAt: new Date().toLocaleString('en-PH', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: 'numeric', minute: '2-digit', hour12: true,
                }),
                note,
              },
            }
          : a
      )
    );
    setSubmitting(false);
    setSubmitModalId(null);
    setSelectedFile(null);
    setNote('');
  }

  function handleCancelSubmit() {
    setSubmitModalId(null);
    setSelectedFile(null);
    setNote('');
  }

  return (
    <div className="sass-page">

      {/* ── Header ── */}
      <div className="sass-header">
        <div>
          <h1 className="sass-title">Assignments</h1>
          <p className="sass-subtitle">Submit and track your assignments across all courses</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="sass-stats-grid">
        <div className="sass-stat sass-stat-orange">
          <div className="sass-stat-icon"><Clock size={20} /></div>
          <div>
            <div className="sass-stat-val">{pending}</div>
            <div className="sass-stat-lbl">Pending</div>
          </div>
        </div>
        <div className="sass-stat sass-stat-blue">
          <div className="sass-stat-icon"><Upload size={20} /></div>
          <div>
            <div className="sass-stat-val">{submitted}</div>
            <div className="sass-stat-lbl">Submitted</div>
          </div>
        </div>
        <div className="sass-stat sass-stat-green">
          <div className="sass-stat-icon"><CheckCircle size={20} /></div>
          <div>
            <div className="sass-stat-val">{graded}</div>
            <div className="sass-stat-lbl">Graded</div>
          </div>
        </div>
        <div className="sass-stat sass-stat-red">
          <div className="sass-stat-icon"><AlertCircle size={20} /></div>
          <div>
            <div className="sass-stat-val">{overdue}</div>
            <div className="sass-stat-lbl">Overdue</div>
          </div>
        </div>
        {avgGrade !== null && (
          <div className="sass-stat sass-stat-purple">
            <div className="sass-stat-icon"><Award size={20} /></div>
            <div>
              <div className="sass-stat-val" style={{ color: getScoreColor(avgGrade) }}>{avgGrade}%</div>
              <div className="sass-stat-lbl">Avg. Grade</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="sass-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`sass-filter-btn ${activeFilter === f ? 'sass-filter-active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
            {f === 'Overdue' && overdue > 0 && (
              <span className="sass-filter-badge">{overdue}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Assignment List ── */}
      {filtered.length === 0 ? (
        <div className="sass-empty">
          <FileText size={40} />
          <p>No assignments found.</p>
        </div>
      ) : (
        <div className="sass-list">
          {filtered.map((a) => {
            const isExpanded = expandedId === a.id;
            const isOverdue  = a.status === 'pending' && new Date(a.dueDate) < new Date();

            return (
              <div
                key={a.id}
                className={`sass-card sass-card-${a.status} ${isOverdue ? 'sass-card-overdue' : ''}`}
              >
                {/* ── Card Main Row ── */}
                <div className="sass-card-main">
                  {/* Left accent */}
                  <div className="sass-card-accent" style={{ background: a.courseColor }} />

                  {/* Course icon */}
                  <div
                    className="sass-course-icon"
                    style={{ background: a.courseColor + '18', color: a.courseColor }}
                  >
                    {a.courseIcon}
                  </div>

                  {/* Info */}
                  <div className="sass-info">
                    <div className="sass-title-row">
                      <h3 className="sass-asgn-title">{a.title}</h3>
                      <span className={`sass-status-badge sass-status-${a.status} ${isOverdue ? 'sass-status-overdue' : ''}`}>
                        {isOverdue
                          ? <><AlertCircle size={11} /> Overdue</>
                          : a.status === 'pending'
                          ? <><Clock size={11} /> Pending</>
                          : a.status === 'submitted'
                          ? <><Upload size={11} /> Submitted</>
                          : <><CheckCircle size={11} /> Graded</>}
                      </span>
                    </div>
                    <div className="sass-meta">
                      <span className="sass-course-tag" style={{ color: a.courseColor }}>
                        <BookOpen size={11} /> {a.course}
                      </span>
                      <span className="sass-dot">·</span>
                      <span className={`sass-due ${getDueBadgeClass(a.dueDate, a.status)}`}>
                        <Calendar size={11} /> {getDaysUntil(a.dueDate)}
                      </span>
                      <span className="sass-dot">·</span>
                      <span className="sass-points">
                        <Award size={11} /> {a.points} pts
                      </span>
                    </div>

                    {/* Grade bar (if graded) */}
                    {a.status === 'graded' && a.grade !== null && (
                      <div className="sass-grade-inline">
                        <div className="sass-grade-bar">
                          <div
                            className="sass-grade-fill"
                            style={{ width: `${a.grade}%`, background: getScoreColor(a.grade) }}
                          />
                        </div>
                        <span className="sass-grade-text" style={{ color: getScoreColor(a.grade) }}>
                          {a.grade}/{a.points} pts
                        </span>
                      </div>
                    )}

                    {/* Submitted filename */}
                    {a.submission && (
                      <div className="sass-submitted-file">
                        <Paperclip size={11} />
                        <span>{a.submission.fileName}</span>
                        <span className="sass-submitted-time">· {a.submission.submittedAt}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="sass-card-actions">
                    {(a.status === 'graded' || a.submission) && (
                      <button
                        className="sass-btn-view"
                        onClick={() => setViewModalId(a.id)}
                        title="View details"
                      >
                        <Eye size={14} /> View
                      </button>
                    )}
                    {(a.status === 'pending' || (a.status === 'submitted' && new Date(a.dueDate) >= new Date())) && (
                      <button
                        className="sass-btn-submit"
                        style={{ background: a.courseColor }}
                        onClick={() => setSubmitModalId(a.id)}
                      >
                        <Upload size={14} />
                        {a.status === 'submitted' ? 'Resubmit' : 'Submit'}
                      </button>
                    )}
                    <button
                      className="sass-btn-expand"
                      onClick={() => setExpandedId(isExpanded ? null : a.id)}
                    >
                      {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                    </button>
                  </div>
                </div>

                {/* ── Expanded Details ── */}
                {isExpanded && (
                  <div className="sass-expanded">
                    <p className="sass-description">{a.description}</p>
                    {a.status === 'graded' && a.feedback && (
                      <div className="sass-feedback-box">
                        <div className="sass-feedback-label">📝 Instructor Feedback</div>
                        <p>{a.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Submit Modal ── */}
      <Modal
        isOpen={!!submitModalId}
        onClose={handleCancelSubmit}
        title={submitTarget?.status === 'submitted' ? 'Resubmit Assignment' : 'Submit Assignment'}
        size="medium"
      >
        {submitTarget && (
          <div className="sass-submit-modal">
            {/* Assignment info */}
            <div className="sass-modal-info">
              <div className="sass-modal-info-row">
                <span>Assignment</span>
                <strong>{submitTarget.title}</strong>
              </div>
              <div className="sass-modal-info-row">
                <span>Course</span>
                <strong>{submitTarget.course}</strong>
              </div>
              <div className="sass-modal-info-row">
                <span>Due Date</span>
                <strong className={getDueBadgeClass(submitTarget.dueDate, submitTarget.status)}>
                  {new Date(submitTarget.dueDate).toLocaleDateString('en-PH', {
                    month: 'long', day: 'numeric', year: 'numeric'
                  })}
                </strong>
              </div>
              <div className="sass-modal-info-row">
                <span>Points</span>
                <strong>{submitTarget.points} pts</strong>
              </div>
            </div>

            {/* File Upload Area */}
            <div
              className={`sass-dropzone ${dragOver ? 'sass-dropzone-active' : ''} ${selectedFile ? 'sass-dropzone-filled' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !selectedFile && fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                className="sass-file-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              {selectedFile ? (
                <div className="sass-file-selected">
                  <Paperclip size={20} className="sass-file-icon" />
                  <div className="sass-file-details">
                    <span className="sass-file-name">{selectedFile.name}</span>
                    <span className="sass-file-size">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    className="sass-file-remove"
                    onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="sass-dropzone-prompt">
                  <Upload size={28} className="sass-upload-icon" />
                  <p className="sass-drop-text">Drag & drop your file here</p>
                  <p className="sass-drop-sub">or <span>browse to upload</span></p>
                  <p className="sass-drop-types">PDF, DOC, DOCX, JPG, PNG, ZIP · max 10MB</p>
                </div>
              )}
            </div>

            {/* Note to instructor */}
            <div className="sass-note-group">
              <label>Note to Instructor <span className="sass-optional">(optional)</span></label>
              <textarea
                rows={3}
                placeholder="Add a note or comment about your submission..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="sass-modal-actions">
              <button className="sass-btn-cancel" onClick={handleCancelSubmit}>
                Cancel
              </button>
              <button
                className="sass-btn-confirm"
                style={{ background: submitTarget.courseColor }}
                onClick={handleSubmit}
                disabled={!selectedFile || submitting}
              >
                {submitting ? (
                  <><span className="sass-spinner" /> Submitting...</>
                ) : (
                  <><Upload size={15} /> Submit Assignment</>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── View / Grade Modal ── */}
      <Modal
        isOpen={!!viewModalId}
        onClose={() => setViewModalId(null)}
        title="Submission Details"
        size="medium"
      >
        {viewTarget && (
          <div className="sass-view-modal">
            <div className="sass-modal-info">
              <div className="sass-modal-info-row">
                <span>Assignment</span>
                <strong>{viewTarget.title}</strong>
              </div>
              <div className="sass-modal-info-row">
                <span>Course</span>
                <strong>{viewTarget.course}</strong>
              </div>
              <div className="sass-modal-info-row">
                <span>Submitted</span>
                <strong>{viewTarget.submission?.submittedAt}</strong>
              </div>
              <div className="sass-modal-info-row">
                <span>File</span>
                <strong className="sass-view-file">
                  <Paperclip size={13} /> {viewTarget.submission?.fileName}
                </strong>
              </div>
            </div>

            {viewTarget.status === 'graded' ? (
              <div className="sass-grade-display">
                <div
                  className="sass-grade-circle"
                  style={{ borderColor: getScoreColor(viewTarget.grade) }}
                >
                  <span className="sass-grade-num" style={{ color: getScoreColor(viewTarget.grade) }}>
                    {viewTarget.grade}%
                  </span>
                  <span className="sass-grade-pts">{viewTarget.grade}/{viewTarget.points} pts</span>
                </div>
                {viewTarget.feedback && (
                  <div className="sass-feedback-box">
                    <div className="sass-feedback-label">📝 Instructor Feedback</div>
                    <p>{viewTarget.feedback}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="sass-pending-notice">
                <Clock size={18} />
                <p>Your submission is being reviewed. Check back later for your grade.</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}