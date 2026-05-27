import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "brand",
      title: "Brand",
      type: "string",
      validation: (rule) => rule.required(),
    }),
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
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Hair Products", value: "hair-products" },
          { title: "Clothing", value: "clothing" },
          { title: "Electronics", value: "electronics" },
          { title: "Accessories", value: "accessories" },
          { title: "Phones", value: "phones" },
          { title: "Cases", value: "cases" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (MNT)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at Price (MNT)",
      type: "number",
      description:
        "Original price before discount. Leave empty if no discount.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      description:
        'Key-value pairs. e.g. Label: "Density" → Value: "0.42 g/cm³"',
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
    defineField({
      name: "condition",
      title: "Condition",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Like New", value: "like-new" },
          { title: "Good", value: "good" },
          { title: "Fair", value: "fair" },
        ],
      },
      description:
        "Leave empty for brand new products. Use for thrift / second-hand items.",
    }),
    defineField({
      name: "availableForSale",
      title: "Available for sale",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "outOfStock",
      title: "Out of stock",
      type: "boolean",
      initialValue: false,
      description: "If true, this product will be hidden from the home page.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      description:
        'e.g. Name: "Size", Values: ["S", "M", "L"] or Name: "Color", Values: ["Black", "White"]',
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "values",
              title: "Values",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "variants",
      title: "Variants",
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
              name: "availableForSale",
              title: "Available for sale",
              type: "boolean",
              initialValue: true,
            }),
            defineField({
              name: "price",
              title: "Price (MNT)",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),
            defineField({
              name: "compareAtPrice",
              title: "Compare at Price (MNT)",
              type: "number",
              description: "Leave empty if no discount on this variant.",
            }),
            defineField({
              name: "selectedOptions",
              title: "Selected options",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    defineField({
                      name: "name",
                      title: "Name",
                      type: "string",
                    }),
                    defineField({
                      name: "value",
                      title: "Value",
                      type: "string",
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "text",
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "title", media: "images.0" },
  },
});
