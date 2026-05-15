import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/pages/home/landingPage3.css'
import careerImg from "../../assets/Career.png";

const LandingPage3 = () => {
  const sectionRef = useRef(null);
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`lp3-section ${isVisible ? "lp3-visible" : ""}`}
    >
      <h2 className="lp3-title">
        Ready to start your <br /> career
      </h2>

      <p className="lp3-subtitle">
        Share your expertise and help students build real-world IT skills
      </p>

      <div className="lp3-buttons">
        {/* INSTRUCTOR ENTRY */}
        <button
          className="lp3-btn-primary"
          onClick={() => navigate("/instructor/login")}
        >
          Instructor Access
        </button>

        {/* PUBLIC / READ-ONLY */}
        <button
          className="lp3-btn-secondary"
          onClick={() => navigate("/course")}
        >
          Browse Courses
        </button>
      </div>

      <div
        className="lp3-image"
        style={{ backgroundImage: `url(${careerImg})` }}
      />
    </section>
  );
};

export default LandingPage3;