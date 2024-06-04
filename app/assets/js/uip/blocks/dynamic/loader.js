const { __, _x, _n, _nx } = wp.i18n;

/**
 * Admin menu block
 *
 * This block has been discontinued but we need to still load it up for consitency or peoples older templates
 *
 * @since 3.2.13
 */
const AdminMenu = {
  name: __("Admin menu", "uipress-lite"),
  moduleName: "uip-admin-menu",
  description: __("Outputs the admin menu", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/admin-menu.min.js",
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
          value: { value: "dynamic" },
          args: {
            options: {
              inline: { value: "inline", label: __("Inline", "uipress-lite") },
              hover: { value: "hover", label: __("Hover", "uipress-lite") },
              dynamic: { value: "dynamic", label: __("Dynamic", "uipress-lite") },
            },
          },
          label: __("Behaviour", "uipress-lite"),
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "menuDirection",
          label: __("Direction", "uipress-lite"),
          args: {
            options: {
              vertical: {
                value: "vertical",
                label: __("Vertical", "uipress-lite"),
              },
              horizontal: {
                value: "horizontal",
                label: __("Horizontal", "uipress-lite"),
              },
            },
          },
          value: {
            value: "vertical",
          },
        },
        { option: "advancedMenuEditing", uniqueKey: "advancedoptions", label: __("Menu editor", "uipress-lite") },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "menuCollapse",
          args: {
            type: "hideShow",
            options: {
              false: {
                value: false,
                label: __("Enabled", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("Disabled", "uipress-lite"),
              },
            },
          },
          label: __("Collapse option", "uipress-lite"),
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "disableAutoUpdate",
          args: { type: "enabledDisabled" },
          label: __("Auto update", "uipress-lite"),
          help: __("Auto update will automatically update the menu when new plugins are or menu items are added.", "uipress-lite"),
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "loadOnClick",
          args: { type: "enabledDisabled" },
          label: __("Auto load", "uipress-lite"),
          help: __("Auto load will load top level menu items when you click on them. If disabled clicking top level items will simply open the items submenu.", "uipress-lite"),
        },
        //{ option: 'hiddenMenuItems', label: __('Hiden menu items', 'uipress-lite') },
        //{ option: 'editMenuItems', label: __('Menu options', 'uipress-lite') },

        { option: "choiceSelect", componentName: "choice-select", args: { type: "hideShow" }, uniqueKey: "hideIcons", label: __("Icons", "uipress-lite") },

        { option: "iconSelect", componentName: "icon-select", uniqueKey: "subMenuIcon", label: __("Submenu Icon", "uipress-lite") },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    //Menu headers
    {
      name: "topLevelItems",
      label: __("Menu headers", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-top-level-item",
    },
    //Menu headers hover
    {
      name: "topLevelItemsHover",
      label: __("Menu headers hover", "uipress-lite"),
      icon: "ads_click",
      styleType: "style",
      class: ".uip-top-level-item:hover",
    },
    //Menu headers active
    {
      name: "topLevelItemsActive",
      label: __("Menu headers active", "uipress-lite"),
      icon: "ads_click",
      styleType: "style",
      class: ".uip-top-level-item-active",
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
    //Sub menu items hover
    {
      name: "subLevelItemsHover",
      label: __("Sub menu items hover", "uipress-lite"),
      icon: "ads_click",
      styleType: "style",
      class: ".uip-sub-level-item:hover",
    },
    //Sub menu items active
    {
      name: "subLevelItemsActive",
      label: __("Sub menu items active", "uipress-lite"),
      icon: "ads_click",
      styleType: "style",
      class: ".uip-sub-level-item-active",
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
  ],
};

/**
 * New admin menu block
 *
 * @since 3.2.13
 */
const AdminMenuNew = {
  name: __("Admin menu", "uipress-lite"),
  moduleName: "uip-admin-menu-new",
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

/**
 * Post table block
 *
 * @since 3.2.13
 */
const PostTable = {
  name: __("Posts table", "uipress-lite"),
  moduleName: "posts-table",
  description: __("Create a list of recent posts", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/posts-table.min.js",
  icon: "table",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        { option: "postTypeSelect", componentName: "post-types", uniqueKey: "activePostTypes", label: __("Post types", "uipress-lite") },
        {
          option: "multiSelect",
          uniqueKey: "actionsEnabled",
          componentName: "multi-select-option",
          label: __("Actions enabled", "uipress-lite"),
          args: {
            options: [
              {
                name: "view",
                label: __("View", "uipress-lite"),
              },
              {
                name: "edit",
                label: __("Edit", "uipress-lite"),
              },
              {
                name: "delete",
                label: __("Delete", "uipress-lite"),
              },
            ],
          },
        },
        { option: "number", componentName: "uip-number", uniqueKey: "postsPerPage", label: __("Posts per page", "uipress-lite"), value: 10 },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "limitToAuthor",
          label: __("Content", "uipress-lite"),
          help: __("If enabled, only the users own content will show", "uipress-lite"),
          value: { value: false },
          args: {
            options: {
              false: {
                value: false,
                label: __("All", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("User", "uipress-lite"),
              },
            },
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "searchDisabled",
          label: __("Search", "uipress-lite"),
          value: { value: false },
          args: {
            options: {
              false: {
                value: false,
                label: __("Show", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("Hide", "uipress-lite"),
              },
            },
          },
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
      name: "search",
      label: __("Search", "uipress-lite"),
      icon: "search",
      styleType: "style",
      class: ".uip-search-block",
    },
    {
      name: "table",
      label: __("Table styles", "uipress-lite"),
      icon: "table",
      styleType: "style",
      class: ".uip-post-table",
    },
    {
      name: "tableHead",
      label: __("Table head", "uipress-lite"),
      icon: "table",
      styleType: "style",
      class: ".uip-post-table-head",
    },
    {
      name: "tableHeadCell",
      label: __("Table head cell", "uipress-lite"),
      icon: "table",
      styleType: "style",
      class: ".uip-post-table-head-cell",
    },
    {
      name: "tableRow",
      label: __("Table row", "uipress-lite"),
      icon: "table",
      styleType: "style",
      class: ".uip-post-table-row",
    },
    {
      name: "tableCell",
      label: __("Table cell", "uipress-lite"),
      icon: "table",
      styleType: "style",
      class: ".uip-post-table-cell",
    },
    {
      name: "gridItem",
      label: __("Grid item", "uipress-lite"),
      icon: "grid_view",
      styleType: "style",
      class: ".uip-grid-item",
    },

    {
      name: "gridItemTitle",
      label: __("Grid item title", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-grid-item-title",
    },

    {
      name: "navButtons",
      label: __("Pagination buttons", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-nav-button",
    },
    {
      name: "typeLabel",
      label: __("Post type label", "uipress-lite"),
      icon: "label",
      styleType: "style",
      class: ".uip-post-type-label",
    },
    {
      name: "postCount",
      label: __("Table post count", "uipress-lite"),
      icon: "pin",
      styleType: "style",
      class: ".uip-post-count",
    },
  ],
};

/**
 * Page content block
 *
 * @since 3.2.13
 */
const PageContent = {
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

/**
 * Recent post blocks
 *
 * @since 3.2.13
 */
const RecentPosts = {
  name: __("Recent posts", "uipress-lite"),
  moduleName: "recent-posts",
  description: __("Create a list of recent posts", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/recent-posts.min.js",
  icon: "description",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        { option: "postTypeSelect", componentName: "post-types", uniqueKey: "activePostTypes", label: __("Post types", "uipress-lite") },
        { option: "number", componentName: "uip-number", uniqueKey: "postsPerPage", label: __("Posts per page", "uipress-lite"), value: 10 },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "limitToAuthor",
          label: __("Content", "uipress-lite"),
          help: __("If enabled, only the users own content will show", "uipress-lite"),
          value: { value: false },
          args: {
            options: {
              false: {
                value: false,
                label: __("All", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("User", "uipress-lite"),
              },
            },
          },
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
      name: "listArea",
      label: __("Posts list", "uipress-lite"),
      icon: "list",
      styleType: "style",
      class: ".uip-list-area",
    },
    {
      name: "itemHeader",
      label: __("Item title", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-post-title",
    },
    {
      name: "itemMeta",
      label: __("Item meta", "uipress-lite"),
      icon: "info",
      styleType: "style",
      class: ".uip-post-meta",
    },
    {
      name: "navButtons",
      label: __("Pagination buttons", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-nav-button",
    },
    {
      name: "typeLabel",
      label: __("Post type label", "uipress-lite"),
      icon: "label",
      styleType: "style",
      class: ".uip-post-type-label",
    },
  ],
};

/**
 * Site search block
 *
 * @since 3.2.13
 */
const Search = {
  name: __("Search", "uipress-lite"),
  moduleName: "search-content",
  description: __("Outputs a search block that queries your sites content", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/search.min.js",
  icon: "search",
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
          uniqueKey: "limitToAuthor",
          label: __("Content", "uipress-lite"),
          help: __("If enabled, only the users own content will show", "uipress-lite"),
          value: { value: false },
          args: {
            options: {
              false: {
                value: false,
                label: __("All", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("User", "uipress-lite"),
              },
            },
          },
        },
        {
          option: "searchPostTypes",
          componentName: "post-type-select",
          placeHolder: __("Select post types", "uipress-lite"),
          label: __("Search post types", "uipress-lite"),
          searchPlaceHolder: __("Search post types", "uipress-lite"),
          requiresUpgrade: true,
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
      name: "search",
      label: __("Search style", "uipress-lite"),
      icon: "search",
      styleType: "style",
      class: ".uip-search-block",
    },
    {
      name: "searchResults",
      label: __("Search results area", "uipress-lite"),
      icon: "list",
      styleType: "style",
      class: ".uip-search-results-area",
    },
    {
      name: "foundItems",
      label: __("Found items list", "uipress-lite"),
      icon: "list",
      styleType: "style",
      class: ".uip-found-items-list",
      presets: {
        flexLayout: {
          direction: "column",
          distribute: "start",
          align: "stretch",
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
      name: "itemHeader",
      label: __("Search item title", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-search-result-title",
    },
    {
      name: "itemMeta",
      label: __("Search item meta", "uipress-lite"),
      icon: "info",
      styleType: "style",
      class: ".uip-search-result-meta",
    },
    {
      name: "navButtons",
      label: __("Pagination buttons", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-search-nav-button",
    },
  ],
};

/**
 * Toolbar block
 *
 * @since 3.2.13
 */
const ToolBar = {
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

/**
 * Breadcrumbs block
 *
 * @since 3.2.13
 */
const BreadCrumbs = {
  name: __("Bread crumbs", "uipress-lite"),
  moduleName: "uip-breadcrumbs",
  description: __("Shows the current page path (breadcrumbs)", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/breadcrumbs.min.js",
  icon: "label_important",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "iconSelect", componentName: "icon-select", uniqueKey: "breadIcon", label: __("Icon separator", "uipress-lite") }],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "crumb",
      label: __("Breadcrumb item", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-crumb",
    },
    {
      name: "icon",
      label: __("Icon separator", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-crumb-icon",
    },
  ],
};

/**
 * Fullscreen toggle block
 *
 * @since 3.2.13
 */
const FullScreenToggle = {
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

/**
 * Fullscreen toggle block
 *
 * @since 3.2.13
 */
const MenuToggle = {
  name: __("Menu collapse toggle", "uipress-lite"),
  moduleName: "menu-collapse-toggle",
  description: __("A customisable button that can toggle the admin menu collapse state.", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/menu-collapse-toggle.min.js",
  icon: "menu_open",
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
            string: __("Collapse menu", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite"), value: { value: "menu_open" } },
        { option: "iconSelect", uniqueKey: "collapsedIcon", componentName: "icon-select", label: __("Collapsed icon", "uipress-lite"), value: { value: "chevron_right" } },
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

/**
 * Open without Frame block
 *
 * @since 3.2.13
 */
const OpenWithoutFrame = {
  name: __("Open without frame", "uipress-lite"),
  moduleName: "uip-without-uipress",
  description: __("This will open the current page outside the current frame and optionally without UiPress all together", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/open-without-frame.min.js",
  icon: "whatshot",
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
            string: __("Open outside frame", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "openInNewTab",
          label: __("Behaviour", "uipress-lite"),
          args: {
            options: {
              false: {
                value: false,
                label: __("Default", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("New tab", "uipress-lite"),
              },
            },
          },
        },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "openWithoutUiPress",
          label: __("Load without uiPress", "uipress-lite"),
          args: {
            options: {
              false: {
                value: false,
                label: __("No", "uipress-lite"),
              },
              true: {
                value: true,
                label: __("Yes", "uipress-lite"),
              },
            },
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
    //Hover options group
    {
      name: "hover",
      label: __("Hover styles", "uipress-lite"),
      icon: "ads_click",
      styleType: "pseudo",
      class: ":hover",
    },
    //Hover options group
    {
      name: "active",
      label: __("Active styles", "uipress-lite"),
      icon: "ads_click",
      styleType: "pseudo",
      class: ":active",
    },
  ],
};

/**
 * Page loader indicator block
 *
 * @since 3.2.13
 */
const PageLoader = {
  name: __("Page loader", "uipress-lite"),
  moduleName: "uip-page-loader",
  description: __("This block allows you to place a loading bar wherever you choose and has the option to replace the bar with a custom image.", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/page-loader.min.js",
  icon: "cached",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "imageSelect", componentName: "inline-image-select", uniqueKey: "loaderImage", label: __("Image", "uipress-lite"), args: { hasPositioning: false } }],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
  ],
};

/**
 * AI chat block
 *
 * @since 3.2.13
 */
const AIChat = {
  name: __("Ai chat", "uipress-lite"),
  moduleName: "uip-ai-chat",
  description: __("This block allows you to add an ai chat to your templates. OpenAi (chatGPT) API key is required.", "uipress-lite"),
  group: "dynamic",
  path: "./blocks/dynamic/ai-chat.min.js",
  icon: "magic_button",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        {
          option: "textField",
          componentName: "uip-input",
          uniqueKey: "apiKey",
          label: __("openAI API key", "uipress-lite"),
          args: { password: true },
        },
        {
          option: "textField",
          componentName: "uip-input",
          uniqueKey: "welcomeMessage",
          label: __("Welcome message", "uipress-lite"),
          args: { password: false },
        },
        {
          option: "textField",
          componentName: "uip-input",
          uniqueKey: "systemMessage",
          label: __("System message", "uipress-lite"),
          args: { password: false },
          help: __(
            "The system message helps set the behavior of the assistant. For example, you can modify the personality of the assistant or provide specific instructions about how it should behave throughout the conversation.",
            "uipress-lite"
          ),
        },
        {
          option: "defaultSelect",
          componentName: "default-select",
          uniqueKey: "chatModel",
          args: {
            options: [
              {
                value: "gpt-3.5-turbo",
                label: "gpt-3.5-turbo",
              },
              {
                value: "gpt-3.5-turbo-16k",
                label: "gpt-3.5-turbo-16k",
              },
              {
                value: "gpt-4",
                label: "gpt-4",
              },
              {
                value: "gpt-4-32k",
                label: "gpt-4-32k",
              },
            ],
          },
          value: "gpt-3.5-turbo",
          label: __("Chat model", "uipress-lite"),
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
      name: "messagesArea",
      label: __("Messages area", "uipress-lite"),
      icon: "forum",
      styleType: "style",
      class: ".uip-chat-area",
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

    {
      name: "botMessage",
      label: __("Bot message", "uipress-lite"),
      icon: "sms",
      styleType: "style",
      class: ".uip-bot-message",
    },
    {
      name: "userMessage",
      label: __("User message", "uipress-lite"),
      icon: "sms",
      styleType: "style",
      class: ".uip-user-message",
    },

    {
      name: "chatInput",
      label: __("Chat input", "uipress-lite"),
      icon: "input",
      styleType: "style",
      class: ".uip-chat-input",
    },
  ],
};

/**
 * Pro block placeholders
 *
 * @since 3.2.13
 */

const MediaLibrary = {
  name: __("Media library", "uipress-lite"),
  moduleName: "uip-media-library",
  description: __("Outputs a media library, with upload, delete and folder features", "uipress-lite"),
  group: "dynamic",
  icon: "photo_library",
};

const PluginUpdates = {
  name: __("Plugin updates", "uipress-lite"),
  moduleName: "uip-plugin-updates",
  description: __("Outputs a list of available plugin and allows you update from the block", "uipress-lite"),
  group: "dynamic",
  icon: "upgrade",
};
const PluginSearch = {
  name: __("Plugin search", "uipress-lite"),
  moduleName: "uip-plugin-search",
  description: __("Search the plugin directory with quick filters, discover new plugins and install all from one block", "uipress-lite"),
  group: "dynamic",
  icon: "extension",
};
const GroupedDateRange = {
  name: __("Grouped Date range", "uipress-lite"),
  moduleName: "uip-grouped-date-range",
  description: __("Outputs a grouped date picker. This date picker is used for controlling it's siblings range such as analytic blocks.", "uipress-lite"),
  group: "dynamic",
  icon: "event",
};
const UserMeta = {
  name: __("User meta", "uipress-lite"),
  moduleName: "uip-user-meta-block",
  description: __("Outputs selected user meta, either as a string or an list of values", "uipress-lite"),
  group: "dynamic",
  icon: "manage_accounts",
};
const ContentNavigator = {
  name: __("Content navigator", "uipress-lite"),
  moduleName: "uip-content-navigator",
  description: __("Creates a navigatable file tree of all your site content like posts, pages and media. Allows for creation of new folders and organisation of content", "uipress-lite"),
  group: "dynamic",
  icon: "folder_open",
};

const OrdersKanban = {
  name: __("Orders kanban", "uipress-lite"),
  moduleName: "orders-kanban",
  description: __("Creates a kanban view of recent woocommerce orders and allows for drag and drop management", "uipress-lite"),
  group: "dynamic",
  icon: "view_kanban",
};
const SiteNotifications = {
  name: __("Site notifications", "uipress-lite"),
  moduleName: "site-notifications",
  description: __("Collects all site notifications and displays theme inside thise block", "uipress-lite"),
  group: "dynamic",
  icon: "notifications",
};

(function () {
  const blocks = [
    AdminMenu,
    AdminMenuNew,
    MenuToggle,
    PageContent,
    PostTable,
    RecentPosts,
    Search,
    ToolBar,
    BreadCrumbs,
    FullScreenToggle,
    OpenWithoutFrame,
    PageLoader,
    AIChat,
    MediaLibrary,
    PluginUpdates,
    PluginSearch,
    GroupedDateRange,
    UserMeta,
    ContentNavigator,
    OrdersKanban,
    SiteNotifications,
  ];
  wp.hooks.addFilter("uipress.blocks.register", "uipress", (currentBlocks) => [...currentBlocks, ...blocks]);
})();
