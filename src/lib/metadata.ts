import type { Metadata } from "next";
import { getBaseUrl } from "./site-url";
import { languages } from "@/i18n/config";

type SeoLike = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
};

type BuildMetadataParams = {
  title: string;
  description?: string;
  image?: string;
  siteName?: string;
  lang: string;
  path: string;
  canonical?: string;
  seo?: SeoLike | null;
  keywords?: string[];
};

const DEFAULT_KEYWORDS_PL = [
  "projektowanie elektroniki",
  "projektowanie PCB",
  "uslugi embedded",
  "programowanie mikrokontrolerow",
  "szybkie prototypowanie",
  "certyfikacja CE",
  "projektowanie CAD",
  "zewnetrzny dzial R&D",
  "Rzeszow",
];

const DEFAULT_KEYWORDS_EN = [
  "electronics design",
  "PCB design",
  "embedded services",
  "microcontroller programming",
  "rapid prototyping",
  "CE certification",
  "CAD design",
  "external R&D team",
  "Rzeszow",
];

function withFallbackDescription(description: string | undefined, lang: string): string {
  const text = (description || "").trim();
  if (text.length >= 110) return text;

  const suffix =
    lang === "pl"
      ? " Projektowanie elektroniki, PCB, embedded, CAD i wsparcie R&D od pomyslu do wdrozenia."
      : " Electronics, PCB, embedded, CAD and end-to-end R&D support from concept to production.";

  const joined = `${text}${suffix}`.trim();
  return joined.length > 160 ? joined.slice(0, 157).trimEnd() + "..." : joined;
}

/**
 * Buduje canonical URL i alternates (hreflang) dla strony.
 * path – pełna ścieżka np. "/", "/pl/faq", "/en/blog/post-slug"
 */
function buildAlternates(path: string, baseUrl: string) {
  const pathNorm = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${baseUrl}${pathNorm}`;
  const segments = pathNorm.split("/").filter(Boolean);
  const isLangFirst =
    segments.length > 0 && (segments[0] === "pl" || segments[0] === "en");
  const rest = isLangFirst ? segments.slice(1).join("/") : "";

  const languagesRecord: Record<string, string> = {};
  languagesRecord["pl"] = rest ? `${baseUrl}/pl/${rest}` : baseUrl + "/";
  languagesRecord["en"] = rest ? `${baseUrl}/en/${rest}` : baseUrl + "/en";

  return { canonical, languages: languagesRecord };
}

/**
 * Buduje obiekt Metadata dla Next.js z opcjonalnych danych SEO z Sanity.
 * Priorytet: seo.metaTitle > title, seo.metaDescription > description, seo.ogImage > image.
 * Zawiera canonical URL oraz hreflang dla i18n.
 */
export function buildMetadata({
  title,
  description,
  image,
  siteName = "NeGeTe",
  lang,
  path,
  canonical: canonicalOverride,
  seo,
  keywords = [],
}: BuildMetadataParams): Metadata {
  const baseUrl = getBaseUrl();
  const { canonical, languages: langUrls } = buildAlternates(path, baseUrl);
  const canonicalUrl = canonicalOverride || canonical;

  const metaTitle = seo?.metaTitle || title;
  const metaDescription = withFallbackDescription(
    seo?.metaDescription || description || undefined,
    lang,
  );
  const ogImage = seo?.ogImage || image;
  const defaultKeywords = lang === "pl" ? DEFAULT_KEYWORDS_PL : DEFAULT_KEYWORDS_EN;
  const metadataKeywords = Array.from(new Set([...defaultKeywords, ...keywords]));
  const fullTitle = metaTitle.includes(siteName)
    ? metaTitle
    : `${metaTitle} | ${siteName}`;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: metadataKeywords,
    alternates: {
      canonical: canonicalUrl,
      languages: langUrls,
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
      locale: lang === "pl" ? "pl_PL" : "en_US",
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
