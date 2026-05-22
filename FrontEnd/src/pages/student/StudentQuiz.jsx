import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, ChevronLeft, RotateCcw, Trophy,
  Star, Play, Eye, BarChart2, Lock, Zap
} from 'lucide-react';
import '../../styles/pages/student/StudentQuiz.css';

/* ── Mock Quiz Data ─────────────────────────────────────────────
   Replace with real API calls when backend is ready
──────────────────────────────────────────────────────────────── */
const MOCK_QUIZZES = [
  {
    id: 1,
    title: 'OSI Model Layers',
    course: 'Network Systems Cabling (NSC)',
    courseColor: '#3b82f6',
    courseIcon: '🔌',
    description: 'Test your knowledge of the 7 OSI model layers, their functions, and how data travels through each layer.',
    questionCount: 10,
    timeLimit: 15,      // minutes
    passingScore: 70,
    attempts: 2,
    maxAttempts: 3,
    bestScore: 80,
    status: 'available',  // available | completed | locked
    dueDate: new Date(Date.now() + 3 * 86400000),
    questions: [
      {
        id: 1,
        text: 'Which OSI layer is responsible for end-to-end communication and error recovery?',
        choices: ['Network Layer', 'Transport Layer', 'Session Layer', 'Data Link Layer'],
        answer: 1,
        explanation: 'The Transport Layer (Layer 4) handles end-to-end communication, error detection, and flow control between hosts.',
      },
      {
        id: 2,
        text: 'What is the PDU (Protocol Data Unit) at the Network Layer?',
        choices: ['Frame', 'Segment', 'Packet', 'Bit'],
        answer: 2,
        explanation: 'The Network Layer (Layer 3) uses Packets as its PDU. Frames are Layer 2, Segments are Layer 4, and Bits are Layer 1.',
      },
      {
        id: 3,
        text: 'Which layer is responsible for converting data into a format suitable for transmission?',
        choices: ['Application Layer', 'Presentation Layer', 'Session Layer', 'Transport Layer'],
        answer: 1,
        explanation: 'The Presentation Layer (Layer 6) handles data translation, encryption, and compression.',
      },
      {
        id: 4,
        text: 'The MAC address operates at which OSI layer?',
        choices: ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer'],
        answer: 1,
        explanation: 'MAC addresses are used at the Data Link Layer (Layer 2) for local network addressing.',
      },
      {
        id: 5,
        text: 'Which protocol works at the Application Layer?',
        choices: ['IP', 'TCP', 'HTTP', 'ARP'],
        answer: 2,
        explanation: 'HTTP (HyperText Transfer Protocol) operates at the Application Layer (Layer 7).',
      },
      {
        id: 6,
        text: 'Which OSI layer establishes, manages, and terminates sessions between applications?',
        choices: ['Transport Layer', 'Presentation Layer', 'Session Layer', 'Application Layer'],
        answer: 2,
        explanation: 'The Session Layer (Layer 5) establishes, maintains, and terminates communication sessions.',
      },
      {
        id: 7,
        text: 'What does the Physical Layer transmit?',
        choices: ['Packets', 'Frames', 'Segments', 'Bits'],
        answer: 3,
        explanation: 'The Physical Layer (Layer 1) transmits raw bits over a physical medium.',
      },
      {
        id: 8,
        text: 'Which layer adds logical addressing information to data?',
        choices: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
        answer: 1,
        explanation: 'The Network Layer (Layer 3) adds IP addresses (logical addressing) to packets.',
      },
      {
        id: 9,
        text: 'What is the correct order of OSI layers from lowest to highest?',
        choices: [
          'Physical, Data Link, Network, Transport, Session, Presentation, Application',
          'Application, Presentation, Session, Transport, Network, Data Link, Physical',
          'Physical, Network, Data Link, Transport, Session, Presentation, Application',
          'Application, Session, Presentation, Transport, Network, Physical, Data Link',
        ],
        answer: 0,
        explanation: 'The correct OSI order from bottom to top is: Physical (1), Data Link (2), Network (3), Transport (4), Session (5), Presentation (6), Application (7).',
      },
      {
        id: 10,
        text: 'Which layer is closest to the end user?',
        choices: ['Session Layer', 'Transport Layer', 'Presentation Layer', 'Application Layer'],
        answer: 3,
        explanation: 'The Application Layer (Layer 7) is the topmost layer and is closest to the end user, providing network services to applications.',
      },
    ],
  },
  {
    id: 2,
    title: 'PC Hardware Components',
    course: 'PC Hardware Assembly & Troubleshooting',
    courseColor: '#10b981',
    courseIcon: '⚙️',
    description: 'Identify and understand the roles of core PC hardware components including the CPU, RAM, motherboard, and storage devices.',
    questionCount: 8,
    timeLimit: 12,
    passingScore: 75,
    attempts: 1,
    maxAttempts: 2,
    bestScore: 87,
    status: 'completed',
    dueDate: new Date(Date.now() - 4 * 86400000),
    questions: [
      {
        id: 1,
        text: 'What is the primary function of the CPU?',
        choices: ['Store permanent data', 'Execute program instructions', 'Supply power to components', 'Display graphics'],
        answer: 1,
        explanation: 'The CPU (Central Processing Unit) fetches and executes program instructions.',
      },
      {
        id: 2,
        text: 'Which type of RAM is volatile?',
        choices: ['ROM', 'Flash Memory', 'DRAM', 'SSD Cache'],
        answer: 2,
        explanation: 'DRAM (Dynamic RAM) is volatile — data is lost when power is removed.',
      },
      {
        id: 3,
        text: 'What connects the CPU to the RAM directly?',
        choices: ['PCIe Bus', 'Front Side Bus / Memory Bus', 'SATA Controller', 'USB Hub'],
        answer: 1,
        explanation: 'The Memory Bus (or Front Side Bus in older systems) directly connects the CPU to RAM.',
      },
      {
        id: 4,
        text: 'Which storage interface offers the fastest data transfer speeds?',
        choices: ['SATA III', 'IDE', 'NVMe PCIe', 'USB 3.0'],
        answer: 2,
        explanation: 'NVMe over PCIe offers the fastest speeds, reaching up to 7,000 MB/s on Gen 4 drives.',
      },
      {
        id: 5,
        text: 'What does BIOS stand for?',
        choices: ['Binary Input Output System', 'Basic Input Output System', 'Boot Integrated Operating System', 'Base Interface Output Software'],
        answer: 1,
        explanation: 'BIOS stands for Basic Input Output System — the firmware that initializes hardware during boot.',
      },
      {
        id: 6,
        text: 'Which component regulates the power supplied to the CPU?',
        choices: ['Chipset', 'VRM (Voltage Regulator Module)', 'PCH', 'Heatsink'],
        answer: 1,
        explanation: 'The VRM (Voltage Regulator Module) on the motherboard converts and regulates power to the CPU.',
      },
      {
        id: 7,
        text: 'What is the purpose of thermal paste?',
        choices: [
          'Permanently bond the CPU to the socket',
          'Improve electrical conductivity',
          'Fill microscopic gaps between CPU and cooler to improve heat transfer',
          'Lubricate the CPU fan',
        ],
        answer: 2,
        explanation: 'Thermal paste fills air gaps between the CPU heat spreader and cooler, improving thermal conductivity.',
      },
      {
        id: 8,
        text: 'Which slot is typically used for a dedicated GPU?',
        choices: ['PCIe x1', 'M.2 slot', 'PCIe x16', 'DDR4 DIMM slot'],
        answer: 2,
        explanation: 'PCIe x16 slots provide maximum bandwidth for dedicated graphics cards.',
      },
    ],
  },
  {
    id: 3,
    title: 'CSS NC II: Tools & Safety',
    course: 'CSS NC II — Computer Systems Servicing',
    courseColor: '#5B4A9E',
    courseIcon: '🖥️',
    description: 'Test your knowledge of the proper use of servicing tools, ESD safety, and workplace safety standards for computer technicians.',
    questionCount: 8,
    timeLimit: 10,
    passingScore: 70,
    attempts: 0,
    maxAttempts: 3,
    bestScore: null,
    status: 'available',
    dueDate: new Date(Date.now() + 7 * 86400000),
    questions: [
      {
        id: 1,
        text: 'What does ESD stand for in computer servicing?',
        choices: ['Electronic Signal Damage', 'Electrostatic Discharge', 'External Storage Device', 'Electrical Supply Drain'],
        answer: 1,
        explanation: 'ESD stands for Electrostatic Discharge — the sudden flow of electricity that can damage sensitive components.',
      },
      {
        id: 2,
        text: 'Which tool is used to tighten or loosen screws on a PC case?',
        choices: ['Pliers', 'Phillips Head Screwdriver', 'Wire Stripper', 'Crimping Tool'],
        answer: 1,
        explanation: 'A Phillips Head Screwdriver is the standard tool for PC case and component screws.',
      },
      {
        id: 3,
        text: 'What is the purpose of an anti-static wrist strap?',
        choices: [
          'Improve grip while working',
          'Ground yourself to prevent ESD from damaging components',
          'Measure current flowing through components',
          'Hold components in place during installation',
        ],
        answer: 1,
        explanation: 'An anti-static wrist strap grounds the technician, preventing electrostatic discharge from damaging sensitive components.',
      },
      {
        id: 4,
        text: 'Before servicing a PC, you should always:',
        choices: [
          'Leave it powered on for faster access',
          'Power it off and unplug it from the wall',
          'Remove only the side panel',
          'Set it to sleep mode',
        ],
        answer: 1,
        explanation: 'Always power off and unplug the PC before servicing to prevent electrical hazards and component damage.',
      },
      {
        id: 5,
        text: 'Which tool is used to measure voltage, current, and resistance?',
        choices: ['Oscilloscope', 'Multimeter', 'Logic Probe', 'Cable Tester'],
        answer: 1,
        explanation: 'A Multimeter (or Digital Multimeter) measures voltage, current, and resistance.',
      },
      {
        id: 6,
        text: 'What material should you avoid placing computer components on?',
        choices: ['Anti-static mat', 'Cardboard box', 'Carpeted floor', 'Metal workbench'],
        answer: 2,
        explanation: 'Carpeted floors generate static electricity and can cause ESD damage to components.',
      },
      {
        id: 7,
        text: 'Which POST diagnostic tool uses beep codes to signal errors?',
        choices: ['BIOS Setup Utility', 'POST Card / Diagnostic Card', 'Device Manager', 'System Monitor'],
        answer: 1,
        explanation: 'A POST (Power-On Self-Test) diagnostic card intercepts and displays error codes during startup.',
      },
      {
        id: 8,
        text: 'What is the correct way to handle a hard drive to avoid data loss?',
        choices: [
          'Hold it by the circuit board',
          'Handle it by the edges, avoid dropping or shaking',
          'Store it near a strong magnet',
          'Place it directly on a metal surface',
        ],
        answer: 1,
        explanation: 'Hard drives should be handled by the edges, kept away from magnets, and never dropped or shaken.',
      },
    ],
  },
  {
    id: 4,
    title: 'IP Addressing & Subnetting',
    course: 'Network Systems Cabling (NSC)',
    courseColor: '#3b82f6',
    courseIcon: '🔌',
    description: 'Master IPv4 addressing, subnet masks, and basic subnetting calculations.',
    questionCount: 10,
    timeLimit: 20,
    passingScore: 75,
    attempts: 0,
    maxAttempts: 2,
    bestScore: null,
    status: 'locked',
    dueDate: new Date(Date.now() + 14 * 86400000),
    questions: [],
  },
];

