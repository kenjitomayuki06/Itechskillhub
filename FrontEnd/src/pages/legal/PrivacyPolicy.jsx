import { useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo1.svg";
import "../../styles/pages/legal/legal.css";

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="legal-page">
      <div className="legal-container">

        <div className="legal-header">
          <Link to="/" className="legal-brand">
            <img src={Logo} alt="ITechSkillsHub" />
            <span>ITechSkillsHub</span>
          </Link>
          <h1>Privacy Policy</h1>
          <p>Last updated: June 2025</p>
        </div>

        <div className="legal-content">

          <section>
            <h2>1. Information We Collect</h2>
            <p>When you use ITechSkillsHub, we collect the following information:</p>
            <ul>
              <li>Account information (full name, email address, password)</li>
              <li>Usage data (courses accessed, quiz scores, progress)</li>
              <li>Device and browser information</li>
            </ul>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Track your learning progress</li>
              <li>Improve the platform and user experience</li>
              <li>Send important updates about the platform</li>
              <li>Respond to your inquiries and support requests</li>
            </ul>
          </section>

          <section>
            <h2>3. Data Security</h2>
            <p>We take the security of your personal information seriously. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, disclosure, or destruction. Passwords are encrypted using industry-standard hashing algorithms.</p>
          </section>

          <section>
            <h2>4. Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
            <ul>
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect the rights and safety of our users</li>
            </ul>
          </section>

          <section>
            <h2>5. Cookies</h2>
            <p>ITechSkillsHub uses cookies and similar technologies to enhance your experience, remember your preferences, and analyze platform usage. You can control cookie settings through your browser.</p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your account and personal data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2>7. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your account at any time by contacting us.</p>
          </section>

          <section>
            <h2>8. Children's Privacy</h2>
            <p>ITechSkillsHub is intended for users who are at least 15 years of age. We do not knowingly collect personal information from children under 15.</p>
          </section>

          <section>
            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated date.</p>
          </section>

          <section>
            <h2>10. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy, please contact us at privacy@itechskillshub.com.</p>
          </section>

        </div>

        <div className="legal-footer">
          <Link to="/terms">← Terms of Service</Link>
          <Link to="/auth">Back to Sign Up →</Link>
        </div>

      </div>
    </div>
  );
}