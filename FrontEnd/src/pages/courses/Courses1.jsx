import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/courses/Courses1.css";
import coursesData from "./coursesData";

const difficultyClass = {
  "Beginner": "tag-beginner",
  "Intermediate": "tag-intermediate",
  "Beginner to Intermediate": "tag-mixed",
};

const Courses1 = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const cardRefs = useRef([]);

  const filters = ["All", "Beginner", "Intermediate", "Beginner to Intermediate"];

  const filtered = filter === "All"
    ? coursesData
    : coursesData.filter(c => c.level === filter);

  useEffect(() => {
    const observers = cardRefs.current.map((ref, i) => {
      if (!ref) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, i]));
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(ref);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, [filtered]);

  const handleStartLearning = (courseId) => {
    const routes = {
      1: "/course/css-ncii",
      2: "/course/pc-hardware",
      3: "/course/network-setup",
      4: "/course/os-installation",
    };
    if (routes[courseId]) navigate(routes[courseId]);
  };

  return (
    <section className="lms-courses-section">
      <div className="lms-grid-bg" aria-hidden="true" />

      <div className="lms-header">
        <div className="lms-header-eyebrow">
          <span className="lms-dot" />
          TESDA-Aligned Curriculum
        </div>
        <h2 className="lms-title">
          Available <span className="lms-title-accent">Courses</span>
        </h2>
        <p className="lms-subtitle">
          Industry-standard training modules for Computer Systems Servicing professionals.
        </p>

        <div className="lms-stats-bar">
          <div className="lms-stat">
            <span className="lms-stat-num">4</span>
            <span className="lms-stat-label">Courses</span>
          </div>
          <div className="lms-stat-divider" />
          <div className="lms-stat">
            <span className="lms-stat-num">36</span>
            <span className="lms-stat-label">Lessons</span>
          </div>
          <div className="lms-stat-divider" />
          <div className="lms-stat">
            <span className="lms-stat-num">470+</span>
            <span className="lms-stat-label">Hours</span>
          </div>
          <div className="lms-stat-divider" />
          <div className="lms-stat">
            <span className="lms-stat-num">Free</span>
            <span className="lms-stat-label">For Students</span>
          </div>
        </div>

        <div className="lms-filters" role="tablist">
          {filters.map(f => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              className={`lms-filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="lms-grid">
        {filtered.map((course, i) => (
          <article
            key={course.id}
            ref={el => cardRefs.current[i] = el}
            className={`lms-card ${visibleCards.has(i) ? "lms-card--visible" : ""} ${hoveredId === course.id ? "lms-card--hovered" : ""}`}
            style={{ "--delay": `${i * 80}ms` }}
            onMouseEnter={() => setHoveredId(course.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="lms-card-accent" />

            <div className="lms-card-image-wrap">
              <img src={course.image} alt={course.title} className="lms-card-image" loading="lazy" />
              <div className="lms-card-image-overlay" />

              {course.badge && (
                <span className={`lms-badge lms-badge--${course.badgeType}`}>
                  {course.badge}
                </span>
              )}

              <div className="lms-image-stats">
                <span className="lms-img-stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {course.hours}
                </span>
                <span className="lms-img-stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  {course.students} enrolled
                </span>
              </div>
            </div>

            <div className="lms-card-body">
              <div className="lms-card-meta">
                <span className={`lms-level-tag ${difficultyClass[course.level] || "tag-beginner"}`}>
                  {course.level}
                </span>
                {course.free && (
                  <span className="lms-free-tag">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="11" height="11"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Free
                  </span>
                )}
              </div>

              <h3 className="lms-card-title">{course.title}</h3>
              <p className="lms-card-desc">{course.description}</p>

              <div className="lms-chips">
                <div className="lms-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  {course.modules}
                </div>
                <div className="lms-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  {course.lessons}
                </div>
                <div className="lms-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {course.hours}
                </div>
              </div>

              <div className="lms-progress-wrap">
                <span className="lms-progress-label">Course Completion</span>
                <span className="lms-progress-pct">0%</span>
              </div>
              <div className="lms-progress-track">
                <div className="lms-progress-fill" style={{ "--pct": "0%" }} />
              </div>

              <button
                className="lms-cta-btn"
                onClick={() => handleStartLearning(course.id)}
                aria-label={`Start learning ${course.title}`}
              >
                <span>Start Learning</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="15" height="15" className="lms-cta-arrow"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Courses1;