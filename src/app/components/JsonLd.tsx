import { getBaseUrl } from "@/lib/site-url";

type JsonLdProps = {
  data: object;
};

/** Wstrzykuje JSON-LD do <head> */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  const baseUrl = getBaseUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NeGeTe",
    url: baseUrl,
    logo: `${baseUrl}/negete_logo.png`,
    foundingDate: "2024",
  };
  return <JsonLd data={data} />;
}

export function WebSiteJsonLd({ lang }: { lang: string }) {
  const baseUrl = getBaseUrl();
  const langBase = lang === "pl" ? baseUrl : `${baseUrl}/en`;
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "NeGeTe",
    alternateName: "negete.pl",
    url: langBase,
    inLanguage: lang === "pl" ? "pl-PL" : "en-US",
    publisher: {
      "@type": "Organization",
      name: "NeGeTe",
    },
  };
  return <JsonLd data={data} />;
}

export function ArticleJsonLd({
  title,
  description,
  image,
  publishedAt,
  modifiedAt,
  url,
  lang,
}: {
  title: string;
  description?: string;
  image?: string;
  publishedAt: string;
  modifiedAt?: string;
  url: string;
  lang: string;
}) {
  const baseUrl = getBaseUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description || title,
    ...(image && { image: image.startsWith("http") ? image : `${baseUrl}${image}` }),
    datePublished: publishedAt,
    ...(modifiedAt && { dateModified: modifiedAt }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url.startsWith("http") ? url : `${baseUrl}${url}`,
    },
    inLanguage: lang === "pl" ? "pl-PL" : "en-US",
    publisher: {
      "@type": "Organization",
      name: "NeGeTe",
    },
  };
  return <JsonLd data={data} />;
}

export function FaqPageJsonLd({
  items,
  lang,
  url,
}: {
  items: { question: string; answer: string }[];
  lang: string;
  url?: string;
}) {
  const baseUrl = getBaseUrl();
  const pageUrl = url ?? `${baseUrl}/${lang}/faq`;
  const mainEntity = items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
    inLanguage: lang === "pl" ? "pl-PL" : "en-US",
    url: pageUrl.startsWith("http") ? pageUrl : `${baseUrl}${pageUrl.startsWith("/") ? "" : "/"}${pageUrl}`,
  };
  return <JsonLd data={data} />;
}

/** SEO: schema.org Service – dla pojedynczej podstrony usługi */
export function ServiceJsonLd({
  name,
  description,
  url,
  lang,
}: {
  name: string;
  description: string;
  url: string;
  lang: string;
}) {
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url.startsWith("/") ? url : `/${url}`}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: fullUrl,
    inLanguage: lang === "pl" ? "pl-PL" : "en-US",
    provider: {
      "@type": "Organization",
      name: "NeGeTe",
    },
  };
  return <JsonLd data={data} />;
}
