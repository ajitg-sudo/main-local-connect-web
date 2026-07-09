export function userInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function formatPublicUserRole({ isAdmin, isOwner, isCustomer }) {
  if (isAdmin) return "Admin";
  if (isOwner) return "Business owner";
  if (isCustomer) return "Customer";
  return "Member";
}

/** Guests (onboarding) and business owners may list a business; customers may not. */
export function canListBusiness(user, { isOwner } = {}) {
  if (!user) return true;
  return isOwner || user.role === "super_admin";
}
