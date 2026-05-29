import { defineField, defineType } from "sanity";

export const productHighlight = defineType({
  name: "productHighlight",
  title: "Product highlight",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
      description: "Small icon shown beside the highlight text.",
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "text", media: "icon" },
  },
});
