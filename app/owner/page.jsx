import OwnerDashboardPage from "@/pages/owner/OwnerDashboardPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Owner Dashboard",
  description: "Manage your business listing, KYC, plan, and analytics.",
  path: "/owner",
  noIndex: true
});

export default function Page() {
  return <OwnerDashboardPage />;
}
