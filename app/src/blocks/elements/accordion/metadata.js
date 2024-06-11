const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Accordion", "uipress-lite"),
  moduleName: "uip-accordion",
  description: __("Creates a accordion block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/accordion.min.js",
  icon: "add",
  content: [],
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite"), value: { value: "star" } },
        {
          option: "title",
          componentName: "uip-dynamic-input",
          uniqueKey: "headingText",
          label: __("Accordion title", "uipress-lite"),
          value: {
            string: __("Accordion title", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
      ],
    },
    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    //Contentclass
    {
      name: "contentStyle",
      label: __("Content style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-accordion-body",
    },
    //Contentclass
    {
      name: "triggerStyle",
      label: __("Chevron style", "uipress-lite"),
      icon: "chevron_left",
      styleType: "style",
      class: ".uip-accordion-trigger",
    },
  ],
};
