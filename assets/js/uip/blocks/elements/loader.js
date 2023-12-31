///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;

/**
 * Button block
 *
 * @since 3.2.13
 */
const Button = {
  name: __("Button", "uipress-lite"),
  moduleName: "uip-block-button",
  description: __("Creates a button link", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/button.min.js",
  icon: "smart_button",
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
            string: __("Press me", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        { option: "linkSelect", componentName: "link-select", label: __("Link", "uipress-lite") },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite") },
        {
          option: "choiceSelect",
          componentName: "choice-select",
          uniqueKey: "iconPosition",
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
        { option: "onClickCode", componentName: "code-editor", args: { language: "javascript" }, requiresUpgrade: true, label: __("JS on click", "uipress-lite") },
      ],
    },
    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "icon",
      label: __("Icon", "uipress-lite"),
      icon: "favorite",
      styleType: "style",
      class: ".uip-icon",
    },
  ],
};

/**
 * Heading block
 *
 * @since 3.2.13
 */
const Heading = {
  name: __("Heading", "uipress-lite"),
  moduleName: "uip-heading",
  description: __("Creates a heading block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/heading.min.js",
  icon: "text_fields",
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
          uniqueKey: "headingText",
          label: __("Heading text", "uipress-lite"),
          value: {
            string: __("Heading text", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
          },
        },
        {
          option: "headingType",
          componentName: "default-select",
          args: {
            options: [
              {
                value: "h1",
                label: "h1",
              },
              {
                value: "h2",
                label: "h2",
              },
              {
                value: "h3",
                label: "h3",
              },
              {
                value: "h4",
                label: "h4",
              },
              {
                value: "h5",
                label: "h5",
              },
              {
                value: "p",
                label: "p",
              },
            ],
          },
          label: __("Heading type", "uipress-lite"),
          value: "h2",
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite") },
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
      name: "iconStyle",
      label: __("Icon", "uipress-lite"),
      icon: "favorite",
      styleType: "style",
      class: ".uip-icon",
    },
  ],
};

/**
 * Paragraph block
 *
 * @since 3.2.13
 */
