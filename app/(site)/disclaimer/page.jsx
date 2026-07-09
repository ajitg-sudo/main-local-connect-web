import LegalPage from "@/views/user/LegalPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Disclaimer",
  description: "Disclaimer for listings and services on India Local Connect.",
  path: "/disclaimer"
});

export default function Page() {
  return <LegalPage type="disclaimer" />;
}
