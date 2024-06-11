const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
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
