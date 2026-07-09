import JsonLd from "./JsonLd";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/utils/metadata";

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items = [] }) {
  if (!items.length) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          ...(item.href ? { item: item.href.startsWith("http") ? item.href : `${SITE_URL}${item.href}` } : {})
        }))
      }}
    />
  );
}

export function LocalBusinessJsonLd({ business, slug }) {
  if (!business) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: business.name,
        description: business.description,
        url: `${SITE_URL}/business/${slug}`,
        telephone: business.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: business.city,
          addressRegion: business.area || business.city,
          addressCountry: "IN"
        },
        ...(business.rating
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: business.rating,
                reviewCount: business.reviews || 1
              }
            }
          : {})
      }}
    />
  );
}
