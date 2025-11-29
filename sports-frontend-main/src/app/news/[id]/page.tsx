
import { API_BASE } from "@/lib/api";
import NewsClient from "./NewsClient";

interface PageParams {
  params: Promise<{ id: string }>; // ✅ Changed to Promise
}

// SEO + Metadata
export async function generateMetadata({ params }: PageParams) {
  try {
    const { id } = await params; // ✅ Await params
    console.log("SERVER META FETCH:", `${API_BASE}/news/${id}`);

    const res = await fetch(`${API_BASE}/news/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return {};

    const news = await res.json();

    return {
      title: news.title || "News Article",
      description: news.content?.slice(0, 150) || "",
      openGraph: {
        title: news.title,
        description: news.content?.slice(0, 150),
        images: [
          {
            url: news.imageUrl?.startsWith("http")
              ? news.imageUrl
              : `${API_BASE}${news.imageUrl}`,
          },
        ],
        url: `https://mal3abak.com/news/${id}`,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description: news.content?.slice(0, 150),
        images: [
          news.imageUrl?.startsWith("http")
            ? news.imageUrl
            : `${API_BASE}${news.imageUrl}`,
        ],
      },
    };
  } catch {
    return {};
  }
}

// PAGE COMPONENT
export default async function Page({ params }: PageParams) {
  const { id } = await params; // ✅ Await params
  const url = `${API_BASE}/news/${id}`;

  console.log("SERVER PAGE FETCH:", url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("❌ NEWS NOT FOUND ON SERVER — STATUS:", res.status);
    return <div className="p-10 text-center">Article Not Found</div>;
  }

  const news = await res.json();

  return <NewsClient newsItem={news} />;
}
