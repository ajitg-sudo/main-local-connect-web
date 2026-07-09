import { adminTabTitle, DEFAULT_ADMIN_TAB } from "./adminNav";

export const SITE_NAME = "India Local Connect";

export const SITE_TAGLINE = "Hyperlocal Business Directory";
export const SITE_DESCRIPTION =
  "Discover trusted local businesses, communities, and offers near you across India.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:5173";

export function getServerApiBase() {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
}

export function absoluteUrl(path = "/") {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image,
  noIndex = false,
  type = "website"
}) {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      locale: "en_IN",
      ...(image ? { images: [{ url: image, alt: title }] } : {})
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : { robots: { index: true, follow: true } })
  };
}

/** @deprecated Use createPageMetadata */
export function pageMetadata(title, description) {
  return createPageMetadata({ title, description });
}

export function createBusinessMetadata(business, slug) {
  const location = [business.area, business.city].filter(Boolean).join(", ");
  const description =
    business.description?.slice(0, 155) ||
    `${business.name}${business.category ? ` — ${business.category}` : ""}${location ? ` in ${location}` : ""}. Call, WhatsApp, or visit on India Local Connect.`;

  return createPageMetadata({
    title: business.name,
    description,
    path: `/business/${slug}`,
    type: "website"
  });
}

export function createCommunityMetadata(community, id) {
  const description =
    community.description?.slice(0, 155) ||
    `Join ${community.name}${community.city ? ` in ${community.city}` : ""} on India Local Connect.`;

  return createPageMetadata({
    title: community.name,
    description,
    path: `/community/${id}`
  });
}

export { adminTabTitle, DEFAULT_ADMIN_TAB };