/* ── Helpers ──────────────────────────────────────────────────── */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getDaysUntil(date) {
  const diff = Math.ceil((date - Date.now()) / 86400000);
  if (diff < 0)  return 'Overdue';
  if (diff === 0) return 'Due today';
  if (diff === 1) return 'Due tomorrow';
  return `Due in ${diff} days`;
}

function getDeadlineClass(date) {
  const diff = Math.ceil((date - Date.now()) / 86400000);
  if (diff < 0)  return 'overdue';
  if (diff <= 1) return 'urgent';
  if (diff <= 3) return 'soon';
  return 'normal';
}

function getScoreClass(score, passing) {
  if (score >= 90) return 'score-excellent';
  if (score >= passing) return 'score-pass';
  return 'score-fail';
}

/* ════════════════════════════════════════════════════════════════
   QUIZ RUNNER — shown while taking a quiz
════════════════════════════════════════════════════════════════ */
function QuizRunner({ quiz, onFinish, onExit }) {
  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(Array(quiz.questions.length).fill(null));
  const [timeLeft, setTimeLeft]   = useState(quiz.timeLimit * 60);
  const [flagged, setFlagged]     = useState(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  /* countdown */
  useEffect(() => {
    if (timeLeft <= 0) { handleSubmit(); return; }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleSubmit = useCallback(() => {
    const answers = selected.map((s, i) => ({
      questionId: quiz.questions[i].id,
      chosen: s,
      correct: s === quiz.questions[i].answer,
    }));
    const score = Math.round(
      (answers.filter(a => a.correct).length / quiz.questions.length) * 100
    );
    onFinish({ answers, score, timeTaken: quiz.timeLimit * 60 - timeLeft });
  }, [selected, quiz, timeLeft, onFinish]);

  const q = quiz.questions[current];
  const answered = selected.filter(s => s !== null).length;
  const pct = Math.round((answered / quiz.questions.length) * 100);
  const isLow = timeLeft < 120;

  return (
    <div className="sqr-overlay">
      <div className="sqr-shell">

        {/* ── Top Bar ── */}
        <div className="sqr-topbar">
          <div className="sqr-topbar-left">
            <span className="sqr-course-tag" style={{ background: quiz.courseColor + '20', color: quiz.courseColor }}>
              {quiz.courseIcon} {quiz.course}
            </span>
            <h2 className="sqr-quiz-title">{quiz.title}</h2>
          </div>
          <div className="sqr-topbar-right">
            <div className={`sqr-timer ${isLow ? 'sqr-timer-low' : ''}`}>
              <Clock size={15} />
              {formatTime(timeLeft)}
            </div>
            <button className="sqr-exit-btn" onClick={() => setShowConfirm(true)}>
              Exit
            </button>
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="sqr-progress-wrap">
          <div className="sqr-progress-bar">
            <div className="sqr-progress-fill" style={{ width: `${pct}%`, background: quiz.courseColor }} />
          </div>
          <span className="sqr-progress-label">{answered}/{quiz.questions.length} answered</span>
        </div>

        <div className="sqr-body">

          {/* ── Question Panel ── */}
          <div className="sqr-question-panel">
            <div className="sqr-q-header">
              <span className="sqr-q-number">Question {current + 1} of {quiz.questions.length}</span>
              <button
                className={`sqr-flag-btn ${flagged.has(current) ? 'sqr-flag-active' : ''}`}
                onClick={() => setFlagged(prev => {
                  const next = new Set(prev);
                  next.has(current) ? next.delete(current) : next.add(current);
                  return next;
                })}
                title="Flag for review"
              >
                🚩 {flagged.has(current) ? 'Flagged' : 'Flag'}
              </button>
            </div>

            <p className="sqr-q-text">{q.text}</p>

            <div className="sqr-choices">
              {q.choices.map((choice, idx) => (
                <button
                  key={idx}
                  className={`sqr-choice ${selected[current] === idx ? 'sqr-choice-selected' : ''}`}
                  style={selected[current] === idx ? { borderColor: quiz.courseColor, background: quiz.courseColor + '12' } : {}}
                  onClick={() => setSelected(prev => {
                    const next = [...prev];
                    next[current] = idx;
                    return next;
                  })}
                >
                  <span className="sqr-choice-letter" style={selected[current] === idx ? { background: quiz.courseColor, color: '#fff' } : {}}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="sqr-choice-text">{choice}</span>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="sqr-nav">
              <button
                className="sqr-nav-btn sqr-nav-prev"
                disabled={current === 0}
                onClick={() => setCurrent(c => c - 1)}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              {current < quiz.questions.length - 1 ? (
                <button
                  className="sqr-nav-btn sqr-nav-next"
                  style={{ background: quiz.courseColor }}
                  onClick={() => setCurrent(c => c + 1)}
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  className="sqr-nav-btn sqr-nav-submit"
                  onClick={() => setShowConfirm(true)}
                >
                  Submit Quiz <CheckCircle size={16} />
                </button>
              )}
            </div>
          </div>

          {/* ── Question Map ── */}
          <div className="sqr-map-panel">
            <h4 className="sqr-map-title">Question Navigator</h4>
            <div className="sqr-map-grid">
              {quiz.questions.map((_, i) => (
                <button
                  key={i}
                  className={`sqr-map-dot
                    ${i === current ? 'sqr-map-current' : ''}
                    ${selected[i] !== null ? 'sqr-map-answered' : ''}
                    ${flagged.has(i) ? 'sqr-map-flagged' : ''}
                  `}
                  style={i === current ? { background: quiz.courseColor } : selected[i] !== null ? { background: quiz.courseColor + '40', color: quiz.courseColor } : {}}
                  onClick={() => setCurrent(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="sqr-map-legend">
              <span><span className="sqr-legend-dot sqr-legend-current" /> Current</span>
              <span><span className="sqr-legend-dot sqr-legend-answered" /> Answered</span>
              <span><span className="sqr-legend-dot sqr-legend-flagged" /> Flagged</span>
              <span><span className="sqr-legend-dot sqr-legend-blank" /> Unanswered</span>
            </div>
            <div className="sqr-map-submit">
              <button
                className="sqr-submit-all-btn"
                onClick={() => setShowConfirm(true)}
              >
                <CheckCircle size={15} /> Submit Quiz
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm Dialog ── */}
      {showConfirm && (
        <div className="sqr-confirm-overlay">
          <div className="sqr-confirm-dialog">
            <AlertCircle size={40} className="sqr-confirm-icon" />
            <h3>Submit Quiz?</h3>
            <p>
              You have answered <strong>{answered}</strong> out of <strong>{quiz.questions.length}</strong> questions.
              {answered < quiz.questions.length && (
                <> <span className="sqr-confirm-warn">{quiz.questions.length - answered} unanswered.</span></>
              )}
            </p>
            <div className="sqr-confirm-actions">
              <button className="sqr-confirm-cancel" onClick={() => setShowConfirm(false)}>
                Keep Reviewing
              </button>
              <button className="sqr-confirm-submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
            <button className="sqr-confirm-exit" onClick={onExit}>
              Exit without submitting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   RESULTS SCREEN
════════════════════════════════════════════════════════════════ */
function QuizResults({ quiz, result, onRetry, onReview, onBack }) {
  const passed = result.score >= quiz.passingScore;
  const correct = result.answers.filter(a => a.correct).length;
  const [showReview, setShowReview] = useState(false);

  if (showReview) {
    return (
      <div className="sqres-overlay">
        <div className="sqres-review-shell">
          <div className="sqres-review-header">
            <button className="sqres-back-btn" onClick={() => setShowReview(false)}>
              <ChevronLeft size={16} /> Back to Results
            </button>
            <h2>Answer Review — {quiz.title}</h2>
          </div>
          <div className="sqres-review-list">
            {quiz.questions.map((q, i) => {
              const ans = result.answers[i];
              return (
                <div key={q.id} className={`sqres-review-item ${ans.correct ? 'sqres-ri-correct' : 'sqres-ri-wrong'}`}>
                  <div className="sqres-ri-top">
                    <span className="sqres-ri-num">Q{i + 1}</span>
                    <p className="sqres-ri-text">{q.text}</p>
                    {ans.correct
                      ? <CheckCircle size={18} className="sqres-ri-icon sqres-correct-icon" />
                      : <XCircle size={18} className="sqres-ri-icon sqres-wrong-icon" />
                    }
                  </div>
                  <div className="sqres-ri-choices">
                    {q.choices.map((c, idx) => (
                      <div
                        key={idx}
                        className={`sqres-ri-choice
                          ${idx === q.answer ? 'sqres-ri-correct-ans' : ''}
                          ${idx === ans.chosen && !ans.correct ? 'sqres-ri-wrong-ans' : ''}
                        `}
                      >
                        <span className="sqres-ri-letter">{String.fromCharCode(65 + idx)}</span>
                        {c}
                        {idx === q.answer && <span className="sqres-ri-tag sqres-tag-correct">✓ Correct</span>}
                        {idx === ans.chosen && !ans.correct && <span className="sqres-ri-tag sqres-tag-wrong">✗ Your Answer</span>}
                      </div>
                    ))}
                  </div>
                  <div className="sqres-ri-explanation">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sqres-overlay">
      <div className="sqres-shell">
        <div className={`sqres-header ${passed ? 'sqres-header-pass' : 'sqres-header-fail'}`}>
          <div className="sqres-trophy">
            {passed ? <Trophy size={48} /> : <XCircle size={48} />}
          </div>
          <h2 className="sqres-verdict">{passed ? 'Quiz Passed! 🎉' : 'Not Passed'}</h2>
          <p className="sqres-verdict-sub">
            {passed
              ? 'Great work! You demonstrated solid understanding of this topic.'
              : `You need ${quiz.passingScore}% to pass. Review the material and try again.`}
          </p>
        </div>

        <div className="sqres-score-ring-wrap">
          <div className={`sqres-score-ring ${passed ? 'sqres-ring-pass' : 'sqres-ring-fail'}`}>
            <span className="sqres-score-num">{result.score}%</span>
            <span className="sqres-score-label">Score</span>
          </div>
        </div>

        <div className="sqres-stats">
          <div className="sqres-stat">
            <CheckCircle size={18} className="sqres-stat-icon-green" />
            <div>
              <div className="sqres-stat-val">{correct}</div>
              <div className="sqres-stat-lbl">Correct</div>
            </div>
          </div>
          <div className="sqres-stat">
            <XCircle size={18} className="sqres-stat-icon-red" />
            <div>
              <div className="sqres-stat-val">{quiz.questions.length - correct}</div>
              <div className="sqres-stat-lbl">Incorrect</div>
            </div>
          </div>
          <div className="sqres-stat">
            <Clock size={18} className="sqres-stat-icon-blue" />
            <div>
              <div className="sqres-stat-val">{formatTime(result.timeTaken)}</div>
              <div className="sqres-stat-lbl">Time Taken</div>
            </div>
          </div>
          <div className="sqres-stat">
            <BarChart2 size={18} className="sqres-stat-icon-purple" />
            <div>
              <div className="sqres-stat-val">{quiz.passingScore}%</div>
              <div className="sqres-stat-lbl">Passing Score</div>
            </div>
          </div>
        </div>

        <div className="sqres-actions">
          <button className="sqres-btn sqres-btn-review" onClick={() => setShowReview(true)}>
            <Eye size={15} /> Review Answers
          </button>
          {quiz.attempts < quiz.maxAttempts && (
            <button className="sqres-btn sqres-btn-retry" onClick={onRetry}>
              <RotateCcw size={15} /> Retry Quiz
            </button>
          )}
          <button className="sqres-btn sqres-btn-back" onClick={onBack}>
            <ChevronLeft size={15} /> Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN PAGE — Quiz List
════════════════════════════════════════════════════════════════ */
export default function StudentQuiz() {
  const [quizzes, setQuizzes]       = useState(MOCK_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);   // result after submission
  const [filter, setFilter]         = useState('All');

  const FILTERS = ['All', 'Available', 'Completed', 'Locked'];

  const filtered = quizzes.filter(q => {
    if (filter === 'All')       return true;
    if (filter === 'Available') return q.status === 'available';
    if (filter === 'Completed') return q.status === 'completed';
    if (filter === 'Locked')    return q.status === 'locked';
    return true;
  });

  const available  = quizzes.filter(q => q.status === 'available').length;
  const completed  = quizzes.filter(q => q.status === 'completed').length;
  const locked     = quizzes.filter(q => q.status === 'locked').length;

  function handleStartQuiz(quiz) {
    setActiveQuiz(quiz);
    setQuizResult(null);
  }

  function handleFinish(result) {
    setQuizResult(result);
    // Update attempts & bestScore in list
    setQuizzes(prev => prev.map(q => {
      if (q.id !== activeQuiz.id) return q;
      const newAttempts = q.attempts + 1;
      const newBest = q.bestScore === null ? result.score : Math.max(q.bestScore, result.score);
      const newStatus = result.score >= q.passingScore ? 'completed'
        : newAttempts >= q.maxAttempts ? 'completed' : 'available';
      return { ...q, attempts: newAttempts, bestScore: newBest, status: newStatus };
    }));
  }

  function handleRetry() {
    setQuizResult(null);
    // activeQuiz stays, runner re-mounts
    setActiveQuiz(q => ({ ...q }));
  }

  function handleBack() {
    setActiveQuiz(null);
    setQuizResult(null);
  }

  /* ── While taking a quiz ── */
  if (activeQuiz && !quizResult) {
    return (
      <QuizRunner
        quiz={activeQuiz}
        onFinish={handleFinish}
        onExit={handleBack}
      />
    );
  }

  /* ── After submitting ── */
  if (activeQuiz && quizResult) {
    return (
      <QuizResults
        quiz={activeQuiz}
        result={quizResult}
        onRetry={handleRetry}
        onBack={handleBack}
      />
    );
  }

  /* ── Quiz List ── */
  return (
    <div className="sq-page">

      {/* Header */}
      <div className="sq-header">
        <div>
          <h1 className="sq-title">Quizzes & Assessments</h1>
          <p className="sq-subtitle">Test your knowledge and track your scores</p>
        </div>
      </div>

      {/* Stats */}
      <div className="sq-stats-row">
        <div className="sq-stat sq-stat-blue">
          <Zap size={18} />
          <div>
            <div className="sq-stat-val">{quizzes.length}</div>
            <div className="sq-stat-lbl">Total Quizzes</div>
          </div>
        </div>
        <div className="sq-stat sq-stat-purple">
          <Play size={18} />
          <div>
            <div className="sq-stat-val">{available}</div>
            <div className="sq-stat-lbl">Available</div>
          </div>
        </div>
        <div className="sq-stat sq-stat-green">
          <CheckCircle size={18} />
          <div>
            <div className="sq-stat-val">{completed}</div>
            <div className="sq-stat-lbl">Completed</div>
          </div>
        </div>
        <div className="sq-stat sq-stat-gray">
          <Lock size={18} />
          <div>
            <div className="sq-stat-val">{locked}</div>
            <div className="sq-stat-lbl">Locked</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sq-filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`sq-filter-btn ${filter === f ? 'sq-filter-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Quiz Cards */}
      <div className="sq-list">
        {filtered.map(quiz => {
          const isLocked    = quiz.status === 'locked';
          const isCompleted = quiz.status === 'completed';
          const canRetry    = isCompleted && quiz.attempts < quiz.maxAttempts;
          const ddClass     = getDeadlineClass(quiz.dueDate);

          return (
            <div key={quiz.id} className={`sq-card ${isLocked ? 'sq-card-locked' : ''} ${isCompleted && !canRetry ? 'sq-card-done' : ''}`}>

              {/* Left accent */}
              <div className="sq-card-accent" style={{ background: quiz.courseColor }} />

              <div className="sq-card-body">
                {/* Top Row */}
                <div className="sq-card-top">
                  <div className="sq-card-icon" style={{ background: quiz.courseColor + '20', color: quiz.courseColor }}>
                    {isLocked ? <Lock size={20} /> : quiz.courseIcon}
                  </div>
                  <div className="sq-card-info">
                    <div className="sq-card-title-row">
                      <h3 className="sq-card-title">{quiz.title}</h3>
                      <span className={`sq-status-badge sq-status-${quiz.status}`}>
                        {quiz.status === 'available'  && '● Available'}
                        {quiz.status === 'completed'  && '✓ Completed'}
                        {quiz.status === 'locked'     && '🔒 Locked'}
                      </span>
                    </div>
                    <div className="sq-card-course" style={{ color: quiz.courseColor }}>
                      {quiz.course}
                    </div>
                    <p className="sq-card-desc">{quiz.description}</p>
                  </div>
                </div>

                {/* Meta Row */}
                <div className="sq-card-meta">
                  <span className="sq-meta-item">
                    <BookOpen size={12} /> {quiz.questionCount} questions
                  </span>
                  <span className="sq-meta-item">
                    <Clock size={12} /> {quiz.timeLimit} min
                  </span>
                  <span className="sq-meta-item">
                    <Star size={12} /> Pass: {quiz.passingScore}%
                  </span>
                  <span className="sq-meta-item">
                    <RotateCcw size={12} /> {quiz.attempts}/{quiz.maxAttempts} attempts
                  </span>
                  <span className={`sq-meta-deadline sq-deadline-${ddClass}`}>
                    📅 {getDaysUntil(quiz.dueDate)}
                  </span>
                </div>

                {/* Score bar (if attempted) */}
                {quiz.bestScore !== null && (
                  <div className="sq-score-row">
                    <span className="sq-score-label">Best Score</span>
                    <div className="sq-score-bar-wrap">
                      <div className="sq-score-bar">
                        <div
                          className="sq-score-fill"
                          style={{ width: `${quiz.bestScore}%`, background: quiz.courseColor }}
                        />
                        <div
                          className="sq-score-pass-line"
                          style={{ left: `${quiz.passingScore}%` }}
                          title={`Passing: ${quiz.passingScore}%`}
                        />
                      </div>
                    </div>
                    <span className={`sq-score-pct ${getScoreClass(quiz.bestScore, quiz.passingScore)}`}>
                      {quiz.bestScore}%
                    </span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="sq-card-action">
                {isLocked ? (
                  <button className="sq-action-btn sq-btn-locked" disabled>
                    <Lock size={14} /> Locked
                  </button>
                ) : isCompleted && !canRetry ? (
                  <button
                    className="sq-action-btn sq-btn-review"
                    onClick={() => handleStartQuiz(quiz)}
                  >
                    <Eye size={14} /> Review
                  </button>
                ) : (
                  <button
                    className="sq-action-btn sq-btn-start"
                    style={{ background: quiz.courseColor }}
                    onClick={() => handleStartQuiz(quiz)}
                  >
                    {quiz.attempts === 0
                      ? <><Play size={14} /> Start Quiz</>
                      : <><RotateCcw size={14} /> Retry</>}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}