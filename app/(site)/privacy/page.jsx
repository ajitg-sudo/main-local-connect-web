import LegalPage from "@/pages/user/LegalPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How India Local Connect collects, uses, and protects your data.",
  path: "/privacy"
});

export default function Page() {
  return <LegalPage type="privacy" />;
}
