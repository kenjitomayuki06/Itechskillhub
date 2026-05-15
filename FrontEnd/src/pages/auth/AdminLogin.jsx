import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../../services/authService';
import '../../styles/pages/auth/AdminLogin.css';
import Logo from '../../assets/Logo1.svg';

function validateSignIn({ email, password }) {
  if (!email.trim())               return 'Email address is required.';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.';
  if (!password)                   return 'Password is required.';
  if (password.length < 6)         return 'Password must be at least 6 characters.';
  return null;
}

const AdminLogin = () => {
  const navigate = useNavigate();

  const [mounted, setMounted]           = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [signIn, setSignIn]             = useState({ email: '', password: '' });

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);

    // If already logged in as admin, go straight to dashboard
    const token  = localStorage.getItem('authToken');
    const stored = localStorage.getItem('user');
    if (token && stored) {
      try {
        const u = JSON.parse(stored);
        if (u.role === 'admin') navigate('/admin/dashboard', { replace: true });
      } catch { /* ignore */ }
    }
  }, [navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    const err = validateSignIn(signIn);
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      const user = await loginWithEmail({
        email:    signIn.email,
        password: signIn.password,
      });

      sessionStorage.setItem("userName", user.fullname || user.id);
      sessionStorage.setItem("userEmail", user.email);


      if (user.role !== 'admin') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setError('Access denied. This portal is for administrators only.');
        return;
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const EyeOpen = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  const EyeOff = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );

  return (
    <div className={`adm-page ${mounted ? 'adm-mounted' : ''}`}>

      <div className="adm-bg">
        <div className="adm-bg-circle adm-bg-circle-1" />
        <div className="adm-bg-circle adm-bg-circle-2" />
        <div className="adm-bg-circle adm-bg-circle-3" />
      </div>

      <div className="adm-card">

        {/* Top — illustration + logo */}
        <div className="adm-card-top">
          <div className="adm-illustration">
            <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
              <rect x="8" y="20" width="70" height="50" rx="6" fill="#e8eaf6" stroke="#c5cae9" strokeWidth="1.5"/>
              <rect x="14" y="28" width="58" height="6" rx="3" fill="#9fa8da"/>
              <rect x="14" y="38" width="42" height="4" rx="2" fill="#c5cae9"/>
              <rect x="14" y="46" width="50" height="4" rx="2" fill="#c5cae9"/>
              <rect x="14" y="54" width="36" height="4" rx="2" fill="#c5cae9"/>
              <circle cx="85" cy="38" r="18" fill="#2f3660"/>
              <path d="M79 38l4 4 8-8" stroke="#ff7a18" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="24" y="68" width="20" height="4" rx="2" fill="#9fa8da"/>
              <rect x="48" y="68" width="14" height="4" rx="2" fill="#c5cae9"/>
            </svg>
          </div>
          <div className="adm-card-logo">
            <img src={Logo} alt="ITechSkillsHub" className="adm-logo-img" />
            <div>
              <div className="adm-logo-brand">ITechSkillsHub</div>
              <div className="adm-logo-sub">Admin Portal</div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="adm-heading">
          <h2>Welcome back, <span>Admin</span></h2>
          <p>Sign in to manage your LMS system</p>
        </div>

        {/* Error */}
        {error && (
          <div className="adm-alert adm-alert-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSignIn} className="adm-form" noValidate>

          <div className="adm-field">
            <label>Email address</label>
            <div className="adm-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                type="email"
                name="email"
                value={signIn.email}
                onChange={e => { setSignIn(p => ({ ...p, email: e.target.value })); setError(''); }}
                placeholder="admin@itechskillshub.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          <div className="adm-field">
            <div className="adm-label-row">
              <label>Password</label>
            </div>
            <div className="adm-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={signIn.password}
                onChange={e => { setSignIn(p => ({ ...p, password: e.target.value })); setError(''); }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />
              <button type="button" className="adm-eye" onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <EyeOff /> : <EyeOpen />}
              </button>
            </div>
          </div>

          <div className="adm-row-between">
            <label className="adm-remember" onClick={() => setRemember(r => !r)}>
              <span className={`adm-check-box ${remember ? 'adm-checked' : ''}`}>
                {remember && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2.2">
                    <polyline points="1.5,5 4,7.5 8.5,2"/>
                  </svg>
                )}
              </span>
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className={`adm-submit ${loading ? 'adm-submit-loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="adm-loading-state">
                <span className="adm-loading-text">Signing in</span>
                <span className="adm-dots">
                  <span className="adm-dot" />
                  <span className="adm-dot" />
                  <span className="adm-dot" />
                </span>
              </span>
            ) : 'Sign In'}
            <span className="adm-submit-shimmer" />
          </button>

        </form>

        <div className="adm-secure-note">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Protected by enterprise-grade security &amp; encryption
        </div>

        <p className="adm-footer">Authorized personnel only · ITechSkillsHub © 2025</p>
      </div>
    </div>
  );
};

export default AdminLogin;