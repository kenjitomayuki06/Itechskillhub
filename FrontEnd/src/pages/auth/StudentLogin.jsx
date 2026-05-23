import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import '../../styles/pages/auth/studentLogin.css';
import Logo from "../../assets/Logo1.svg";
import Lottie from "lottie-react";
import techAnim from "../../assets/tech.json";
import { loginWithEmail, registerUser } from "../../services/authService";

export default function StudentLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Signing in...");

    try {
      const user = await loginWithEmail({ email, password });

      if (user) {
        toast.success("Welcome back! Redirecting...", { id: toastId });

        // Redirect based on role returned from backend
        const role = user.role || "student";
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "instructor") {
          navigate("/instructor/dashboard");
        } else {
          navigate("/student/dashboard");
        }
      }
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");

    try {
      const user = await registerUser({
        name: fullName,
        email,
        password,
        role: 'student',
      });

      if (user) {
        toast.success("Account created! You can now sign in.", { id: toastId });
        setIsSignUp(false);
        setEmail("");
        setPassword("");
        setFullName("");
        setConfirmPassword("");
      }
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth when backend adds POST /api/auth/google
    toast.error("Google login is coming soon. Please use email login for now.");
  };

  return (
    <div className="auth-wrapper">

      {/* Background glow orbs */}
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-orb auth-orb-3" />

      <div className="auth-card">

        {/* Lottie on top */}
        <div className="auth-lottie">
          <Lottie animationData={techAnim} loop />
        </div>

        {/* Brand */}
        <div className="auth-brand">
          <img src={Logo} alt="ITechSkillsHub" />
          <span>ITechSkillsHub</span>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${!isSignUp ? "active" : ""}`}
            onClick={() => setIsSignUp(false)}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${isSignUp ? "active" : ""}`}
            onClick={() => setIsSignUp(true)}
          >
            Sign Up
          </button>
          <div className={`auth-tab-indicator ${isSignUp ? "right" : "left"}`} />
        </div>

        {!isSignUp ? (
          /* ── SIGN IN ── */
          <div className="auth-form">
            <div className="auth-heading">
              <h2>Welcome back</h2>
              <p>Sign in to continue your learning journey</p>
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

            <div className="auth-field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <span className="auth-forgot">Forgot password?</span>
            </div>

            <button
              className="auth-submit"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <div className="auth-divider"><span>or continue with</span></div>

            <button className="auth-google" type="button" onClick={handleGoogleLogin} disabled={isLoading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z" fill="#34A853"/>
                <path d="M3.96 10.71A5.44 5.44 0 0 1 3.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" fill="#FBBC05"/>
                <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="auth-switch">
              Don't have an account?{" "}
              <span onClick={() => setIsSignUp(true)}>Sign up free</span>
            </p>
          </div>

        ) : (
          /* ── SIGN UP ── */
          <div className="auth-form">
            <div className="auth-heading">
              <h2>Create account</h2>
              <p>Start building your tech future today</p>
            </div>

            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Juan dela Cruz"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
              />
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

            <div className="auth-field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <p className="auth-terms">
              By signing up, you agree to our{" "}
              <span>Terms of Service</span> and <span>Privacy Policy</span>.
            </p>

            <button
              className="auth-submit"
              onClick={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="auth-switch">
              Already have an account?{" "}
              <span onClick={() => setIsSignUp(false)}>Sign in</span>
            </p>
          </div>
        )}

        <footer className="auth-footer">© 2025 ITechSkillsHub. All rights reserved</footer>
      </div>
    </div>
  );
}