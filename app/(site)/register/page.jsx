import RegisterPage from "@/views/user/RegisterPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Register Your Business",
  description: "Create a business owner account and list your shop or service.",
  path: "/register",
  noIndex: true
});

export default function Page() {
  return <RegisterPage />;
}
