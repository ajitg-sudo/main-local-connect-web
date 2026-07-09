"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminLayout from "@/layouts/AdminLayout";

export default function AdminRootLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <ProtectedRoute roles={["super_admin", "city_admin"]} loginPath="/admin/login">
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}
