import { defineField, defineType } from "sanity";

export const purchaseBundleOption = defineType({
  name: "purchaseBundleOption",
  title: "Purchase bundle option",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Thumbnail image",
      type: "image",
      options: { hotspot: true },
      description:
        "Optional image for Two Pack and Complete styling kit cards.",
    }),
    defineField({
      name: "price",
      title: "Price (MNT)",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "compareAtPrice",
      title: "Compare at price",
      type: "number",
      description: "Original price shown struck through (optional).",
      validation: (rule) => rule.min(0),
    }),
    defineField({
      name: "highlightLabel",
      title: "Highlight label",
      type: "string",
      description: 'e.g. "MOST POPULAR" or "BEST VALUE"',
    }),
    defineField({
      name: "promoBadges",
      title: "Promo badges",
      type: "array",
      of: [{ type: "string" }],
      description: 'e.g. "Save 10%", "Free USA Shipping"',
    }),
    defineField({
      name: "whatsIncludedUrl",
      title: "What's included link",
      type: "url",
      description: "Optional link for the Complete styling kit.",
    }),
    defineField({
      name: "variantId",
      title: "Variant ID",
      type: "string",
      description:
        "The variant _key from this product's variants array. Required for Add to Cart.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      price: "price",
      media: "image",
    },
    prepare({ title, price, media }) {
      return {
        title: title || "Bundle option",
        subtitle: price != null ? `${price} MNT` : undefined,
        media,
      };
    },
  },
});
