import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Fullscreen toggle", "uipress-lite"),
  moduleName: "uip-fullscreen",
  description: __("A customisable button that can toggle the fullscreen mode of the content frame", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/fullscreen.min.js",
  icon: "fullscreen",
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
            string: __("Fullscreen", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite"), value: { value: "fullscreen" } },
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
          value: { value: "left" },
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
