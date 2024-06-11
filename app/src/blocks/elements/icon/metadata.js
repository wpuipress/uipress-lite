const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Icon", "uipress-lite"),
  moduleName: "uip-icon",
  description: __("Creates a icon block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/icon.min.js",
  icon: "interests",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite"), value: { value: "favorite" } }],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
  ],
};
