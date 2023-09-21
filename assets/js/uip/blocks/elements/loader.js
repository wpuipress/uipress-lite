///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;
const uipress = new window.uipClass();
export function fetchBlocks() {
  return [
    /**
     * Button block options
     * @since 3.0.0
     */
    {
      name: __('Button', 'uipress-lite'),
      moduleName: 'uip-block-button',
      description: __('Creates a button link', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/button.min.js',
      icon: 'smart_button',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            {
              option: 'title',
              uniqueKey: 'buttonText',
              label: __('Button text', 'uipress-lite'),
              value: {
                string: __('Press me', 'uipress-lite'),
                dynamic: false,
                dynamicKey: '',
                dynamicPos: 'left',
              },
            },
            { option: 'linkSelect', label: __('Link', 'uipress-lite') },
            { option: 'iconSelect', label: __('Icon', 'uipress-lite') },
            {
              option: 'choiceSelect',
              uniqueKey: 'iconPosition',
              args: {
                options: {
                  left: {
                    value: 'left',
                    label: __('Left', 'uipress-lite'),
                  },
                  right: {
                    value: 'right',
                    label: __('Right', 'uipress-lite'),
                  },
                },
              },
              label: __('Icon position', 'uipress-lite'),
              value: { value: 'left' },
            },
            { option: 'onClickCode', label: __('JS on click', 'uipress-lite') },
          ],
        },
        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'icon',
          label: __('Icon', 'uipress-lite'),
          icon: 'favorite',
          styleType: 'style',
          class: '.uip-icon',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Heading block
     * @since 3.0.0
     */
    {
      name: __('Heading', 'uipress-lite'),
      moduleName: 'uip-heading',
      description: __('Creates a heading block', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/heading.min.js',
      icon: 'text_fields',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            {
              option: 'title',
              uniqueKey: 'headingText',
              label: __('Heading text', 'uipress-lite'),
              value: {
                string: __('Heading text', 'uipress-lite'),
                dynamic: false,
                dynamicKey: '',
                dynamicPos: 'left',
              },
            },
            { option: 'headingType', label: __('Heading type', 'uipress-lite'), value: 'h2' },
            { option: 'iconSelect', label: __('Icon', 'uipress-lite') },
            { option: 'iconPosition', label: __('Icon position', 'uipress-lite') },
          ],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Contentclass: '.uip-top-level-item',
        {
          name: 'iconStyle',
          label: __('Icon', 'uipress-lite'),
          icon: 'favorite',
          styleType: 'style',
          class: '.uip-icon',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Pargraph block
     * @since 3.0.0
     */
    {
      name: __('Paragraph', 'uipress-lite'),
      moduleName: 'uip-paragraph',
      description: __('Creates a paragraph block', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/paragraph.min.js',
      icon: 'segment',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [{ option: 'paragraph', label: __('Content', 'uipress-lite'), args: { fullWidth: true } }],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Image block
     * @since 3.0.0
     */
    {
      name: __('Image', 'uipress-lite'),
      moduleName: 'uip-image',
      description: __('Creates a image block', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/image.min.js',
      icon: 'image',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [{ option: 'imageSelect', uniqueKey: 'userImage', label: __('Image', 'uipress-lite'), args: { hasPositioning: false } }],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Accordion block
     * @since 3.0.0
     */
    {
      name: __('Accordion', 'uipress-lite'),
      moduleName: 'uip-accordion',
      description: __('Creates a accordion block', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/accordion.min.js',
      icon: 'add',
      content: [],
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            { option: 'iconSelect', label: __('Icon', 'uipress-lite'), value: { value: 'star' } },
            {
              option: 'title',
              uniqueKey: 'headingText',
              label: __('Accordion title', 'uipress-lite'),
              value: {
                string: __('Accordion title', 'uipress-lite'),
                dynamic: false,
                dynamicKey: '',
                dynamicPos: 'left',
              },
            },
          ],
        },
        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Contentclass
        {
          name: 'contentStyle',
          label: __('Content style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          class: '.uip-accordion-body',
          options: uipress.returnDefaultOptions(true),
        },
        //Contentclass
        {
          name: 'triggerStyle',
          label: __('Chevron style', 'uipress-lite'),
          icon: 'chevron_left',
          styleType: 'style',
          class: '.uip-accordion-trigger',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Icon block
     * @since 3.0.0
     */
    {
      name: __('Icon', 'uipress-lite'),
      moduleName: 'uip-icon',
      description: __('Creates a icon block', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/icon.min.js',
      icon: 'interests',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [{ option: 'iconSelect', label: __('Icon', 'uipress-lite'), value: { value: 'favorite' } }],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Dark mode
     * @since 3.0.0
     */
    {
      name: __('Dark mode', 'uipress-lite'),
      moduleName: 'uip-dark-toggle',
      description: __('Outputs a toggle for switiching between light and dark modes', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/dark-mode-toggle.min.js',
      icon: 'dark_mode',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [{ option: 'trueFalse', uniqueKey: 'prefersColorScheme', label: __('Auto detect color theme?', 'uipress-lite'), args: { asText: true } }],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },

        //Container options group
        {
          name: 'inactive',
          label: __('Inactive toggle', 'uipress-lite'),
          icon: 'toggle_off',
          styleType: 'style',
          class: 'input + .uip-slider:before',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'active',
          label: __('Active toggle', 'uipress-lite'),
          icon: 'toggle_on',
          styleType: 'style',
          class: 'input:checked + .uip-slider:before',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'Track',
          label: __('Track', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          class: '.uip-slider',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Tabs
     * @since 3.0.0
     */
    {
      name: __('Tabs', 'uipress-lite'),
      moduleName: 'tab-nav',
      description: __('Create a tabbed navigation with different styles', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/tabs.min.js',
      icon: 'tab',
      settings: {},
      content: [],
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [{ option: 'tabCreator', uniqueKey: 'tabs', label: __('Tabs', 'uipress-lite') }],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'tabItem',
          label: __('Tab item', 'uipress-lite'),
          icon: 'tab',
          styleType: 'style',
          class: '.uip-tab-item',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'tabItemHover',
          label: __('Tab item hover', 'uipress-lite'),
          icon: 'ads_click',
          styleType: 'style',
          class: '.uip-tab-item:hover',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'tabItemActive',
          label: __('Tab item active', 'uipress-lite'),
          icon: 'ads_click',
          styleType: 'style',
          class: '.uip-tab-item-active',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'tabContent',
          label: __('Tab content', 'uipress-lite'),
          icon: 'smart_button',
          styleType: 'style',
          class: '.uip-tab-content-area',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * To do list
     * @since 3.0.0
     */
    {
      name: __('To do list', 'uipress-lite'),
      moduleName: 'todo-list',
      description: __('Outputs a customisable to do list', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/todo-list.min.js',
      icon: 'task_alt',
      settings: {},
      optionsEnabled: [
        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'button',
          label: __('Add todo button', 'uipress-lite'),
          icon: 'smart_button',
          styleType: 'style',
          class: '.uip-add-todo',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'tabs',
          label: __('Tabs', 'uipress-lite'),
          icon: 'tab',
          styleType: 'style',
          class: '.uip-tabs',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'tab',
          label: __('Tab', 'uipress-lite'),
          icon: 'tab',
          styleType: 'style',
          class: '.uip-tab',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'tabsactive',
          label: __('Active tab', 'uipress-lite'),
          icon: 'tab',
          styleType: 'style',
          class: '.uip-tab-active',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'listArea',
          label: __('List area', 'uipress-lite'),
          icon: 'list',
          styleType: 'style',
          class: '.uip-list-area',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'itemTitle',
          label: __('Item title', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-list-item-title',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'itemDescription',
          label: __('Item description', 'uipress-lite'),
          icon: 'description',
          styleType: 'style',
          class: '.uip-list-item-description',
          options: uipress.returnDefaultOptions(),
        },

        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Video
     * @since 3.0.0
     */
    {
      name: __('Video', 'uipress-lite'),
      moduleName: 'uip-video',
      description: __('Outputs a video block. Can be a direct URL, media library link or embed', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/video.min.js',
      icon: 'play_arrow',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            { option: 'textField', uniqueKey: 'videoURL', label: __('Video URL', 'uipress-lite'), value: 'https://www.youtube.com/embed/ZgCY96vPUGI' },
            { option: 'youtubeEmbed', uniqueKey: 'youtube', label: __('Video embed', 'uipress-lite') },
          ],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'video',
          label: __('Video', 'uipress-lite'),
          icon: 'play_arrow',
          styleType: 'style',
          class: '.uip-video',
          options: uipress.returnDefaultOptions(),
        },

        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Video
     * @since 3.0.0
     */
    {
      name: __('Quote', 'uipress-lite'),
      moduleName: 'uip-qupote',
      description: __('Displays a quote in a decorative way', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/quote.min.js',
      icon: 'format_quote',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            {
              option: 'title',
              uniqueKey: 'quote',
              label: __('Quote', 'uipress-lite'),
              value: {
                string: __('When the power of love overcomes the love of power, the world will know peace', 'uipress-lite'),
              },
            },
            {
              option: 'title',
              uniqueKey: 'quoteAuthor',
              label: __('Quote meta', 'uipress-lite'),
              value: {
                string: __('Jimi Hendrix', 'uipress-lite'),
              },
            },
          ],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'quote',
          label: __('Quote', 'uipress-lite'),
          icon: 'format_quote',
          styleType: 'style',
          class: '.uip-block-quote',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'quoteAuthor',
          label: __('Quote meta', 'uipress-lite'),
          icon: 'format_quote',
          styleType: 'style',
          class: '.uip-quote-meta',
          options: uipress.returnDefaultOptions(),
        },

        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    /**
     * Button block options
     * @since 3.0.0
     */
    {
      name: __('Exit to dashboard', 'uipress-lite'),
      moduleName: 'uip-exit-dash-button',
      description: __('This button is designed for admins with active ui templates. When clicked it will remove the current UI layer and display the default WordPress admin page', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      path: '../blocks/elements/exit-to-dashboard.min.js',
      icon: 'exit_to_app',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            {
              option: 'title',
              uniqueKey: 'buttonText',
              label: __('Button text', 'uipress-lite'),
              value: {
                string: __('Exit to admin', 'uipress-lite'),
              },
            },
            { option: 'iconSelect', label: __('Icon', 'uipress-lite') },
            { option: 'iconPosition', label: __('Icon position', 'uipress-lite') },
          ],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(),
        },
        //Hover options group
        {
          name: 'hover',
          label: __('Hover styles', 'uipress-lite'),
          icon: 'ads_click',
          styleType: 'pseudo',
          class: ':hover',
          options: uipress.returnDefaultOptions(),
        },
        //Hover options group
        {
          name: 'active',
          label: __('Active styles', 'uipress-lite'),
          icon: 'ads_click',
          styleType: 'pseudo',
          class: ':active',
          options: uipress.returnDefaultOptions(),
        },
        //Advanced options group
        {
          name: 'advanced',
          label: __('Advanced', 'uipress-lite'),
          icon: 'code',
          options: uipress.returnAdvancedOptions(),
        },
      ],
    },

    {
      name: __('iFrame', 'uipress-pro'),
      moduleName: 'uip-iframe',
      description: __('Outputs a iframe block', 'uipress-pro'),
      category: __('Dynamic', 'uipress-pro'),
      group: 'elements',
      icon: 'public',
    },

    {
      name: __('HTML', 'uipress-lite'),
      moduleName: 'uip-custom-html',
      description: __('This block allows you to output your own HTML into the template', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      icon: 'code',
    },
    {
      name: __('Icon list', 'uipress-lite'),
      moduleName: 'uip-icon-list-block',
      description: __('Creates a list with icons', 'uipress-lite'),
      category: __('Elements', 'uipress-lite'),
      group: 'elements',
      icon: 'list',
    },
    {
      name: __('Shortcode', 'uipress-lite'),
      moduleName: 'uip-shortcode',
      description: __('This block allows you to output custom shortcodes into the template', 'uipress-lite'),
      category: __('Elements', 'uipress-pro'),
      group: 'elements',
      icon: 'code_blocks',
    },
  ];
}
