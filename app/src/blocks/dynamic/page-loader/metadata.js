const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Page loader", "uipress-lite"),
  moduleName: "uip-page-loader",
  description: __("This block allows you to place a loading bar wherever you choose and has the option to replace the bar with a custom image.", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/page-loader.min.js",
  icon: "cached",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "imageSelect", componentName: "inline-image-select", uniqueKey: "loaderImage", label: __("Image", "uipress-lite"), args: { hasPositioning: false } }],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
  ],
};
