import LoginPage from "@/views/user/LoginPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Sign In",
  description: "Sign in to your India Local Connect account.",
  path: "/login",
  noIndex: true
});

export default function Page() {
  return <LoginPage />;
}
