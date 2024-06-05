import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Button", "uipress-lite"),
  moduleName: "uip-block-button",
  description: __("Creates a button link", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/button.min.js",
  icon: "smart_button",
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
            string: __("Press me", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        { option: "linkSelect", componentName: "link-select", label: __("Link", "uipress-lite") },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite") },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "iconPosition",
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
        { option: "onClickCode", componentName: "code-editor", args: { language: "javascript" }, requiresUpgrade: true, label: __("JS on click", "uipress-lite") },
      ],
    },
    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "icon",
      label: __("Icon", "uipress-lite"),
      icon: "favorite",
      styleType: "style",
      class: ".uip-icon",
    },
  ],
};
