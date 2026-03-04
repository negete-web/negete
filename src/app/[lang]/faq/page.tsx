import { type Language, languages } from "@/i18n/config";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import { FaqAccordion } from "../../components/FaqAccordion";
import { FaqPageJsonLd } from "../../components/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { t } from "@/i18n/dictionary";
import { getCachedFaqSection, getCachedSiteSettings } from "@/sanity/cache";
import type { FaqItem } from "@/sanity/faq";

const MOCK_FAQ: {
  questionPl: string;
  questionEn: string;
  answerPl: string;
  answerEn: string;
}[] = [
  {
    questionPl: "Jak mogę skontaktować się z NEGETE?",
    questionEn: "How can I contact NEGETE?",
    answerPl:
      "Napisz do nas maila lub zadzwoń. Dane kontaktowe znajdziesz w zakładce Kontakt. Odpowiadamy zwykle w ciągu 24 godzin.",
    answerEn:
      "Send us an email or call. You can find contact details on the Contact page. We usually reply within 24 hours.",
  },
  {
    questionPl: "Czy realizujecie projekty dla klientów zagranicznych?",
    questionEn: "Do you work with international clients?",
    answerPl:
      "Tak. Pracujemy z klientami z całej Europy. Komunikacja w języku angielskim jest standardem.",
    answerEn:
      "Yes. We work with clients across Europe. Communication in English is standard.",
  },
  {
    questionPl: "Ile trwa typowy projekt od koncepcji do prototypu?",
    questionEn:
      "How long does a typical project take from concept to prototype?",
    answerPl:
      "Zależy od złożoności: proste projekty elektroniczne 2–4 miesiące, pełny produkt z obudową i oprogramowaniem 4–8 miesięcy. Po wstępnej rozmowie przedstawimy harmonogram.",
    answerEn:
      "It depends on complexity: simple electronics 2–4 months, full product with enclosure and software 4–8 months. We will provide a timeline after an initial call.",
  },
  {
    questionPl: "Czy oferujecie wsparcie po wdrożeniu?",
    questionEn: "Do you offer support after deployment?",
    answerPl:
      "Tak. Oferujemy okres gwarancyjny, aktualizacje oprogramowania oraz wsparcie techniczne. Szczegóły ustalamy indywidualnie.",
    answerEn:
      "Yes. We offer warranty period, software updates and technical support. Details are agreed individually.",
  },
];

function getMockFaqItems(lang: Language): FaqItem[] {
  const isPl = lang === "pl";
  return MOCK_FAQ.map((item, id) => ({
    id,
    question: isPl ? item.questionPl : item.questionEn,
    answer: isPl ? item.answerPl : item.answerEn,
  }));
}

export const revalidate = 3600;

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) return {};
  const settings = await getCachedSiteSettings(lang as Language);
  const seo = settings?.faqPageSeo;
  return buildMetadata({
    title: t(lang as Language, "faq.title"),
    description:
      lang === "pl"
        ? "Najczęściej zadawane pytania o usługi i współpracę z NEGETE."
        : "Frequently asked questions about NEGETE services and collaboration.",
    siteName: settings?.siteName,
    lang,
    path: `/${lang}/faq`,
    seo,
    image: settings?.defaultOgImage,
  });
}

export default async function FaqPage({ params }: Props) {
  const { lang } = await params;
  if (!languages.includes(lang as Language)) notFound();

  const [faqData, settings] = await Promise.all([
    getCachedFaqSection(lang as Language),
    getCachedSiteSettings(lang as Language),
  ]);

  const items: FaqItem[] =
    faqData && faqData.items?.length
      ? faqData.items
      : getMockFaqItems(lang as Language);
  const heading = faqData?.heading ?? t(lang as Language, "faq.title");
  const subtitle = faqData?.subtitle;

  const faqItemsForSeo = items.map((i) => ({
    question: i.question,
    answer: i.answer,
  }));

  return (
    <main id="main-content" className="relative pt-16 min-h-screen">
      <FaqPageJsonLd items={faqItemsForSeo} lang={lang} url={`/${lang}/faq`} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="mb-6 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-white ">
            {heading}
          </h1>
          {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
        </div>
        {items.length > 0 ? (
          <FaqAccordion items={items} />
        ) : (
          <p className="text-gray-400">
            {t(lang as Language, "faq.noQuestions")}
          </p>
        )}
      </div>
      <Footer />
    </main>
  );
}
