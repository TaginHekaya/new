import type { Metadata } from "next";

import "./globals.css";
import FooterGate from "@/components/FooterGate";
import AuthWrapper from "@/components/AuthWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

// 🌍 الموقع الرسمي — Metadata احترافية
export const metadata: Metadata = {
  metadataBase: new URL("https://mal3abak.com"),

  title: {
    default: "ملعبك — كل أخبار ومباريات كرة القدم في مكان واحد",
    template: "%s | ملعبك",
  },

  description: 
    // 🇦🇪 الوصف العربي أولاً
    "ملعبك — منصتك الشاملة لمتابعة أحدث أخبار كرة القدم، مواعيد المباريات، الأهداف، الملخصات، الإشعارات الفورية، ترتيب الدوريات، انتقالات اللاعبين، وتحليلات لحظة بلحظة… كل ذلك في مكان واحد بتجربة سريعة واحترافية." +
    " | " +
    // 🇬🇧 الوصف الإنجليزي ثانياً
    "Mal3abak — Your complete football platform for breaking news, live scores, match schedules, goals, highlights, instant alerts, league standings, transfers, and real-time updates — all in one powerful experience.",

  keywords: [
    // Arabic Keywords
    "ملعبك",
    "اخبار كرة القدم",
    "اهداف",
    "مواعيد المباريات",
    "بث مباشر",
    "ترتيب الدوري",
    "انتقالات اللاعبين",
    "تحليلات كرة قدم",
    "تشكيلات الفرق",
    "مباريات اليوم",
    "نتائج المباريات",
    "فانتازي",
    
    // English Keywords
    "football",
    "soccer",
    "live scores",
    "football news",
    "goals",
    "sports",
    "highlights",
    "fixtures",
    "match schedule",
    "transfers",
    "league table",
    "fantasy football",
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
      "تابع آخر أخبار كرة القدم، النتائج المباشرة، الأهداف، التحليلات، انتقالات اللاعبين، وتحديثات الدوريات العالمية لحظة بلحظة — مع تجربة سريعة وممتعة.",
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

  twitter: {
    card: "summary_large_image",
    site: "@mal3abak",
    creator: "@mal3abak",
    title: "ملعبك — كل كرة القدم بين يديك",
    description:
      "احصل على أحدث أخبار كرة القدم، النتائج الفورية، الأهداف، الإشعارات، والمحتوى المخصص لفرقك ولاعبيك المفضلين — في منصة واحدة.",
    images: ["/og-main.jpg"],
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

  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },

  category: "Sports",
};

// 📱 Mobile viewport
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
    <html lang="ar" dir="rtl">
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
