const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Heading", "uipress-lite"),
  moduleName: "uip-heading",
  description: __("Creates a heading block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/heading.min.js",
  icon: "text_fields",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        {
          option: "title",
          componentName: "uip-dynamic-input",
          uniqueKey: "headingText",
          label: __("Heading text", "uipress-lite"),
          value: {
            string: __("Heading text", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        {
          option: "headingType",
          componentName: "default-select",
          args: {
            options: [
              {
                value: "h1",
                label: "h1",
              },
              {
                value: "h2",
                label: "h2",
              },
              {
                value: "h3",
                label: "h3",
              },
              {
                value: "h4",
                label: "h4",
              },
              {
                value: "h5",
                label: "h5",
              },
              {
                value: "p",
                label: "p",
              },
            ],
          },
          label: __("Heading type", "uipress-lite"),
          value: "h2",
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite") },
        {
          option: "iconPosition",
          componentName: "choice-select",
          args: {
            options: {
              left: {
                value: "left",
                label: __("Left", "uipress-lite"),
              },
              right: {
                value: "right",
                label: __("Right", "uipress-lite"),
              },
            },
          },
          label: __("Icon position", "uipress-lite"),
        },
      ],
    },
    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "iconStyle",
      label: __("Icon", "uipress-lite"),
      icon: "favorite",
      styleType: "style",
      class: ".uip-icon",
    },
  ],
};
