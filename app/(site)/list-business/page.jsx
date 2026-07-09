import ListBusinessPage from "@/views/user/ListBusinessPage";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: "List Your Business",
  description: "Submit your shop or service listing and get discovered by local customers.",
  path: "/list-business"
});

export default function Page() {
  return <ListBusinessPage />;
}
