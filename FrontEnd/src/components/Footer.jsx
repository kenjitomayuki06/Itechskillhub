import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Facebook, Instagram, Mail } from 'lucide-react';
import '../styles/components/Footer.css'
import logo from '../assets/Logo1.svg';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  // Handle smooth scroll to team section
  const handleTeamClick = (e) => {
    e.preventDefault();
    if (pathname === '/about') {
      // Already on About page — just scroll to team section
      const teamSection = document.getElementById('team');
      if (teamSection) teamSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to About page then scroll to team
      navigate('/about');
      setTimeout(() => {
        const teamSection = document.getElementById('team');
        if (teamSection) teamSection.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="footer footer-safe">
      <div className="footer-container">
        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-text">
            <h3>Stay informed always</h3>
            <p>Get the latest updates on courses and industry insights</p>
          </div>
          <div className="newsletter-form-wrapper">
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <div className="newsletter-input-group">
                <input
                  type="email"
                  placeholder="Your email here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">Subscribe</button>
              </div>
            </form>
            <p className="privacy-notice">By subscribing you agree to our Privacy Policy</p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <div className="footer-column logo-column">
            <img src={logo} alt="ITechSkillsHub" className="footer-logo" />
          </div>

          <div className="footer-column">
            <h4>Courses</h4>
            <ul>
              <li><Link to="/course/css-ncii">Computer Systems Servicing</Link></li>
              <li><Link to="/course/pc-hardware">PC Hardware Assembly</Link></li>
              <li><Link to="/course/network-setup">Network Setup & Config</Link></li>
              <li><Link to="/course/os-installation">OS Installation</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><a href="/about#team" onClick={handleTeamClick}>Our Team</a></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/games">Games</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><Link to="/auth">Student Login</Link></li>
              <li><Link to="/instructor/login">Instructor Login</Link></li>
              <li><a href="mailto:info@itechskillshub.com">Contact Us</a></li>
              <li><Link to="/about">Learn More</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p className="copyright">© 2026 ITechSkillsHub. All rights reserved.</p>
            <div className="footer-legal">
              <Link to="/about">About</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/games">Resources</Link>
            </div>
          </div>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="mailto:info@itechskillshub.com" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;