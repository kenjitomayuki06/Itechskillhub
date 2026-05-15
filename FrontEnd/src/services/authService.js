/* ============================================================
   authService.js — ITechSkillsHub
   Centralized auth functions — API-ready for Node.js backend

   PARA SA BACKEND TEAMMATE:
   Palitan lang yung BASE_URL ng actual server URL ninyo.
   Endpoints needed:
     POST /api/auth/login        → { email, password } → { token, user }
     POST /api/auth/register     → { name, email, password, role } → { token, user }
     POST /api/auth/google       → { tokenId } → { token, user }
     POST /api/auth/forgot-password → { email } → { message }
     GET  /api/auth/me           → headers: Authorization: Bearer <token> → { user }

   PARA SA ADMIN ACCOUNT:
   Hindi nagre-register ang admin sa frontend.
   Ang admin account ay ini-assign ng backend dev direkta
   sa database gamit ang seed script. Example:
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

/* ── Generic fetch wrapper ── */
async function apiFetch(endpoint, options = {}) {
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
  // Use the apiFetch wrapper to hit the new endpoint
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password
    }),
  });

  // Log the data to see it in your console
  console.log("Login Success:", data);

  if (data.token) localStorage.setItem('authToken', data.token);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data.user; 
};


/* ── Register (instructors and students only) ── */
export async function registerUser({ name, email, password, role = 'instructor' }) {
  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role }),
  });
  setToken(data.token);
  setUser(data.user);
  return data.user;
}

/* ── Google OAuth ── */
export async function loginWithGoogle(googleTokenId) {
  const data = await apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ tokenId: googleTokenId }),
  });
  setToken(data.token);
  setUser(data.user);
  return data.user;
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