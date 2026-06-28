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
      name: "category",
      title: "Product Category",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Sneakers", value: "sneakers" },
          { title: "Clothes", value: "clothes" },
          { title: "Accessories", value: "accessories" },
          { title: "Carry", value: "carry" },
          { title: "Watches", value: "watches" },
          { title: "Lifestyle", value: "lifestyle" },
          { title: "Fragrance", value: "fragrance" },
          { title: "Home", value: "home" },
          { title: "Tech", value: "tech" },
          { title: "Heritage", value: "heritage" },
          { title: "Art", value: "art" },
          { title: "Beauty", value: "beauty" },
        ],
      },
      description:
        "Select the product category this page represents. Products with this category selected will appear here automatically.",
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
      title: "Category face (legacy)",
      type: "reference",
      group: "home",
      to: [{ type: "product" }],
      description:
        "Optional. The homepage grid now uses the category logo and links to this collection — products are no longer shown on the home grid.",
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
