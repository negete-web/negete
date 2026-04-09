import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import "./globals.css";
import { defaultLanguage, languages, type Language } from "@/i18n/config";
import Aurora from "./components/Aurora";
import AppShell from "./components/AppShell";
import { OrganizationJsonLd, WebSiteJsonLd } from "./components/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "NeGeTe | Twój zewnętrzny dział R&D",
  description:
    "NeGeTe - projektowanie elektroniki, mechaniki i oprogramowania. Od pomysłu do produktu.",
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
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: -1 }}>
          <Aurora
            colorStops={["#182e60", "#405f92"]}
            blend={0.5}
            amplitude={0.5}
            speed={0.7}
          />
        </div>

        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
