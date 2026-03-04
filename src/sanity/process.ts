import { sanityClient } from "./client";
import { type Language } from "@/i18n/config";
import { urlFor } from "./image";

export interface ProcessGroup {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  details: string[];
}

export interface HomepageProcess {
  heading: string;
  subtitle: string;
  groups: ProcessGroup[];
}

export interface ProcessSection {
  id: number;
  title: string;
  description: string;
  secondDescription?: string;
  image?: {
    url: string;
    alt: string;
    withBorder?: boolean;
  };
  icon?: string;
  color: string;
  details: string[];
}

export interface ProcessPageCta {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

export interface ProcessPageSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface ProcessPageData {
  heading: string;
  intro?: string;
  sections: ProcessSection[];
  cta: ProcessPageCta;
  seo?: ProcessPageSeo;
}

/**
 * Pobiera dane procesu na stronie głównej
 */
export async function fetchHomepageProcess(
  lang: Language = "pl"
): Promise<HomepageProcess | null> {
  const query = `
    *[_type == "homepageProcess"][0]{
      headingPl,
      headingEn,
      subtitlePl,
      subtitleEn,
      groups[]{
        iconKey,
        namePl,
        nameEn,
        shortNamePl,
        shortNameEn,
        descriptionPl,
        descriptionEn,
        color,
        details[]{
          textPl,
          textEn
        }
      }
    }
  `;

  const data = await sanityClient.fetch<any>(query);

  if (!data) {
    return null;
  }

  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const subtitleKey = lang === "pl" ? "subtitlePl" : "subtitleEn";
  const nameKey = lang === "pl" ? "namePl" : "nameEn";
  const shortNameKey = lang === "pl" ? "shortNamePl" : "shortNameEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";
  const textKey = lang === "pl" ? "textPl" : "textEn";

  const groups: ProcessGroup[] =
    data.groups?.map((group: any, index: number) => ({
      id: index,
      title: group[nameKey] || group.namePl || "",
      shortTitle: group[shortNameKey] || group.shortNamePl || group[nameKey] || group.namePl || "",
      description: group[descriptionKey] || group.descriptionPl || "",
      icon: group.iconKey || "",
      color: group.color || "#00f0ff",
      details: group.details?.map((detail: any) => detail[textKey] || detail.textPl || "") || [],
    })) || [];

  return {
    heading: data[headingKey] || data.headingPl || "",
    subtitle: data[subtitleKey] || data.subtitlePl || "",
    groups,
  };
}

/**
 * Pobiera dane strony procesu
 */
export async function fetchProcessPage(
  lang: Language = "pl"
): Promise<ProcessPageData | null> {
  const query = `
    *[_type == "processPage"][0]{
      introPl,
      introEn,
      headingPl,
      headingEn,
      seo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } },
      ctaTitlePl,
      ctaTitleEn,
      ctaDescriptionPl,
      ctaDescriptionEn,
      ctaButtonTextPl,
      ctaButtonTextEn,
      sections[]{
        image{
          ...,
          altPl,
          altEn,
          withBorder
        },
        iconKey,
        titlePl,
        titleEn,
        descriptionPl,
        descriptionEn,
        secondDescriptionPl,
        secondDescriptionEn,
        color,
        details[]{
          textPl,
          textEn
        }
      }
    }
  `;

  const data = await sanityClient.fetch<any>(query);

  if (!data) {
    return null;
  }

  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";
  const altKey = lang === "pl" ? "altPl" : "altEn";
  const textKey = lang === "pl" ? "textPl" : "textEn";

  const secondDescriptionKey = lang === "pl" ? "secondDescriptionPl" : "secondDescriptionEn";

  const sections: ProcessSection[] =
    data.sections?.map((section: any, index: number) => ({
      id: index,
      title: section[titleKey] || section.titlePl || "",
      description: section[descriptionKey] || section.descriptionPl || "",
      secondDescription: section[secondDescriptionKey] || section.secondDescriptionPl || undefined,
      image: section.image
        ? {
            url: urlFor(section.image).width(1200).url(),
            alt: section.image[altKey] || section.image.altPl || "",
            withBorder: section.image.withBorder === true,
          }
        : undefined,
      icon: section.iconKey,
      color: section.color || "#00f0ff",
      details: section.details?.map((detail: any) => detail[textKey] || detail.textPl || "") || [],
    })) || [];

  const introKey = lang === "pl" ? "introPl" : "introEn";
  const ctaTitleKey = lang === "pl" ? "ctaTitlePl" : "ctaTitleEn";
  const ctaDescKey = lang === "pl" ? "ctaDescriptionPl" : "ctaDescriptionEn";
  const ctaBtnKey = lang === "pl" ? "ctaButtonTextPl" : "ctaButtonTextEn";

  const cta: ProcessPageCta = {
    title: data[ctaTitleKey] || data.ctaTitlePl || "Gotowy na start?",
    description:
      data[ctaDescKey] ||
      data.ctaDescriptionPl ||
      "Każdy wielki projekt zaczyna się od pierwszego kroku. Porozmawiajmy o Twoich celach.",
    buttonText: data[ctaBtnKey] || data.ctaButtonTextPl || "Skontaktuj się",
    link: `/${lang}/kontakt`,
  };

  const seoRaw = data.seo;
  const seo: ProcessPageSeo | undefined = seoRaw
    ? {
        metaTitle:
          (lang === "pl" ? seoRaw.metaTitlePl : seoRaw.metaTitleEn) ||
          seoRaw.metaTitlePl,
        metaDescription:
          (lang === "pl" ? seoRaw.metaDescriptionPl : seoRaw.metaDescriptionEn) ||
          seoRaw.metaDescriptionPl,
        ogImage: seoRaw.ogImage
          ? urlFor(seoRaw.ogImage).width(1200).height(630).fit("clip").url()
          : undefined,
      }
    : undefined;

  return {
    heading: data[headingKey] || data.headingPl || "",
    intro: data[introKey] || data.introPl || "",
    sections,
    cta,
    seo,
  };
}
