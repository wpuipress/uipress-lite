import { __ } from "@wordpress/i18n";
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
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
