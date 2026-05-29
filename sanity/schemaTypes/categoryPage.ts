import { defineField, defineType } from "sanity";

export const categoryPage = defineType({
  name: "categoryPage",
  title: "Category Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "home", title: "Homepage" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL handle",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categoryLogo",
      title: "Category logo (SVG from Figma)",
      type: "image",
      group: "content",
      description:
        "Upload the category wordmark SVG exported from Figma. Shown in the black card instead of the Sainto logo.",
      options: { accept: "image/svg+xml,image/*" },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      group: "content",
      rows: 3,
      description:
        "Products are added on each Product document by choosing this category. They appear here automatically.",
    }),
    defineField({
      name: "featuredProduct",
      title: "Category face (homepage)",
      type: "reference",
      group: "home",
      to: [{ type: "product" }],
      description:
        "The product card shown on the home page for this category. Must be a product assigned to this category.",
      options: {
        filter: ({ document }) => {
          const categoryId = document?._id;
          if (!categoryId || typeof categoryId !== "string") {
            return { filter: '_type == "product"' };
          }
          return {
            filter: "category._ref == $categoryId",
            params: { categoryId },
          };
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "showOnHome",
      title: "Show on homepage",
      type: "boolean",
      group: "home",
      initialValue: true,
    }),
    defineField({
      name: "homeSortOrder",
      title: "Homepage sort order",
      type: "number",
      group: "home",
      initialValue: 0,
      description: "Lower numbers appear first on the home grid.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text" }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
      media: "categoryLogo",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `/category/${subtitle}` : undefined,
        media,
      };
    },
  },
});
