import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { languages } from "@/i18n/config";

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

// Mapowanie typów dokumentów Sanity na tagi cache
const TYPE_TO_TAGS: Record<string, string[]> = {
  project: ["project"],
  projectCategory: ["project"],
  portfolioSection: ["portfolioSection", "project"],
  servicesSection: ["servicesSection"],
  service: ["servicesSection"],
  processPage: ["processPage"],
  homepageProcess: ["homepageProcess"],
  trustedBy: ["trustedBy"],
  faqSection: ["faqSection"],
  serviceCta: ["serviceCta"],
  siteSettings: ["siteSettings"],
  statsSection: ["statsSection"],
  contact: ["contact"],
  post: ["post"],
};

const TYPE_TO_PATH_PREFIX: Record<string, string> = {
  project: "/realizacje",
  post: "/blog",
};

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (SANITY_WEBHOOK_SECRET && secret !== SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const docType = body._type as string | undefined;
    const slug = body.slug?.current as string | undefined;

    const tags = docType ? (TYPE_TO_TAGS[docType] ?? ["project", "portfolioSection", "servicesSection", "siteSettings"]) : Object.values(TYPE_TO_TAGS).flat();

    // Slug-specific tag (czyści też zapisane null-e w unstable_cache)
    if (slug && docType === "project") {
      revalidateTag(`project-${slug}`, "max");
    }
    if (slug && docType === "post") {
      revalidateTag(`post-${slug}`, "max");
    }

    tags.forEach((tag) => revalidateTag(tag, "max"));

    // Czyścimy też full route cache dla podstrony i listingu we wszystkich językach.
    // To eliminuje przypadek, w którym Next zapamiętał wcześniej wyrenderowany 404.
    const pathPrefix = docType ? TYPE_TO_PATH_PREFIX[docType] : undefined;
    if (pathPrefix) {
      for (const lang of languages) {
        revalidatePath(`/${lang}${pathPrefix}`);
        if (slug) revalidatePath(`/${lang}${pathPrefix}/${slug}`);
      }
    }
    // Strona główna pokazuje wybrane projekty / posty — odśwież ją również.
    for (const lang of languages) {
      revalidatePath(`/${lang}`);
    }

    return NextResponse.json({ revalidated: true, type: docType ?? "unknown", tags });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
