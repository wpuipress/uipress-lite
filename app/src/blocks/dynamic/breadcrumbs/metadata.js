const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Bread crumbs", "uipress-lite"),
  moduleName: "uip-breadcrumbs",
  description: __("Shows the current page path (breadcrumbs)", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/breadcrumbs.min.js",
  icon: "label_important",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "iconSelect", componentName: "icon-select", uniqueKey: "breadIcon", label: __("Icon separator", "uipress-lite") }],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "crumb",
      label: __("Breadcrumb item", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-crumb",
    },
    {
      name: "icon",
      label: __("Icon separator", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-crumb-icon",
    },
  ],
};
