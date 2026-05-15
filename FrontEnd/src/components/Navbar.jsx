import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import '../styles/components/navbar.css';
import logo from "../assets/Logo1.svg";

const Navbar = () => {
  const [scrolled, setScrolled]               = useState(false);
  const [showResources, setShowResources]     = useState(false);
  const [menuOpen, setMenuOpen]               = useState(false);
  const [showStudentToast, setShowStudentToast] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  // Check if student just logged in
  useEffect(() => {
    if (sessionStorage.getItem("studentLoggedIn") === "true") {
      setShowStudentToast(true);
      // Remove flag so toast only shows once
      sessionStorage.removeItem("studentLoggedIn");
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => setShowStudentToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const isHome    = location.pathname === "/";
  const isAbout   = location.pathname === "/about";
  const isCourse  = location.pathname.startsWith("/course");
  const isGames   = location.pathname === "/games";
  const isBlog    = location.pathname === "/blog";
  const isResources = isGames || isBlog;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown & menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setShowResources(false);
      setMenuOpen(false);
    };
    handleRouteChange();
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('.resources-dropdown-container')) setShowResources(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const goHome = () => {
    if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
    else navigate("/");
  };

  const isTransparent = (isHome || isAbout || isCourse || isBlog || isGames) && !scrolled && !menuOpen;

  // Which page-specific bg class to apply when transparent
  const pageClass = isGames ? 'navbar-games' : isAbout ? 'navbar-about' : isBlog ? 'navbar-blog' : isCourse ? 'navbar-course' : 'navbar-home';

  return (
    <nav className={`navbar ${isTransparent ? `navbar-transparent ${pageClass}` : 'navbar-solid'}`}>

      {/* STUDENT LOGIN TOAST */}
      {showStudentToast && (
        <div className="student-toast">
          <span className="student-toast-icon">✓</span>
          You're logged in as a Student
          <button className="student-toast-close" onClick={() => setShowStudentToast(false)}>×</button>
        </div>
      )}

      {/* LEFT — LOGO */}
      <div className="navbar-left">
        <button className="navbar-brand-btn" onClick={goHome}>
          <img src={logo} alt="ITechSkillsHub" className="navbar-logo" />
          <span className="navbar-title">ITechSkillsHub</span>
        </button>
      </div>

      {/* CENTER — DESKTOP LINKS */}
      <div className="navbar-center">
        <button
          className={`nav-link-btn ${isHome ? 'nav-active' : ''}`}
          onClick={goHome}
        >Home</button>

        <Link to="/about" className={isAbout ? 'nav-active' : ''}>About</Link>
        <Link to="/course" className={isCourse ? 'nav-active' : ''}>Courses</Link>

        {/* Resources Dropdown */}
        <div className="resources-dropdown-container">
          <button
            className={`resources-dropdown-btn ${isResources ? 'nav-active' : ''}`}
            onClick={() => setShowResources(p => !p)}
          >
            Resources
            <svg
              className={`dropdown-arrow ${showResources ? 'open' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              width="13" height="13" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {showResources && (
            <div className="resources-dropdown-menu">
              <Link to="/games" className={`dropdown-item ${isGames ? 'dropdown-item-active' : ''}`} onClick={() => setShowResources(false)}>
                <span className="dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px"><path d="M189-160q-60 0-102.5-43T42-307q0-9 1-18t3-18l84-336q14-54 57-87.5t98-33.5h390q55 0 98 33.5t57 87.5l84 336q2 9 3.5 18.5T919-306q0 61-43.5 103.5T771-160q-42 0-78-22t-54-60l-28-58q-5-10-15-15t-21-5H385q-11 0-21 5t-15 15l-28 58q-18 38-54 60t-78 22Zm3-80q19 0 34.5-10t23.5-27l28-57q15-31 44-48.5t63-17.5h190q34 0 63 18t45 48l28 57q8 17 23.5 27t34.5 10q28 0 48-18.5t21-46.5q0 1-2-19l-84-335q-7-27-28-44t-49-17H285q-28 0-49.5 17T208-659l-84 335q-2 6-2 18 0 28 20.5 47t49.5 19Zm376.5-291.5Q580-543 580-560t-11.5-28.5Q557-600 540-600t-28.5 11.5Q500-577 500-560t11.5 28.5Q523-520 540-520t28.5-11.5Zm80-80Q660-623 660-640t-11.5-28.5Q637-680 620-680t-28.5 11.5Q580-657 580-640t11.5 28.5Q603-600 620-600t28.5-11.5Zm0 160Q660-463 660-480t-11.5-28.5Q637-520 620-520t-28.5 11.5Q580-497 580-480t11.5 28.5Q603-440 620-440t28.5-11.5Zm80-80Q740-543 740-560t-11.5-28.5Q717-600 700-600t-28.5 11.5Q660-577 660-560t11.5 28.5Q683-520 700-520t28.5-11.5Zm-367 63Q370-477 370-490v-40h40q13 0 21.5-8.5T440-560q0-13-8.5-21.5T410-590h-40v-40q0-13-8.5-21.5T340-660q-13 0-21.5 8.5T310-630v40h-40q-13 0-21.5 8.5T240-560q0 13 8.5 21.5T270-530h40v40q0 13 8.5 21.5T340-460q13 0 21.5-8.5ZM480-480Z"/></svg>
                </span>
                <div className="dropdown-text">
                  <span className="dropdown-label">Games</span>
                  <span className="dropdown-desc">Interactive quizzes & simulations</span>
                </div>
              </Link>
              <Link to="/blog" className={`dropdown-item ${isBlog ? 'dropdown-item-active' : ''}`} onClick={() => setShowResources(false)}>
                <span className="dropdown-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px"><path d="M400-400h160v-80H400v80Zm0-120h320v-80H400v80Zm0-120h320v-80H400v80Zm-80 400q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z"/></svg>
                </span>
                <div className="dropdown-text">
                  <span className="dropdown-label">Blog</span>
                  <span className="dropdown-desc">Tutorials & tech articles</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — LOGIN + HAMBURGER */}
      <div className="navbar-right">
        <button className="login-btn" onClick={() => navigate("/admin/login")}>
          Admin Login
        </button>
        <button
          className={`hamburger ${menuOpen ? 'hamburger-open' : ''}`}
          onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className={`mobile-link ${isHome ? 'mobile-active' : ''}`} onClick={goHome}>Home</button>
          <Link to="/about"  className={`mobile-link ${isAbout   ? 'mobile-active' : ''}`}>About</Link>
          <Link to="/course" className={`mobile-link ${isCourse  ? 'mobile-active' : ''}`}>Courses</Link>
          <Link to="/games"  className={`mobile-link ${isGames   ? 'mobile-active' : ''}`}>Games</Link>
          <Link to="/blog"   className={`mobile-link ${isBlog    ? 'mobile-active' : ''}`}>Blog</Link>
          <button className="mobile-login" onClick={() => navigate("/admin/login")}>Admin Login</button>
        </div>
      )}

    </nav>
  );
};

export default Navbar;