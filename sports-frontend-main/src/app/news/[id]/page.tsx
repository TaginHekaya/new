// THIS FILE IS SERVER COMPONENT
import { API_BASE } from "@/lib/api";
import NewsClient from "@/components/news/NewsClient";

// ------------------
// FIXED: add types
// ------------------
interface PageParams {
  params: {
    id: string;
  };
}

// ------------------
// SEO + Metadata
// ------------------
export async function generateMetadata(
  { params }: PageParams
) {
  try {
    const res = await fetch(`${API_BASE}/news/${params.id}`, {
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
        url: `https://mal3abak.com/news/${params.id}`,
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
  } catch (e) {
    return {};
  }
}

// ------------------
// PAGE COMPONENT
// ------------------
export default async function Page({ params }: PageParams) {
  const res = await fetch(`${API_BASE}/news/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return <div className="p-10 text-center">Article Not Found</div>;
  }

  const news = await res.json();

  // Send news to client component
  return <NewsClient newsItem={news} />;
}
