export const dynamic = "force-dynamic";

import { API_BASE } from "@/lib/api";
import NewsClient from "./NewsClient";
import type { Metadata } from "next";

interface PageParams {
  params: { id: string };
}

// Helper function to clean and optimize text for SEO
function cleanTextForSEO(text: string, maxLength: number = 160): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim().slice(0, maxLength).trim();
}

// Helper function to get absolute image URL
function getAbsoluteImageUrl(imageUrl: string): string {
  if (!imageUrl) return "https://mal3abak.com/default-og-image.jpg";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return imageUrl.startsWith("/")
    ? `${API_BASE}${imageUrl}`
    : `${API_BASE}/${imageUrl}`;
}

// SEO Metadata
export async function generateMetadata({
  params,
}: PageParams): Promise<Metadata> {
  try {
    const { id } = params;

    console.log("🔍 SERVER META FETCH:", `${API_BASE}/news/${id}`);

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

    const news = await res.json();

    const title = news.title || "Latest Football News";
    const description = cleanTextForSEO(news.content, 160);
    const imageUrl = getAbsoluteImageUrl(news.imageUrl);
    const articleUrl = `https://mal3abak.com/news/${id}`;
    const publishedTime = news.publishedAt || news.createdAt;
    const modifiedTime = news.updatedAt || publishedTime;
    const authorName = news.author?.username || "Mal3abak Team";

    const keywords = [
      "football news",
      "soccer news",
      "sports news",
      "mal3abak",
      "ملعبك",
      "أخبار كرة القدم",
      "أخبار رياضية",
      title.split(" ").slice(0, 5).join(", "),
    ].join(", ");

    return {
      title: `${title} | Mal3abak`,
      description,
      keywords,
      authors: [{ name: authorName }],
      creator: "Mal3abak",
      publisher: "Mal3abak",

      alternates: {
        canonical: articleUrl,
      },

      openGraph: {
        type: "article",
        title,
        description,
        url: articleUrl,
        siteName: "Mal3abak - All Football News in One Place",
        locale: "ar_EG",
        alternateLocale: ["en_US"],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
            type: "image/jpeg",
          },
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: title,
          },
        ],
        publishedTime,
        modifiedTime,
        authors: [authorName],
        section: "Sports",
        tags: ["Football", "Soccer", "Sports", "News", "ملعبك", "كرة القدم"],
      },

      twitter: {
        card: "summary_large_image",
        site: "@mal3abak1",
        creator: "@mal3abak",
        title,
        description,
        images: [imageUrl],
      },

      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },

      category: "Sports",

      verification: {
        google: "your-google-site-verification-code",
      },

      appLinks: {
        web: {
          url: articleUrl,
          should_fallback: true,
        },
      },

      other: {
        "article:published_time": publishedTime,
        "article:modified_time": modifiedTime,
        "article:author": authorName,
        "article:section": "Sports",
        "article:tag": "Football, Soccer, Sports",
      },
    };
  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    return {
      title: "Mal3abak - All Football News in One Place",
      description:
        "Get the latest football news, match updates, and sports coverage from around the world.",
    };
  }
}

// PAGE COMPONENT
export default async function Page({ params }: PageParams) {
  const { id } = params;
  const url = `${API_BASE}/news/${id}`;

  console.log("🚀 SERVER PAGE FETCH:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.log("❌ NEWS NOT FOUND — STATUS:", res.status);
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-10">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Article Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <a
              href="/news"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to News
            </a>
          </div>
        </div>
      );
    }

    const news = await res.json();

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: news.title,
      description: cleanTextForSEO(news.content, 160),
      image: getAbsoluteImageUrl(news.imageUrl),
      datePublished: news.publishedAt || news.createdAt,
      dateModified: news.updatedAt || news.publishedAt || news.createdAt,
      author: {
        "@type": "Person",
        name: news.author?.username || "Mal3abak Team",
      },
      publisher: {
        "@type": "Organization",
        name: "Mal3abak",
        logo: {
          "@type": "ImageObject",
          url: "https://mal3abak.com/logo.png",
        },
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
        <NewsClient newsItem={news} />
      </>
    );
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-10">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't load this article. Please try again later.
          </p>
          <a
            href="/news"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to News
          </a>
        </div>
      </div>
    );
  }
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/news?limit=50`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const news = await res.json();
    const articles = Array.isArray(news) ? news : news.news || [];

    return articles.map((article: any) => ({
      id: article._id,
    }));
  } catch {
    return [];
  }
}

export const revalidate = 60;
