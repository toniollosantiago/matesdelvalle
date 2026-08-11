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
    absolute: "Mates del Valle",
    default: "Mates del Valle",
    template: "%s | Mates del Valle",
  },
  description:
    "Mates artesanales, bombillas y combos de calidad a buen precio. Directo desde Embalse, Calamuchita, Córdoba.",
  keywords: ["mates artesanales", "bombillas", "mate calabaza", "Embalse", "Calamuchita", "Córdoba"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/icon.svg",
    apple: "/logo.jpg",
  },
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
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </head>
      <body className="bg-background text-on-surface font-sans antialiased pt-16 flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex flex-col">{children}</div>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
