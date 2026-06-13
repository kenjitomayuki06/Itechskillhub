import { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo1.svg";
import "../../styles/pages/legal/legal.css";

export default function TermsOfService() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="legal-page">
      <div className="legal-container">

        <div className="legal-header">
          <Link to="/" className="legal-brand">
            <img src={Logo} alt="ITechSkillsHub" />
            <span>ITechSkillsHub</span>
          </Link>
          <h1>Terms of Service</h1>
          <p>Last updated: June 2025</p>
        </div>

        <div className="legal-content">

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using ITechSkillsHub, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.</p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>ITechSkillsHub is a web-based training and review platform designed to help students prepare for the TESDA Computer Systems Servicing (CSS) NC III assessment. The platform provides access to training modules, practice quizzes, and learning resources.</p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>To access certain features of the platform, you must create an account. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information during registration</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2>4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the platform for any unlawful purpose</li>
              <li>Share your account credentials with others</li>
              <li>Attempt to gain unauthorized access to any part of the platform</li>
              <li>Upload or transmit any harmful, offensive, or inappropriate content</li>
              <li>Interfere with or disrupt the integrity or performance of the platform</li>
            </ul>
          </section>

          <section>
            <h2>5. Intellectual Property</h2>
            <p>All content on ITechSkillsHub, including but not limited to text, graphics, logos, and training materials, is the property of ITechSkillsHub and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written permission.</p>
          </section>

          <section>
            <h2>6. Certificates and Completion</h2>
            <p>Certificates issued by ITechSkillsHub upon completion of training modules are for educational purposes only and do not constitute official TESDA certification. To obtain an official TESDA National Certificate, you must complete the official TESDA assessment process.</p>
          </section>

          <section>
            <h2>7. Disclaimer of Warranties</h2>
            <p>ITechSkillsHub is provided "as is" without warranties of any kind. We do not guarantee that the platform will be error-free, uninterrupted, or that it will meet your specific requirements.</p>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>ITechSkillsHub shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of or inability to use the platform.</p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>If you have questions about these Terms of Service, please contact us at support@itechskillshub.com.</p>
          </section>

        </div>

        <div className="legal-footer">
          <Link to="/auth">← Back to Sign Up</Link>
          <Link to="/privacy">Privacy Policy →</Link>
        </div>

      </div>
    </div>
  );
}