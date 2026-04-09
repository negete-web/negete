import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";
import type { Language } from "@/i18n/config";
import { urlFor } from "./image";

function getCategoryLabel(
  category?: { titlePl?: string; titleEn?: string },
  lang: Language = "pl",
): string | undefined {
  if (!category) return undefined;
  return (
    (lang === "en" ? category.titleEn : category.titlePl) || category.titlePl
  );
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  image: string;
  imageAlt?: string;
  /** true gdy wysokość > szerokość (zdjęcie pionowe) – do obrotu w gridzie */
  isPortrait?: boolean;
  gridSpan: string;
  description?: string;
  category?: string;
  categoryLabel?: string;
}

export interface PortfolioSection {
  _id: string;
  heading: string;
  description?: string;
  projects: Project[];
}

interface ProjectRaw {
  _id: string;
  titlePl?: string;
  titleEn?: string;
  slug?: {
    current?: string;
  };
  mainImage?: SanityImageSource & {
    altPl?: string;
    altEn?: string;
  };
  gridSpan?: string;
  descriptionPl?: string;
  descriptionEn?: string;
  category?: {
    titlePl?: string;
    titleEn?: string;
    slug?: { current?: string };
  };
  sections?: any[];
  gallery?: Array<
    SanityImageSource & {
      altPl?: string;
      altEn?: string;
    }
  >;
  publishedAt?: string;
  seo?: {
    metaTitlePl?: string;
    metaTitleEn?: string;
    metaDescriptionPl?: string;
    metaDescriptionEn?: string;
    ogImage?: SanityImageSource;
  };
}

interface PortfolioSectionRaw {
  _id: string;
  headingPl?: string;
  headingEn?: string;
  descriptionPl?: string;
  descriptionEn?: string;
  projects?: ProjectRaw[];
}

/**
 * Pobiera z Sanity dokument typu `portfolioSection` z tłumaczeniami.
 * Używane na stronie głównej – zwraca TYLKO projekty wybrane w sekcji Portfolio
 * (pole "Wybrane projekty"), NIE listę wszystkich realizacji.
 * @param lang - Język, w którym mają być zwrócone dane ('pl' lub 'en')
 */
export async function fetchPortfolioSection(
  lang: Language = "pl",
): Promise<PortfolioSection | null> {
  const query = `
    *[_type == "portfolioSection"] | order(_updatedAt desc)[0]{
      _id,
      headingPl,
      headingEn,
      descriptionPl,
      descriptionEn,
      "projects": projects[]->{
        _id,
        titlePl,
        titleEn,
        slug,
        mainImage{
          ...,
          altPl,
          altEn
        },
        gridSpan,
        descriptionPl,
        descriptionEn,
        category->{ titlePl, titleEn, slug }
      }[defined(_id) && !(_id in path("drafts.**"))]
    }
  `;

  const data = await sanityClient.fetch<PortfolioSectionRaw | null>(query);

  if (!data) {
    return null;
  }
  const headingKey = lang === "pl" ? "headingPl" : "headingEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";
  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const projectDescriptionKey =
    lang === "pl" ? "descriptionPl" : "descriptionEn";

  const altKey = lang === "pl" ? "altPl" : "altEn";

  const projects: Project[] =
    (data.projects ?? [])
      .filter((project): project is ProjectRaw => Boolean(project))
      .map((project) => {
      const categoryLabel = getCategoryLabel(project.category, lang);
      return {
        _id: project._id,
        title: project[titleKey] || project.titlePl || "",
        slug: project.slug?.current || "",
        image: project.mainImage
          ? urlFor(project.mainImage).width(800).url()
          : "",
        imageAlt: project.mainImage?.[altKey] || project.mainImage?.altPl || "",
        gridSpan: project.gridSpan || "md:col-span-1 md:row-span-1",
        description: project[projectDescriptionKey] || project.descriptionPl,
        category: project.category?.slug?.current,
        categoryLabel,
      };
    });

  return {
    _id: data._id,
    heading: data[headingKey] || "",
    description: data[descriptionKey] || undefined,
    projects,
  };
}

export interface ProjectSection {
  _type: string;
  [key: string]: any;
}

export interface ProjectSeo {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
}

export interface ProjectDetail extends Project {
  sections?: ProjectSection[];
  gallery?: { url: string; alt?: string }[];
  publishedAt?: string;
  seo?: ProjectSeo;
}

/**
 * Pobiera pojedynczy projekt po slug (dla podstrony projektu)
 * @param slug - Slug projektu
 * @param lang - Język, w którym mają być zwrócone dane ('pl' lub 'en')
 */
