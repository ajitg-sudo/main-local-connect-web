import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Admin Login",
  description: "Staff sign-in for the India Local Connect admin console.",
  path: "/admin/login",
  noIndex: true
});

export default function Page() {
  return <AdminLoginPage />;
}
