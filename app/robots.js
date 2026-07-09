import { SITE_URL } from "@/utils/metadata";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/owner", "/api/"]
      }
    ],
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
