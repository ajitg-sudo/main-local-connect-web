import BusinessDetailPage from "@/pages/user/BusinessDetailPage";
import { LocalBusinessJsonLd } from "@/components/seo/SiteJsonLd";
import { createBusinessMetadata, getServerApiBase } from "@/utils/metadata";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const res = await fetch(`${getServerApiBase()}/businesses/${slug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      return createBusinessMetadata({ name: "Business Not Found", category: "", area: "", city: "" }, slug);
    }

    const business = await res.json();
    return createBusinessMetadata(business, slug);
  } catch {
    return createBusinessMetadata({ name: "Business", category: "", area: "", city: "" }, slug);
  }
}

export default async function Page({ params }) {
  const { slug } = await params;
  let business = null;

  try {
    const res = await fetch(`${getServerApiBase()}/businesses/${slug}`, {
      next: { revalidate: 60 }
    });
    if (res.ok) business = await res.json();
  } catch {
    business = null;
  }

  return (
    <>
      {business && <LocalBusinessJsonLd business={business} slug={slug} />}
      <BusinessDetailPage />
    </>
  );
}
