import ContactPage from "@/views/user/ContactPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description: "Get help with listings, ads, partnerships, or report a business on India Local Connect.",
  path: "/contact"
});

export default function Page() {
  return <ContactPage />;
}
