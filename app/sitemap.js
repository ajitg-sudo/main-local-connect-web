import { SITE_URL } from "@/utils/metadata";

const STATIC_ROUTES = [
  "",
  "/categories",
  "/list-business",
  "/communities",
  "/play-offers",
  "/contact",
  "/login",
  "/register",
  "/signup",
  "/terms",
  "/privacy",
  "/disclaimer"
];

export default function sitemap() {
  const lastModified = new Date();

  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8
  }));
}
