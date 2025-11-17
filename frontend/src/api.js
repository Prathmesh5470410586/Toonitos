// frontend/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
});

// Attach token from localStorage to every request
API.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
}, (err) => Promise.reject(err));

// Optional: global response interceptor to handle 401 (token expired/invalid)
API.interceptors.response.use(
  (res) => res,
  (err) => {
    // if unauthorised, clear local auth (so UI can react)
    if (err?.response?.status === 401) {
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {}
    }
    return Promise.reject(err);
  }
);

/**
 * Helper: set auth token (also stores in localStorage)
 * @param {string|null} token
 */
function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

/**
 * Helper: store user object in localStorage
 * @param {object|null} user
 */
function setUser(user) {
  if (user) localStorage.setItem('user', JSON.stringify(user));
  else localStorage.removeItem('user');
}

/**
 * Helper: fetch /api/user/me and update localStorage user
 * Returns the user object (or throws an error)
 */
async function fetchMe() {
  const res = await API.get('/user/me');
  const user = res.data;
  setUser(user);
  return user;
}

export default API;
export { setToken, setUser, fetchMe };