export async function fetchProjectBySlug(
  slug: string,
  lang: Language = "pl",
): Promise<ProjectDetail | null> {
  const query = `
    *[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
      _id,
      titlePl,
      titleEn,
      slug,
      mainImage{
        ...,
        altPl,
        altEn
      },
      gridSpan,
      descriptionPl,
      descriptionEn,
      category->{ titlePl, titleEn, slug },
      sections[]{
        _type,
        _type == "heroSection" => {
          titlePl,
          titleEn,
          subtitlePl,
          subtitleEn,
          backgroundImage{
            ...,
            altPl,
            altEn
          }
        },
        _type == "descriptionSection" => {
          contentPl,
          contentEn
        },
        _type == "gallerySection" => {
          titlePl,
          titleEn,
          descriptionPl,
          descriptionEn
        },
        _type == "specsSection" => {
          titlePl,
          titleEn,
          specs[]{
            labelPl,
            labelEn,
            valuePl,
            valueEn
          }
        },
        _type == "featuresSection" => {
          titlePl,
          titleEn,
          features[]{
            titlePl,
            titleEn,
            descriptionPl,
            descriptionEn,
            icon
          }
        },
        _type == "imageGridSection" => {
          titlePl,
          titleEn,
          items[]{
            image{
              ...,
              altPl,
              altEn
            },
            titlePl,
            titleEn,
            descriptionPl,
            descriptionEn
          }
        }
      },
      gallery[]{ ..., altPl, altEn },
      publishedAt,
      seo{ metaTitlePl, metaTitleEn, metaDescriptionPl, metaDescriptionEn, ogImage{ ... } }
    }
  `;

  const data = await sanityClient.fetch<ProjectRaw | null>(query, { slug });

  if (!data) {
    return null;
  }

  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";
  const altKey = lang === "pl" ? "altPl" : "altEn";

  const categoryLabel = getCategoryLabel(data.category, lang);

  const mappedSections = data.sections?.map((section: any) => {
    const mapped: any = { _type: section._type };

    if (section._type === "heroSection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.subtitle =
        section[lang === "pl" ? "subtitlePl" : "subtitleEn"] ||
        section.subtitlePl;
      if (section.backgroundImage) {
        mapped.backgroundImage = {
          url: urlFor(section.backgroundImage)
            .width(1920)
            .height(1080)
            .fit("clip")
            .url(),
          alt:
            section.backgroundImage[altKey] ||
            section.backgroundImage.altPl ||
            "",
        };
      }
    } else if (section._type === "descriptionSection") {
      mapped.content =
        section[lang === "pl" ? "contentPl" : "contentEn"] || section.contentPl;
    } else if (section._type === "gallerySection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.description =
        section[lang === "pl" ? "descriptionPl" : "descriptionEn"] ||
        section.descriptionPl;
    } else if (section._type === "specsSection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.specs = section.specs?.map((spec: any) => ({
        label: spec[lang === "pl" ? "labelPl" : "labelEn"] || spec.labelPl,
        value: spec[lang === "pl" ? "valuePl" : "valueEn"] || spec.valuePl,
      }));
    } else if (section._type === "featuresSection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.features = section.features?.map((feature: any) => ({
        title: feature[titleKey] || feature.titlePl,
        description:
          feature[lang === "pl" ? "descriptionPl" : "descriptionEn"] ||
          feature.descriptionPl,
        icon: feature.icon,
      }));
    } else if (section._type === "imageGridSection") {
      mapped.title = section[titleKey] || section.titlePl;
      mapped.items = section.items?.map((item: any) => ({
        image: item.image
          ? {
              url: urlFor(item.image).width(800).height(600).url(),
              alt: item.image[altKey] || item.image.altPl || "",
            }
          : null,
        title: item[titleKey] || item.titlePl,
        description:
          item[lang === "pl" ? "descriptionPl" : "descriptionEn"] ||
          item.descriptionPl,
      }));
    }

    return mapped;
  });

  const seoRaw = data.seo;
  const seo: ProjectSeo | undefined = seoRaw
    ? {
        metaTitle:
          (lang === "pl" ? seoRaw.metaTitlePl : seoRaw.metaTitleEn) ||
          seoRaw.metaTitlePl,
        metaDescription:
          (lang === "pl"
            ? seoRaw.metaDescriptionPl
            : seoRaw.metaDescriptionEn) || seoRaw.metaDescriptionPl,
        ogImage: seoRaw.ogImage
          ? urlFor(seoRaw.ogImage).width(1200).height(630).fit("clip").url()
          : undefined,
      }
    : undefined;

  const gallery = data.gallery?.map((img: any) => ({
    url: urlFor(img).width(1200).url(),
    alt: img[altKey] || img.altPl || "",
  }));

  return {
    _id: data._id,
    title: data[titleKey] || data.titlePl || "",
    slug: data.slug?.current || "",
    image: data.mainImage ? urlFor(data.mainImage).width(1200).url() : "",
    imageAlt: data.mainImage?.[altKey] || data.mainImage?.altPl || "",
    gridSpan: data.gridSpan || "md:col-span-1 md:row-span-1",
    description: data[descriptionKey] || data.descriptionPl,
    category: data.category?.slug?.current,
    categoryLabel,
    sections: mappedSections,
    gallery,
    publishedAt: data.publishedAt,
    seo,
  };
}

/**
 * Pobiera wszystkie projekty (dla przyszłej strony z listą wszystkich realizacji)
 * @param lang - Język, w którym mają być zwrócone dane ('pl' lub 'en')
 */
export async function fetchAllProjects(
  lang: Language = "pl",
): Promise<Project[]> {
  const query = `
    *[_type == "project" && !(_id in path("drafts.**"))] | order(publishedAt desc){
      _id,
      titlePl,
      titleEn,
      slug,
      mainImage{
        ...,
        altPl,
        altEn
      },
      gridSpan,
      descriptionPl,
      descriptionEn,
      category->{ titlePl, titleEn, slug },
      publishedAt
    }
  `;

  const data = await sanityClient.fetch<ProjectRaw[]>(query);

  const titleKey = lang === "pl" ? "titlePl" : "titleEn";
  const descriptionKey = lang === "pl" ? "descriptionPl" : "descriptionEn";
  const altKey = lang === "pl" ? "altPl" : "altEn";

  return data.map((project) => {
    const categoryLabel = getCategoryLabel(project.category, lang);
    return {
      _id: project._id,
      title: project[titleKey] || project.titlePl || "",
      slug: project.slug?.current || "",
      image: project.mainImage
        ? urlFor(project.mainImage).width(800).url()
        : "",
      imageAlt: project.mainImage?.[altKey] || project.mainImage?.altPl || "",
      gridSpan: project.gridSpan || "md:col-span-1 md:row-span-1",
      description: project[descriptionKey] || project.descriptionPl,
      category: project.category?.slug?.current,
      categoryLabel,
    };
  });
}
