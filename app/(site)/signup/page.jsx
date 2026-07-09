import CustomerSignupPage from "@/pages/user/CustomerSignupPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Create Account",
  description: "Sign up to play games, win discount coupons, and save offers from local businesses.",
  path: "/signup",
  noIndex: true
});

export default function Page() {
  return <CustomerSignupPage />;
}
