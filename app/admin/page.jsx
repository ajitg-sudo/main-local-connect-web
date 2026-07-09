import { Suspense } from "react";
import AdminDashboardPage from "@/views/admin/AdminDashboardPage";
import { adminTabTitle, createPageMetadata } from "@/utils/metadata";
import { DEFAULT_ADMIN_TAB } from "@/utils/adminNav";

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const tab = params.tab || DEFAULT_ADMIN_TAB;
  const title = tab === DEFAULT_ADMIN_TAB ? "Admin Dashboard" : adminTabTitle(tab);

  return createPageMetadata({
    title,
    description: "Manage listings, users, KYC, payments, and platform data.",
    path: tab === DEFAULT_ADMIN_TAB ? "/admin" : `/admin?tab=${tab}`,
    noIndex: true
  });
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-muted">Loading...</div>}>
      <AdminDashboardPage />
    </Suspense>
  );
}
