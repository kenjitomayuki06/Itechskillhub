import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Users, BookOpen, FileText, BarChart3,
  Settings, LogOut, Bell, Menu, X, User, Search,
  ChevronDown, ChevronRight, Clock, Calendar,
  Star, HelpCircle, Sun, Moon, Plus
} from 'lucide-react';
import '../styles/layouts/DashboardLayout.css';
import Logo from '../assets/Logo1.svg';

const SIDEBAR_FULL = 280;
const SIDEBAR_MINI = 70;

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
            <img src={Logo} alt="Logo" className="sidebar-logo" />
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
      <nav className="premium-sidebar-nav">
        {navItems.map((item, index) => (
          <div key={index} className="nav-item-container">
            <div className={`nav-item-wrapper ${isIconOnly ? 'nav-item-wrapper--icon' : ''}`}>
              <Link
                to={item.path}
                className={`premium-nav-item ${location.pathname === item.path ? 'active' : ''} ${isIconOnly ? 'icon-only-item' : ''}`}
                title={isIconOnly ? item.label : ''}
              >
                <div className="nav-icon-wrapper">
                  <item.icon size={20} />
                  {location.pathname === item.path && <div className="icon-glow"></div>}
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
                {location.pathname === item.path && <div className="active-indicator"></div>}
              </Link>

              {!isIconOnly && item.subMenu && (
                <div className="nav-actions">
                  <button
                    className="expand-btn"
                    onClick={(e) => { e.preventDefault(); toggleSubMenu(item.label); }}
                  >
                    {expandedMenus[item.label] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </div>
              )}
            </div>

            {item.subMenu && expandedMenus[item.label] && !isIconOnly && (
              <div className="sub-menu">
                {item.subMenu.map((sub, si) => (
                  <Link key={si} to={sub.path} className="sub-menu-item">
                    <div className="sub-menu-dot"></div>
                    <span>{sub.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <button
          className={`premium-logout-btn ripple-effect ${isIconOnly ? 'logout-icon-only' : ''}`}
          onClick={handleLogout}
          title="Logout"
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

  const [darkMode, setDarkMode]                           = useState(false);
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

  /* ── load logged-in user from localStorage ── */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    try { setCurrentUser(stored ? JSON.parse(stored) : null); }
    catch { setCurrentUser(null); }
  }, []);

  const navigate       = useNavigate();
  const location       = useLocation();
  const searchInputRef = useRef(null);

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

  /* ── clock ── */
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
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
        { icon: Home,      label: 'Dashboard',  path: '/admin/dashboard',   badge: null  },
        {
          icon: Users, label: 'Users', path: '/admin/users', badge: '12',
          subMenu: [
            { label: 'All Users',   path: '/admin/users/all'         },
            { label: 'Instructors', path: '/admin/users/instructors' },
            { label: 'Students',    path: '/admin/users/students'    },
          ],
        },
        {
          icon: BookOpen, label: 'Courses', path: '/admin/courses', badge: 'New',
          subMenu: [
            { label: 'All Courses', path: '/admin/courses/all'       },
            { label: 'Published',   path: '/admin/courses/published' },
            { label: 'Drafts',      path: '/admin/courses/drafts'    },
          ],
        },
        { icon: FileText,  label: 'Assignments', path: '/admin/assignments', badge: '5'  },
        { icon: BarChart3, label: 'Analytics',   path: '/admin/analytics',   badge: null },
        { icon: Settings,  label: 'Settings',    path: '/admin/settings',    badge: null },
      ];
    } else if (userRole === 'instructor') {
      return [
        { icon: Home,      label: 'Dashboard',   path: '/instructor/dashboard',   badge: null },
        { icon: BookOpen,  label: 'My Courses',  path: '/instructor/courses',     badge: '3'  },
        { icon: Users,     label: 'Students',    path: '/instructor/students',    badge: null },
        { icon: FileText,  label: 'Assignments', path: '/instructor/assignments', badge: '8'  },
        { icon: BarChart3, label: 'Reports',     path: '/instructor/reports',     badge: null },
      ];
    }
    return [];
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirect to the correct login page based on role
    if (userRole === 'instructor') {
      navigate('/instructor/login');
    } else {
      navigate('/admin/login');
    }
  };

  const toggleSubMenu = (label) =>
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));

  const toggleDarkMode = () => {
    setDarkMode(p => !p);
    document.documentElement.classList.toggle('dark-mode');
  };

  const formatTime = (d) => d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  const formatDate = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const unreadCount  = notifications.filter(n => n.unread).length;
  const isIconOnly   = !isMobile && !sidebarExpanded;
  const desktopWidth = sidebarExpanded ? SIDEBAR_FULL : SIDEBAR_MINI;
  const navItems     = getNavigationItems();

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
        <div className="search-overlay" onClick={() => setShowSearch(false)}>
          <div className="search-modal glass-effect" onClick={(e) => e.stopPropagation()}>
            <div className="search-header">
              <Search size={20} className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search anything... (Ctrl+K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button className="search-close" onClick={() => setShowSearch(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="search-results">
              <div className="search-category">
                <h4>Quick Actions</h4>
                <div className="search-item"><Home size={16} /><span>Go to Dashboard</span></div>
                <div className="search-item"><Plus size={16} /><span>Create New Course</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Modal */}
      {showKeyboardShortcuts && (
        <div className="shortcuts-overlay" onClick={() => setShowKeyboardShortcuts(false)}>
          <div className="shortcuts-modal glass-effect" onClick={(e) => e.stopPropagation()}>
            <div className="shortcuts-header">
              <h3>Keyboard Shortcuts</h3>
              <button onClick={() => setShowKeyboardShortcuts(false)}><X size={20} /></button>
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
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      {!isMobile && (
        <aside
          className={`premium-sidebar desktop-sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}
          style={{ width: `${desktopWidth}px` }}
        >
          <SidebarContent
            {...sidebarProps}
            onHamburgerClick={() => setSidebarExpanded(p => !p)}
          />
        </aside>
      )}

      {/* ── MOBILE DRAWER ── */}
      {isMobile && (
        <aside className={`premium-sidebar mobile-sidebar ${mobileOpen ? 'open' : ''}`}>
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
        <header className="premium-top-nav">
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
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <ChevronRight size={14} className="breadcrumb-separator" />
              <span className="breadcrumb-item active">Overview</span>
            </div>
          </div>

          <div className="top-nav-center">
            <button className="search-trigger-btn ripple-effect" onClick={() => setShowSearch(true)}>
              <Search size={18} />
              <span>Search...</span>
              <kbd className="kbd-hint">Ctrl K</kbd>
            </button>
          </div>

          <div className="top-nav-right">
            <div className="quick-actions">
              <button className="action-btn ripple-effect" title="Quick Add"><Plus size={20} /></button>
              <button className="action-btn ripple-effect" onClick={() => setShowKeyboardShortcuts(true)} title="Keyboard Shortcuts (?)"><HelpCircle size={20} /></button>
              <button className="action-btn ripple-effect" onClick={toggleDarkMode} title="Toggle Dark Mode">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div className="datetime-display">
              <div className="time"><Clock size={16} /><span>{formatTime(currentTime)}</span></div>
              <div className="date"><Calendar size={16} /><span>{formatDate(currentTime)}</span></div>
            </div>

            {/* Notifications */}
            <div className="notification-wrapper">
              <button
                className="premium-notification-btn ripple-effect"
                onClick={() => { setShowNotifications(p => !p); setShowProfileMenu(false); }}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                <div className="notification-glow"></div>
              </button>

              {showNotifications && (
                <div className="notifications-dropdown glass-effect">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button className="mark-all-read" onClick={markAllRead}>Mark all as read</button>
                  </div>
                  <div className="notifications-list">
                    {notifications.map(notif => (
                      <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                        <div className="notif-content">
                          <h4>{notif.title}</h4>
                          <p>{notif.message}</p>
                          <span className="notif-time">{notif.time}</span>
                        </div>
                        {notif.unread && <div className="unread-dot"></div>}
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
              >
                <div className="user-avatar-wrapper">
                  <img
                    src={currentUser?.picture || currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || userRole)}&background=5B4A9E&color=fff`}
                    alt="User"
                    className="user-avatar"
                  />
                  <div className="avatar-ring"></div>
                  <div className="online-indicator"></div>
                </div>
                <div className="user-info">
                  <span className="user-name">{currentUser?.name || 'User'}</span>
                  <span className="user-role">{userRole}</span>
                </div>
                <ChevronDown size={16} className={`dropdown-arrow ${showProfileMenu ? 'rotated' : ''}`} />
              </div>

              {showProfileMenu && (
                <div className="profile-dropdown glass-effect">
                  <div className="profile-header">
                    <img
                      src={currentUser?.picture || currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || userRole)}&background=5B4A9E&color=fff&size=60`}
                      alt="Profile"
                    />
                    <div>
                      <h3>{currentUser?.name || 'User'}</h3>
                      <p>{currentUser?.email || ''}</p>
                    </div>
                  </div>
                  <div className="profile-menu">
                    <button className="profile-menu-item"><User size={18} /><span>My Profile</span></button>
                    <button className="profile-menu-item"><Settings size={18} /><span>Settings</span></button>
                    <button className="profile-menu-item"><HelpCircle size={18} /><span>Help & Support</span></button>
                    <div className="profile-divider"></div>
                    <button className="profile-menu-item logout" onClick={handleLogout}>
                      <LogOut size={18} /><span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="premium-page-content">
          <div className="content-shine"></div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}