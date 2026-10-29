import axios from "axios";

const STORAGE_KEY = "emp_auth";

// Small wrapper so a blocked/unavailable sessionStorage never crashes the app
export const authStorage = {
  get() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
  clear() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};

// Builds the value for the "Authorization: Basic ..." header (unicode safe)
export function buildBasicToken(username, password) {
  const bytes = new TextEncoder().encode(`${username}:${password}`);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

// Attach the saved credentials to every request
client.interceptors.request.use((config) => {
  const auth = authStorage.get();
  if (auth?.token && !config.headers.Authorization) {
    config.headers.Authorization = `Basic ${auth.token}`;
  }
  return config;
});

// If the server says 401 (bad / missing credentials), log the user out
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      authStorage.clear();
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

// Turns any axios error into a readable message for the UI
export function getErrorMessage(error) {
  if (error.response) {
    const message = error.response.data?.message;
    if (message) return message;
    if (error.response.status === 401) return "Invalid username or password.";
    return `Request failed (HTTP ${error.response.status}).`;
  }
  return "Cannot reach the server. Is Spring Boot running on port 8080?";
}

export default client;
