export const TOKEN_KEY = "careerpilot_token";
export const USER_KEY = "careerpilot_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function hasValidSession() {
  const token = getToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      clearAuth();
      return false;
    }
    return Boolean(getStoredUser());
  } catch {
    clearAuth();
    return false;
  }
}

export function getStoredUser() {
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    clearAuth();
    return null;
  }
}

export function saveAuth({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
