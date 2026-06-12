import { defineField, defineType } from "sanity";

export const homeConfig = defineType({
  name: "homeConfig",
  title: "Home Page Configuration",
  type: "document",
  fields: [
    defineField({
      name: "featuredProducts",
      title: "Featured Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      validation: (rule) => rule.max(5),
      description: "Select up to 5 products to show in the Featured section on the home page.",
    }),
    defineField({
      name: "categorySections",
      title: "Category Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "category",
              title: "Category",
              type: "reference",
              to: [{ type: "categoryPage" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "enabled",
              title: "Enabled",
              type: "boolean",
              initialValue: true,
              description: "Enable this category section on the home page.",
            }),
            defineField({
              name: "sortOrder",
              title: "Sort Order",
              type: "number",
              initialValue: 0,
              description: "Lower numbers appear first.",
            }),
          ],
          preview: {
            select: {
              category: "category.title",
              enabled: "enabled",
            },
            prepare({ category, enabled }) {
              return {
                title: category,
                subtitle: enabled ? "Enabled" : "Disabled",
              };
            },
          },
        },
      ],
      description: "Select categories to show as sections on the home page. Each section will show up to 5 products from that category.",
    }),
  ],
  preview: {
    select: {
      featuredProducts: "featuredProducts",
      categorySections: "categorySections",
    },
    prepare({ featuredProducts, categorySections }) {
      return {
        title: "Home Configuration",
        subtitle: `${featuredProducts?.length || 0} featured, ${categorySections?.length || 0} category sections`,
      };
    },
  },
});
