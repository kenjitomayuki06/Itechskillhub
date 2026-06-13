import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { forgotPassword } from '../../services/authService';
import '../../styles/pages/auth/InstructorLogin.css';
import Logo from '../../assets/Logo1.svg';

const InstructorForgotPassword = () => {
  const [email, setEmail]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');
  const [sent, setSent]           = useState(false);
  const [animData, setAnimData]   = useState(null);

  useEffect(() => {
    fetch('https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json')
      .then(r => r.json())
      .then(setAnimData)
      .catch(() => setAnimData(null));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ins-page">
      <div className="ins-card">

        {/* Lottie */}
        <div className="ins-lottie-wrap">
          {animData && <Lottie animationData={animData} loop autoplay />}
        </div>

        {/* Brand */}
        <Link to="/" className="ins-brand">
          <img src={Logo} alt="ITechSkillsHub" className="ins-brand-logo" />
          <div className="ins-brand-text">
            <span className="ins-brand-name">ITechSkillsHub</span>
            <span className="ins-brand-sub">Instructor Portal</span>
          </div>
        </Link>

        {!sent ? (
          <>
            {/* Heading */}
            <div className="ins-header">
              <h2>Forgot <em>password?</em></h2>
              <p>Enter your email and we'll send you a reset link</p>
            </div>

            {/* Error */}
            {error && (
              <div className="ins-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <form className="ins-form" noValidate onSubmit={handleSubmit}>
              <div className="ins-field">
                <label htmlFor="fp-email">Email address</label>
                <div className="ins-input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="fp-email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="instructor@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button type="submit" className="ins-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="ins-spinner" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>

              <p className="ins-switch">
                Remember your password?{' '}
                <Link to="/instructor/login" style={{ color: 'inherit', fontWeight: 600 }}>Sign in</Link>
              </p>
            </form>
          </>
        ) : (
          <>
            <div className="ins-header" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
              <h2>Check your <em>email</em></h2>
              <p>
                We sent a reset link to <strong style={{ color: '#fff' }}>{email}</strong>.
                It may take a minute to arrive.
              </p>
            </div>

            <form className="ins-form" noValidate onSubmit={handleSubmit}>
              <button type="submit" className="ins-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="ins-spinner" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/>
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Resending...
                  </>
                ) : (
                  'Resend Email'
                )}
              </button>

              <p className="ins-switch" style={{ marginTop: 12 }}>
                Back to{' '}
                <Link to="/instructor/login" style={{ color: 'inherit', fontWeight: 600 }}>Sign in</Link>
              </p>
            </form>
          </>
        )}

        <footer className="ins-footer-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Protected by enterprise-grade security &amp; encryption
        </footer>

      </div>
    </div>
  );
};

export default InstructorForgotPassword;