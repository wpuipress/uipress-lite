import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
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
