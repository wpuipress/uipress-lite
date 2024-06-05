import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Page content", "uipress-lite"),
  moduleName: "uip-content",
  description: __("Outputs the page content block", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/content.min.js",
  icon: "list_alt",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        { option: "choiceSelect", componentName: "choice-select", args: { type: "enabledDisabled" }, uniqueKey: "disableFullScreen", label: __("Fullscreen", "uipress-lite") },
        { option: "choiceSelect", componentName: "choice-select", args: { type: "hideShow" }, uniqueKey: "hideLoader", label: __("Loading bar", "uipress-lite") },
        { option: "startPage", componentName: "link-select", args: { hideLinkType: true }, uniqueKey: "loginRedirect", label: __("Login redirect", "uipress-lite") },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "iFrame",
      label: __("Content frame", "uipress-lite"),
      icon: "language",
      styleType: "style",
      class: ".uip-page-content-frame",
    },

    {
      name: "frameToolbar",
      label: __("Frame toolbar", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-frame-toolbar",
    },
    {
      name: "loadingBarTrack",
      label: __("Loading bar track", "uipress-lite"),
      icon: "rotate_right",
      styleType: "style",
      class: ".uip-ajax-loader",
    },
    {
      name: "loadingBar",
      label: __("Loading bar", "uipress-lite"),
      icon: "rotate_right",
      styleType: "style",
      class: ".uip-loader-bar",
    },
  ],
};
