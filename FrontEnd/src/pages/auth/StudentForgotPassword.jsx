import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import '../../styles/pages/auth/studentLogin.css';
import Logo from "../../assets/Logo1.svg";
import Lottie from "lottie-react";
import techAnim from "../../assets/tech.json";
import { forgotPassword } from "../../services/authService";

export default function StudentForgotPassword() {
  const [email, setEmail]       = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Sending reset link...");
    try {
      await forgotPassword(email.trim().toLowerCase());
      toast.success("Reset link sent! Check your email.", { id: toastId });
      setSent(true);
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

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

        {!sent ? (
          <div className="auth-form">
            <div className="auth-heading">
              <h2>Forgot password?</h2>
              <p>Enter your email and we'll send you a reset link</p>
            </div>

            <div className="auth-field">
              <label>Email address</label>
              <input
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <button
              className="auth-submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <p className="auth-switch">
              Remember your password?{" "}
              <Link to="/auth" style={{ color: '#a066ff', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>

        ) : (
          <div className="auth-form">
            <div className="auth-heading" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📬</div>
              <h2>Check your email</h2>
              <p>
                We sent a password reset link to <strong style={{ color: '#fff' }}>{email}</strong>.
                It may take a minute to arrive.
              </p>
            </div>

            <button
              className="auth-submit"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ marginTop: 8 }}
            >
              {isLoading ? "Resending..." : "Resend Email"}
            </button>

            <p className="auth-switch" style={{ marginTop: 12 }}>
              Back to{" "}
              <Link to="/auth" style={{ color: '#a066ff', fontWeight: 600, textDecoration: 'none' }}>
                Sign in
              </Link>
            </p>
          </div>
        )}

        <footer className="auth-footer">© 2025 ITechSkillsHub. All rights reserved</footer>
      </div>
    </div>
  );
}