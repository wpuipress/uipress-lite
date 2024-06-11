const { __ } = wp.i18n;
/**
 * Dropdown block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Dropdown", "uipress-lite"),
  moduleName: "uip-dropdown",
  description: __("Creates a dropdown with a customisable trigger", "uipress-lite"),
  group: "layout",
  path: "./blocks/layout/dropdown.min.js",
  icon: "expand_circle_down",
  content: [],
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
          label: __("Trigger text", "uipress-lite"),
          value: {
            string: __("Press me", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite") },
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
        {
          option: "choice-select",
          componentName: "choice-select",
          uniqueKey: "openMode",
          args: {
            options: {
              click: {
                value: "click",
                label: __("Click", "uipress-lite"),
              },
              hover: {
                value: "hover",
                label: __("Hover", "uipress-lite"),
              },
            },
          },
          label: __("Mode", "uipress-lite"),
          value: { value: "click" },
        },
        {
          option: "defaultSelect",
          componentName: "default-select",
          uniqueKey: "dropDirection",
          label: __("Dropdown position", "uipress-lite"),
          args: {
            options: [
              {
                value: "bottom center",
                label: __("Bottom center", "uipress-lite"),
              },
              {
                value: "bottom left",
                label: __("Bottom left", "uipress-lite"),
              },
              {
                value: "bottom right",
                label: __("Bottom right", "uipress-lite"),
              },
              {
                value: "top center",
                label: __("Top center", "uipress-lite"),
              },
              {
                value: "top left",
                label: __("Top left", "uipress-lite"),
              },
              {
                value: "top right",
                label: __("Top right", "uipress-lite"),
              },
              {
                value: "left center",
                label: __("Left center", "uipress-lite"),
              },
              {
                value: "left top",
                label: __("Left top", "uipress-lite"),
              },
              {
                value: "left bottom",
                label: __("Left bottom", "uipress-lite"),
              },
              {
                value: "right center",
                label: __("Right center", "uipress-lite"),
              },
              {
                value: "right top",
                label: __("Right top", "uipress-lite"),
              },
              {
                value: "right bottom",
                label: __("Right bottom", "uipress-lite"),
              },
            ],
          },
          value: "bottom-left",
        },
        { option: "keyboardShortcut", componentName: "keyboard-shortcut", label: __("Keyboard shortcut", "uipress-lite") },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },

    {
      name: "trigger",
      label: __("Trigger styles", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-drop-trigger",
    },
    {
      name: "dropdown",
      label: __("Dropdown styles", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-dropdown-container",
    },
  ],
};
