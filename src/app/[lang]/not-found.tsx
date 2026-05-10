import { headers } from "next/headers";
import { defaultLanguage, languages, type Language } from "@/i18n/config";
import Footer from "../components/Footer";
import NotFoundContent from "../components/NotFoundContent";

export default async function LocalizedNotFound() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const segments = pathname.split("/").filter(Boolean);
  const lang: Language =
    segments.length > 0 && languages.includes(segments[0] as Language)
      ? (segments[0] as Language)
      : defaultLanguage;

  return (
    <>
      <NotFoundContent lang={lang} />
      <Footer />
    </>
  );
}
