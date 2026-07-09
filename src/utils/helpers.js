import { FEATURED_TOP_SLOTS } from "./planLimits";

export function filterBusinesses(businesses, filters) {
  return businesses.filter((b) => {
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hay = `${b.name} ${b.category} ${b.area} ${b.city}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filters.city && b.city !== filters.city) return false;
    if (filters.area && b.area !== filters.area) return false;
    if (filters.category && b.category !== filters.category) return false;
    if (filters.openNow && !b.open) return false;
    if (filters.verifiedOnly && !b.verified) return false;
    if (filters.premium && b.premium !== filters.premium) return false;
    if (filters.minRating && b.rating < Number(filters.minRating)) return false;
    return true;
  });
}

export function uniqueAreas(businesses, city) {
  const set = new Set();
  businesses.forEach((b) => {
    if ((!city || b.city === city) && b.area) set.add(b.area);
  });
  return [...set].sort();
}

function compareByQuality(a, b) {
  if (b.verified !== a.verified) return b.verified ? 1 : -1;
  if (b.rating !== a.rating) return b.rating - a.rating;
  return (b.reviews || 0) - (a.reviews || 0);
}

function planWeight(premium) {
  return { Featured: 3, Premium: 2, Free: 1 }[premium] || 1;
}

/** Rank listings — Featured get top slots (max 3), overflow Featured ranks as Premium */
export function rankBusinesses(list) {
  const featured = list.filter((b) => b.premium === "Featured").sort(compareByQuality);
  const topFeatured = featured.slice(0, FEATURED_TOP_SLOTS);
  const topIds = new Set(topFeatured.map((b) => b.id || b.slug));

  const effectiveWeight = (b) => {
    if (b.premium === "Featured" && !topIds.has(b.id || b.slug)) return 2;
    return planWeight(b.premium);
  };

  const rest = list
    .filter((b) => !topIds.has(b.id || b.slug))
    .sort((a, b) => {
      const pw = effectiveWeight(b) - effectiveWeight(a);
      if (pw) return pw;
      return compareByQuality(a, b);
    });

  return [...topFeatured, ...rest];
}
