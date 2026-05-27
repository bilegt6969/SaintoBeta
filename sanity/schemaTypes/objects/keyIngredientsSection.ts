import { defineField, defineType } from "sanity";

export const keyIngredientsSection = defineType({
  name: "keyIngredientsSection",
  title: "Key ingredients section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      initialValue: "The Key Ingredients",
    }),
    defineField({
      name: "subtitle",
      title: "Section subtitle",
      type: "string",
      initialValue: "SIMPLE, EFFECTIVE, BASED",
    }),
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [{ type: "keyIngredient" }],
      description: "Each ingredient has its own image, name, and description.",
    }),
    defineField({
      name: "featureBadges",
      title: "Feature badges",
      type: "array",
      of: [{ type: "productHighlight" }],
      description:
        'Badges below the grid, e.g. "Premium Non-Toxic", "Zero Endocrine Disruptors".',
    }),
    defineField({
      name: "fullIngredientListUrl",
      title: "Full ingredient list URL",
      type: "url",
    }),
  ],
});
