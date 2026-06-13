import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { loginWithEmail, loginWithGoogle } from '../../services/authService';
import '../../styles/pages/auth/InstructorLogin.css';
import { useGoogleLogin } from '@react-oauth/google';
import Logo from '../../assets/Logo1.svg';

function validateLogin({ email, password }) {
  if (!email.trim())                return 'Email address is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
  if (!password)                    return 'Password is required.';
  if (password.length < 6)          return 'Password must be at least 6 characters.';
  return null;
}

const InstructorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData]           = useState({ email: '', password: '' });
  const [error, setError]                 = useState('');
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword]   = useState(false);
  const [animData, setAnimData]           = useState(null);

  useEffect(() => {
    fetch('https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json')
      .then(r => r.json())
      .then(setAnimData)
      .catch(() => setAnimData(null));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validateLogin(formData);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const user = await loginWithEmail({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
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
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError('');
      try {
        const user = await loginWithGoogle(tokenResponse.access_token);
        if (user.status === 'pending') {
          navigate('/instructor/pending');
        } else if (user.role === 'instructor') {
          navigate('/instructor/dashboard');
        } else {
          setError('Access denied. This portal is for instructors only.');
        }
      } catch (err) {
        setError(err.message || 'Google login failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setError('Google login failed. Please try again.');
      setGoogleLoading(false);
    },
  });

  return (
    <div className="ins-page">
      <div className="ins-card">

        <div className="ins-lottie-wrap">
          {animData && <Lottie animationData={animData} loop autoplay />}
        </div>

        <Link to="/" className="ins-brand">
          <img src={Logo} alt="ITechSkillsHub" className="ins-brand-logo" />
          <div className="ins-brand-text">
            <span className="ins-brand-name">ITechSkillsHub</span>
            <span className="ins-brand-sub">Instructor Portal</span>
          </div>
        </Link>

        <div className="ins-header">
          <h2>Your Classroom Awaits</h2>
          <p>Sign in to your instructor portal</p>
        </div>

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
                placeholder="••••••••"
                autoComplete="current-password" />
              <button type="button" className="ins-eye" onClick={() => setShowPassword(p => !p)}>
                {showPassword
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
          </div>

          <div className="ins-row">
            <label className="ins-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <Link to="/instructor/forgot-password" className="ins-forgot-btn">Forgot password?</Link>
          </div>

          <button type="submit" className="ins-submit" disabled={loading}>
            {loading ? (
              <><svg className="ins-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
            ) : 'Sign In'}
          </button>

          <div className="ins-divider"><span>or continue with</span></div>

          <button type="button" onClick={() => handleGoogleLogin()} className="ins-google-btn" disabled={googleLoading}>
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
            Don't have an account?{' '}
            <Link to="/instructor/register">Sign Up</Link>
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