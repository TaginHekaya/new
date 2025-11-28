
import { Metadata } from "next";
import NewsClient from "./NewsClient";

interface PageParams {
  params: {
    id: string;
  };
}

const API_BASE = "https://api.mal3abak.com";
const SITE_URL = "https://mal3abak.com";

// Generate Metadata for SEO - ENHANCED VERSION
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  try {
    const res = await fetch(`${API_BASE}/news/${params.id}`, {
      cache: "no-store",
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      return {
        title: "Article Not Found | Mal'abak - Your Football Stadium",
        description: "The article you're looking for could not be found. Browse more football news and updates on Mal'abak.",
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const news = await res.json();
    
    const imageUrl = news.imageUrl?.startsWith("http")
      ? news.imageUrl
      : `${API_BASE}${news.imageUrl}`;
    
    const articleUrl = `${SITE_URL}/news/${params.id}`;
    const description = news.content?.slice(0, 160) || "Read the latest football news and updates on Mal'abak.";
    const publishedTime = news.publishedAt || news.createdAt;
    const authorName = news.author?.username || "Mal'abak Team";

    return {
      title: `${news.title} | Mal'abak`,
      description: description,
      
      // Keywords for better SEO
      keywords: [
        "football news",
        "soccer updates",
        "Mal'abak",
        news.title,
        authorName,
        "sports news",
        "football headlines",
      ],
      
      // Authors
      authors: [
        {
          name: authorName,
          url: `${SITE_URL}/author/${news.author?._id}`,
        },
      ],
      
      // Creator
      creator: authorName,
      publisher: "Mal'abak",
      
      // Open Graph (Facebook, LinkedIn, etc.)
      openGraph: {
        type: "article",
        title: news.title,
        description: description,
        url: articleUrl,
        siteName: "Mal'abak - Your Football Stadium",
        locale: "ar_EG",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: news.title,
            type: "image/jpeg",
          },
        ],
        publishedTime: publishedTime,
        modifiedTime: news.updatedAt || publishedTime,
        authors: [authorName],
        tags: ["football", "soccer", "sports", "news"],
      },
      
      // Twitter Card
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description: description,
        site: "@mal3abak",
        creator: "@mal3abak",
        images: [imageUrl],
      },
      
      // Robots
      robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      
      // Canonical URL
      alternates: {
        canonical: articleUrl,
        languages: {
          "ar-EG": articleUrl,
          "en-US": `${articleUrl}?lang=en`,
        },
      },
      
      // Verification
      verification: {
        google: "your-google-verification-code",
        // yandex: "your-yandex-verification-code",
        // yahoo: "your-yahoo-verification-code",
      },
      
      // Category
      category: "Sports News",
      
      // Other metadata
      other: {
        "article:author": authorName,
        "article:published_time": publishedTime,
        "article:section": "Football News",
        "og:type": "article",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error Loading Article | Mal'abak",
      description: "An error occurred while loading the article. Please try again later.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

// Fetch News Data
async function fetchNewsById(id: string) {
  try {
    const res = await fetch(`${API_BASE}/news/${id}`, {
      cache: "no-store",
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error(`Failed to fetch news: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    return null;
  }
}

// Generate Static Params (Optional - for Static Site Generation)
// Uncomment this if you want to pre-render popular articles
/*
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_BASE}/news?limit=50`, {
      cache: "no-store",
    });
    
    if (!res.ok) return [];
    
    const news = await res.json();
    
    return news.map((article: any) => ({
      id: article._id,
    }));
  } catch {
    return [];
  }
}
*/

// Page Component (Server Component)
export default async function NewsPage({ params }: PageParams) {
  const newsItem = await fetchNewsById(params.id);

  // JSON-LD Structured Data for Rich Snippets
  const jsonLd = newsItem ? {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": newsItem.title,
    "description": newsItem.content?.slice(0, 160),
    "image": newsItem.imageUrl?.startsWith("http")
      ? newsItem.imageUrl
      : `${API_BASE}${newsItem.imageUrl}`,
    "datePublished": newsItem.publishedAt || newsItem.createdAt,
    "dateModified": newsItem.updatedAt || newsItem.publishedAt || newsItem.createdAt,
    "author": {
      "@type": "Person",
      "name": newsItem.author?.username || "Mal'abak Team",
      "url": `${SITE_URL}/author/${newsItem.author?._id}`,
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
    "articleSection": "Football News",
    "inLanguage": "ar-EG",
    "isAccessibleForFree": "True",
  } : null;

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      
      {/* Pass data to Client Component */}
      <NewsClient newsItem={newsItem} />
    </>
  );
      }
