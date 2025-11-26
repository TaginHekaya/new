import type { Metadata } from "next";

import "./globals.css";
import FooterGate from "@/components/FooterGate";
import AuthWrapper from "@/components/AuthWrapper";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Mal'abak - Your Football Stadium",
  description: "All football news and matches in one place",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased dark`}>

        <ThemeProvider>
          <AuthProvider>
            <AuthWrapper>

              {/* --- كل صفحات الموقع هنا --- */}
              {children}

              {/* FOOTER */}
              <FooterGate />

              {/* ✅ GLOBAL FLOATING LIVE BUTTON (ثابت في كل الصفحات) */}
              <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999999] pointer-events-auto">
                <a
                  href="/matches"
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700
                            text-white px-3 py-1.5 rounded-full text-[12px] font-semibold
                            shadow-lg backdrop-blur-xl border border-red-300/30
                            transition-all duration-200"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  LIVE
                </a>
              </div>

            </AuthWrapper>
          </AuthProvider>
        </ThemeProvider>

      </body>
    </html>
  );
}
