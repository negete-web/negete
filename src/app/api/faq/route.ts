import { getCachedFaqSection } from "@/sanity/cache";
import type { Language } from "@/i18n/config";

const MOCK_QUESTIONS: { questionPl: string; questionEn: string }[] = [
  { questionPl: "Jak mogę skontaktować się z NEGETE?", questionEn: "How can I contact NEGETE?" },
  { questionPl: "Czy realizujecie projekty dla klientów zagranicznych?", questionEn: "Do you work with international clients?" },
  { questionPl: "Ile trwa typowy projekt od koncepcji do prototypu?", questionEn: "How long does a typical project take from concept to prototype?" },
  { questionPl: "Czy oferujecie wsparcie po wdrożeniu?", questionEn: "Do you offer support after deployment?" },
];

const MAX_FAQ_IN_FOOTER = 5;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = (searchParams.get("lang") || "pl") as Language;
  const faq = await getCachedFaqSection(lang);
  const items =
    faq?.items?.length > 0
      ? faq.items.slice(0, MAX_FAQ_IN_FOOTER).map((item) => ({ id: item.id, question: item.question }))
      : MOCK_QUESTIONS.slice(0, MAX_FAQ_IN_FOOTER).map((item, id) => ({
          id,
          question: lang === "pl" ? item.questionPl : item.questionEn,
        }));
  return Response.json({ items });
}