const Paragraph = {
  name: __("Paragraph", "uipress-lite"),
  moduleName: "uip-paragraph",
  description: __("Creates a paragraph block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/paragraph.min.js",
  icon: "segment",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        {
          option: "paragraph",
          componentName: "uip-paragraph-input",
          value: "Mauris placerat tortor non enim commodo interdum. Sed gravida sagittis magna. Suspendisse non metus sagittis neque mollis consectetur.",
          label: __("Content", "uipress-lite"),
          args: { fullWidth: true },
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
 * Image block
 *
 * @since 3.2.13
 */
const Image = {
  name: __("Image", "uipress-lite"),
  moduleName: "uip-image",
  description: __("Creates a image block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/image.min.js",
  icon: "image",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "imageSelect", componentName: "inline-image-select", uniqueKey: "userImage", label: __("Image", "uipress-lite"), args: { hasPositioning: false } }],
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
 * Accordion block
 *
 * @since 3.2.13
 */
const Accordion = {
  name: __("Accordion", "uipress-lite"),
  moduleName: "uip-accordion",
  description: __("Creates a accordion block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/accordion.min.js",
  icon: "add",
  content: [],
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite"), value: { value: "star" } },
        {
          option: "title",
          componentName: "uip-dynamic-input",
          uniqueKey: "headingText",
          label: __("Accordion title", "uipress-lite"),
          value: {
            string: __("Accordion title", "uipress-lite"),
            dynamic: false,
            dynamicKey: "",
            dynamicPos: "left",
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
    //Contentclass
    {
      name: "contentStyle",
      label: __("Content style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
      class: ".uip-accordion-body",
    },
    //Contentclass
    {
      name: "triggerStyle",
      label: __("Chevron style", "uipress-lite"),
      icon: "chevron_left",
      styleType: "style",
      class: ".uip-accordion-trigger",
    },
  ],
};

/**
 * Icon block
 *
 * @since 3.2.13
 */
const Icon = {
  name: __("Icon", "uipress-lite"),
  moduleName: "uip-icon",
  description: __("Creates a icon block", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/icon.min.js",
  icon: "interests",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [{ option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite"), value: { value: "favorite" } }],
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
 * Dark mode block
 *
 * @since 3.2.13
 */
const DarkMode = {
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

/**
 * Tab block
 *
 * @since 3.2.13
 */
const Tabs = {
  name: __("Tabs", "uipress-lite"),
  moduleName: "tab-nav",
  description: __("Create a tabbed navigation with different styles", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/tabs.min.js",
  icon: "tab",
  content: [],
  optionsEnabled: [
    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "tabItem",
      label: __("Tab item", "uipress-lite"),
      icon: "tab",
      styleType: "style",
      class: ".uip-tab-item",
    },
    {
      name: "tabItemHover",
      label: __("Tab item hover", "uipress-lite"),
      icon: "ads_click",
      styleType: "style",
      class: ".uip-tab-item:hover",
    },
    {
      name: "tabItemActive",
      label: __("Tab item active", "uipress-lite"),
      icon: "ads_click",
      styleType: "style",
      class: ".uip-tab-item-active",
    },
    {
      name: "tabContent",
      label: __("Tab content", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-tab-content-area",
    },
  ],
};

/**
 * Todo block
 *
 * @since 3.2.13
 */
const ToDo = {
  name: __("To do list", "uipress-lite"),
  moduleName: "todo-list",
  description: __("Outputs a customisable to do list", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/todo-list.min.js",
  icon: "task_alt",
  optionsEnabled: [
    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "button",
      label: __("Add todo button", "uipress-lite"),
      icon: "smart_button",
      styleType: "style",
      class: ".uip-add-todo",
    },
    {
      name: "tabs",
      label: __("Tabs", "uipress-lite"),
      icon: "tab",
      styleType: "style",
      class: ".uip-tabs",
    },
    {
      name: "tab",
      label: __("Tab", "uipress-lite"),
      icon: "tab",
      styleType: "style",
      class: ".uip-tab",
    },
    {
      name: "tabsactive",
      label: __("Active tab", "uipress-lite"),
      icon: "tab",
      styleType: "style",
      class: ".uip-tab-active",
    },
    {
      name: "listArea",
      label: __("List area", "uipress-lite"),
      icon: "list",
      styleType: "style",
      class: ".uip-list-area",
    },
    {
      name: "itemTitle",
      label: __("Item title", "uipress-lite"),
      icon: "title",
      styleType: "style",
      class: ".uip-list-item-title",
    },
    {
      name: "itemDescription",
      label: __("Item description", "uipress-lite"),
      icon: "description",
      styleType: "style",
      class: ".uip-list-item-description",
    },
  ],
};

/**
 * Video block
 *
 * @since 3.2.13
 */
const Video = {
  name: __("Video", "uipress-lite"),
  moduleName: "uip-video",
  description: __("Outputs a video block. Can be a direct URL, media library link or embed", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/video.min.js",
  icon: "play_arrow",
  optionsEnabled: [
    //Block options group
    {
      name: "block",
      label: __("Block options", "uipress-lite"),
      icon: "check_box_outline_blank",
      options: [
        { option: "textField", componentName: "uip-input", uniqueKey: "videoURL", label: __("Video URL", "uipress-lite"), value: "https://player.vimeo.com/video/794492622?h=31cc9f209b" },
        { option: "youtubeEmbed", componentName: "code-editor", args: { language: "html" }, uniqueKey: "youtube", label: __("Video embed", "uipress-lite") },
      ],
    },

    {
      name: "style",
      label: __("Style", "uipress-lite"),
      icon: "palette",
      styleType: "style",
    },
    {
      name: "video",
      label: __("Video", "uipress-lite"),
      icon: "play_arrow",
      styleType: "style",
      class: ".uip-video",
    },
  ],
};

/**
 * Quote block
 *
 * @since 3.2.13
 */
const Quote = {
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

/**
 * Exit to dashboard block
 *
 * @since 3.2.13
 */
const ExitDashboard = {
  name: __("Exit to dashboard", "uipress-lite"),
  moduleName: "uip-exit-dash-button",
  description: __("This button is designed for admins with active ui templates. When clicked it will remove the current UI layer and display the default WordPress admin page", "uipress-lite"),
  group: "elements",
  path: "./blocks/elements/exit-to-dashboard.min.js",
  icon: "exit_to_app",
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
            string: __("Exit to admin", "uipress-lite"),
          },
        },
        { option: "iconSelect", componentName: "icon-select", label: __("Icon", "uipress-lite") },
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
 * Pro placeholders
 *
 * @since 3.2.13
 */

const IFrame = {
  name: __("iFrame", "uipress-pro"),
  moduleName: "uip-iframe",
  description: __("Outputs a iframe block", "uipress-pro"),
  category: __("Dynamic", "uipress-pro"),
  group: "elements",
  icon: "public",
};

const HTMLblock = {
  name: __("HTML", "uipress-lite"),
  moduleName: "uip-custom-html",
  description: __("This block allows you to output your own HTML into the template", "uipress-lite"),
  group: "elements",
  icon: "code",
};
const IconList = {
  name: __("Icon list", "uipress-lite"),
  moduleName: "uip-icon-list-block",
  description: __("Creates a list with icons", "uipress-lite"),
  group: "elements",
  icon: "list",
};
const ShortCode = {
  name: __("Shortcode", "uipress-lite"),
  moduleName: "uip-shortcode",
  description: __("This block allows you to output custom shortcodes into the template", "uipress-lite"),
  category: __("Elements", "uipress-pro"),
  group: "elements",
  icon: "code_blocks",
};

(function () {
  const blocks = [Button, Heading, Paragraph, Image, Accordion, Icon, DarkMode, Tabs, ToDo, Video, Quote, ExitDashboard, IFrame, HTMLblock, IconList, ShortCode];
  wp.hooks.addFilter("uipress.blocks.register", "uipress", (currentBlocks) => [...currentBlocks, ...blocks]);
})();
