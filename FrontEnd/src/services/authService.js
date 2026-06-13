/* ============================================================
   authService.js — ITechSkillsHub
   Centralized authentication functions — API-ready for Node.js backend

   Backend Endpoints Required:
     POST /api/auth/login             → { email, password }          → { token, user }
     POST /api/auth/register          → { name, email, password, role } → { token, user }
     POST /api/auth/google            → { tokenId }                  → { token, ucd ser }
     POST /api/auth/forgot-password   → { email }                    → { message }
     GET  /api/auth/me                → Authorization: Bearer <token> → { user }

   Admin Account Setup:
     Admin accounts are seeded directly in the database by the backend team.
     They are NOT created through this registration flow.
     Example seed:
       email:    "admin@itechskillshub.com"
       password: (bcrypt hashed)
       role:     "admin"
   ============================================================ */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ── Token helpers ── */
export const getToken    = () => localStorage.getItem('authToken');
export const setToken    = (token) => localStorage.setItem('authToken', token);
export const removeToken = () => localStorage.removeItem('authToken');

export const getUser = () => {
  const u = localStorage.getItem('user');
  try { return u ? JSON.parse(u) : null; }
  catch { return null; }
};
export const setUser    = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('user');

export const isAuthenticated = () => !!getToken();

/* ── Normalize user object from backend ──
   Backend returns { fullname, email_address, ... }
   Frontend expects  { name, email, role, id }
   This function maps backend fields → frontend fields consistently.
── */
function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    name:  user.name  || user.fullname  || '',
    email: user.email || user.email_address || '',
  };
}

/* ── Generic fetch wrapper ── */
export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

/* ── Login with Email + Password ── */
export const loginWithEmail = async (credentials) => {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email:    credentials.email,
      password: credentials.password,
    }),
  });

  const user = normalizeUser(data.user);
  if (data.token) setToken(data.token);
  if (user)       setUser(user);
  return user;
};

/* ── Register (instructors and students only) ── */
export async function registerUser({ name, email, password, role = 'student', gender, age, contact_number, invite_code }) {
  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role, gender, age, contact_number, invite_code }),
  });

  const user = normalizeUser(data.user);
  // token may not exist yet if backend doesn't return one after register
  if (data.token) setToken(data.token);
  if (user)       setUser(user);
  return user;
}

/* ── Google OAuth ── */
export async function loginWithGoogle(accessToken) {
  const data = await apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ credential: accessToken }),
  });
  const user = normalizeUser(data.user);
  if (data.token) setToken(data.token);
  if (user)       setUser(user);
  return user;
}

/* ── Forgot Password ── */
export async function forgotPassword(email) {
  return await apiFetch('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/* ── Get current logged-in user (verify token) ── */
export async function getCurrentUser() {
  return await apiFetch('/api/auth/me');
}

/* ── Logout ── */
export function logout() {
  removeToken();
  removeUser();
}

/* ── Admin Login ── */
export const adminLogin = async (credentials) => {
  const data = await apiFetch('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({
      email:      credentials.email,
      password:   credentials.password,
      secretCode: credentials.secretCode,
    }),
  });

  const admin = data.admin;
  if (data.token) setToken(data.token);
  if (admin)      setUser(admin);
  return admin;
};