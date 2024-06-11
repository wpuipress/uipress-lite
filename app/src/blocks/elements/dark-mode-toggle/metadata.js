const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Dark mode", "uipress-lite"),
  moduleName: "uip-dark-toggle",
  description: __("Outputs a toggle for switiching between light and dark modes", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/dark-mode-toggle.min.js",
  icon: "dark_mode",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "trueFalse", componentName: "switch-select", uniqueKey: "prefersColorScheme", label: __("Auto detect color theme?", "uipress-lite"), args: { asText: true } }],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },

    {
      name: "inactive",
      label: __("Inactive toggle", "uipress-lite"),
      icon: "toggle_off",
      styleType: "style",
      class: "input + .uip-slider:before",
    },
    {
      name: "active",
      label: __("Active toggle", "uipress-lite"),
      icon: "toggle_on",
      styleType: "style",
      class: "input:checked + .uip-slider:before",
    },
    {
      name: "Track",
      label: __("Track", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-slider",
    },
  ],
};
