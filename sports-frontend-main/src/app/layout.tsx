import type { Metadata } from "next";

import "./globals.css";
import FooterGate from "@/components/FooterGate";
import AuthWrapper from "@/components/AuthWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// 🌍 الموقع الرسمي (metadata عالمي)
export const metadata: Metadata = {
  metadataBase: new URL("https://mal3abak.com"),

  title: {
    default: "Mal3abak - All Football News & Matches in One Place",
    template: "%s | Mal3abak",
  },

  description:
    "Live football scores, breaking news, match schedules, goals, statistics, transfers, and personalized alerts — all in one place with Mal3abak.",

  keywords: [
    "اخبار كرة القدم",
    "اهداف",
    "مواعيد المباريات",
    "ترتيب الدوري",
    "تشكيلات",
    "انتقالات",
    "اندية العالم",
    "البث المباشر"
    "football",
    "soccer",
    "sports",
    "live scores",
    "football news",
    "goals",
    "matches",
    "statistics",
    "ملعبك",
  ],

  authors: [{ name: "Mal3abak Team", url: "https://mal3abak.com" }],
  creator: "Mal3abak Team",
  publisher: "Mal3abak",

  // 🔥 OG Image — مهم جدًا للسوشيال
  openGraph: {
    type: "website",
    url: "https://mal3abak.com",
    siteName: "Mal3abak",
    title: "Mal3abak - Your Football Stadium",
    description:
      "Follow the latest football news, match results, goals, leagues, transfers, and live updates from around the world — all in one place.",
    images: [
      {
        url: "/og-main.jpg",
        width: 1200,
        height: 630,
        alt: "Mal3abak - Football News & Matches",
      },
    ],
    locale: "ar_EG",
    alternateLocale: ["en_US"],
  },

  // 🐦 Twitter (X)
  twitter: {
    card: "summary_large_image",
    site: "@mal3abak",
    creator: "@mal3abak",
    title: "Mal3abak - Your Football Stadium",
    description:
      "Live football scores, news, goals, and personalized alerts — all in one place.",
    images: ["/og-main.jpg"],
  },

  // 🤖 Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // 📱 Mobile viewport
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },

  // 📦 Additional
  category: "Sports",
};

// 📱 Mobile Scale
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased dark">

        <ThemeProvider>
          <AuthProvider>
            <AuthWrapper>
              {children}
              <FooterGate />
            </AuthWrapper>
          </AuthProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
