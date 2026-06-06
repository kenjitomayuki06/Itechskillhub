import { useEffect, useRef, useState } from "react";
import '../../styles/pages/home/landingPage2.css'
import startImg from "../../assets/Start.png";
import beginImg from "../../assets/Begin.png";
import finishImg from "../../assets/Finish.png";

const LandingPage2 = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animDone, setAnimDone] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => setAnimDone(true), 1600);
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
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

  const cardClass = `process-card${animDone ? " anim-done" : ""}`;

  return (
    <section
      ref={sectionRef}
      className={`process-section ${isVisible ? "lp2-visible" : ""}`}
    >
      <p className="process-label">Process</p>
      <p className="process-small-title">How it works</p>

      <p className="process-subtitle">
        Three steps to prepare for your CSS NC III assessment
      </p>

      <div className="process-cards">
        {/* CARD 1 */}
        <div
          className={cardClass}
          style={{ backgroundImage: `url(${startImg})` }}
        >
          <span className="step">Step</span>
          <h3>
            Sign up and <br /> choose your modules
          </h3>
          <p>
            Create your account and select the CSS NC III modules that fit your learning pace.
          </p>
        </div>

        {/* CARD 2 */}
        <div
          className={cardClass}
          style={{ backgroundImage: `url(${beginImg})` }}
        >
          <span className="step">Step</span>
          <h3>
            Learn through <br /> practice and review
          </h3>
          <p>
            Work through practice exercises, video lessons, and reviewer materials to prepare for your assessment.
          </p>
        </div>

        {/* CARD 3 */}
        <div
          className={cardClass}
          style={{ backgroundImage: `url(${finishImg})` }}
        >
          <span className="step">Step</span>
          <h3>
            Complete training and <br /> take your NC III assessment
          </h3>
          <p>
            Finish your training modules and feel confident and ready to take your official CSS NC III assessment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingPage2;