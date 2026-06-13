import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import '../../styles/pages/auth/studentLogin.css';
import Logo from "../../assets/Logo1.svg";
import Lottie from "lottie-react";
import techAnim from "../../assets/tech.json";
import { apiFetch } from "../../services/authService";

export default function StudentResetPassword() {
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading]             = useState(false);
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [done, setDone]                       = useState(false);
  const [searchParams]                        = useSearchParams();
  const navigate                              = useNavigate();
  const token                                 = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Password must have uppercase, lowercase, number, and special character (@$!%*?&).");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Resetting password...");
    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      toast.success("Password reset! You can now sign in.", { id: toastId });
      setDone(true);
      setTimeout(() => navigate("/auth"), 2000);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = ({ show }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

  return (
    <div className="auth-wrapper">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="auth-card">
        <div className="auth-lottie">
          <Lottie animationData={techAnim} loop />
        </div>
        <div className="auth-brand">
          <img src={Logo} alt="ITechSkillsHub" />
          <span>ITechSkillsHub</span>
        </div>

        {!done ? (
          <div className="auth-form">
            <div className="auth-heading">
              <h2>Reset password</h2>
              <p>Enter your new password below</p>
            </div>

            {/* New Password */}
            <div className="auth-field">
              <label>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  style={{ paddingRight: '42px', width: '100%', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#888', padding: 0,
                  }}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
              <p className="auth-hint">Must be 8+ characters with uppercase, lowercase, number, and special character (@$!%*?&)</p>
            </div>

            {/* Confirm Password */}
            <div className="auth-field">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  style={{ paddingRight: '42px', width: '100%', boxSizing: 'border-box' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#888', padding: 0,
                  }}
                >
                  <EyeIcon show={showConfirm} />
                </button>
              </div>
            </div>

            <button className="auth-submit" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="auth-switch">
              <Link to="/auth" style={{ color: '#a066ff', fontWeight: 600, textDecoration: 'none' }}>
                Back to Sign in
              </Link>
            </p>
          </div>
        ) : (
          <div className="auth-form">
            <div className="auth-heading" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h2>Password reset!</h2>
              <p>Redirecting you to sign in...</p>
            </div>
          </div>
        )}

        <footer className="auth-footer">© 2025 ITechSkillsHub. All rights reserved</footer>
      </div>
    </div>
  );
}