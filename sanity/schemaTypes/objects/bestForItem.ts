import { defineField, defineType } from "sanity";

export const bestForItem = defineType({
  name: "bestForItem",
  title: "Best for item",
  type: "object",
  fields: [
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "label", media: "icon" },
  },
});
