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
      <body className="antialiased dark">

        {/* Floating LIVE Button - Mobile Only */}
        <div className="md:hidden fixed top-6 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
          <a
            href="/matches"
            className="flex items-center gap-1 bg-gradient-to-r from-red-600 to-red-700
                     hover:from-red-700 hover:to-red-800
                     text-white px-2.5 py-1 rounded-full text-[10px] font-bold
                     shadow-[0_0_20px_rgba(220,38,38,0.4)]
                     backdrop-blur-xl border border-red-400/40
                     transition-all duration-300 pointer-events-auto
                     hover:scale-105 hover:shadow-[0_0_25px_rgba(220,38,38,0.6)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-sm"></span>
            </span>
            <span className="tracking-wider">LIVE</span>
          </a>
        </div>

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
