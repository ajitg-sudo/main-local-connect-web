import { Suspense } from "react";
import PlayOffersPage from "@/pages/user/PlayOffersPage";
import { createPageMetadata, getServerApiBase } from "@/utils/metadata";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const businessSlug = params.business;

  if (!businessSlug) {
    return createPageMetadata({
      title: "Play & Win Discounts",
      description: "Play mini-games on business listings and unlock percent-off coupon codes.",
      path: "/play-offers"
    });
  }

  try {
    const res = await fetch(`${getServerApiBase()}/businesses/${businessSlug}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      return createPageMetadata({
        title: "Play & Win Discounts",
        path: "/play-offers"
      });
    }

    const business = await res.json();
    return createPageMetadata({
      title: `Win a Discount at ${business.name}`,
      description: `Play a mini-game and unlock a coupon for ${business.name}.`,
      path: `/play-offers?business=${encodeURIComponent(businessSlug)}`
    });
  } catch {
    return createPageMetadata({
      title: "Play & Win Discounts",
      path: "/play-offers"
    });
  }
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-muted">Loading...</div>}>
      <PlayOffersPage />
    </Suspense>
  );
}
