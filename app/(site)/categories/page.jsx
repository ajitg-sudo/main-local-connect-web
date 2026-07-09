import { Suspense } from "react";
import CategoriesPage from "@/pages/user/CategoriesPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Browse by Category",
  description: "Find electricians, salons, medical stores, food carts, tutors, and more near you.",
  path: "/categories"
});

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-muted">Loading categories...</div>}>
      <CategoriesPage />
    </Suspense>
  );
}
