import { defineField, defineType } from "sanity";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "desktopImage",
      title: "Desktop Image (1920x1080)",
      type: "image",
      options: {
        hotspot: true,
        accept: "image/*",
      },
      validation: (rule) => rule.required(),
      description: "Recommended size: 1920x1080 for desktop and tablet screens",
    }),
    defineField({
      name: "mobileImage",
      title: "Mobile Image (1080x1920)",
      type: "image",
      options: {
        hotspot: true,
        accept: "image/*",
      },
      validation: (rule) => rule.required(),
      description: "Recommended size: 1080x1920 for mobile screens (vertical orientation)",
    }),
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      initialValue: true,
      description: "Toggle to show/hide this hero on the homepage",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first",
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "desktopImage",
    },
    prepare({ title, media }) {
      return {
        title,
        media,
      };
    },
  },
});
