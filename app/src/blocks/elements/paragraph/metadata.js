import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Paragraph", "uipress-lite"),
  moduleName: "uip-paragraph",
  description: __("Creates a paragraph block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/paragraph.min.js",
  icon: "segment",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        {
          option: "paragraph",
          componentName: "uip-paragraph-input",
          value: "Mauris placerat tortor non enim commodo interdum. Sed gravida sagittis magna. Suspendisse non metus sagittis neque mollis consectetur.",
          label: __("Content", "uipress-lite"),
          args: { fullWidth: true },
        },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
  ],
};
