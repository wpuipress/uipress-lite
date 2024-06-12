const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Admin menu", "uipress-lite"),
  moduleName: "uip-admin-menu",
  description: __("Outputs the admin menu", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/admin-menu-new.min.js",
  icon: "sort",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "subMenuStyle",
          value: { value: "inline" },
          args: {
            options: {
              inline: { value: "inline", label: __("Inline", "uipress-lite") },
              hover: { value: "hover", label: __("Hover", "uipress-lite") },
              dynamic: { value: "dynamic", label: __("Drilldown", "uipress-lite") },
            },
          },
          label: __("Behaviour", "uipress-lite"),
        },
        {
          option: "defaultSelect",
          componentName: "default-select",
          uniqueKey: "dropdownPosition",
          args: {
            options: [
              {
                value: "bottom-left",
                label: __("Bottom left", "uipress-lite"),
              },
              {
                value: "bottom-right",
                label: __("Bottom right", "uipress-lite"),
              },
              {
                value: "top-left",
                label: __("Top left", "uipress-lite"),
              },
              {
                value: "top-right",
                label: __("Top right", "uipress-lite"),
              },
              {
                value: "left",
                label: __("Left", "uipress-lite"),
              },
              {
                value: "right",
                label: __("Right", "uipress-lite"),
              },
            ],
          },
          value: "right",
          label: __("Drop posisition", "uipress-lite"),
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "showSearch",
          args: {
            options: {
              true: {
                value: true,
                label: __("Show", "uipress-lite"),
              },
              false: {
                value: false,
                label: __("Hide", "uipress-lite"),
              },
            },
          },
          label: __("Menu search", "uipress-lite"),
          value: { value: true },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "menuCollapse",
          args: {
            options: {
              true: {
                value: true,
                label: __("Show", "uipress-lite"),
              },
              false: {
                value: false,
                label: __("Hide", "uipress-lite"),
              },
            },
          },
          label: __("Collapse option", "uipress-lite"),
          value: { value: true },
        },

        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "loadOnClick",
          args: {
            options: {
              true: {
                value: true,
                label: __("Enabled", "uipress-lite"),
              },
              false: {
                value: false,
                label: __("Disabled", "uipress-lite"),
              },
            },
          },
          label: __("Auto load", "uipress-lite"),
          value: true,
          help: __("Auto load will load top level menu items when you click on them. If disabled clicking top level items will simply open the items submenu.", "uipress-lite"),
        },

        { option: "choiceSelect", componentName: "choice-select", args: { type: "hideShow" }, uniqueKey: "hideIcons", label: __("Icons", "uipress-lite") },

        { option: "iconSelect", componentName: "icon-select", uniqueKey: "subMenuIcon", label: __("Submenu Icon", "uipress-lite") },
        {
          option: "staticMenu",
          componentName: "static-menu",
          uniqueKey: "staticMenu",
          label: __("Static menu", "uipress-lite"),
          help: __("If enabled, this menu block will load a custom menu from the menu builder. The menu will become static and will not react to plugin changes.", "uipress-lite"),
        },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      presets: {
        flexLayout: {
          direction: "column",
          distribute: "start",
          align: "stretch",
          wrap: "nowrap",
          type: "stack",
          placeContent: "normal",
          gap: {
            value: 12,
            units: "px",
          },
        },
      },
    },
    //Menu headers
    {
      name: "topLevelItems",
      label: __("Menu headers", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-top-level-item",
      presets: {
        flexLayout: {
          direction: "row",
          distribute: "start",
          align: "center",
          wrap: "nowrap",
          type: "stack",
          placeContent: "normal",
          gap: {
            value: 8,
            units: "px",
          },
        },
      },
    },
    {
      name: "separators",
      label: __("Menu sepators", "uipress-lite"),
      icon: "view_list",
      styleType: "style",
      class: ".uip-menu-separator",
    },
    //Submenu
    {
      name: "submenu",
      label: __("Submenu", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-admin-submenu",
      presets: {
        flexLayout: {
          direction: "column",
          distribute: "start",
          align: "stretch",
          wrap: "nowrap",
          type: "stack",
          placeContent: "normal",
          gap: {
            value: 4,
            units: "px",
          },
        },
        spacing: {
          margin: {
            preset: "custom",
            sync: false,
            left: 22,
            top: 4,
            bottom: 8,
            right: 0,
            units: "px",
          },
        },
      },
    },
    //Sub menu items
    {
      name: "subMenuIcons",
      label: __("Header submenu icon", "uipress-lite"),
      icon: "favorite",
      styleType: "style",
      class: ".uip-submenu-icon",
    },
    //Sub menu items
    {
      name: "subMenuHeader",
      label: __("Sub menu header", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-sub-menu-header",
    },

    //Sub menu items
    {
      name: "subLevelItems",
      label: __("Sub menu items", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-sub-level-item",
    },
    //Menu icons
    {
      name: "icons",
      label: __("Icons", "uipress-lite"),
      icon: "star",
      styleType: "style",
      class: ".uip-menu-icon",
    },

    //Notifications
    {
      name: "notifications",
      label: __("Notifications", "uipress-lite"),
      icon: "notifications",
      styleType: "style",
      class: ".uip-menu-notification",
    },
    //Notifications
    {
      name: "menuCollapse",
      label: __("Menu collapse", "uipress-lite"),
      icon: "menu_open",
      styleType: "style",
      class: ".uip-menu-collapse",
    },
    {
      name: "menuSearch",
      label: __("Menu search", "uipress-lite"),
      icon: "manage_search",
      styleType: "style",
      class: ".uip-menu-search",
    },
  ],
};
