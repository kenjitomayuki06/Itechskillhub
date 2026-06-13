import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../../assets/Logo1.svg';
import '../../styles/pages/auth/StudentVerifyEmail.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StudentVerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user_id, email } = location.state || {};

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect kung walang state
  if (!user_id || !email) {
    navigate('/auth');
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 6) {
      toast.error('Please enter the 6-digit verification code.');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Verifying...');
    try {
      const res = await fetch(`${BASE_URL}/api/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Verification failed.');
      toast.success('Email verified! You can now sign in.', { id: toastId });
      navigate('/auth');
    } catch (err) {
      toast.error(err.message || 'Verification failed.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    const toastId = toast.loading('Resending code...');
    try {
      const res = await fetch(`${BASE_URL}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Verification code resent!', { id: toastId });
    } catch (err) {
      toast.error(err.message || 'Failed to resend code.', { id: toastId });
    }
  };

  return (
    <div className="verify-page">
      <div className="verify-card">

        <Link to="/" className="verify-brand">
          <img src={Logo} alt="ITechSkillsHub" className="verify-logo" />
          <span className="verify-brand-name">ITechSkillsHub</span>
        </Link>

        <div className="verify-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h2>Check your email</h2>
        <p className="verify-desc">
          We sent a 6-digit verification code to<br/>
          <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="verify-form">
          <div className="verify-field">
            <label>Verification Code</label>
            <input
              type="text"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              disabled={loading}
              className="verify-input"
            />
          </div>

          <button type="submit" className="verify-submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <p className="verify-resend">
          Didn't receive the code?{' '}
          <button onClick={handleResend} className="verify-resend-btn" disabled={loading}>
            Resend code
          </button>
        </p>

        <Link to="/auth" className="verify-back">← Back to login</Link>

      </div>
    </div>
  );
}