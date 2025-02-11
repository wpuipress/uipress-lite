const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Toolbar", "uipress-lite"),
  moduleName: "uip-toolbar",
  description: __("Outputs default toolbar items", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/toolbar.min.js",
  icon: "build",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "toolBarItems",
      label: __("Admin bar", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-admin-toolbar",
      presets: {
        flexLayout: {
          direction: "row",
          distribute: "start",
          align: "center",
          wrap: "nowrap",
          type: "stack",
          placeContent: "normal",
          gap: {
            value: 16,
            units: "px",
          },
        },
      },
    },
    {
      name: "topLevelItemStyle",
      label: __("Toolbar item", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-admin-toolbar > li > a",
    },
    {
      name: "topLevelIcons",
      label: __("Toolbar icons", "uipress-lite"),
      icon: "favorite",
      styleType: "style",
      class: ".ab-icon",
    },
    {
      name: "submenu",
      label: __("Submenu", "uipress-lite"),
      icon: "menu",
      styleType: "style",
      class: ".ab-sub-wrapper ul",
      presets: {
        flexLayout: {
          direction: "column",
          distribute: "start",
          align: "stretch",
          wrap: "nowrap",
          type: "stack",
          placeContent: "normal",
          gap: {
            value: 2,
            units: "px",
          },
        },
        spacing: {
          padding: {
            preset: "S",
            sync: true,
          },
        },
      },
    },
    {
      name: "subLevelItemStyle",
      label: __("Submenu item", "uipress-lite"),
      icon: "menu",
      styleType: "style",
      class: ".ab-sub-wrapper .ab-item",
    },
  ],
};
