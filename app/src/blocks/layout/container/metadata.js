import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Container", "uipress-lite"),
  moduleName: "uip-container",
  description: __("Creates a container block with options for aligning content", "uipress-lite"),
  group: "layout",
  path: "./blocks/layout/container.min.js",
  icon: "crop_free",
  content: [],
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [],
    },
    //Style options group
    {
      name: "style",
      icon: "dashboard_customize",
      styleType: "style",
    },
  ],
};
