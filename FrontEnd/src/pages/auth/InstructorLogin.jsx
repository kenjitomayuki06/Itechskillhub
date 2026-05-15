import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { loginWithEmail, loginWithGoogle, registerUser } from '../../services/authService';
import '../../styles/pages/auth/InstructorLogin.css';
import Logo from '../../assets/Logo1.svg';

function validateLogin({ email, password }) {
  if (!email.trim())                return 'Email address is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
  if (!password)                    return 'Password is required.';
  if (password.length < 6)          return 'Password must be at least 6 characters.';
  return null;
}

function validateRegister({ name, email, password, confirmPassword }) {
  if (!name.trim())                      return 'Full name is required.';
  if (!email.trim())                     return 'Email address is required.';
  if (!/\S+@\S+\.\S+/.test(email))       return 'Please enter a valid email address.';
  if (!password)                         return 'Password is required.';
  if (password.length < 8)               return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(password))           return 'Password must contain at least one uppercase letter.';
  if (!/[0-9]/.test(password))           return 'Password must contain at least one number.';
  if (password !== confirmPassword)      return 'Passwords do not match.';
  return null;
}

const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)          score++;
  if (/[A-Z]/.test(pw))        score++;
  if (/[0-9]/.test(pw))        score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const InstructorLogin = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp]           = useState(false);
  const [formData, setFormData]           = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [agreed, setAgreed]               = useState(false);
  const [animData, setAnimData]           = useState(null);
  const [animKey, setAnimKey]             = useState(0);

  useEffect(() => {
    fetch('https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json')
      .then(r => r.json())
      .then(setAnimData)
      .catch(() => setAnimData(null));
  }, []);

  useEffect(() => {
    setAnimKey(prev => prev + 1);
    setError('');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  }, [isSignUp]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const pwStrength    = passwordStrength(formData.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const strengthClass = ['', 'str-weak', 'str-fair', 'str-good', 'str-strong'][pwStrength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!agreed) { setError('Please agree to the Terms and Privacy Policy.'); return; }
      const err = validateRegister(formData);
      if (err) { setError(err); return; }
      setLoading(true);
      try {
        await registerUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          role: 'instructor',
        });
        navigate('/instructor/dashboard');
      } catch (err) {
        setError(err.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      const err = validateLogin(formData);
      if (err) { setError(err); return; }
      setLoading(true);
      try {
        const user = await loginWithEmail({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        sessionStorage.setItem("userName", user.fullname || user.id);
        sessionStorage.setItem("userEmail", user.email);

        if (user.role === 'instructor') {
          navigate('/instructor/dashboard');
        } else {
          setError('Access denied. This portal is for instructors only.');
        }
      } catch (err) {
        setError(err.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      throw new Error('Google login coming soon. Please use email login for now.');
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="ins-page">

      <div className="ins-card">

        {/* Lottie on top */}
        <div className="ins-lottie-wrap">
          {animData && <Lottie animationData={animData} loop autoplay />}
        </div>

        {/* Brand */}
        <Link to="/" className="ins-brand">
          <img
            src={Logo}
            alt="ITechSkillsHub"
            className="ins-brand-logo"
          />
          <div className="ins-brand-text">
            <span className="ins-brand-name">ITechSkillsHub</span>
            <span className="ins-brand-sub">Instructor Portal</span>
          </div>
        </Link>

        {/* Tabs */}
        <div className="ins-tabs">
          <button
            className={`ins-tab ${!isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            className={`ins-tab ${isSignUp ? 'active' : ''}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <div className={`ins-tab-indicator ${isSignUp ? 'right' : 'left'}`} />
        </div>

        {/* Heading */}
        <div className="ins-header">
          <h2>
            {isSignUp ? <>Create <em>account</em></> : <>Welcome back, <em>Instructor</em></>}
          </h2>
          <p>{isSignUp ? 'Start teaching thousands of students today' : 'Sign in to manage your courses and students'}</p>
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

        {/* Form */}
        <form className="ins-form" key={animKey} noValidate onSubmit={handleSubmit}>

          {isSignUp && (
            <div className="ins-field">
              <label htmlFor="ins-name">Full Name</label>
              <div className="ins-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input id="ins-name" type="text" name="name"
                  value={formData.name} onChange={handleChange}
                  placeholder="Prof. Maria Santos" autoComplete="name" />
              </div>
            </div>
          )}

          <div className="ins-field">
            <label htmlFor="ins-email">Email address</label>
            <div className="ins-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input id="ins-email" type="email" name="email"
                value={formData.email} onChange={handleChange}
                placeholder="instructor@example.com" autoComplete="email" />
            </div>
          </div>

          <div className="ins-field">
            <div className="ins-field-header">
              <label htmlFor="ins-password">Password</label>
            </div>
            <div className="ins-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input id="ins-password" type={showPassword ? 'text' : 'password'} name="password"
                value={formData.password} onChange={handleChange}
                placeholder={isSignUp ? 'Min. 8 characters' : '••••••••'}
                autoComplete={isSignUp ? 'new-password' : 'current-password'} />
              <button type="button" className="ins-eye" onClick={() => setShowPassword(p => !p)}>
                {showPassword
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {isSignUp && formData.password && (
              <div className="ins-pw-strength">
                <div className="ins-pw-bars">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`ins-pw-bar ${i <= pwStrength ? strengthClass : ''}`} />
                  ))}
                </div>
                <span className={`ins-pw-label ${strengthClass}`}>{strengthLabel}</span>
              </div>
            )}
          </div>

          {isSignUp && (
            <div className="ins-field">
              <label htmlFor="ins-confirm">Confirm Password</label>
              <div className="ins-input-wrap">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <input id="ins-confirm" type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter your password" autoComplete="new-password" />
                <button type="button" className="ins-eye" onClick={() => setShowConfirm(p => !p)}>
                  {showConfirm
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>
          )}

          {!isSignUp && (
            <div className="ins-row">
              <label className="ins-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/instructor/forgot-password" className="ins-forgot-btn">Forgot password?</Link>
            </div>
          )}

          {isSignUp && (
            <label className="ins-terms">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
              <span>
                By signing up, you agree to our{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                {' '}and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </span>
            </label>
          )}

          <button type="submit" className="ins-submit" disabled={loading}>
            {loading ? (
              <><svg className="ins-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>{isSignUp ? 'Creating account...' : 'Signing in...'}</>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>

          <div className="ins-divider"><span>or continue with</span></div>

          <button type="button" onClick={handleGoogleLogin} className="ins-google-btn" disabled={googleLoading}>
            {googleLoading ? (
              <><svg className="ins-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Connecting...</>
            ) : (
              <><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z" fill="#34A853"/>
                <path d="M3.96 10.71A5.44 5.44 0 0 1 3.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" fill="#FBBC05"/>
                <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
              </svg>Continue with Google</>
            )}
          </button>

          <p className="ins-switch">
            {isSignUp
              ? <>Already have an account?{' '}<span onClick={() => setIsSignUp(false)}>Sign in</span></>
              : <>Don't have an account?{' '}<span onClick={() => setIsSignUp(true)}>Sign up free</span></>
            }
          </p>

        </form>

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

export default InstructorLogin;