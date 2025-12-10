export const dynamic = "force-dynamic";

import { API_BASE } from "@/lib/api";
import NewsClient from "./NewsClient";
import type { Metadata } from "next";

interface PageParams {
  params: Promise<{ id: string }>;
}

function cleanTextForSEO(text: string, maxLength: number = 160): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim().slice(0, maxLength).trim();
}

function getAbsoluteImageUrl(imageUrl: string): string {
  if (!imageUrl) return "https://mal3abak.com/default-og-image.jpg";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return imageUrl.startsWith("/")
    ? `${API_BASE}${imageUrl}`
    : `${API_BASE}/${imageUrl}`;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  try {
    const { id } = await params;

    const res = await fetch(`${API_BASE}/news/${id}`, {
      cache: "no-store",
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: "Article Not Found | Mal3abak",
        description: "The requested article could not be found.",
      };
    }

    // 🔥 FIX: دعم الشكل الجديد
    const json = await res.json();
    const news = json.data || json;

    const title = news.title || "Latest Football News";
    const description = cleanTextForSEO(news.content, 160);
    const imageUrl = getAbsoluteImageUrl(news.imageUrl);
    const articleUrl = `https://mal3abak.com/news/${id}`;
    const publishedTime = news.publishedAt || news.createdAt;
    const modifiedTime = news.updatedAt || publishedTime;
    const authorName = news.author?.username || "Mal3abak Team";

    return {
      title: `${title} | Mal3abak`,
      description,
      keywords: [
        "football news",
        "soccer news",
        "sports news",
        "mal3abak",
        "ملعبك",
        "أخبار كرة القدم",
        "أخبار رياضية",
        title.split(" ").slice(0, 5).join(", "),
      ].join(", "),

      openGraph: {
        type: "article",
        title,
        description,
        url: articleUrl,
        siteName: "Mal3abak",
        images: [
          { url: imageUrl, width: 1200, height: 630, alt: title },
          { url: imageUrl, width: 800, height: 600, alt: title },
        ],
        publishedTime,
        modifiedTime,
        authors: [authorName],
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },

      alternates: { canonical: articleUrl },

      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (err) {
    console.error("❌ Metadata error:", err);
    return {
      title: "Mal3abak",
      description: "Latest sports news",
    };
  }
}

export default async function Page({ params }: PageParams) {
  const { id } = await params;

  try {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      cache: "no-store",
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <h1>Article Not Found</h1>
        </div>
      );
    }

    // 🔥 FIX: دعم شكل backend الجديد
    const json = await res.json();
    const news = json.data || json;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: news.title,
      description: cleanTextForSEO(news.content, 160),
      image: getAbsoluteImageUrl(news.imageUrl),
      datePublished: news.publishedAt || news.createdAt,
      dateModified: news.updatedAt || news.createdAt,
      author: {
        "@type": "Person",
        name: news.author?.username || "Mal3abak Team",
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://mal3abak.com/news/${id}`,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Pass correct formatted data */}
        <NewsClient newsItem={news} />
      </>
    );
  } catch (err) {
    console.error("❌ Page error:", err);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1>Error loading article</h1>
      </div>
    );
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/news?limit=50`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const articles = Array.isArray(json) ? json : json.news || [];

    return articles.map((article: any) => ({
      id: article._id,
    }));
  } catch {
    return [];
  }
}

export const revalidate = 60;
