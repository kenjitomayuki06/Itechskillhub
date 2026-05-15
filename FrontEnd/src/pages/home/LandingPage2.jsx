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
          // Last card animates at 0.85s delay + 0.7s duration = ~1.6s total
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
        Three steps to your CSS certification and career readiness
      </p>

      <div className="process-cards">
        {/* CARD 1 */}
        <div
          className={cardClass}
          style={{ backgroundImage: `url(${startImg})` }}
        >
          <span className="step">Step</span>
          <h3>
            Sign up and <br /> choose your path
          </h3>
          <p>
            Create your account and select the CSS course that fits your goals
            and schedule.
          </p>
          <span className="card-action">Start</span>
        </div>

        {/* CARD 2 */}
        <div
          className={cardClass}
          style={{ backgroundImage: `url(${beginImg})` }}
        >
          <span className="step">Step</span>
          <h3>
            Learn through <br /> hands-on training
          </h3>
          <p>
            Work through modules with real labs, video lessons, and guidance from
            certified instructors.
          </p>
          <span className="card-action">Begin</span>
        </div>

        {/* CARD 3 */}
        <div
          className={cardClass}
          style={{ backgroundImage: `url(${finishImg})` }}
        >
          <span className="step">Step</span>
          <h3>
            Earn your TESDA <br /> certification
          </h3>
          <p>
            Complete assessments and receive your credential recognized across
            the industry.
          </p>
          <span className="card-action">Finish</span>
        </div>
      </div>
    </section>
  );
};

export default LandingPage2;