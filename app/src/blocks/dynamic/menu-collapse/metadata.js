const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Menu collapse toggle", "uipress-lite"),
  moduleName: "menu-collapse-toggle",
  description: __("A customisable button that can toggle the admin menu collapse state.", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/menu-collapse-toggle.min.js",
  icon: "menu_open",
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
          uniqueKey: "buttonText",
          label: __("Button text", "uipress-lite"),
          value: {
            string: __("Collapse menu", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite"), value: { value: "menu_open" } },
        { option: "iconSelect", uniqueKey: "collapsedIcon", componentName: "icon-select", label: __("Collapsed icon", "uipress-lite"), value: { value: "chevron_right" } },
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
