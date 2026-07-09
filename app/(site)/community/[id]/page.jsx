import CommunityDetailPage from "@/views/user/CommunityDetailPage";
import { createCommunityMetadata, getServerApiBase } from "@/utils/metadata";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(`${getServerApiBase()}/communities/${id}`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      return createCommunityMetadata({ name: "Community Not Found", city: "", description: "" }, id);
    }

    const data = await res.json();
    const community = data.community || data;
    return createCommunityMetadata(community, id);
  } catch {
    return createCommunityMetadata({ name: "Community", city: "", description: "" }, id);
  }
}

export default function Page() {
  return <CommunityDetailPage />;
}
