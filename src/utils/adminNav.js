export const ADMIN_TABS = [
  { key: "listings", label: "Listings", shortLabel: "Listings" },
  { key: "kyc", label: "KYC", shortLabel: "KYC" },
  { key: "users", label: "Users", shortLabel: "Users" },
  { key: "payments", label: "Payments", shortLabel: "Payments" },
  { key: "leads", label: "Leads", shortLabel: "Leads" },
  { key: "ads", label: "Ads", shortLabel: "Ads" },
  { key: "communities", label: "Communities", shortLabel: "Groups" },
  { key: "testimonials", label: "Testimonials", shortLabel: "Reviews" }
];

export const DEFAULT_ADMIN_TAB = "listings";

export function formatAdminRole(role) {
  if (role === "super_admin") return "Super Admin";
  if (role === "city_admin") return "City Admin";
  return role?.replace(/_/g, " ") || "";
}

export function adminTabPath(tabKey) {
  if (!tabKey || tabKey === DEFAULT_ADMIN_TAB) return "/admin";
  return `/admin?tab=${tabKey}`;
}

export function adminTabTitle(tabKey) {
  const tab = ADMIN_TABS.find((item) => item.key === tabKey);
  return tab?.label || "Admin";
}
