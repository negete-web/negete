import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Contact from "../../components/Contact";
import Footer from "../../components/Footer";
import { getCachedContactSection, getCachedFooterData, getCachedSiteSettings } from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const [settings, contactData] = await Promise.all([
    getCachedSiteSettings(lang as Language),
    getCachedContactSection(lang as Language),
  ]);
  const seo = settings?.contactPageSeo;
  return buildMetadata({
    title: contactData?.heading ?? t(lang as Language, "kontakt.title"),
    description: contactData?.subtitle,
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/kontakt`,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const [contactData, footerData] = await Promise.all([
    getCachedContactSection(lang as Language),
    getCachedFooterData(lang as Language),
  ]);

  return (
    <main id="main-content" className="relative min-h-screen">
      <Contact
        lang={lang as Language}
        initialData={contactData}
        contactItems={footerData?.contactItems ?? undefined}
        headingLevel="h1"
      />
      <Footer />
    </main>
  );
}
