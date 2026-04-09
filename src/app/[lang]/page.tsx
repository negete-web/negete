import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import HeroAlt from "../components/HeroAlt";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import Process from "../components/Process";
import Stats from "../components/Stats";
import TrustedBy from "../components/TrustedBy";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import {
  getCachedServicesSection,
  getCachedPortfolioSection,
  getCachedHomepageProcess,
  getCachedTrustedBy,
  getCachedContactSection,
  getCachedFooterData,
  getCachedSiteSettings,
  getCachedStatsSection,
} from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";

/** ISR – cache 1h, szybsze ładowanie na Vercel */
export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const settings = await getCachedSiteSettings(lang as Language);
  const seo = settings?.homePageSeo;
  return buildMetadata({
    title: t(lang as Language, "home.title"),
    description: t(lang as Language, "home.description"),
    siteName: settings?.siteName,
    lang,
    path: `/${lang}`,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const [servicesData, portfolioData, processData, statsData, trustedByData, contactData, footerData] =
    await Promise.all([
      getCachedServicesSection(lang as Language),
      getCachedPortfolioSection(lang as Language),
      getCachedHomepageProcess(lang as Language),
      getCachedStatsSection(lang as Language),
      getCachedTrustedBy(lang as Language),
      getCachedContactSection(lang as Language),
      getCachedFooterData(lang as Language),
    ]);

  return (
    <main id="main-content" className="relative min-h-screen">
      <HeroAlt lang={lang as Language} />
      <Stats lang={lang as Language} initialData={statsData} />
      <Services lang={lang as Language} initialData={servicesData} />
      <Portfolio lang={lang as Language} initialData={portfolioData} />
      <Process lang={lang as Language} initialData={processData} />
      <TrustedBy lang={lang as Language} initialData={trustedByData} />
      <Contact
        lang={lang as Language}
        initialData={contactData}
        contactItems={footerData?.contactItems ?? undefined}
      />
      <Footer
        lang={lang as Language}
        initialFooterData={footerData}
        initialServicesData={servicesData}
      />
    </main>
  );
}
