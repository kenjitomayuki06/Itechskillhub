import { Navigate } from 'react-router-dom';

/* ── Simple JWT expiry check (no external library needed) ──
   JWT payload is base64url-encoded between the first and second dot.
   We decode it and check the `exp` claim (Unix seconds).
   This does NOT verify the signature — that must be done server-side.
   It only prevents the UI from showing protected pages after token expiry. */
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (!payload.exp) return false; // no expiry claim → treat as valid
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true; // malformed token → treat as expired
  }
}

export default function ProtectedRoute({ role, children }) {
  const loginPath = {
    admin:       '/sys_admin_ItechSkillsHubphpAccess2026_v2',
    super_admin: '/sys_superadmin_ItechSkillsHubphpAccess2026_v2',
    instructor:  '/instructor/login',
    student:     '/auth',
  };

  const token  = localStorage.getItem('authToken');
  const stored = localStorage.getItem('user');
  let user = null;

  try { user = stored ? JSON.parse(stored) : null; }
  catch { user = null; }

  // No token or no user → redirect to login
  if (!token || !user) {
    return <Navigate to={loginPath[role] || '/auth'} replace />;
  }

  // Token expired → clear storage and redirect to login
  if (isTokenExpired(token)) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    return <Navigate to={loginPath[role] || '/auth'} replace />;
  }

  // Wrong role → redirect to their correct login
  if (user.role !== role) {
    return <Navigate to={loginPath[user.role] || '/auth'} replace />;
  }

  return children;
}