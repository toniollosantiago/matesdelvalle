import type { Metadata, Viewport } from "next";
import { Montserrat, Libre_Caslon_Text, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/layout/CookieBanner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const caslon = Libre_Caslon_Text({
  variable: "--font-caslon",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Mates del Valle — Embalse, Calamuchita, Córdoba",
    template: "%s | Mates del Valle",
  },
  description:
    "Mates artesanales, bombillas y combos de calidad a buen precio. Directo desde Embalse, Calamuchita, Córdoba.",
  keywords: ["mates artesanales", "bombillas", "mate calabaza", "Embalse", "Calamuchita", "Córdoba"],
  openGraph: {
    title: "Mates del Valle — Embalse, Córdoba",
    description: "Mates artesanales, bombillas y combos de calidad a buen precio.",
    type: "website",
    locale: "es_AR",
    siteName: "Mates del Valle",
  },
};

export const viewport: Viewport = {
  themeColor: "#6c7a52",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${caslon.variable} ${playfair.variable} ${cormorant.variable}`}
    >
      <body className="bg-background text-on-surface font-sans antialiased pt-16 flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex flex-col">{children}</div>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
