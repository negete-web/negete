import { defineType, defineField, defineArrayMember } from "sanity";

export const processPage = defineType({
  name: "processPage",
  title: "Strona Procesu",
  type: "document",
  fieldsets: [
    {
      name: "heading",
      title: "Nagłówek strony",
      options: { columns: 2 },
    },
    {
      name: "seo",
      title: "SEO / Meta",
      options: { columns: 2 },
    },
  ],
  fields: [
    defineField({
      name: "introPl",
      title: "Wstęp / krótki opis (Polski)",
      type: "text",
      rows: 3,
      description: "Krótki opis wyświetlany w sekcji hero.",
    }),
    defineField({
      name: "introEn",
      title: "Wstęp / krótki opis (English)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "headingPl",
      title: "Nagłówek (Polski)",
      type: "string",
      fieldset: "heading",
    }),
    defineField({
      name: "headingEn",
      title: "Nagłówek (English)",
      type: "string",
      fieldset: "heading",
    }),
    defineField({
      name: "seo",
      title: "Meta tytuł / opis / OG obraz",
      type: "seoFields",
      fieldset: "seo",
      description: "SEO dla strony Proces. Puste = użycie nagłówka i wstępu.",
    }),
    defineField({
      name: "ctaTitlePl",
      title: "CTA — Tytuł (Polski)",
      type: "string",
      description: "Sekcja na końcu strony z linkiem do kontaktu",
      initialValue: "Gotowy na start?",
    }),
    defineField({
      name: "ctaTitleEn",
      title: "CTA — Tytuł (English)",
      type: "string",
      initialValue: "Ready to start?",
    }),
    defineField({
      name: "ctaDescriptionPl",
      title: "CTA — Opis (Polski)",
      type: "text",
      rows: 2,
      initialValue:
        "Każdy wielki projekt zaczyna się od pierwszego kroku. Porozmawiajmy o Twoich celach.",
    }),
    defineField({
      name: "ctaDescriptionEn",
      title: "CTA — Opis (English)",
      type: "text",
      rows: 2,
      initialValue:
        "Every great project starts with the first step. Let's talk about your goals.",
    }),
    defineField({
      name: "ctaButtonTextPl",
      title: "CTA — Przycisk (Polski)",
      type: "string",
      initialValue: "Skontaktuj się",
    }),
    defineField({
      name: "ctaButtonTextEn",
      title: "CTA — Przycisk (English)",
      type: "string",
      initialValue: "Contact us",
    }),
    defineField({
      name: "sections",
      title: "Sekcje procesu",
      type: "array",
      of: [
        defineArrayMember({
          name: "processSection",
          title: "Sekcja",
          type: "object",
          fields: [
            defineField({
              name: "image",
              title: "Zdjęcie",
              type: "image",
              options: { hotspot: true },
              fields: [
                {
                  name: "altPl",
                  title: "Tekst alternatywny (Polski)",
                  type: "string",
                },
                {
                  name: "altEn",
                  title: "Tekst alternatywny (English)",
                  type: "string",
                },
                {
                  name: "withBorder",
                  title: "Z borderem",
                  type: "boolean",
                  description: "Pokazuje obramowanie wokół zdjęcia",
                  initialValue: true,
                },
              ],
            }),
            defineField({
              name: "iconKey",
              title: "Ikona (alternatywa dla zdjęcia)",
              type: "string",
              description:
                "Nazwa ikony z lucide-react, np. 'Search', 'Layers'. Używana jeśli nie ma zdjęcia.",
            }),
            defineField({
              name: "titlePl",
              title: "Tytuł (Polski)",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "Tytuł (English)",
              type: "string",
            }),
            defineField({
              name: "descriptionPl",
              title: "Opis (Polski)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "descriptionEn",
              title: "Opis (English)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "color",
              title: "Kolor",
              type: "string",
              description: "Kolor w formacie hex, np. #00f0ff",
              initialValue: "#00f0ff",
            }),
            defineField({
              name: "secondDescriptionPl",
              title: "Drugi opis (Polski)",
              type: "text",
              rows: 3,
              description: "Wyświetlany pod listą szczegółów",
            }),
            defineField({
              name: "secondDescriptionEn",
              title: "Drugi opis (English)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "details",
              title: "Lista szczegółów",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "textPl",
                      title: "Tekst (Polski)",
                      type: "string",
                    }),
                    defineField({
                      name: "textEn",
                      title: "Tekst (English)",
                      type: "string",
                    }),
                  ],
                  preview: {
                    select: {
                      title: "textPl",
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "titlePl",
              media: "image",
            },
          },
        }),
      ],
    }),
  ],
});
