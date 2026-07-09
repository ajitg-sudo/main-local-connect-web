import HomePage from "@/views/user/HomePage";
import { WebSiteJsonLd } from "@/components/seo/SiteJsonLd";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Find Local Businesses",
  description: "Search shops, services, and vendors near you on India Local Connect.",
  path: "/"
});

export default function Page() {
  return (
    <>
      <WebSiteJsonLd />
      <HomePage />
    </>
  );
}
