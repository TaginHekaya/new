import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";
import "../styles/analysis.css"; // ⬅️ استيراد ملف Analysis CSS
import FooterGate from "@/components/FooterGate";
import AuthWrapper from "@/components/AuthWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

/* =========================
   🌍 Global SEO Metadata
========================= */
export const metadata: Metadata = {
  metadataBase: new URL("https://mal3abak.com"),

  title: {
    default: "ملعبك — كل أخبار ومباريات كرة القدم في مكان واحد",
    template: "%s | ملعبك",
  },

  description:
    "ملعبك — منصتك الشاملة لمتابعة أحدث أخبار كرة القدم، مواعيد المباريات، الأهداف، الملخصات، الإشعارات الفورية، ترتيب الدوريات، انتقالات اللاعبين، وتحليلات لحظة بلحظة — كل ذلك في مكان واحد بتجربة سريعة واحترافية.",

  keywords: [
    "ملعبك",
    "اخبار كرة القدم",
    "مباريات اليوم",
    "اهداف",
    "نتائج المباريات",
    "ترتيب الدوري",
    "انتقالات اللاعبين",
    "كرة القدم",
    "football",
    "soccer",
    "football news",
    "live scores",
    "highlights",
    "fixtures",
    "transfers",
  ],

  authors: [{ name: "Mal3abak Team", url: "https://mal3abak.com" }],
  creator: "Mal3abak Team",
  publisher: "Mal3abak",

  openGraph: {
    type: "website",
    url: "https://mal3abak.com",
    siteName: "Mal3abak — ملعبك",
    title: "ملعبك — كل ما يخص كرة القدم في مكان واحد",
    description:
      "تابع آخر أخبار كرة القدم، النتائج المباشرة، الأهداف، التحليلات، انتقالات اللاعبين، وتحديثات الدوريات العالمية لحظة بلحظة.",
    images: [
      {
        url: "/og-main-v2.jpg",
        width: 1200,
        height: 630,
        alt: "Mal3abak - Football News",
      },
    ],
    locale: "ar_EG",
    alternateLocale: ["en_US"],
  },

  twitter: {
    card: "summary_large_image",
    title: "ملعبك — كل كرة القدم بين يديك",
    description:
      "أخبار كرة القدم، نتائج مباشرة، أهداف، انتقالات وتحليلات — منصة واحدة لكل عشاق الكرة.",
    images: ["/og-main-v2.jpg"],
  },

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

  category: "Sports",
};

/* =========================
   📱 Viewport
========================= */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

/* =========================
   🧱 Root Layout
========================= */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="ltr">
      <head>
        {/* =========================
           🔐 Google Consent Mode v2
        ========================= */}
        <Script id="google-consent" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            gtag('consent', 'default', {
              ad_storage: 'granted',
              analytics_storage: 'granted',
              functionality_storage: 'granted',
              personalization_storage: 'granted',
              security_storage: 'granted'
            });
          `}
        </Script>

        {/* =========================
           📊 Google Analytics (GA4)
        ========================= */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Y5X96FD8WJ"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Y5X96FD8WJ', {
              anonymize_ip: true,
              send_page_view: true
            });
          `}
        </Script>
      </head>

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
