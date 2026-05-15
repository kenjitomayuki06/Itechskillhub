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
    { value: "4", label: "CSS NC II Modules" },
    { value: "3",  label: "User Roles" },
    { value: "TESDA",  label: "Aligned Curriculum" },
    { value: "LMS",    label: "Web-Based Platform" },
  ];

  const reasons = [
    { icon: Award,          title: "TESDA Registered",    desc: "Fully accredited by TESDA as an official Training Institution — your certification is recognized nationwide." },
    { icon: Laptop,         title: "Hands-On Training",   desc: "Real lab environments, actual hardware, and practical assessments that prepare you for the job — not just the exam." },
    { icon: GraduationCap,  title: "Industry Instructors", desc: "Learn from certified professionals with years of real-world experience in computer systems and IT infrastructure." },
    { icon: Route,          title: "Clear Career Path",   desc: "From beginner to TESDA-certified technician — our structured curriculum gets you job-ready in the shortest time." },
    { icon: Users,          title: "Supportive Community", desc: "Join a growing community of Filipino IT professionals, alumni, and mentors who help each other grow." },
    { icon: ShieldCheck,    title: "Quality Assured",     desc: "Our training modules are regularly updated to meet current industry standards and TESDA competency requirements." },
  ];

  const team = [
    { name: "Ilyanna Rose P. Castillo",  role: "Quality Assurance",    desc: "Ensures the platform meets quality standards through testing and validation of features.", initials: "IC" },
    { name: "Almar L. Crisostomo",       role: "Backend Developer",    desc: "Handles server-side logic, database architecture, and API development of the LMS.",        initials: "AC" },
    { name: "Angel Rose C. Durana",      role: "Frontend Developer",   desc: "Builds and implements the user interface and client-side features of the platform.",         initials: "AD" },
    { name: "Keisha Mae C. Padua",       role: "Project Manager",      desc: "Leads project planning, coordinates the team, and ensures timely delivery of milestones.",   initials: "KP" },
    { name: "Jose Nelson L. Salino Jr.", role: "UI/UX Designer",       desc: "Designs the overall look, feel, and user experience of the ITechSkillsHub platform.",        initials: "JS" },
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
            ITechSkillsHub is a web-based Learning Management System (LMS) designed to deliver TESDA-aligned Computer Systems Servicing training — built as a capstone project by Filipino IT students.
          </p>
          <button className="about-hero-btn" onClick={() => navigate("/course")}>
            Explore Our Courses
          </button>
        </div>
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section ref={missionRef} className={`about-mission ${missionVisible ? "about-visible" : ""}`}>
        <div className="about-mission-inner">
          <div className="about-mv-card about-mv-mission">
            <div className="about-mv-icon"><Target size={28} /></div>
            <h3>Our Mission</h3>
            <p>To develop a functional and accessible web-based LMS that delivers TESDA-aligned CSS NC II training — giving students a structured path to certification through modern technology.</p>
          </div>
          <div className="about-mv-card about-mv-vision">
            <div className="about-mv-icon"><Eye size={28} /></div>
            <h3>Our Vision</h3>
            <p>To create a platform that demonstrates how technology can modernize TESDA-aligned education — making quality IT training more organized, accessible, and effective for Filipino learners.</p>
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
        <h2 className="about-section-title">Built for Filipino IT professionals</h2>
        <p className="about-section-sub">Everything we do is designed to get you certified, job-ready, and confident.</p>
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
          <p>Browse our CSS NC II modules and see what ITechSkillsHub has to offer.</p>
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