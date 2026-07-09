export function dealPointsFor(business) {
  return business.dealPoints ?? Math.max(10, Math.round((business.rating || 4) * 10));
}

export function directionsLink(business) {
  if (business.mapUrl) return business.mapUrl;
  const q = encodeURIComponent(`${business.name}, ${business.area || ""}, ${business.city}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export async function shareBusiness(business) {
  const url = `${window.location.origin}/business/${business.slug}`;
  const payload = {
    title: business.name,
    text: `Check out ${business.name} on India Local Connect`,
    url
  };
  if (navigator.share) {
    await navigator.share(payload);
    return;
  }
  await navigator.clipboard.writeText(url);
}

export function offerHeadline(business) {
  if (business.primaryOffer?.discount) return business.primaryOffer.discount;
  if (business.primaryOffer?.title) return business.primaryOffer.title;
  return "Ask on WhatsApp for today's local offer.";
}
