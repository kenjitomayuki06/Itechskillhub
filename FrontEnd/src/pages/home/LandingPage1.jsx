import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/pages/home/landingPage1.css";
import heroImg from "../../assets/Landing1.png";

const LandingPage1 = () => {
  const navigate = useNavigate();
  const landingRef = useRef(null);
  const bgRef = useRef(null);
  const [animKey, setAnimKey] = useState(0);

  // Retrigger animation every time component mounts (user navigates to Home)
  useEffect(() => {
    setAnimKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const progress = Math.min(scrollY / (vh * 0.8), 1);

      // Fade out the text content as user scrolls
      if (landingRef.current) {
        landingRef.current.style.setProperty("--scroll-progress", progress);
      }

      // Parallax: move bg upward slowly — gives the "pinned" feel
      // but bg is now absolute (contained in section), so no bleed
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${scrollY * 0.4}px)`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={landingRef} className="landing">
      <div
        ref={bgRef}
        className="landing-bg"
        style={{ backgroundImage: `url(${heroImg})` }}
      />
      <div className="landing-inner">
        <div className="landing-content" key={animKey}>
          <h1>
            Master <br />
            computer <br />
            systems <br />
            servicing <br />
            today
          </h1>

          <p>
            ITechSkills Hub Platform delivers TESDA-aligned CSS training
            with hands-on labs and industry-certified instructors.
            Start your journey toward a skilled trade that matters.
          </p>

          <div className="landing-buttons">
            <button
              className="btn-google"
              onClick={() => navigate("/auth")}
              type="button"
              aria-label="Get started using Google account"
            >
              <svg viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z" fill="#34A853"/>
                <path d="M3.96 10.71A5.44 5.44 0 0 1 3.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" fill="#FBBC05"/>
                <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Get Started with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage1;