import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { registerUser } from '../../services/authService';
import '../../styles/pages/auth/InstructorRegister.css';
import Logo from '../../assets/Logo1.svg';

function validate({ name, email, password, confirmPassword }) {
  if (!name.trim())                      return 'Full name is required.';
  if (name.trim().length < 2)            return 'Name must be at least 2 characters.';
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

const InstructorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [touched, setTouched]           = useState({});
  const [agreed, setAgreed]             = useState(false);
  const [animData, setAnimData]         = useState(null);

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
  const handleBlur = (e) => setTouched(prev => ({ ...prev, [e.target.name]: true }));

  const pwStrength   = passwordStrength(formData.password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength];
  const strengthClass = ['', 'str-weak', 'str-fair', 'str-good', 'str-strong'][pwStrength];

  const handleRegister = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirmPassword: true });
    if (!agreed) { setError('Please agree to the Terms and Privacy Policy.'); return; }
    const validationError = validate(formData);
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError('');
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
  };

  return (
    <div className="reg-page">

      <div className="reg-card">

        {/* Lottie on top */}
        <div className="reg-lottie-top">
          {animData && <Lottie animationData={animData} loop autoplay />}
        </div>

        {/* Brand */}
        <Link to="/" className="reg-brand">
          <img src={Logo} alt="ITechSkillsHub" className="reg-brand-logo" />
          <div className="reg-brand-text">
            <span className="reg-brand-name">ITechSkillsHub</span>
            <span className="reg-brand-sub">Instructor Portal</span>
          </div>
        </Link>

        {/* Heading */}
        <div className="reg-header">
          <h2>Create <em>account</em></h2>
          <p>Start teaching thousands of students today</p>
        </div>

        {/* Error */}
        {error && (
          <div className="reg-error">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="reg-form" noValidate>

          {/* Full Name */}
          <div className="reg-field">
            <label htmlFor="reg-name">Full Name</label>
            <div className="reg-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input id="reg-name" type="text" name="name"
                value={formData.name} onChange={handleChange} onBlur={handleBlur}
                placeholder="Prof. Maria Santos" autoComplete="name" />
            </div>
          </div>

          {/* Email */}
          <div className="reg-field">
            <label htmlFor="reg-email">Email address</label>
            <div className="reg-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input id="reg-email" type="email" name="email"
                value={formData.email} onChange={handleChange} onBlur={handleBlur}
                placeholder="instructor@example.com" autoComplete="email" />
            </div>
          </div>

          {/* Password */}
          <div className="reg-field">
            <label htmlFor="reg-password">Password</label>
            <div className="reg-input-wrap">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input id="reg-password" type={showPassword ? 'text' : 'password'} name="password"
                value={formData.password} onChange={handleChange} onBlur={handleBlur}
                placeholder="Min. 8 characters" autoComplete="new-password" />
              <button type="button" className="reg-eye" onClick={() => setShowPassword(p => !p)}>
                {showPassword
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {formData.password && (
              <div className="reg-pw-strength">
                <div className="reg-pw-bars">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`reg-pw-bar ${i <= pwStrength ? strengthClass : ''}`} />
                  ))}
                </div>
                <span className={`reg-pw-label ${strengthClass}`}>{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="reg-field">
            <label htmlFor="reg-confirm">Confirm Password</label>
            <div className={`reg-input-wrap ${touched.confirmPassword && formData.password !== formData.confirmPassword ? 'reg-input-error' : ''}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <input id="reg-confirm" type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                placeholder="Re-enter your password" autoComplete="new-password" />
              <button type="button" className="reg-eye" onClick={() => setShowConfirm(p => !p)}>
                {showConfirm
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                }
              </button>
            </div>
            {touched.confirmPassword && formData.password !== formData.confirmPassword && (
              <span className="reg-field-err">Passwords do not match.</span>
            )}
          </div>

          {/* Terms */}
          <label className="reg-terms">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span>
              By signing up, you agree to our{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </span>
          </label>

          {/* Submit */}
          <button type="submit" className="reg-submit" disabled={loading}>
            {loading ? (
              <><svg className="reg-spinner" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25"/><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account...</>
            ) : (
              'Create Account'
            )}
          </button>

          <p className="reg-login-link">
            Already have an account? <Link to="/instructor/login">Sign in here</Link>
          </p>

        </form>

        <footer className="reg-footer-note">
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

export default InstructorRegister;