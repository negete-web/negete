import type { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/client";
import { languages } from "@/i18n/config";
import { getBaseUrl } from "@/lib/site-url";

const baseUrl = getBaseUrl();

const staticPaths = [
  "",
  "kontakt",
  "proces",
  "uslugi",
  "blog",
  "realizacje",
  "faq",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  entries.push({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  });
  for (const lang of languages) {
    const prefix = `/${lang}`;
    for (const path of staticPaths) {
      const url = path ? `${baseUrl}${prefix}/${path}` : `${baseUrl}${prefix}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.9,
      });
    }
  }
  let blogSlugs: { slug: string }[] = [];
  try {
    blogSlugs = await sanityClient.fetch<{ slug: string }[]>(
      `*[_type == "blogPost" && (!defined(publishedAt) || publishedAt <= now())]{ "slug": slug.current }`,
    );
  } catch {
    blogSlugs = [];
  }
  for (const lang of languages) {
    for (const post of blogSlugs ?? []) {
      if (post.slug) {
        entries.push({
          url: `${baseUrl}/${lang}/blog/${post.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }
  let servicesDoc: { services?: { slug?: { current?: string } }[] } | null = null;
  try {
    servicesDoc = await sanityClient.fetch<{
      services?: { slug?: { current?: string } }[];
    } | null>(`*[_type == "servicesSection"][0]{ services[] { slug { current } } }`);
  } catch {
    servicesDoc = null;
  }
  const serviceSlugs = servicesDoc?.services ?? [];
  for (const lang of languages) {
    for (const s of serviceSlugs) {
      const slug = s.slug?.current;
      if (slug) {
        entries.push({
          url: `${baseUrl}/${lang}/uslugi/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  let projectSlugs: { slug: string }[] = [];
  try {
    projectSlugs = await sanityClient.fetch<{ slug: string }[]>(
      `*[_type == "project" && !(_id in path("drafts.**"))]{ "slug": slug.current }`,
    );
  } catch {
    projectSlugs = [];
  }
  for (const lang of languages) {
    for (const project of projectSlugs ?? []) {
      if (project.slug) {
        entries.push({
          url: `${baseUrl}/${lang}/realizacje/${project.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.8,
        });
      }
    }
  }

  return entries;
}
