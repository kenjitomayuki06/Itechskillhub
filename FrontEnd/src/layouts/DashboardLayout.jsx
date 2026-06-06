import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../services/authService';
import {
  Home, Users, BookOpen, FileText, BarChart3,
  Settings, LogOut, Bell, Menu, X, User, Search,
  ChevronDown, ChevronRight, Clock, Calendar,
  Star, HelpCircle, Sun, Moon, Plus,
  GraduationCap, Award, ClipboardList
} from 'lucide-react';
import '../styles/layouts/DashboardLayout.css';
import Logo from '../assets/Logo1.svg';

const SIDEBAR_FULL = 280;
const SIDEBAR_MINI = 70;

/* ─────────────────────────────────────────────────────
   Breadcrumb label map — maps route segments to display names
───────────────────────────────────────────────────── */
const BREADCRUMB_LABELS = {
  admin:       'Admin',
  instructor:  'Instructor',
  student:     'Student',
  dashboard:   'Dashboard',
  users:       'Users',
  courses:     'Courses',
  assignments: 'Assignments',
  analytics:   'Analytics',
  settings:    'Settings',
  students:    'Students',
  reports:     'Reports',
  profile:     'My Profile',
  notifications: 'Notifications',
  quiz:        'Quizzes & Assessments',
  progress:      'My Progress',
  certificates:  'My Certificates',
    'audit-log': 'Audit Log', 
};

function buildBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [];
  let accumulated = '';

  segments.forEach((seg, i) => {
    accumulated += `/${seg}`;
    const label = BREADCRUMB_LABELS[seg] || seg.charAt(0).toUpperCase() + seg.slice(1);
    crumbs.push({ label, path: accumulated, isLast: i === segments.length - 1 });
  });

  return crumbs;
}

