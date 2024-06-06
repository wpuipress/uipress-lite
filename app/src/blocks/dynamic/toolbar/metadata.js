import { __ } from "@wordpress/i18n";
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
      options: [
        { option: "hiddenToolbarItems", componentName: "hiden-toolbar-items-select", label: __("Hidden toolbar items", "uipress-lite") },
        { option: "editToolbarItems", componentName: "edit-toolbar-items", label: __("Toolbar icons", "uipress-lite") },
        {
          option: "defaultSelect",
          componentName: "default-select",
          uniqueKey: "dropdownPosition",
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
          label: __("Submenu pos", "uipress-lite"),
        },
        {
          option: "defaultSelect",
          componentName: "default-select",
          uniqueKey: "subDropdownPosition",
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
          value: "right",
          label: __("Sub submenu pos", "uipress-lite"),
        },
      ],
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
      class: ".uip-toolbar-top-item",
    },
    {
      name: "topLevelIcons",
      label: __("Toolbar icons", "uipress-lite"),
      icon: "favorite",
      styleType: "style",
      class: ".uip-toolbar-top-item-icon",
    },
    {
      name: "submenu",
      label: __("Submenu", "uipress-lite"),
      icon: "menu",
      styleType: "style",
      class: ".uip-toolbar-submenu",
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
      label: __("Submenu items", "uipress-lite"),
      icon: "menu",
      styleType: "style",
      class: ".uip-toolbar-sub-item",
    },
  ],
};
