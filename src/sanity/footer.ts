import { sanityClient } from "./client";
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
    const data = await sanityClient.fetch<any | null>(
      query,
      {},
      { useCdn: false },
    );
    if (!data) return null;

    const descKey =
      lang === "pl" ? "footerDescriptionPl" : "footerDescriptionEn";
    const description = data[descKey] || data.footerDescriptionPl || "";

    const textKey = lang === "pl" ? "textPl" : "textEn";
    const contactItems: FooterContactItem[] = (
      data.footerContactItems || []
    ).map((item: any) => ({
      icon: item.icon || "Mail",
      text: item[textKey] || item.textPl || "",
      url: item.url || "#",
    }));

    const socialLinks: FooterSocialItem[] = (data.footerSocialLinks || []).map(
      (item: any) => ({
        icon: item.icon || "Linkedin",
        url: item.url || "#",
      }),
    );

    return { description, contactItems, socialLinks };
  } catch (error) {
    console.error("Error fetching footer data:", error);
    return null;
  }
}
