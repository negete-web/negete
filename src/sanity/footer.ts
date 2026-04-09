import { sanityClient } from "./client";
import { localized } from "./i18n";
import type { Language } from "@/i18n/config";

export interface FooterContactItem {
  icon: "Mail" | "Phone" | "MapPin";
  text: string;
  url: string;
}

export interface FooterSocialItem {
  icon: string;
  url: string;
}

export interface FooterData {
  description: string;
  contactItems: FooterContactItem[];
  socialLinks: FooterSocialItem[];
}

export async function fetchFooterData(
  lang: Language = "pl",
): Promise<FooterData | null> {
  try {
    const query = `
      *[_type == "siteSettings" && _id == "siteSettings"][0]{
        footerDescriptionPl,
        footerDescriptionEn,
        footerContactItems[]{
          icon,
          textPl,
          textEn,
          url
        },
        footerSocialLinks[]{
          icon,
          url
        }
      }
    `;
    const data = await sanityClient.fetch<Record<string, unknown> | null>(
      query,
      {},
      { useCdn: false },
    );
    if (!data) return null;

    const description = localized(data, "footerDescription", lang);

    const contactItems: FooterContactItem[] = (
      (data.footerContactItems as Record<string, unknown>[]) || []
    ).map((item) => ({
      icon: (item.icon as FooterContactItem["icon"]) || "Mail",
      text: localized(item, "text", lang),
      url: (item.url as string) || "#",
    }));

    const socialLinks: FooterSocialItem[] = (
      (data.footerSocialLinks as Record<string, unknown>[]) || []
    ).map((item) => ({
      icon: (item.icon as string) || "Linkedin",
      url: (item.url as string) || "#",
    }));

    return { description, contactItems, socialLinks };
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
}
