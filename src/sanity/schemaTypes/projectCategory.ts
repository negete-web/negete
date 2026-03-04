import { defineType, defineField } from "sanity";

export const projectCategory = defineType({
  name: "projectCategory",
  title: "Kategoria realizacji",
  type: "document",
  fields: [
    defineField({
      name: "titlePl",
      title: "Nazwa (Polski)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "Nazwa (English)",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug (identyfikator)",
      type: "slug",
      description: "Używany do filtrowania w URL (np. elektronika-pcb)",
      options: {
        source: "titlePl",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "titlePl",
      subtitle: "titleEn",
    },
  },
});
