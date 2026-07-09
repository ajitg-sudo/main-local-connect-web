const VISITOR_KEY = "ilc_visitor";

export function getVisitorKey() {
  let key = localStorage.getItem(VISITOR_KEY);
  if (!key) {
    key = `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(VISITOR_KEY, key);
  }
  return key;
}
