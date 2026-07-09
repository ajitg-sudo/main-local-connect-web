import LegalPage from "@/views/user/LegalPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Terms & Conditions",
  description: "Terms and conditions for using India Local Connect.",
  path: "/terms"
});

export default function Page() {
  return <LegalPage type="terms" />;
}
