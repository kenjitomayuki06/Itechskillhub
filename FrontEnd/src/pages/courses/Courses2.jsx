import React, { useEffect } from 'react';
import "../../styles/courses/Courses2.css";

const Courses2 = () => {
  useEffect(() => {
    const cards = document.querySelectorAll('.feature-card, .support-card');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      ),
      title: 'Industry-Recognized Certification',
      description: 'Earn TESDA NC II credentials valued by employers nationwide.',
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z"/>
        </svg>
      ),
      title: 'Blended Online & Hands-On Training',
      description: 'Combine flexible online learning with practical lab sessions.',
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      title: 'Guidance from TESDA-Certified Instructors',
      description: 'Learn from industry veterans with years of field experience.',
    },
  ];

  const supportFeatures = [
    '100% free access to all courses',
    'TESDA-aligned curriculum',
    'Practice quizzes and assessments',
    'Certificate upon completion',
  ];

  return (
    <section className="courses2-section">
      <div className="courses2-container">
        {/* What Sets Us Apart Section */}
        <div className="courses2-header">
          <span className="section-badge">Why Our Courses</span>
          <h2>What Sets Us Apart</h2>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              className="feature-card" 
              key={feature.id}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Learning Support Section */}
        <div className="support-section">
          <div className="support-card">
            <div className="support-content">
              <h2>Need Learning Support?</h2>
              <p className="support-description">
                All our courses are completely free for students. We're here to help you succeed with comprehensive support resources.
              </p>
              
              <ul className="support-features">
                {supportFeatures.map((feature, index) => (
                  <li key={index}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="support-cta">
              <button className="quiz-btn">
                Practice with Quizzes
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </button>
              <p className="cta-description">Test your knowledge • Track your progress</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses2;