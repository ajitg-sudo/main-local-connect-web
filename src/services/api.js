const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

function getToken() {
  return localStorage.getItem("ilc_token");
}

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value != null && value !== "" && value !== "undefined")
  );
}

export async function apiRequest(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export async function uploadKycFile(file, fieldName = "file") {
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/upload/kyc`, { method: "POST", headers, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
  return data;
}

export async function uploadFile(file, fieldName = "file") {
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/upload`, { method: "POST", headers, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
  return data;
}

export const api = {
  health: () => apiRequest("/health"),
  login: (body) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  register: (body) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  registerCustomer: (body) => apiRequest("/auth/register-customer", { method: "POST", body: JSON.stringify(body) }),
  me: () => apiRequest("/auth/me"),
  updateProfile: (body) => apiRequest("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),
  changePassword: (body) => apiRequest("/auth/change-password", { method: "POST", body: JSON.stringify(body) }),
  listUsers: (params = {}) => {
    const qs = new URLSearchParams(cleanParams(params)).toString();
    return apiRequest(`/users${qs ? `?${qs}` : ""}`);
  },
  getUser: (id) => apiRequest(`/users/${id}`),
  createUser: (body) => apiRequest("/users", { method: "POST", body: JSON.stringify(body) }),
  updateUser: (id, body) => apiRequest(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteUser: (id) => apiRequest(`/users/${id}`, { method: "DELETE" }),
  resetUserPassword: (id, newPassword) =>
    apiRequest(`/users/${id}/reset-password`, { method: "POST", body: JSON.stringify({ newPassword }) }),
  businesses: (params = {}) => {
    const qs = new URLSearchParams(cleanParams(params)).toString();
    return apiRequest(`/businesses${qs ? `?${qs}` : ""}`);
  },
  businessBySlug: (slug) => apiRequest(`/businesses/${slug}`),
  createListing: (body) => apiRequest("/businesses/listings", { method: "POST", body: JSON.stringify(body) }),
  communities: (params = {}) => {
    const qs = new URLSearchParams(cleanParams(params)).toString();
    return apiRequest(`/communities${qs ? `?${qs}` : ""}`);
  },
  communityById: (id) => apiRequest(`/communities/${id}`),
  joinCommunity: (body) => apiRequest("/communities/join", { method: "POST", body: JSON.stringify(body) }),
  createPost: (body) => apiRequest("/communities/posts", { method: "POST", body: JSON.stringify(body) }),
  ads: (params = {}) => {
    const qs = new URLSearchParams(cleanParams(params)).toString();
    return apiRequest(`/ads${qs ? `?${qs}` : ""}`);
  },
  adEvent: (id, type) => apiRequest(`/ads/${id}/event`, { method: "POST", body: JSON.stringify({ type }) }),
  createLead: (body) => apiRequest("/leads", { method: "POST", body: JSON.stringify(body) }),
  submitContact: (body) => apiRequest("/contact", { method: "POST", body: JSON.stringify(body) }),
  gamesHub: (businessId) => {
    const params = businessId ? `?businessId=${encodeURIComponent(businessId)}` : "";
    return apiRequest(`/games/hub${params}`);
  },
  claimGameOffer: (body) => apiRequest("/games/claim", { method: "POST", body: JSON.stringify(body) }),
  testimonials: () => apiRequest("/testimonials"),
  adminDashboard: () => apiRequest("/admin/dashboard"),
  adminPatch: (table, id, body) => apiRequest(`/admin/${table}/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  adminDelete: (table, id) => apiRequest(`/admin/${table}/${id}`, { method: "DELETE" }),
  adminCreateTestimonial: (body) => apiRequest("/admin/testimonials", { method: "POST", body: JSON.stringify(body) }),
  adminCreateCommunity: (body) => apiRequest("/admin/communities", { method: "POST", body: JSON.stringify(body) }),
  adminCreateAd: (body) => apiRequest("/admin/ads", { method: "POST", body: JSON.stringify(body) }),
  ownerWorkspace: () => apiRequest("/owner/workspace"),
  ownerAnalytics: (businessId) => apiRequest(`/owner/analytics?businessId=${encodeURIComponent(businessId)}`),
  updateBusiness: (id, body) => apiRequest(`/owner/businesses/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  createOffering: (body) => apiRequest("/owner/offerings", { method: "POST", body: JSON.stringify(body) }),
  updateOffering: (id, body) => apiRequest(`/owner/offerings/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteOffering: (id) => apiRequest(`/owner/offerings/${id}`, { method: "DELETE" }),
  kycStatus: () => apiRequest("/kyc/me"),
  kycSaveDraft: (body) => apiRequest("/kyc/me", { method: "PUT", body: JSON.stringify(body) }),
  kycSubmit: (body) => apiRequest("/kyc/me/submit", { method: "POST", body: JSON.stringify(body) }),
  adminKycStats: () => apiRequest("/admin/kyc/stats"),
  adminKycList: (params = {}) => {
    const qs = new URLSearchParams(cleanParams(params)).toString();
    return apiRequest(`/admin/kyc${qs ? `?${qs}` : ""}`);
  },
  adminKycGet: (id) => apiRequest(`/admin/kyc/${id}`),
  adminKycReview: (id, body) => apiRequest(`/admin/kyc/${id}/review`, { method: "PATCH", body: JSON.stringify(body) }),
  uploadFile,
  uploadKycFile,
  createPaymentOrder: (body) =>
    apiRequest("/payments/create-order", { method: "POST", body: JSON.stringify(body) }),
  verifyPayment: (body) =>
    apiRequest("/payments/verify", { method: "POST", body: JSON.stringify(body) }),
  paymentSubscriptions: (businessId) => apiRequest(`/payments/subscriptions/${businessId}`)
};
