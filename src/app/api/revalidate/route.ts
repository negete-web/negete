import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (SANITY_WEBHOOK_SECRET && secret !== SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const docType = body._type as string | undefined;

    // Rewaliduj konkretne ścieżki zależnie od typu dokumentu
    if (docType === "project") {
      revalidatePath("/[lang]/realizacje", "page");
      revalidatePath("/[lang]/realizacje/[slug]", "page");
      revalidatePath("/[lang]", "page");
    } else if (docType === "portfolioSection") {
      revalidatePath("/[lang]", "page");
      revalidatePath("/[lang]/realizacje", "page");
    } else if (docType === "projectCategory") {
      revalidatePath("/[lang]/realizacje", "page");
    } else {
      // Fallback — rewaliduj wszystko
      revalidatePath("/", "layout");
    }

    return NextResponse.json({ revalidated: true, type: docType ?? "unknown" });
  } catch {
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 },
    );
  }
}
