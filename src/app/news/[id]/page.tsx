import { Metadata } from "next";
import NewsClient from "./NewsClient";

interface PageParams {
  params: {
    id: string;
  };
}

const API_BASE = "https://api.mal3abak.com";
const SITE_URL = "https://mal3abak.com";

// Generate Metadata for SEO
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE}/news/${params.id}`, {
      cache: "no-store",
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: "Article Not Found | Mal'abak - Your Football Stadium",
        description: "The article you're looking for could not be found.",
        robots: { index: false, follow: true },
      };
    }

    // حل مشكلة BOM في الميتا أيضاً
    const text = await res.text();
    const cleanText = text.replace(/^\uFEFF/, "");
    const news = JSON.parse(cleanText);

    const imageUrl = news.imageUrl?.startsWith("http")
      ? news.imageUrl
      : `${API_BASE}${news.imageUrl}`;

    const articleUrl = `${SITE_URL}/news/${params.id}`;
    const description = news.content?.slice(0, 160) || "Latest football news";

    return {
      title: `${news.title} | Mal'abak`,
      description,
      openGraph: {
        type: "article",
        title: news.title,
        description,
        url: articleUrl,
        siteName: "Mal'abak",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: news.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description,
        images: [imageUrl],
      },
      robots: { index: true, follow: true },
      alternates: { canonical: articleUrl },
    };
  } catch (error) {
    return {
      title: "Error Loading Article | Mal'abak",
      description: "An error occurred while loading the article.",
      robots: { index: false, follow: true },
    };
  }
}

// Fetch News (Server-side with BOM Fix)
async function fetchNewsById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      cache: "no-store",
      next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    // ⛔ مهم: نتجنب كراش JSON.parse بسبب BOM
    const text = await res.text();
    const clean = text.replace(/^\uFEFF/, ""); // حذف BOM
    return JSON.parse(clean);

  } catch (err) {
    console.error("News Parsing Error:", err);
    return null;
  }
}

// Page Component (Server Component)
export default async function NewsPage({ params }: PageParams) {
  const newsItem = await fetchNewsById(params.id);

  const jsonLd = newsItem
    ? {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": newsItem.title,
        "description": newsItem.content?.slice(0, 160),
        "image": newsItem.imageUrl?.startsWith("http")
          ? newsItem.imageUrl
          : `${API_BASE}${newsItem.imageUrl}`,
        "datePublished": newsItem.publishedAt || newsItem.createdAt,
        "dateModified":
          newsItem.updatedAt ||
          newsItem.publishedAt ||
          newsItem.createdAt,
        "author": {
          "@type": "Person",
          "name": newsItem.author?.username || "Mal'abak Team",
        },
        "publisher": {
          "@type": "Organization",
          "name": "Mal'abak",
          "logo": {
            "@type": "ImageObject",
            "url": `${SITE_URL}/logo.png`,
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `${SITE_URL}/news/${params.id}`,
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* ملاحظة مهمة: نرسل id + البيانات المبدئية فقط */}
      <NewsClient id={params.id} initialNews={newsItem} />
    </>
  );
}
