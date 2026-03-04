import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cpu, Code, Box, Zap, Award, Factory } from "lucide-react";
import Footer from "../../components/Footer";

const SERVICE_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Cpu,
  Code,
  Box,
  Zap,
  Award,
  Factory,
};

function getIconComponent(iconKey: string | null | undefined) {
  if (!iconKey) return Cpu;
  const normalized = iconKey.charAt(0).toUpperCase() + iconKey.slice(1).toLowerCase();
  return SERVICE_ICONS[iconKey] ?? SERVICE_ICONS[normalized] ?? Cpu;
}
import {
  getCachedServicesSection,
  getCachedSiteSettings,
} from "@/sanity/cache";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";

const MOCK_SERVICES = [
  {
    iconKey: "Cpu",
    title: "Projektowanie Elektroniki & PCB",
    slug: "projektowanie-pcb",
    description:
      "Schematy ideowe, obwody wielowarstwowe, symulacje oraz projektowanie pod kątem kompatybilności elektromagnetycznej (EMC/EMI).",
  },
  {
    iconKey: "Code",
    title: "Firmware & Embedded",
    slug: "firmware",
    description:
      "Oprogramowanie wbudowane (C/C++), sterowniki mikrokontrolerów, systemy IoT oraz bezpieczna komunikacja bezprzewodowa.",
  },
  {
    iconKey: "Box",
    title: "Mechanika & Wzornictwo",
    slug: "mechanika",
    description:
      "Projekty obudów w CAD 3D, dobór materiałów, projektowanie form wtryskowych oraz pełna dokumentacja techniczna 2D/3D.",
  },
  {
    iconKey: "Zap",
    title: "Szybkie Prototypowanie",
    slug: "prototypowanie",
    description:
      "Weryfikacja koncepcji poprzez druk 3D, frezowanie CNC oraz montaż próbny układów elektronicznych (PCBA).",
  },
  {
    iconKey: "Award",
    title: "Certyfikacja i Testy",
    slug: "certyfikacja",
    description:
      "Przygotowanie produktu do oznaczenia znakiem CE, badania wstępne oraz tworzenie dokumentacji wymaganej prawem.",
  },
  {
    iconKey: "Factory",
    title: "Produkcja Seryjna",
    slug: "produkcja",
    description:
      "Organizacja łańcucha dostaw, nadzór nad produkcją elektroniki, kontrola jakości i skalowanie produkcji.",
  },
];

type Props = {
  params: Promise<{ lang: string }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const settings = await getCachedSiteSettings(lang as Language);
  return buildMetadata({
    title: t(lang as Language, "uslugi.title"),
    description: t(lang as Language, "uslugi.metaDescription"),
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/uslugi`,
    seo: settings?.servicesListPageSeo,
    image: settings?.defaultOgImage,
  });
}

export default async function UslugiPage({ params }: Props) {
  const { lang } = await params;
  const isSupported = languages.includes(lang as Language);

  if (!isSupported) {
    notFound();
  }

  const servicesData = await getCachedServicesSection(lang as Language);
  const services =
    servicesData?.services && servicesData.services.length > 0
      ? servicesData.services.map((s, i) => ({
          iconKey: s.iconKey || "Cpu",
          title: s.title,
          slug:
            s.slug ||
            MOCK_SERVICES[i]?.slug ||
            s.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          description: s.description,
        }))
      : MOCK_SERVICES;

  const heading =
    servicesData?.heading || t(lang as Language, "uslugi.defaultHeading");
  const intro =
    servicesData?.intro || t(lang as Language, "uslugi.defaultIntro");

  return (
    <main id="main-content" className="relative min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <Link
          href={lang === "pl" ? "/" : `/${lang}`}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-12 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          {t(lang as Language, "common.backToHome")}
        </Link>

        <header className="mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            {heading}
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">{intro}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, idx) => {
            const IconComponent = getIconComponent(service.iconKey);
            return (
              <Link
                key={idx}
                href={`/${lang}/uslugi/${service.slug}`}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-400/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20">
                    <IconComponent className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </main>
  );
}
