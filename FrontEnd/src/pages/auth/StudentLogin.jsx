import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import '../../styles/pages/auth/studentLogin.css';
import Logo from "../../assets/Logo1.svg";
import Lottie from "lottie-react";
import techAnim from "../../assets/tech.json";
import { loginWithEmail, registerUser, loginWithGoogle } from "../../services/authService";
import { GoogleLogin } from "@react-oauth/google";

export default function StudentLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
        const role = user.role || "student";
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "instructor") navigate("/instructor/dashboard");
        else navigate("/student/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) { toast.error("Please enter your full name."); return; }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { toast.error("Please enter a valid email address."); return; }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) { toast.error("Password must have uppercase, lowercase, number, and special character (@$!%*?&)."); return; }
    if (password !== confirmPassword) { toast.error("Passwords do not match."); return; }
    if (!gender) { toast.error("Please select your gender."); return; }
    if (!age || age < 15 || age > 100) { toast.error("Please enter a valid age (15-100)."); return; }
    if (!contactNumber.trim()) { toast.error("Please enter your contact number."); return; }
    if (!agreedToTerms) { toast.error("Please agree to the Terms of Service and Privacy Policy."); return; }

    setIsLoading(true);
    const toastId = toast.loading("Creating your account...");
    try {
      const user = await registerUser({
        name: fullName, email, password, role: 'student',
        gender, age: parseInt(age), contact_number: contactNumber,
      });
      if (user) {
        toast.success("Account created! Please check your email for the verification code.", { id: toastId });
        navigate('/auth/verify-email', {
          state: {
            user_id: user.id,
            email: user.email
          }
        });
      }
    } catch (err) {
      toast.error(err.message || "Registration failed. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const EyeOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );

  const EyeOff = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
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

        {!isSignUp ? (
          <div className="auth-form">
            <div className="auth-heading">
              <h2>Ready to Review?</h2>
              <p>Your CSS NC II training starts here</p>
            </div>

            <div className="auth-field">
              <label>Email address</label>
              <input type="email" placeholder="name@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="input-wrap">
                <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-remember">
                <input type="checkbox" /><span>Remember me</span>
              </label>
              <Link to="/auth/forgot-password" className="auth-forgot">Forgot password?</Link>
            </div>

            <button className="auth-submit" type="button" onClick={handleSignIn} disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

         <div style={{ position: 'relative' }}>
  <div style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
    setIsLoading(true);
    const toastId = toast.loading("Signing in with Google...");
    try {
      const user = await loginWithGoogle(credentialResponse.credential);
      if (user) {
        toast.success("Welcome! Redirecting...", { id: toastId });
        const role = user.role || "student";
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "instructor") navigate("/instructor/dashboard");
        else navigate("/student/dashboard");
      }
    } catch (err) {
      toast.error(err.message || "Google login failed.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }}
  onError={() => toast.error("Google login failed.")}
  useOneTap={false}
  width="100%"
    />
  </div>
  <button
    className="auth-google"
    type="button"
    disabled={isLoading}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.62z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33C2.44 15.98 5.48 18 9 18z" fill="#34A853"/>
      <path d="M3.96 10.71A5.44 5.44 0 0 1 3.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3-2.33z" fill="#FBBC05"/>
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3 2.33C4.68 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
    Continue with Google
  </button>
</div>

            <p className="auth-switch">
              Don't have an account?{" "}
              <span onClick={() => setIsSignUp(true)}>Sign up</span>
            </p>
          </div>

        ) : (
          <div className="auth-form">
            <div className="auth-heading">
              <h2>Create account</h2>
              <p>Start building your tech future today</p>
            </div>

            <div className="auth-field">
              <label>Full Name</label>
              <input type="text" placeholder="Juan dela Cruz" value={fullName}
                onChange={(e) => setFullName(e.target.value)} disabled={isLoading} />
            </div>

            <div className="auth-field">
              <label>Email address</label>
              <input type="email" placeholder="name@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
            </div>

            <div className="auth-field">
              <label>Password</label>
              <div className="input-wrap">
                <input type={showPassword ? "text" : "password"} placeholder="Create a strong password"
                  value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                <button className="eye-btn" onClick={() => setShowPassword(!showPassword)} type="button">
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              <p className="auth-hint">Must be 8+ characters with uppercase, lowercase, number, and special character (@$!%*?&)</p>
            </div>

            <div className="auth-field">
              <label>Confirm Password</label>
              <input type={showPassword ? "text" : "password"} placeholder="Repeat your password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
            </div>

            <div className="auth-field">
              <label>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} disabled={isLoading}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="auth-field">
              <label>Age</label>
              <input type="number" placeholder="Enter your age" value={age}
                onChange={(e) => setAge(e.target.value)} disabled={isLoading} min="15" max="100" />
            </div>

            <div className="auth-field">
              <label>Contact Number</label>
              <input type="tel" placeholder="09XXXXXXXXX" value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)} disabled={isLoading} />
            </div>

            <div className="auth-terms">
              <label className="auth-terms-check">
                <input type="checkbox" checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)} disabled={isLoading} />
                <span>I agree to the{" "}
                  <Link to="/terms" target="_blank">Terms of Service</Link> and{" "}
                  <Link to="/privacy" target="_blank">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button className="auth-submit" type="button" onClick={handleSignUp} disabled={isLoading}>
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