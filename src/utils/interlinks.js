export const AUTH_INTERLINKS = [
  { href: "/login", label: "Sign in" },
  { href: "/signup", label: "Create account" },
  { href: "/register", label: "List your business" }
];

export const LEGAL_INTERLINKS = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" }
];

export const DISCOVER_INTERLINKS = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/communities", label: "Communities" },
  { href: "/play-offers", label: "Play & win" },
  { href: "/list-business", label: "List your business" }
];

export const SUPPORT_INTERLINKS = [
  { href: "/contact", label: "Contact support" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" }
];

export function businessInterlinks(business) {
  if (!business) return DISCOVER_INTERLINKS;

  return [
    { href: "/", label: "Directory home" },
    {
      href: `/categories?category=${encodeURIComponent(business.category)}`,
      label: `More ${business.category}`
    },
    {
      href: `/play-offers?business=${encodeURIComponent(business.slug)}`,
      label: "Play & win discount"
    },
    { href: "/communities", label: "Communities" },
    { href: "/contact", label: "Contact support" }
  ];
}

export function communityInterlinks() {
  return [
    { href: "/communities", label: "All communities" },
    { href: "/categories", label: "Browse categories" },
    { href: "/list-business", label: "List your business" },
    { href: "/contact", label: "Contact support" }
  ];
}

export function categoryInterlinks(category) {
  if (!category) {
    return [
      { href: "/", label: "Home" },
      { href: "/list-business", label: "List your business" },
      { href: "/communities", label: "Communities" }
    ];
  }

  return [
    { href: "/categories", label: "All categories" },
    { href: `/list-business`, label: "List in this category" },
    { href: "/play-offers", label: "Play & win offers" },
    { href: "/communities", label: "Communities" }
  ];
}
