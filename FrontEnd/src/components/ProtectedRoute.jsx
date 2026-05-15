import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ role, children }) {
  const loginPath = {
    admin:      '/admin/login',
    instructor: '/instructor/login',
    student:    '/auth',
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

  // Wrong role → redirect to their correct login
  if (user.role !== role) {
    return <Navigate to={loginPath[user.role] || '/auth'} replace />;
  }

  return children;
}