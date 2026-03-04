import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Realizacja / Projekt",
  type: "document",
  fieldsets: [
    {
      name: "title",
      title: "Tytuł",
      options: { columns: 2 },
    },
    {
      name: "description",
      title: "Krótki opis",
      options: { columns: 2 },
    },
    {
      name: "content",
      title: "Pełna treść projektu",
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
      name: "titlePl",
      title: "Tytuł (Polski)",
      type: "string",
      fieldset: "title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Tytuł (English)",
      type: "string",
      fieldset: "title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      description:
        "Używany do tworzenia URL podstrony projektu (np. smart-iot-device)",
      options: {
        source: "titlePl",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Główne zdjęcie",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "altPl",
          title: "Tekst alternatywny (Polski)",
          type: "string",
          description: "Opis obrazu dla czytników ekranu i SEO (opcjonalnie)",
        }),
        defineField({
          name: "altEn",
          title: "Tekst alternatywny (English)",
          type: "string",
          description: "Opis obrazu dla czytników ekranu i SEO (opcjonalnie)",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Kategoria",
      type: "reference",
      to: [{ type: "projectCategory" }],
      description: "Wybierz kategorię z listy. Kategoriami zarządzasz w sekcji 'Kategorie realizacji'.",
    }),
    defineField({
      name: "gridSpan",
      title: "Rozmiar w siatce portfolio",
      type: "string",
      description:
        "Jak duży ma być element w siatce portfolio na stronie głównej",
      options: {
        list: [
          { title: "Mały (1x1)", value: "md:col-span-1 md:row-span-1" },
          { title: "Szeroki (2x1)", value: "md:col-span-2 md:row-span-1" },
          { title: "Wysoki (1x2)", value: "md:col-span-1 md:row-span-2" },
          { title: "Duży (2x2)", value: "md:col-span-2 md:row-span-2" },
        ],
      },
      initialValue: "md:col-span-1 md:row-span-1",
    }),
    defineField({
      name: "descriptionPl",
      title: "Krótki opis (Polski)",
      type: "text",
      rows: 3,
      fieldset: "description",
    }),
    defineField({
      name: "descriptionEn",
      title: "Krótki opis (English)",
      type: "text",
      rows: 3,
      fieldset: "description",
    }),
    defineField({
      name: "seo",
      title: "Meta tytuł / opis / OG obraz",
      type: "seoFields",
      fieldset: "seo",
      description:
        "Opcjonalne nadpisanie SEO. Puste = użycie tytułu i opisu projektu.",
    }),
    defineField({
      name: "sections",
      title: "Sekcje projektu",
      type: "array",
      description:
        "Dodaj sekcje, które mają być wyświetlone na stronie projektu (wszystko opcjonalne)",
      of: [
        {
          type: "object",
          name: "heroSection",
          title: "Sekcja Hero",
          fields: [
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
              name: "subtitlePl",
              title: "Podtytuł (Polski)",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "subtitleEn",
              title: "Podtytuł (English)",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "backgroundImage",
              title: "Zdjęcie tła",
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
              ],
            }),
          ],
          preview: {
            select: {
              title: "titlePl",
            },
          },
        },
        {
          type: "object",
          name: "descriptionSection",
          title: "Sekcja Opisu",
          fields: [
            defineField({
              name: "contentPl",
              title: "Treść (Polski)",
              type: "text",
              rows: 6,
            }),
            defineField({
              name: "contentEn",
              title: "Treść (English)",
              type: "text",
              rows: 6,
            }),
          ],
          preview: {
            select: {
              title: "contentPl",
            },
          },
        },
        {
          type: "object",
          name: "gallerySection",
          title: "Sekcja Galerii",
          description:
            "Blok pozycjonujący – wybierz miejsce na stronie, gdzie ma się pojawić galeria. Zdjęcia pochodzą z głównej „Galeria zdjęć” u góry formularza.",
          fields: [
            defineField({
              name: "titlePl",
              title: "Tytuł sekcji (Polski)",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "Tytuł sekcji (English)",
              type: "string",
            }),
            defineField({
              name: "descriptionPl",
              title: "Opis (Polski)",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "descriptionEn",
              title: "Opis (English)",
              type: "text",
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: "titlePl",
            },
          },
        },
        {
          type: "object",
          name: "specsSection",
          title: "Sekcja Specyfikacji Technicznej",
          fields: [
            defineField({
              name: "titlePl",
              title: "Tytuł sekcji (Polski)",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "Tytuł sekcji (English)",
              type: "string",
            }),
            defineField({
              name: "specs",
              title: "Specyfikacje",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "labelPl",
                      title: "Etykieta (Polski)",
                      type: "string",
                    },
                    {
                      name: "labelEn",
                      title: "Etykieta (English)",
                      type: "string",
                    },
                    {
                      name: "valuePl",
                      title: "Wartość (Polski)",
                      type: "string",
                    },
                    {
                      name: "valueEn",
                      title: "Wartość (English)",
                      type: "string",
                    },
                  ],
                  preview: {
                    select: {
                      title: "labelPl",
                      subtitle: "valuePl",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "titlePl",
            },
          },
        },
        {
          type: "object",
          name: "featuresSection",
          title: "Sekcja Funkcji/Feature",
          fields: [
            defineField({
              name: "titlePl",
              title: "Tytuł sekcji (Polski)",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "Tytuł sekcji (English)",
              type: "string",
            }),
            defineField({
              name: "features",
              title: "Funkcje",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "titlePl",
                      title: "Tytuł (Polski)",
                      type: "string",
                    },
                    {
                      name: "titleEn",
                      title: "Tytuł (English)",
                      type: "string",
                    },
                    {
                      name: "descriptionPl",
                      title: "Opis (Polski)",
                      type: "text",
                      rows: 3,
                    },
                    {
                      name: "descriptionEn",
                      title: "Opis (English)",
                      type: "text",
                      rows: 3,
                    },
                    {
                      name: "icon",
                      title: "Ikona (opcjonalnie)",
                      type: "string",
                      description: "Nazwa ikony z lucide-react",
                    },
                  ],
                  preview: {
                    select: {
                      title: "titlePl",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "titlePl",
            },
          },
        },
        {
          type: "object",
          name: "imageGridSection",
          title: "Sekcja z Obrazami",
          fields: [
            defineField({
              name: "titlePl",
              title: "Tytuł sekcji (Polski)",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "Tytuł sekcji (English)",
              type: "string",
            }),
            defineField({
              name: "items",
              title: "Elementy",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
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
                      ],
                    },
                    {
                      name: "titlePl",
                      title: "Tytuł (Polski)",
                      type: "string",
                    },
                    {
                      name: "titleEn",
                      title: "Tytuł (English)",
                      type: "string",
                    },
                    {
                      name: "descriptionPl",
                      title: "Opis (Polski)",
                      type: "text",
                      rows: 3,
                    },
                    {
                      name: "descriptionEn",
                      title: "Opis (English)",
                      type: "text",
                      rows: 3,
                    },
                  ],
                  preview: {
                    select: {
                      title: "titlePl",
                      media: "image",
                    },
                  },
                },
              ],
            }),
          ],
          preview: {
            select: {
              title: "titlePl",
            },
          },
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Galeria zdjęć",
      type: "array",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "altPl",
              title: "Tekst alternatywny (Polski)",
              type: "string",
              description: "Opis obrazu dla czytników ekranu i SEO",
            },
            {
              name: "altEn",
              title: "Tekst alternatywny (English)",
              type: "string",
              description: "Opis obrazu dla czytników ekranu i SEO",
            },
          ],
        },
      ],
      description: "Dodatkowe zdjęcia projektu (opcjonalnie)",
    }),
    defineField({
      name: "publishedAt",
      title: "Data publikacji",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "titlePl",
      media: "mainImage",
    },
  },
});
