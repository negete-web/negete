import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

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

    // Jeśli mamy konkretny slug projektu, inwaliduj też tag dla tego sluga
    if (slug && docType === "project") {
      revalidateTag(`project-${slug}`, "max");
    }
    if (slug && docType === "post") {
      revalidateTag(`post-${slug}`, "max");
    }

    tags.forEach((tag) => revalidateTag(tag, "max"));

    return NextResponse.json({ revalidated: true, type: docType ?? "unknown", tags });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
