import { useState, useEffect, useCallback } from 'react';
import { apiFetch, getUser } from '../../services/authService';
import {
  BookOpen, Clock, CheckCircle, XCircle, AlertCircle,
  ChevronRight, ChevronLeft, RotateCcw, Trophy,
  Star, Play, Eye, BarChart2, Lock, Zap, Loader
} from 'lucide-react';
import '../../styles/pages/student/StudentQuiz.css';

/* ── Helpers ──────────────────────────────────────────────────── */
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function getScoreClass(score, passing) {
  if (score >= 90) return 'score-excellent';
  if (score >= passing) return 'score-pass';
  return 'score-fail';
}

// Map A/B/C/D letter to a 0-3 index for the UI
const LETTER_TO_INDEX = { A: 0, B: 1, C: 2, D: 3 };
const INDEX_TO_LETTER = ['A', 'B', 'C', 'D'];

// Course colors/icons — fallback styling since DB doesn't store these per quiz
const TOPIC_STYLE = {
  default: { color: '#5B4A9E', icon: '📝' },
};
function getTopicStyle() {
  return TOPIC_STYLE.default;
}

/* ════════════════════════════════════════════════════════════════
   QUIZ RUNNER — shown while taking a quiz
════════════════════════════════════════════════════════════════ */
function QuizRunner({ quiz, onFinish, onExit }) {
  const TIME_LIMIT_SECONDS = 15 * 60; // 15 min default since DB has no time_limit column

  const [current, setCurrent]     = useState(0);
  const [selected, setSelected]   = useState(Array(quiz.questions.length).fill(null));
  const [timeLeft, setTimeLeft]   = useState(TIME_LIMIT_SECONDS);
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
    // Build studentAnswers map: { [question_id]: 'A' | 'B' | 'C' | 'D' }
    const studentAnswers = {};
    quiz.questions.forEach((q, i) => {
      if (selected[i] !== null) {
        studentAnswers[q.question_id] = INDEX_TO_LETTER[selected[i]];
      }
    });
    onFinish({
      studentAnswers,
      selected,
      timeTaken: TIME_LIMIT_SECONDS - timeLeft,
    });
  }, [selected, quiz, timeLeft, onFinish]);

  const q = quiz.questions[current];
  const choices = [q.option_a, q.option_b, q.option_c, q.option_d];
  const answered = selected.filter(s => s !== null).length;
  const pct = Math.round((answered / quiz.questions.length) * 100);
  const isLow = timeLeft < 120;
  const style = getTopicStyle();

  return (
    <div className="sqr-overlay">
      <div className="sqr-shell">

        {/* ── Top Bar ── */}
        <div className="sqr-topbar">
          <div className="sqr-topbar-left">
            <span className="sqr-course-tag" style={{ background: style.color + '20', color: style.color }}>
              {style.icon} {quiz.topic}
            </span>
            <h2 className="sqr-quiz-title">{quiz.topic}</h2>
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
            <div className="sqr-progress-fill" style={{ width: `${pct}%`, background: style.color }} />
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

            <p className="sqr-q-text">{q.question_text}</p>

            <div className="sqr-choices">
              {choices.map((choice, idx) => (
                <button
                  key={idx}
                  className={`sqr-choice ${selected[current] === idx ? 'sqr-choice-selected' : ''}`}
                  style={selected[current] === idx ? { borderColor: style.color, background: style.color + '12' } : {}}
                  onClick={() => setSelected(prev => {
                    const next = [...prev];
                    next[current] = idx;
                    return next;
                  })}
                >
                  <span className="sqr-choice-letter" style={selected[current] === idx ? { background: style.color, color: '#fff' } : {}}>
                    {INDEX_TO_LETTER[idx]}
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
                  style={{ background: style.color }}
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
                  style={i === current ? { background: style.color } : selected[i] !== null ? { background: style.color + '40', color: style.color } : {}}
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
function QuizResults({ quiz, result, onRetry, onBack }) {
  const passed = result.isPassed;
  const correct = result.score;
  const total = result.totalQuestions;
  const [showReview, setShowReview] = useState(false);

  if (showReview) {
    return (
      <div className="sqres-overlay">
        <div className="sqres-review-shell">
          <div className="sqres-review-header">
            <button className="sqres-back-btn" onClick={() => setShowReview(false)}>
              <ChevronLeft size={16} /> Back to Results
            </button>
            <h2>Answer Review — {quiz.topic}</h2>
          </div>
          <div className="sqres-review-list">
            {quiz.questions.map((q, i) => {
              const choices = [q.option_a, q.option_b, q.option_c, q.option_d];
              const chosenIdx = result.selected[i];
              const correctIdx = LETTER_TO_INDEX[q.correct_option];
              const isCorrect = chosenIdx === correctIdx;
              return (
                <div key={q.question_id} className={`sqres-review-item ${isCorrect ? 'sqres-ri-correct' : 'sqres-ri-wrong'}`}>
                  <div className="sqres-ri-top">
                    <span className="sqres-ri-num">Q{i + 1}</span>
                    <p className="sqres-ri-text">{q.question_text}</p>
                    {isCorrect
                      ? <CheckCircle size={18} className="sqres-ri-icon sqres-correct-icon" />
                      : <XCircle size={18} className="sqres-ri-icon sqres-wrong-icon" />
                    }
                  </div>
                  <div className="sqres-ri-choices">
                    {choices.map((c, idx) => (
                      <div
                        key={idx}
                        className={`sqres-ri-choice
                          ${idx === correctIdx ? 'sqres-ri-correct-ans' : ''}
                          ${idx === chosenIdx && !isCorrect ? 'sqres-ri-wrong-ans' : ''}
                        `}
                      >
                        <span className="sqres-ri-letter">{INDEX_TO_LETTER[idx]}</span>
                        {c}
                        {idx === correctIdx && <span className="sqres-ri-tag sqres-tag-correct">✓ Correct</span>}
                        {idx === chosenIdx && !isCorrect && <span className="sqres-ri-tag sqres-tag-wrong">✗ Your Answer</span>}
                      </div>
                    ))}
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
              : 'Review the material and try again.'}
          </p>
        </div>

        <div className="sqres-score-ring-wrap">
          <div className={`sqres-score-ring ${passed ? 'sqres-ring-pass' : 'sqres-ring-fail'}`}>
            <span className="sqres-score-num">{correct}/{total}</span>
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
              <div className="sqres-stat-val">{total - correct}</div>
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
              <div className="sqres-stat-val">{Math.round((correct / total) * 100)}%</div>
              <div className="sqres-stat-lbl">Your Score</div>
            </div>
          </div>
        </div>

        <div className="sqres-actions">
          <button className="sqres-btn sqres-btn-review" onClick={() => setShowReview(true)}>
            <Eye size={15} /> Review Answers
          </button>
          <button className="sqres-btn sqres-btn-retry" onClick={onRetry}>
            <RotateCcw size={15} /> Retry Quiz
          </button>
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
  const [quizzes, setQuizzes]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(null);   // full quiz with questions
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizResult, setQuizResult] = useState(null);   // result after submission

  /* ── Fetch quiz list ── */
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        const res = await apiFetch('/api/quizzes');
        setQuizzes(res?.quizzes ?? []);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
        setError('Hindi ma-load ang mga quiz. Subukan ulit.');
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const totalQuizzes = quizzes.length;

  async function handleStartQuiz(quiz) {
    setQuizLoading(true);
    setQuizResult(null);
    try {
      const res = await apiFetch(`/api/quizzes/${quiz.quiz_id}`);
      if (res?.quiz?.questions?.length) {
        setActiveQuiz(res.quiz);
      } else {
        setError('Walang tanong na nakuha para sa quiz na ito.');
      }
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Hindi ma-load ang quiz. Subukan ulit.');
    } finally {
      setQuizLoading(false);
    }
  }

  async function handleFinish({ studentAnswers, selected, timeTaken }) {
    try {
      const res = await apiFetch(`/api/quizzes/${activeQuiz.quiz_id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          studentAnswers,
          topic: activeQuiz.topic,
          difficulty: activeQuiz.difficulty,
        }),
      });
      setQuizResult({
        ...res.result,
        selected,
        timeTaken,
      });
    } catch (err) {
      console.error('Quiz submission failed:', err);
      setError('Hindi na-save ang resulta ng quiz. Subukan ulit.');
    }
  }

  function handleRetry() {
    setQuizResult(null);
    // activeQuiz already has the questions loaded — just re-mount the runner
    setActiveQuiz(q => ({ ...q }));
  }

  function handleBack() {
    setActiveQuiz(null);
    setQuizResult(null);
  }

  /* ── While loading a specific quiz ── */
  if (quizLoading) {
    return (
      <div className="sq-page">
        <div className="sq-loading">
          <Loader size={32} className="sq-spinner-icon" />
          <p>Loading quiz...</p>
        </div>
      </div>
    );
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

      {error && (
        <div className="sq-error-banner">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stats */}
      <div className="sq-stats-row">
        <div className="sq-stat sq-stat-blue">
          <Zap size={18} />
          <div>
            <div className="sq-stat-val">{loading ? '—' : totalQuizzes}</div>
            <div className="sq-stat-lbl">Total Quizzes</div>
          </div>
        </div>
        <div className="sq-stat sq-stat-purple">
          <Play size={18} />
          <div>
            <div className="sq-stat-val">{loading ? '—' : totalQuizzes}</div>
            <div className="sq-stat-lbl">Available</div>
          </div>
        </div>
        <div className="sq-stat sq-stat-green">
          <Star size={18} />
          <div>
            <div className="sq-stat-val">{loading ? '—' : 'Medium'}</div>
            <div className="sq-stat-lbl">Avg. Difficulty</div>
          </div>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="sq-list">
        {loading ? (
          <div className="sq-loading">
            <Loader size={32} className="sq-spinner-icon" />
            <p>Loading quizzes...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="sq-empty">
            <BookOpen size={32} />
            <p>No quizzes available yet.</p>
          </div>
        ) : (
          quizzes.map(quiz => {
            const style = getTopicStyle();
            return (
              <div key={quiz.quiz_id} className="sq-card">

                {/* Left accent */}
                <div className="sq-card-accent" style={{ background: style.color }} />

                <div className="sq-card-body">
                  {/* Top Row */}
                  <div className="sq-card-top">
                    <div className="sq-card-icon" style={{ background: style.color + '20', color: style.color }}>
                      {style.icon}
                    </div>
                    <div className="sq-card-info">
                      <div className="sq-card-title-row">
                        <h3 className="sq-card-title">{quiz.topic}</h3>
                        <span className="sq-status-badge sq-status-available">
                          ● Available
                        </span>
                      </div>
                      <div className="sq-card-course" style={{ color: style.color }}>
                        Difficulty: {quiz.difficulty}
                      </div>
                    </div>
                  </div>

                  {/* Meta Row */}
                  <div className="sq-card-meta">
                    <span className="sq-meta-item">
                      <BookOpen size={12} /> {quiz.total_question} questions
                    </span>
                    <span className="sq-meta-item">
                      <Clock size={12} /> 15 min
                    </span>
                    <span className="sq-meta-item">
                      <Star size={12} /> {quiz.difficulty}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="sq-card-action">
                  <button
                    className="sq-action-btn sq-btn-start"
                    style={{ background: style.color }}
                    onClick={() => handleStartQuiz(quiz)}
                  >
                    <Play size={14} /> Start Quiz
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}