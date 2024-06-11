const { __ } = wp.i18n;
/**
 * Container block
 *
 * @since 3.2.13
 */
export const metadata = {
  name: __("Quote", "uipress-lite"),
  moduleName: "uip-qupote",
  description: __("Displays a quote in a decorative way", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/quote.min.js",
  icon: "format_quote",
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
          uniqueKey: "quote",
          label: __("Quote", "uipress-lite"),
          value: {
            string: __("When the power of love overcomes the love of power, the world will know peace", "uipress-lite"),
          },
        },
        {
          option: "title",
          componentName: "uip-dynamic-input",
          uniqueKey: "quoteAuthor",
          label: __("Quote meta", "uipress-lite"),
          value: {
            string: __("Jimi Hendrix", "uipress-lite"),
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
      name: "quote",
      label: __("Quote", "uipress-lite"),
      icon: "format_quote",
      styleType: "style",
      class: ".uip-block-quote",
    },
    {
      name: "quoteAuthor",
      label: __("Quote meta", "uipress-lite"),
      icon: "format_quote",
      styleType: "style",
      class: ".uip-quote-meta",
    },
  ],
};
