import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { defaultLanguage, languages, type Language } from "@/i18n/config";
import AppShell from "./components/AppShell";
import AuroraBackground from "./components/AuroraBackground";
import { OrganizationJsonLd, WebSiteJsonLd } from "./components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NeGeTe | Twój zewnętrzny dział R&D",
  description:
    "NeGeTe - projektowanie elektroniki, mechaniki i oprogramowania. Od pomysłu do produktu.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/negete_logo.png", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/negete_logo.png" }],
  },
};

function getLangFromPathname(pathname: string): Language {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && languages.includes(segments[0] as Language)) {
    return segments[0] as Language;
  }
  return defaultLanguage;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const lang: Language = getLangFromPathname(pathname);

  return (
    <html lang={lang}>
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd lang={lang} />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('scrollRestoration'in history){history.scrollRestoration='manual'}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} antialiased`}>
        <AuroraBackground />

        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