/* ─────────────────────────────────────────────────────
   Sidebar Content — lifted OUT of DashboardLayout
   so React never re-mounts it on every render
───────────────────────────────────────────────────── */
function SidebarContent({
  onHamburgerClick,
  isIconOnly,
  pinnedItems,
  navItems,
  location,
  expandedMenus,
  toggleSubMenu,
  handleLogout,
}) {
  return (
    <>
      <div className="sidebar-shine"></div>
      <div className="sidebar-gradient"></div>

      {/* Header: logo + hamburger */}
      <div className={`sidebar-header ${isIconOnly ? 'sidebar-header--icon' : ''}`}>
        <Link to="/" className="sidebar-brand" title="ITechSkillsHub">
          <div className="logo-wrapper">
            <img src={Logo} alt="ITechSkillsHub Logo" className="sidebar-logo" />
          </div>
          {!isIconOnly && (
            <h2 className="brand-text">
              <span className="brand-gradient">ITechSkillsHub</span>
            </h2>
          )}
        </Link>

        <button
          className="sidebar-hamburger-btn ripple-effect"
          onClick={onHamburgerClick}
          aria-label="Toggle sidebar"
          title={isIconOnly ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && !isIconOnly && (
        <div className="pinned-section">
          <div className="section-title">
            <Star size={14} />
            <span>Pinned</span>
          </div>
          {navItems
            .filter(item => pinnedItems.includes(item.path))
            .map((item, i) => (
              <Link key={`pinned-${i}`} to={item.path} className="premium-nav-item pinned">
                <div className="nav-icon-wrapper"><item.icon size={18} /></div>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
        </div>
      )}

      {/* Navigation */}
      <nav className="premium-sidebar-nav" aria-label="Main navigation">
        {navItems.map((item, index) => {
          // Active if exact match OR starts-with for parent items with sub-menus
          const isActive = item.subMenu
            ? location.pathname.startsWith(item.path)
            : location.pathname === item.path;

          return (
            <div key={index} className="nav-item-container">
              <div className={`nav-item-wrapper ${isIconOnly ? 'nav-item-wrapper--icon' : ''}`}>
                <Link
                  to={item.path}
                  className={`premium-nav-item ${isActive ? 'active' : ''} ${isIconOnly ? 'icon-only-item' : ''}`}
                  title={isIconOnly ? item.label : ''}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="nav-icon-wrapper">
                    <item.icon size={20} />
                    {isActive && <div className="icon-glow"></div>}
                  </div>
                  {!isIconOnly && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && (
                        <span className={`nav-badge ${item.badge === 'New' ? 'badge-new' : 'badge-count'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isActive && <div className="active-indicator"></div>}
                </Link>

                {!isIconOnly && item.subMenu && (
                  <div className="nav-actions">
                    <button
                      className="expand-btn"
                      onClick={(e) => { e.preventDefault(); toggleSubMenu(item.label); }}
                      aria-expanded={expandedMenus[item.label] ? 'true' : 'false'}
                      aria-label={`${expandedMenus[item.label] ? 'Collapse' : 'Expand'} ${item.label} submenu`}
                    >
                      {expandedMenus[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  </div>
                )}
              </div>

              {item.subMenu && expandedMenus[item.label] && !isIconOnly && (
                <div className="sub-menu">
                  {item.subMenu.map((sub, si) => (
                    <Link
                      key={si}
                      to={sub.path}
                      className={`sub-menu-item ${location.pathname === sub.path ? 'active' : ''}`}
                    >
                      <div className="sub-menu-dot"></div>
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className={`premium-logout-btn ripple-effect ${isIconOnly ? 'logout-icon-only' : ''}`}
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <div className="nav-icon-wrapper"><LogOut size={20} /></div>
          {!isIconOnly && <span>Logout</span>}
        </button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────
   Main Layout
───────────────────────────────────────────────────── */
export default function DashboardLayout({ userRole = 'admin' }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen]           = useState(false);
  const [isMobile, setIsMobile]               = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return false;
  });
  const [showSearch, setShowSearch]                       = useState(false);
  const [searchQuery, setSearchQuery]                     = useState('');
  const [showNotifications, setShowNotifications]         = useState(false);
  const [showProfileMenu, setShowProfileMenu]             = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [expandedMenus, setExpandedMenus]                 = useState({});
  const [pinnedItems]                                     = useState([]);
  const [notifications, setNotifications]                 = useState([
    { id: 1, title: 'New Assignment', message: 'John submitted homework',       time: '2 min ago',   unread: true  },
    { id: 2, title: 'Course Update',  message: 'React course has been updated', time: '1 hour ago',  unread: true  },
    { id: 3, title: 'System Alert',   message: 'Scheduled maintenance tonight', time: '3 hours ago', unread: false },
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(null);

  /* ── apply saved dark mode on mount ── */
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', darkMode);
  }, []);

  /* ── load logged-in user from localStorage ── */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    try { setCurrentUser(stored ? JSON.parse(stored) : null); }
    catch { setCurrentUser(null); }
  }, []);

  const navigate       = useNavigate();
  const location       = useLocation();
  const searchInputRef = useRef(null);

  /* ── Update document title based on current route ── */
  useEffect(() => {
    const crumbs = buildBreadcrumbs(location.pathname);
    const pageLabel = crumbs.length > 0 ? crumbs[crumbs.length - 1].label : 'Dashboard';
    document.title = `${pageLabel} | ITechSkillsHub`;
  }, [location.pathname]);

  /* ── detect mobile ── */
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── close mobile drawer on navigation ── */
  useEffect(() => {
    const timer = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  /* ── clock (update every second for accurate display) ── */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ── keyboard shortcuts ── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === '?' && !showSearch) { e.preventDefault(); setShowKeyboardShortcuts(p => !p); }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowKeyboardShortcuts(false);
        setShowNotifications(false);
        setShowProfileMenu(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showSearch]);

  /* ── nav items ── */
  const getNavigationItems = () => {
    if (userRole === 'admin') {
      return [
        { icon: Home,         label: 'Dashboard',   path: '/admin/dashboard',   badge: null  },
        { icon: Users,        label: 'Users',        path: '/admin/users',       badge: null  },
        { icon: BookOpen,     label: 'Courses',      path: '/admin/courses',     badge: null  },
        { icon: FileText,     label: 'Assignments',  path: '/admin/assignments', badge: null  },
        { icon: BarChart3,    label: 'Analytics',    path: '/admin/analytics',   badge: null  },
        { icon: ClipboardList, label: 'Audit Log',   path: '/admin/audit-log',   badge: null },
        { icon: Settings,     label: 'Settings',     path: '/admin/settings',    badge: null  },
      ];
    } else if (userRole === 'instructor') {
      return [
        { icon: Home,         label: 'Dashboard',   path: '/instructor/dashboard',   badge: null },
        { icon: BookOpen,     label: 'My Courses',  path: '/instructor/courses',     badge: null },
        { icon: Users,        label: 'Students',    path: '/instructor/students',    badge: null },
        { icon: FileText,     label: 'Assignments', path: '/instructor/assignments', badge: null },
        { icon: BarChart3,    label: 'Reports',     path: '/instructor/reports',     badge: null },
      ];
    } else if (userRole === 'student') {
      return [
        { icon: Home,         label: 'Dashboard',      path: '/student/dashboard',     badge: null },
        { icon: BookOpen,     label: 'My Courses',     path: '/student/courses',       badge: null },
        { icon: FileText,     label: 'Assignments',    path: '/student/assignments',   badge: null },
        { icon: ClipboardList,label: 'Quizzes',        path: '/student/quiz',          badge: null },
        { icon: GraduationCap,label: 'Progress',       path: '/student/progress',      badge: null },
        { icon: Award,        label: 'Certificates',   path: '/student/certificates',  badge: null },
        { icon: Bell,         label: 'Notifications',  path: '/student/notifications', badge: null },
        { icon: User,         label: 'My Profile',     path: '/student/profile',       badge: null },
      ];
    }
    return [];
  };

  const handleLogout = () => {
    logout(); // clears authToken + user from localStorage via authService
    toast.success('Logged out successfully.');
    if (userRole === 'instructor') {
      navigate('/instructor/login');
    } else if (userRole === 'student') {
      navigate('/auth');
    } else {
      navigate('/admin/login');
    }
  };

  const toggleSubMenu = (label) =>
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));

  const toggleDarkMode = () => {
    setDarkMode(p => {
      const next = !p;
      localStorage.setItem('darkMode', String(next));
      document.documentElement.classList.toggle('dark-mode', next);
      return next;
    });
  };

  const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const unreadCount  = notifications.filter(n => n.unread).length;
  const isIconOnly   = !isMobile && !sidebarExpanded;
  const desktopWidth = sidebarExpanded ? SIDEBAR_FULL : SIDEBAR_MINI;
  const navItems     = getNavigationItems();
  const breadcrumbs  = buildBreadcrumbs(location.pathname);

  /* shared props for SidebarContent */
  const sidebarProps = {
    isIconOnly,
    pinnedItems,
    navItems,
    location,
    expandedMenus,
    toggleSubMenu,
    handleLogout,
  };

  /* ── mark all notifications read ── */
  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <div className={`premium-dashboard-layout ${darkMode ? 'dark-mode' : ''}`}>

      {/* Global Search Modal */}
      {showSearch && (
        <div className="search-overlay" onClick={() => setShowSearch(false)} role="dialog" aria-modal="true" aria-label="Search">
          <div className="search-modal glass-effect" onClick={(e) => e.stopPropagation()}>
            <div className="search-header">
              <Search size={20} className="search-icon" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search students, courses, assignments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
                aria-label="Search"
              />
              <button className="search-close" onClick={() => setShowSearch(false)} aria-label="Close search">
                <X size={20} />
              </button>
            </div>
            <div className="search-results">
              {searchQuery.trim() === '' ? (
                <div className="search-category">
                  <h4>Quick Actions</h4>
                  <div className="search-item" onClick={() => { navigate(`/${userRole}/dashboard`); setShowSearch(false); }} role="button" tabIndex={0}>
                    <Home size={16} aria-hidden="true" /><span>Go to Dashboard</span>
                  </div>
                  {userRole === 'admin' && (
                    <div className="search-item" onClick={() => { navigate('/admin/courses'); setShowSearch(false); }} role="button" tabIndex={0}>
                      <BookOpen size={16} aria-hidden="true" /><span>Manage Courses</span>
                    </div>
                  )}
                  {userRole === 'admin' && (
                    <div className="search-item" onClick={() => { navigate('/admin/users'); setShowSearch(false); }} role="button" tabIndex={0}>
                      <Users size={16} aria-hidden="true" /><span>Manage Users</span>
                    </div>
                  )}
                  {userRole === 'instructor' && (
                    <div className="search-item" onClick={() => { navigate('/instructor/assignments'); setShowSearch(false); }} role="button" tabIndex={0}>
                      <FileText size={16} aria-hidden="true" /><span>View Assignments</span>
                    </div>
                  )}
                  {userRole === 'student' && (
                    <div className="search-item" onClick={() => { navigate('/student/courses'); setShowSearch(false); }} role="button" tabIndex={0}>
                      <BookOpen size={16} aria-hidden="true" /><span>My Courses</span>
                    </div>
                  )}
                </div>
              ) : (() => {
                // ── Mock searchable index — replace with real API: GET /api/search?q=query ──
                const SEARCH_INDEX = [
                  // Pages
                  { type: 'page', label: 'Dashboard',     path: `/${userRole}/dashboard`,      icon: Home,         roles: ['admin','instructor','student'] },
                  { type: 'page', label: 'Courses',        path: '/admin/courses',              icon: BookOpen,     roles: ['admin'] },
                  { type: 'page', label: 'Users',          path: '/admin/users',                icon: Users,        roles: ['admin'] },
                  { type: 'page', label: 'Analytics',      path: '/admin/analytics',            icon: BarChart3,    roles: ['admin'] },
                  { type: 'page', label: 'Settings',       path: '/admin/settings',             icon: Settings,     roles: ['admin'] },
                  { type: 'page', label: 'Assignments',    path: '/admin/assignments',          icon: FileText,     roles: ['admin'] },
                  { type: 'page', label: 'My Courses',     path: '/instructor/courses',         icon: BookOpen,     roles: ['instructor'] },
                  { type: 'page', label: 'Students',       path: '/instructor/students',        icon: Users,        roles: ['instructor'] },
                  { type: 'page', label: 'Assignments',    path: '/instructor/assignments',     icon: FileText,     roles: ['instructor'] },
                  { type: 'page', label: 'Reports',        path: '/instructor/reports',         icon: BarChart3,    roles: ['instructor'] },
                  { type: 'page', label: 'My Courses',     path: '/student/courses',            icon: BookOpen,     roles: ['student'] },
                  { type: 'page', label: 'Assignments',    path: '/student/assignments',        icon: FileText,     roles: ['student'] },
                  { type: 'page', label: 'Quizzes',        path: '/student/quiz',               icon: ClipboardList,roles: ['student'] },
                  { type: 'page', label: 'Progress',       path: '/student/progress',           icon: GraduationCap,roles: ['student'] },
                  { type: 'page', label: 'Certificates',   path: '/student/certificates',       icon: Award,        roles: ['student'] },
                  { type: 'page', label: 'Notifications',  path: '/student/notifications',      icon: Bell,         roles: ['student'] },
                  { type: 'page', label: 'My Profile',     path: '/student/profile',            icon: User,         roles: ['student'] },
                  // Courses
                  { type: 'course', label: 'CSS NC II — Computer Systems Servicing', path: '/course/css-ncii',      icon: BookOpen, roles: ['admin','instructor','student'] },
                  { type: 'course', label: 'PC Hardware Assembly & Troubleshooting', path: '/course/pc-hardware',   icon: BookOpen, roles: ['admin','instructor','student'] },
                  { type: 'course', label: 'Network Systems Cabling (NSC)',          path: '/course/network-setup', icon: BookOpen, roles: ['admin','instructor','student'] },
                  { type: 'course', label: 'OS Installation & Configuration (OSIC)', path: '/course/osic',          icon: BookOpen, roles: ['admin','instructor','student'] },
                ];

                const q = searchQuery.toLowerCase().trim();
                const results = SEARCH_INDEX.filter(item =>
                  item.roles.includes(userRole) &&
                  item.label.toLowerCase().includes(q)
                );

                const pages   = results.filter(r => r.type === 'page');
                const courses = results.filter(r => r.type === 'course');

                if (results.length === 0) return (
                  <div className="search-category">
                    <h4 style={{ color: 'var(--text-secondary)', fontWeight: 400 }}>
                      No results for "{searchQuery}"
                    </h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '8px 0' }}>
                      Try searching for a page name or course title.
                    </p>
                  </div>
                );

                return (
                  <>
                    {pages.length > 0 && (
                      <div className="search-category">
                        <h4>Pages</h4>
                        {pages.map((item, i) => (
                          <div key={i} className="search-item" onClick={() => { navigate(item.path); setShowSearch(false); setSearchQuery(''); }} role="button" tabIndex={0}>
                            <item.icon size={16} aria-hidden="true" /><span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {courses.length > 0 && (
                      <div className="search-category">
                        <h4>Courses</h4>
                        {courses.map((item, i) => (
                          <div key={i} className="search-item" onClick={() => { navigate(item.path); setShowSearch(false); setSearchQuery(''); }} role="button" tabIndex={0}>
                            <item.icon size={16} aria-hidden="true" /><span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="shortcuts-overlay" onClick={() => setShowKeyboardShortcuts(false)} role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
          <div className="shortcuts-modal glass-effect" onClick={(e) => e.stopPropagation()}>
            <div className="shortcuts-header">
              <h3>Keyboard Shortcuts</h3>
              <button onClick={() => setShowKeyboardShortcuts(false)} aria-label="Close shortcuts"><X size={20} /></button>
            </div>
            <div className="shortcuts-content">
              <div className="shortcut-item"><div className="shortcut-keys"><kbd>Ctrl</kbd> + <kbd>K</kbd></div><span>Open Search</span></div>
              <div className="shortcut-item"><div className="shortcut-keys"><kbd>?</kbd></div><span>Show Shortcuts</span></div>
              <div className="shortcut-item"><div className="shortcut-keys"><kbd>Esc</kbd></div><span>Close Modals</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay Backdrop */}
      {isMobile && mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      {!isMobile && (
        <aside
          className={`premium-sidebar desktop-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}
          style={{ width: `${desktopWidth}px` }}
          aria-label="Sidebar navigation"
        >
          <SidebarContent
            {...sidebarProps}
            onHamburgerClick={() => setSidebarExpanded(p => !p)}
          />
        </aside>
      )}

      {/* ── MOBILE DRAWER ── */}
      {isMobile && (
        <aside
          className={`premium-sidebar mobile-sidebar ${mobileOpen ? 'open' : ''}`}
          aria-label="Mobile navigation"
          aria-hidden={!mobileOpen}
        >
          <SidebarContent
            {...sidebarProps}
            onHamburgerClick={() => setMobileOpen(false)}
          />
        </aside>
      )}

      {/* ── Main Content ── */}
      <div
        className="premium-main-content"
        style={isMobile ? { marginLeft: 0 } : { marginLeft: `${desktopWidth}px` }}
      >
        {/* Top Navigation */}
        <header className="premium-top-nav" role="banner">
          <div className="nav-shine"></div>

          <div className="top-nav-left">
            {isMobile && (
              <button
                className="mobile-topnav-hamburger ripple-effect"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu size={22} />
              </button>
            )}

            {/* ── DYNAMIC BREADCRUMB ── */}
            <nav className="breadcrumb" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="breadcrumb-segment">
                  {i > 0 && <ChevronRight size={14} className="breadcrumb-separator" aria-hidden="true" />}
                  {crumb.isLast ? (
                    <span className="breadcrumb-item active" aria-current="page">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="breadcrumb-item">{crumb.label}</Link>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="top-nav-center">
            <button
              className="search-trigger-btn ripple-effect"
              onClick={() => setShowSearch(true)}
              aria-label="Open search (Ctrl+K)"
            >
              <Search size={18} aria-hidden="true" />
              <span>Search...</span>
              <kbd className="kbd-hint">Ctrl K</kbd>
            </button>
          </div>

          <div className="top-nav-right">
            <div className="quick-actions">
              <button
                className="action-btn ripple-effect"
                title="Coming soon"
                aria-label="Quick add (coming soon)"
                onClick={() => toast('Quick Add feature coming soon!', { icon: '🚀' })}
              >
                <Plus size={20} />
              </button>
              <button
                className="action-btn ripple-effect"
                onClick={() => setShowKeyboardShortcuts(true)}
                title="Keyboard Shortcuts (?)"
                aria-label="Show keyboard shortcuts"
              >
                <HelpCircle size={20} />
              </button>
              <button
                className="action-btn ripple-effect"
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-label={darkMode ? 'Enable light mode' : 'Enable dark mode'}
                aria-pressed={darkMode}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div className="datetime-display" aria-live="polite" aria-atomic="true">
              <div className="time"><Clock size={16} aria-hidden="true" /><span>{formatTime(currentTime)}</span></div>
              <div className="date"><Calendar size={16} aria-hidden="true" /><span>{formatDate(currentTime)}</span></div>
            </div>

            {/* Notifications */}
            <div className="notification-wrapper">
              <button
                className="premium-notification-btn ripple-effect"
                onClick={() => {
                  if (userRole === 'student') {
                    navigate('/student/notifications');
                  } else {
                    setShowNotifications(p => !p);
                    setShowProfileMenu(false);
                  }
                }}
                aria-label={`Notifications — ${unreadCount} unread`}
                aria-expanded={showNotifications}
              >
                <Bell size={20} aria-hidden="true" />
                {unreadCount > 0 && <span className="notification-badge" aria-hidden="true">{unreadCount}</span>}
                <div className="notification-glow"></div>
              </button>

              {showNotifications && (
                <div className="notifications-dropdown glass-effect" role="menu" aria-label="Notifications">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-read" onClick={markAllRead}>Mark all as read</button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`} role="menuitem">
                        <div className="notif-content">
                          <h4>{notif.title}</h4>
                          <p>{notif.message}</p>
                          <span className="notif-time">{notif.time}</span>
                        </div>
                        {notif.unread && <div className="unread-dot" aria-label="Unread"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="user-menu-wrapper">
              <div
                className="premium-user-menu ripple-effect"
                onClick={() => { setShowProfileMenu(p => !p); setShowNotifications(false); }}
                role="button"
                tabIndex={0}
                aria-label="User menu"
                aria-expanded={showProfileMenu}
                onKeyDown={(e) => e.key === 'Enter' && setShowProfileMenu(p => !p)}
              >
                <div className="user-avatar-wrapper">
                  <img
                    src={currentUser?.picture || currentUser?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || userRole)}&background=5B4A9E&color=fff`}
                    alt={`${currentUser?.name || userRole} avatar`}
                    className="user-avatar"
                  />
                  <div className="avatar-ring" aria-hidden="true"></div>
                  <div className="online-indicator" aria-label="Online"></div>
                </div>
                <div className="user-info">
                  <span className="user-name">{currentUser?.name || 'User'}</span>
                  <span className="user-role">{userRole}</span>
                </div>
                <ChevronDown size={16} className={`dropdown-arrow ${showProfileMenu ? 'rotated' : ''}`} aria-hidden="true" />
              </div>

              {showProfileMenu && (
                <div className="profile-dropdown glass-effect" role="menu" aria-label="Profile menu">
                  <div className="profile-header">
                    <img
                      src={currentUser?.picture || currentUser?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || userRole)}&background=5B4A9E&color=fff&size=60`}
                      alt={`${currentUser?.name || userRole} profile picture`}
                    />
                    <div>
                      <h3>{currentUser?.name || 'User'}</h3>
                      <p>{currentUser?.email || ''}</p>
                    </div>
                  </div>
                  <div className="profile-menu">
                    <button
                      className="profile-menu-item"
                      role="menuitem"
                      onClick={() => {
                        setShowProfileMenu(false);
                        if (userRole === 'student') navigate('/student/profile');
                        else if (userRole === 'instructor') toast('Instructor profile page coming soon!', { icon: '👤' });
                        else if (userRole === 'admin') navigate('/admin/settings');
                      }}
                    >
                      <User size={18} aria-hidden="true" /><span>My Profile</span>
                    </button>
                    {userRole === 'admin' && (
                      <button
                        className="profile-menu-item"
                        role="menuitem"
                        onClick={() => { navigate('/admin/settings'); setShowProfileMenu(false); }}
                      >
                        <Settings size={18} aria-hidden="true" /><span>Settings</span>
                      </button>
                    )}
                    <button
                      className="profile-menu-item"
                      role="menuitem"
                      onClick={() => toast('Help & Support coming soon!', { icon: '💬' })}
                    >
                      <HelpCircle size={18} aria-hidden="true" /><span>Help &amp; Support</span>
                    </button>
                    <div className="profile-divider" role="separator"></div>
                    <button className="profile-menu-item logout" role="menuitem" onClick={handleLogout}>
                      <LogOut size={18} aria-hidden="true" /><span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="premium-page-content" id="main-content">
          <div className="content-shine" aria-hidden="true"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}