import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/about/about.css";
import logo from "../../assets/Logo1.svg";
import {
  Award, Laptop, GraduationCap, Route, Users, ShieldCheck,
  Target, Eye
} from "lucide-react";

const useVisible = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold, rootMargin: "0px 0px -80px 0px" }
    );
    const currentRef = ref.current;
    if (currentRef) obs.observe(currentRef);
    return () => { if (currentRef) obs.unobserve(currentRef); };
  }, [threshold]);
  return [ref, visible];
};

const About = () => {
  const navigate = useNavigate();

  const [missionRef, missionVisible] = useVisible();
  const [statsRef, statsVisible] = useVisible();
  const [whyRef, whyVisible] = useVisible();
  const [teamRef, teamVisible] = useVisible();
  const [ctaRef, ctaVisible] = useVisible();

  const stats = [
    { value: "4",     label: "CSS NC III Modules" },
    { value: "3",     label: "User Roles" },
    { value: "TESDA", label: "Aligned Curriculum" },
    { value: "CSS",   label: "NC III Training Platform" },
  ];

  const reasons = [
    { icon: Award,         title: "TESDA-Aligned Content",    desc: "Training materials are aligned with TESDA's CSS NC III competency standards to help you prepare for the official assessment." },
    { icon: Laptop,        title: "Hands-On Practice",        desc: "Work through practical exercises and review materials that simulate real-world scenarios covered in the NC III assessment." },
    { icon: GraduationCap, title: "Structured Modules",       desc: "Learn through organized modules designed to guide you step-by-step through all CSS NC III competencies." },
    { icon: Route,         title: "Clear Learning Path",      desc: "From beginner to assessment-ready — our structured curriculum helps you build knowledge and confidence at your own pace." },
    { icon: Users,         title: "Built for IT Students",    desc: "Designed specifically for IT students, computer engineering students, and anyone preparing to take the CSS NC III assessment." },
    { icon: ShieldCheck,   title: "Quality Training Content", desc: "Training modules are carefully developed to cover the key competencies and skills required for the CSS NC III assessment." },
  ];

  const team = [
    { name: "Ilyanna Rose P. Castillo",  role: "Quality Assurance",  desc: "Ensures the platform meets quality standards through testing and validation of features.", initials: "IC" },
    { name: "Almar L. Crisostomo",       role: "Backend Developer",  desc: "Handles server-side logic, database architecture, and API development of the platform.",   initials: "AC" },
    { name: "Angel Rose C. Durana",      role: "Frontend Developer", desc: "Builds and implements the user interface and client-side features of the platform.",        initials: "AD" },
    { name: "Keisha Mae C. Padua",       role: "Project Manager",    desc: "Leads project planning, coordinates the team, and ensures timely delivery of milestones.",  initials: "KP" },
    { name: "Jose Nelson L. Salino Jr.", role: "UI/UX Designer",     desc: "Designs the overall look, feel, and user experience of the ITechSkillsHub platform.",       initials: "JS" },
  ];

  return (
    <div className="about-page">

      {/* ===== HERO ===== */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <span className="about-hero-label">About Us</span>
          <h1 className="about-hero-title">
            Empowering Filipinos <br /> through tech education
          </h1>
          <p className="about-hero-sub">
            ITechSkillsHub is a CSS NC III review and training platform designed to help students prepare for the TESDA CSS NC III assessment — built as a capstone project by Filipino IT students.
          </p>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section ref={missionRef} className={`about-mission ${missionVisible ? "about-visible" : ""}`}>
        <div className="about-mission-inner">
          <div className="about-mv-card about-mv-mission">
            <div className="about-mv-icon"><Target size={28} /></div>
            <h3>Our Mission</h3>
            <p>To develop a functional and accessible training and review system that helps students build the knowledge and skills needed to confidently take the TESDA CSS NC III assessment.</p>
          </div>
          <div className="about-mv-card about-mv-vision">
            <div className="about-mv-icon"><Eye size={28} /></div>
            <h3>Our Vision</h3>
            <p>To create a web-based system that demonstrates how technology can modernize training preparation — making quality CSS NC III review materials more organized, accessible, and effective for Filipino learners.</p>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section ref={statsRef} className={`about-stats ${statsVisible ? "about-visible" : ""}`}>
        <div className="about-stats-inner">
          {stats.map((s, i) => (
            <div className="about-stat-item" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
              <span className="about-stat-value">{s.value}</span>
              <span className="about-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section ref={whyRef} className={`about-why ${whyVisible ? "about-visible" : ""}`}>
        <p className="about-section-label">Why ITechSkillsHub</p>
        <h2 className="about-section-title">Built for Filipino IT students</h2>
        <p className="about-section-sub">Everything we do is designed to help you prepare, practice, and pass your CSS NC III assessment.</p>
        <div className="about-why-grid">
          {reasons.map((r, i) => (
            <div className="about-why-card" key={i} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
              <div className="about-why-icon"><r.icon size={24} /></div>
              <h4>{r.title}</h4>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section id="team" ref={teamRef} className={`about-team ${teamVisible ? "about-visible" : ""}`}>
        <p className="about-section-label">The Team</p>
        <h2 className="about-section-title">Meet the developers</h2>
        <p className="about-section-sub">A group of IT students building ITechSkillsHub as their capstone project.</p>
        <div className="about-team-grid">
          {team.map((m, i) => (
            <div className="about-team-card" key={i} style={{ animationDelay: `${0.1 + i * 0.15}s` }}>
              <div className="about-team-avatar">{m.initials}</div>
              <h4 className="about-team-name">{m.name}</h4>
              <span className="about-team-role">{m.role}</span>
              <p className="about-team-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section ref={ctaRef} className={`about-cta ${ctaVisible ? "about-visible" : ""}`}>
        <div className="about-cta-inner">
          <img src={logo} alt="ITechSkillsHub" className="about-cta-logo" />
          <h2>Explore the platform</h2>
          <p>Browse our CSS NC III modules and see what ITechSkillsHub has to offer.</p>
          <div className="about-cta-btns">
            <button className="about-cta-primary" onClick={() => navigate("/auth")}>Get Started</button>
            <button className="about-cta-secondary" onClick={() => navigate("/course")}>Browse Courses</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;