import { __ } from "@wordpress/i18n";
/**
 * Dropdown block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Slide out panel", "uipress-lite"),
  moduleName: "uip-slide-out",
  description: __("Creates a slide out panel with a customisable trigger", "uipress-lite"),
  group: "layout",
  path: "./blocks/layout/slide-out-panel.min.js",
  icon: "space_dashboard",
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
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "panelSide",
          label: __("Panel position", "uipress-lite"),
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
          value: {
            value: "right",
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "overlayStyle",
          label: __("Style", "uipress-lite"),
          args: {
            options: {
              overlay: {
                value: "overlay",
                label: __("Overlay", "uipress-lite"),
              },
              push: {
                value: "push",
                label: __("Push", "uipress-lite"),
              },
            },
          },
          value: {
            value: "overlay",
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "closeOnPageChange",
          args: {
            options: {
              false: {
                value: false,
                label: __("Disabled", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("Enabled", "uipress-lite"),
              },
            },
          },
          label: __("Close on page change", "uipress-lite"),
        },
        { option: "keyboardShortcut", componentName: "keyboard-shortcut", label: __("Keyboard shortcut", "uipress-lite") },
      ],
    },
    {
      name: "style",
      icon: "dashboard_customize",
      styleType: "style",
    },
    {
      name: "trigger",
      label: __("Trigger style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-panel-trigger",
    },
    {
      name: "panel",
      label: __("Panel styles", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-offcanvas-panel",
    },
  ],
};
