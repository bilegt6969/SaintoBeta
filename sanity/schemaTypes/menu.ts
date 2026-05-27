import { defineField, defineType } from "sanity";

export const menu = defineType({
  name: "menu",
  title: "Menu",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Handle",
      type: "slug",
      description:
        "Use next-js-frontend-header-menu or next-js-frontend-footer-menu to match the storefront.",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "path",
              title: "Path",
              type: "string",
              description: "e.g. /search or /about",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
