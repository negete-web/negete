import { sanityClient } from "./client";
import { type Language } from "@/i18n/config";
import { urlFor } from "./image";

export interface Company {
  name: string;
  logo?: {
    url: string;
    alt: string;
  };
  projectSlug?: string;
  url?: string;
}

export interface TrustedBySection {
  heading: string;
  subtitle?: string;
  companies: Company[];
}

/**
 * Pobiera dane sekcji "Zaufali nam"
 */
export async function fetchTrustedBy(
  lang: Language = "pl"
): Promise<TrustedBySection | null> {
  const query = `
    *[_type == "trustedBy"][0]{
      headingPl,
      headingEn,
      subtitlePl,
      subtitleEn,
      companies[]{
        name,
        logo{
          ...,
          altPl,
          altEn
        },
        project->{
          slug
        },
        url
      }
    }
  `;

  const data = await sanityClient.fetch<any>(query);

  if (!data) {
    return null;
  }

  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const subtitleKey = lang === "pl" ? "subtitlePl" : "subtitleEn";
  const altKey = lang === "pl" ? "altPl" : "altEn";

  const companies: Company[] =
    data.companies?.map((company: any) => ({
      name: company.name || "",
      logo: company.logo
        ? {
            url: urlFor(company.logo).width(260).height(80).url(),
            alt: company.logo[altKey] || company.logo.altPl || company.name || "",
          }
        : undefined,
      projectSlug: company.project?.slug?.current,
      url: company.url,
    })) || [];

  return {
    heading: data[headingKey] || "",
    subtitle: data[subtitleKey] || undefined,
    companies,
  };
}
