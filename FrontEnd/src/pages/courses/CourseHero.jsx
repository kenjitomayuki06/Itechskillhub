import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/courses/courseHero.css";
import ParticleBackground from "../../components/ParticleBackground";

const CourseHero = () => {
  const navigate = useNavigate();
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey(prev => prev + 1);
  }, []);

  const handleBrowse = () => {
    // If already on /course, smooth scroll down to course list
    const courseList = document.querySelector(".courses-section");
    if (courseList) {
      courseList.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback: navigate to course page
      navigate("/course");
    }
  };

  return (
    <section className="course-hero">
      {/* PARTICLE BACKGROUND ONLY */}
      <div className="particle-bg">
        <ParticleBackground />
      </div>

      {/* CONTENT */}
      <div className="hero-content" key={animKey}>
        <span className="hero-badge">TESDA-Aligned Programs</span>

        <h1>
          Computer Systems <br />
          Servicing Training <br />
          Courses
        </h1>

        <p>
          Master the skills employers demand with our comprehensive,
          nationally-recognized CSS training programs. Start your tech
          career journey today.
        </p>

        <button className="hero-btn" onClick={handleBrowse}>
          Browse All Courses
        </button>
      </div>
    </section>
  );
};

export default CourseHero;