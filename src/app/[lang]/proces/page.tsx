import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import ProcessPage from "../../components/ProcessPage";
import Footer from "../../components/Footer";
import { getCachedProcessPage, getCachedSiteSettings } from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const [settings, processData] = await Promise.all([
    getCachedSiteSettings(lang as Language),
    getCachedProcessPage(lang as Language),
  ]);
  const seo = processData?.seo ?? settings?.processPageSeo;
  return buildMetadata({
    title: processData?.heading ?? t(lang as Language, "proces.title"),
    description: processData?.intro,
    image: settings?.defaultOgImage,
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/proces`,
    seo,
  });
}

export default async function ProcessPageRoute({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const processData = await getCachedProcessPage(lang as Language);

  return (
    <main id="main-content" className="relative min-h-screen w-full">
      <ProcessPage lang={lang as Language} initialData={processData} />
      <Footer />
    </main>
  );
}
