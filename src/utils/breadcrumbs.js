import { adminTabPath, adminTabTitle, DEFAULT_ADMIN_TAB } from "./adminNav";

const SEGMENT_LABELS = {
  categories: "Categories",
  "list-business": "List Your Business",
  communities: "Communities",
  login: "Sign In",
  register: "Register Business",
  signup: "Create Account",
  contact: "Contact Us",
  "play-offers": "Play & Win",
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  disclaimer: "Disclaimer",
  owner: "Owner Dashboard"
};

function getSearchParam(searchParams, key) {
  if (!searchParams) return "";
  if (typeof searchParams.get === "function") return searchParams.get(key) || "";
  return searchParams[key] || "";
}

export function buildBreadcrumbs(pathname, searchParams = {}, dynamicLabels = {}) {
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return [];

  const items = [{ label: "Home", href: "/" }];

  if (parts[0] === "admin") {
    if (parts[1] === "login") {
      items.push({ label: "Admin Login" });
      return items;
    }

    const tab = getSearchParam(searchParams, "tab") || DEFAULT_ADMIN_TAB;
    items.push({ label: "Admin", href: "/admin" });
    if (tab !== DEFAULT_ADMIN_TAB) {
      items.push({ label: adminTabTitle(tab), href: adminTabPath(tab) });
    }
    return items.map((item, index) =>
      index === items.length - 1 ? { label: item.label } : item
    );
  }

  if (parts[0] === "owner") {
    items.push({ label: "Owner Dashboard" });
    return items;
  }

  let index = 0;
  while (index < parts.length) {
    const segment = parts[index];
    const pathSoFar = `/${parts.slice(0, index + 1).join("/")}`;
    const isLastSegment = index === parts.length - 1;

    if (segment === "business" && parts[index + 1]) {
      const slug = parts[index + 1];
      const category = dynamicLabels.businessCategory;
      if (category) {
        items.push({
          label: category,
          href: `/categories?category=${encodeURIComponent(category)}`
        });
      } else {
        items.push({ label: "Categories", href: "/categories" });
      }
      items.push({
        label: dynamicLabels[`business:${slug}`] || dynamicLabels.businessName || "Business"
      });
      index += 2;
      continue;
    }

    if (segment === "community" && parts[index + 1]) {
      const id = parts[index + 1];
      items.push({ label: "Communities", href: "/communities" });
      items.push({
        label: dynamicLabels[`community:${id}`] || dynamicLabels.communityName || "Community"
      });
      index += 2;
      continue;
    }

    if (segment === "categories") {
      const category = getSearchParam(searchParams, "category");
      items.push({
        label: "Categories",
        href: category ? "/categories" : undefined
      });
      if (category) items.push({ label: category });
      index += 1;
      continue;
    }

    if (segment === "play-offers") {
      const businessName = dynamicLabels.playBusinessName;
      const businessSlug = dynamicLabels.playBusinessSlug;
      items.push({
        label: "Play & Win",
        href: businessSlug ? "/play-offers" : undefined
      });
      if (businessName) items.push({ label: businessName });
      index += 1;
      continue;
    }

    const label = SEGMENT_LABELS[segment] || segment;
    items.push({
      label,
      href: isLastSegment ? undefined : pathSoFar
    });
    index += 1;
  }

  if (items.length > 1) {
    const last = items[items.length - 1];
    delete last.href;
  }

  return items;
}
