export function getStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable; callers already use their existing fallback behavior.
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage can be unavailable.
  }
}
