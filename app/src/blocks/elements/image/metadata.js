const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Image", "uipress-lite"),
  moduleName: "uip-image",
  description: __("Creates a image block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/image.min.js",
  icon: "image",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "imageSelect", componentName: "inline-image-select", uniqueKey: "userImage", label: __("Image", "uipress-lite"), args: { hasPositioning: false } }],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
  ],
};
