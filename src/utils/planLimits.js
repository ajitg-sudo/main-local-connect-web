/** Plan tier limits — keep in sync with backend/src/config/planLimits.js */
export const PLAN_LIMITS = {
  Free: {
    maxPhotos: 1,
    maxOfferings: 2,
    leadDashboard: false,
    analytics: false,
    featuredTopSlots: 0
  },
  Premium: {
    maxPhotos: 8,
    maxOfferings: 10,
    leadDashboard: true,
    analytics: true,
    featuredTopSlots: 0
  },
  Featured: {
    maxPhotos: 20,
    maxOfferings: null,
    leadDashboard: true,
    analytics: true,
    featuredTopSlots: 3
  }
};

export const FEATURED_TOP_SLOTS = 3;

export function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.Free;
}

export function parseGallery(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function countBusinessPhotos(business) {
  let count = business.logoUrl ? 1 : 0;
  count += parseGallery(business.galleryUrls).length;
  return count;
}

export function maxOfferingsForPlan(plan) {
  const limit = getPlanLimits(plan).maxOfferings;
  return limit == null ? Infinity : limit;
}

export function maxPhotosForPlan(plan) {
  return getPlanLimits(plan).maxPhotos;
}

export function canAccessAnalytics(plan) {
  return Boolean(getPlanLimits(plan).analytics);
}

export function canAccessLeadDashboard(plan) {
  return Boolean(getPlanLimits(plan).leadDashboard);
}

export function isAtOfferingLimit(plan, count) {
  const max = maxOfferingsForPlan(plan);
  return count >= max;
}

export function isAtPhotoLimit(plan, count) {
  return count >= maxPhotosForPlan(plan);
}

export function planUsageLabel(used, max) {
  if (max == null) return `${used} used · Unlimited`;
  return `${used} / ${max} used`;
}
