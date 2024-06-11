const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Tabs", "uipress-lite"),
  moduleName: "tab-nav",
  description: __("Create a tabbed navigation with different styles", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/tabs.min.js",
  icon: "tab",
  content: [],
  optionsEnabled: [
    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "tabItem",
      label: __("Tab item", "uipress-lite"),
      icon: "tab",
      styleType: "style",
      class: ".uip-tab-item",
    },
    {
      name: "tabItemHover",
      label: __("Tab item hover", "uipress-lite"),
      icon: "ads_click",
      styleType: "style",
      class: ".uip-tab-item:hover",
    },
    {
      name: "tabItemActive",
      label: __("Tab item active", "uipress-lite"),
      icon: "ads_click",
      styleType: "style",
      class: ".uip-tab-item-active",
    },
    {
      name: "tabContent",
      label: __("Tab content", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-tab-content-area",
    },
  ],
};
