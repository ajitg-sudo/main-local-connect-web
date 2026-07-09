"use client";

import ProtectedRoute from "@/routes/ProtectedRoute";
import OwnerLayout from "@/layouts/OwnerLayout";

export default function OwnerRootLayout({ children }) {
  return (
    <ProtectedRoute roles={["business_owner", "super_admin"]}>
      <OwnerLayout>{children}</OwnerLayout>
    </ProtectedRoute>
  );
}
