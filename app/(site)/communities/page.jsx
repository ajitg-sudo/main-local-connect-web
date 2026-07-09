import CommunitiesPage from "@/pages/user/CommunitiesPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Business Communities",
  description: "Join local owner groups to share leads, referrals, and area updates.",
  path: "/communities"
});

export default function Page() {
  return <CommunitiesPage />;
}
