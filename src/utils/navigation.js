const REDIRECT_KEY = "ilc_redirect";
const CONTACT_STATE_KEY = "ilc_contact_state";

export function setRedirectPath(path) {
  if (!path || typeof window === "undefined") return;
  sessionStorage.setItem(REDIRECT_KEY, path);
}

export function getRedirectPath() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(REDIRECT_KEY);
}

export function clearRedirectPath() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REDIRECT_KEY);
}

export function setContactState(state) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CONTACT_STATE_KEY, JSON.stringify(state || {}));
}

export function getContactState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CONTACT_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearContactState() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CONTACT_STATE_KEY);
}
