const { __, _x, _n, _nx } = wp.i18n;
const uipress = new window.uipClass();
export function fetchBlocks() {
  return [
    /**
     * Admin menu options
     * @since 3.0.0
     */
    {
      name: __('Admin menu', 'uipress-lite'),
      moduleName: 'uip-admin-menu',
      description: __('Outputs the admin menu', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/admin-menu.min.js',
      icon: 'sort',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            //{ option: 'choiceSelect', args: { type: 'hideShow' }, uniqueKey: 'hideScreenOptions', label: __('Screen options', 'uipress-lite') },
            //{ option: 'choiceSelect', args: { type: 'enabledDisabled' }, uniqueKey: 'disableTheme', label: __('Admin theme', 'uipress-lite') },

            {
              option: 'choiceSelect',
              uniqueKey: 'subMenuStyle',
              value: { value: 'dynamic' },
              args: {
                options: {
                  inline: { value: 'inline', label: __('Inline', 'uipress-lite') },
                  hover: { value: 'hover', label: __('Hover', 'uipress-lite') },
                  dynamic: { value: 'dynamic', label: __('Dynamic', 'uipress-lite') },
                },
              },
              label: __('Behaviour', 'uipress-lite'),
            },
            {
              option: 'choiceSelect',
              uniqueKey: 'menuDirection',
              label: __('Direction', 'uipress-lite'),
              args: {
                options: {
                  vertical: {
                    value: 'vertical',
                    label: __('Vertical', 'uipress-lite'),
                  },
                  horizontal: {
                    value: 'horizontal',
                    label: __('Horizontal', 'uipress-lite'),
                  },
                },
              },
              value: {
                value: 'vertical',
              },
            },
            { option: 'advancedMenuEditing', uniqueKey: 'advancedoptions', label: __('Menu editor', 'uipress-lite') },
            { option: 'choiceSelect', uniqueKey: 'menuCollapse', args: { type: 'hideShow' }, label: __('Collapse option', 'uipress-lite') },
            {
              option: 'choiceSelect',
              uniqueKey: 'disableAutoUpdate',
              args: { type: 'enabledDisabled' },
              label: __('Auto update', 'uipress-lite'),
              help: __('Auto update will automatically update the menu when new plugins are or menu items are added.', 'uipress-lite'),
            },
            {
              option: 'choiceSelect',
              uniqueKey: 'loadOnClick',
              args: { type: 'enabledDisabled' },
              label: __('Auto load', 'uipress-lite'),
              help: __('Auto load will load top level menu items whe you click on them. If disabled clicking top level items will simply open the items submenu.', 'uipress-lite'),
            },
            //{ option: 'hiddenMenuItems', label: __('Hiden menu items', 'uipress-lite') },
            //{ option: 'editMenuItems', label: __('Menu options', 'uipress-lite') },

            { option: 'choiceSelect', args: { type: 'hideShow' }, uniqueKey: 'hideIcons', label: __('Icons', 'uipress-lite') },

            { option: 'iconSelect', uniqueKey: 'subMenuIcon', label: __('Submenu Icon', 'uipress-lite') },
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
        //Menu headers
        {
          name: 'topLevelItems',
          label: __('Menu headers', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-top-level-item',
          options: uipress.returnDefaultOptions(),
        },
        //Menu headers hover
        {
          name: 'topLevelItemsHover',
          label: __('Menu headers hover', 'uipress-lite'),
          icon: 'ads_click',
          styleType: 'style',
          class: '.uip-top-level-item:hover',
          options: uipress.returnDefaultOptions(),
        },
        //Menu headers active
        {
          name: 'topLevelItemsActive',
          label: __('Menu headers active', 'uipress-lite'),
          icon: 'ads_click',
          styleType: 'style',
          class: '.uip-top-level-item-active',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'separators',
          label: __('Menu sepators', 'uipress-lite'),
          icon: 'view_list',
          styleType: 'style',
          class: '.uip-menu-separator',
          options: uipress.returnDefaultOptions(),
        },
        //Submenu
        {
          name: 'submenu',
          label: __('Submenu', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          class: '.uip-admin-submenu',
          options: uipress.returnDefaultOptions(),
        },
        //Sub menu items
        {
          name: 'subMenuIcons',
          label: __('Header submenu icon', 'uipress-lite'),
          icon: 'favorite',
          styleType: 'style',
          class: '.uip-submenu-icon',
          options: uipress.returnDefaultOptions(),
        },
        //Sub menu items
        {
          name: 'subMenuHeader',
          label: __('Sub menu header', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-sub-menu-header',
          options: uipress.returnDefaultOptions(),
        },

        //Sub menu items
        {
          name: 'subLevelItems',
          label: __('Sub menu items', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-sub-level-item',
          options: uipress.returnDefaultOptions(),
        },
        //Sub menu items hover
        {
          name: 'subLevelItemsHover',
          label: __('Sub menu items hover', 'uipress-lite'),
          icon: 'ads_click',
          styleType: 'style',
          class: '.uip-sub-level-item:hover',
          options: uipress.returnDefaultOptions(),
        },
        //Sub menu items active
        {
          name: 'subLevelItemsActive',
          label: __('Sub menu items active', 'uipress-lite'),
          icon: 'ads_click',
          styleType: 'style',
          class: '.uip-sub-level-item-active',
          options: uipress.returnDefaultOptions(),
        },
        //Menu icons
        {
          name: 'icons',
          label: __('Icons', 'uipress-lite'),
          icon: 'star',
          styleType: 'style',
          class: '.uip-menu-icon',
          options: uipress.returnDefaultOptions(),
        },

        //Notifications
        {
          name: 'notifications',
          label: __('Notifications', 'uipress-lite'),
          icon: 'notifications',
          styleType: 'style',
          class: '.uip-menu-notification',
          options: uipress.returnDefaultOptions(),
        },
        //Notifications
        {
          name: 'menuCollapse',
          label: __('Menu collapse', 'uipress-lite'),
          icon: 'menu_open',
          styleType: 'style',
          class: '.uip-menu-collapse',
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
      name: __('Admin menu', 'uipress-lite'),
      moduleName: 'uip-admin-menu-new',
      description: __('Outputs the admin menu', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/admin-menu-new.min.js',
      icon: 'sort',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            {
              option: 'choiceSelect',
              uniqueKey: 'subMenuStyle',
              value: { value: 'inline' },
              args: {
                options: {
                  inline: { value: 'inline', label: __('Inline', 'uipress-lite') },
                  hover: { value: 'hover', label: __('Hover', 'uipress-lite') },
                  dynamic: { value: 'dynamic', label: __('Dynamic', 'uipress-lite') },
                },
              },
              label: __('Behaviour', 'uipress-lite'),
            },
            {
              option: 'defaultSelect',
              uniqueKey: 'dropdownPosition',
              args: {
                options: [
                  {
                    value: 'bottom-left',
                    label: __('Bottom left', 'uipress-lite'),
                  },
                  {
                    value: 'bottom-right',
                    label: __('Bottom right', 'uipress-lite'),
                  },
                  {
                    value: 'top-left',
                    label: __('Top left', 'uipress-lite'),
                  },
                  {
                    value: 'top-right',
                    label: __('Top right', 'uipress-lite'),
                  },
                  {
                    value: 'left',
                    label: __('Left', 'uipress-lite'),
                  },
                  {
                    value: 'right',
                    label: __('Right', 'uipress-lite'),
                  },
                ],
              },
              value: 'right',
              label: __('Drop posisition', 'uipress-lite'),
            },
            {
              option: 'choiceSelect',
              uniqueKey: 'showSearch',
              args: {
                options: {
                  true: {
                    value: true,
                    label: __('Show', 'uipress-lite'),
                  },
                  false: {
                    value: false,
                    label: __('Hide', 'uipress-lite'),
                  },
                },
              },
              label: __('Menu search', 'uipress-lite'),
              value: { value: true },
            },
            {
              option: 'choiceSelect',
              uniqueKey: 'menuCollapse',
              args: {
                options: {
                  true: {
                    value: true,
                    label: __('Show', 'uipress-lite'),
                  },
                  false: {
                    value: false,
                    label: __('Hide', 'uipress-lite'),
                  },
                },
              },
              label: __('Collapse option', 'uipress-lite'),
              value: { value: true },
            },

            {
              option: 'choiceSelect',
              uniqueKey: 'loadOnClick',
              args: { type: 'enabledDisabled' },
              label: __('Auto load', 'uipress-lite'),
              value: true,
              help: __('Auto load will load top level menu items whe you click on them. If disabled clicking top level items will simply open the items submenu.', 'uipress-lite'),
            },

            { option: 'choiceSelect', args: { type: 'hideShow' }, uniqueKey: 'hideIcons', label: __('Icons', 'uipress-lite') },

            { option: 'iconSelect', uniqueKey: 'subMenuIcon', label: __('Submenu Icon', 'uipress-lite') },
            //{
            //option: 'customMenu',
            //uniqueKey: 'customMenu',
            //label: __('Custom menu', 'uipress-lite'),
            //help: __(
            //"uiPress will normally pull the default menu or active menu from the menu builder. Using this option will load a specific menu from the menu builder. Please bare in mind this menu //will be static and won't respond to site changes.",
            //'uipress-lite'
            //),
            //},
          ],
        },

        //Container options group
        {
          name: 'style',
          label: __('Style', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          options: uipress.returnDefaultOptions(true, false, {
            flexLayout: {
              direction: 'column',
              distribute: 'start',
              align: 'stretch',
              wrap: 'nowrap',
              type: 'stack',
              placeContent: 'normal',
              gap: {
                value: 12,
                units: 'px',
              },
            },
          }),
        },
        //Menu headers
        {
          name: 'topLevelItems',
          label: __('Menu headers', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-top-level-item',
          options: uipress.returnDefaultOptions(true, false, {
            flexLayout: {
              direction: 'row',
              distribute: 'start',
              align: 'center',
              wrap: 'nowrap',
              type: 'stack',
              placeContent: 'normal',
              gap: {
                value: 8,
                units: 'px',
              },
            },
          }),
        },
        {
          name: 'separators',
          label: __('Menu sepators', 'uipress-lite'),
          icon: 'view_list',
          styleType: 'style',
          class: '.uip-menu-separator',
          options: uipress.returnDefaultOptions(),
        },
        //Submenu
        {
          name: 'submenu',
          label: __('Submenu', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          class: '.uip-admin-submenu',
          options: uipress.returnDefaultOptions(true, false, {
            flexLayout: {
              direction: 'column',
              distribute: 'start',
              align: 'stretch',
              wrap: 'nowrap',
              type: 'stack',
              placeContent: 'normal',
              gap: {
                value: 4,
                units: 'px',
              },
            },
            spacing: {
              margin: {
                preset: 'custom',
                sync: false,
                left: 22,
                top: 4,
                bottom: 8,
                right: 0,
                units: 'px',
              },
            },
          }),
        },
        //Sub menu items
        {
          name: 'subMenuIcons',
          label: __('Header submenu icon', 'uipress-lite'),
          icon: 'favorite',
          styleType: 'style',
          class: '.uip-submenu-icon',
          options: uipress.returnDefaultOptions(),
        },
        //Sub menu items
        {
          name: 'subMenuHeader',
          label: __('Sub menu header', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-sub-menu-header',
          options: uipress.returnDefaultOptions(),
        },

        //Sub menu items
        {
          name: 'subLevelItems',
          label: __('Sub menu items', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-sub-level-item',
          options: uipress.returnDefaultOptions(),
        },
        //Menu icons
        {
          name: 'icons',
          label: __('Icons', 'uipress-lite'),
          icon: 'star',
          styleType: 'style',
          class: '.uip-menu-icon',
          options: uipress.returnDefaultOptions(),
        },

        //Notifications
        {
          name: 'notifications',
          label: __('Notifications', 'uipress-lite'),
          icon: 'notifications',
          styleType: 'style',
          class: '.uip-menu-notification',
          options: uipress.returnDefaultOptions(),
        },
        //Notifications
        {
          name: 'menuCollapse',
          label: __('Menu collapse', 'uipress-lite'),
          icon: 'menu_open',
          styleType: 'style',
          class: '.uip-menu-collapse',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'menuSearch',
          label: __('Menu search', 'uipress-lite'),
          icon: 'manage_search',
          styleType: 'style',
          class: '.uip-menu-search',
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
     * Page content
     * @since 3.0.0
     */
    {
      name: __('Page content', 'uipress-lite'),
      moduleName: 'uip-content',
      description: __('Outputs the page content block', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/content.min.js',
      icon: 'list_alt',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            { option: 'choiceSelect', args: { type: 'hideShow' }, uniqueKey: 'hideScreenOptions', label: __('Screen options', 'uipress-lite') },
            { option: 'choiceSelect', args: { type: 'hideShow' }, uniqueKey: 'hideHelpTab', label: __('Help tab', 'uipress-lite') },
            { option: 'choiceSelect', args: { type: 'enabledDisabled' }, uniqueKey: 'disableTheme', label: __('Admin theme', 'uipress-lite') },
            { option: 'choiceSelect', args: { type: 'enabledDisabled' }, uniqueKey: 'disableFullScreen', label: __('Fullscreen', 'uipress-lite') },
            { option: 'choiceSelect', args: { type: 'hideShow' }, uniqueKey: 'hidePluginNotices', label: __('Plugin notices', 'uipress-lite') },
            { option: 'choiceSelect', args: { type: 'hideShow' }, uniqueKey: 'hideLoader', label: __('Loading bar', 'uipress-lite') },
            { option: 'startPage', args: { hideLinkType: true }, uniqueKey: 'loginRedirect', label: __('Login redirect', 'uipress-lite') },
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
          name: 'iFrame',
          label: __('Content frame', 'uipress-lite'),
          icon: 'language',
          styleType: 'style',
          class: '.uip-page-content-frame',
          options: uipress.returnDefaultOptions(),
        },

        //Container options group
        {
          name: 'frameToolbar',
          label: __('Frame toolbar', 'uipress-lite'),
          icon: 'palette',
          styleType: 'style',
          class: '.uip-frame-toolbar',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'loadingBarTrack',
          label: __('Loading bar track', 'uipress-lite'),
          icon: 'rotate_right',
          styleType: 'style',
          class: '.uip-ajax-loader',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'loadingBar',
          label: __('Loading bar', 'uipress-lite'),
          icon: 'rotate_right',
          styleType: 'style',
          class: '.uip-loader-bar',
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
     * Posts table
     * @since 3.0.0
     */
    {
      name: __('Posts table', 'uipress-lite'),
      moduleName: 'posts-table',
      description: __('Create a list of recent posts', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/posts-table.min.js',
      icon: 'table',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            { option: 'postTypeSelect', uniqueKey: 'activePostTypes', label: __('Post types', 'uipress-lite') },
            { option: 'postMetaSelect', uniqueKey: 'activeColumns', label: __('Columns', 'uipress-lite') },
            {
              option: 'multiSelect',
              uniqueKey: 'actionsEnabled',
              label: __('Actions enabled', 'uipress-lite'),
              args: {
                options: [
                  {
                    name: 'view',
                    label: __('View', 'uipress-lite'),
                  },
                  {
                    name: 'edit',
                    label: __('Edit', 'uipress-lite'),
                  },
                  {
                    name: 'delete',
                    label: __('Delete', 'uipress-lite'),
                  },
                ],
              },
            },
            { option: 'number', uniqueKey: 'postsPerPage', label: __('Posts per page', 'uipress-lite'), value: 10 },
            {
              option: 'choiceSelect',
              uniqueKey: 'limitToAuthor',
              label: __('Content', 'uipress-lite'),
              help: __('If enabled, only the users own content will show', 'uipress-lite'),
              value: { value: false },
              args: {
                options: {
                  false: {
                    value: false,
                    label: __('All', 'uipress-lite'),
                  },
                  true: {
                    value: true,
                    label: __('User', 'uipress-lite'),
                  },
                },
              },
            },
            {
              option: 'choiceSelect',
              uniqueKey: 'searchDisabled',
              label: __('Search', 'uipress-lite'),
              value: { value: false },
              args: {
                options: {
                  false: {
                    value: false,
                    label: __('Show', 'uipress-lite'),
                  },
                  true: {
                    value: true,
                    label: __('Hide', 'uipress-lite'),
                  },
                },
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
          name: 'search',
          label: __('Search', 'uipress-lite'),
          icon: 'search',
          styleType: 'style',
          class: '.uip-search-block',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'table',
          label: __('Table styles', 'uipress-lite'),
          icon: 'table',
          styleType: 'style',
          class: '.uip-post-table',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'tableHead',
          label: __('Table head', 'uipress-lite'),
          icon: 'table',
          styleType: 'style',
          class: '.uip-post-table-head',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'tableHeadCell',
          label: __('Table head cell', 'uipress-lite'),
          icon: 'table',
          styleType: 'style',
          class: '.uip-post-table-head-cell',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'tableRow',
          label: __('Table row', 'uipress-lite'),
          icon: 'table',
          styleType: 'style',
          class: '.uip-post-table-row',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'tableCell',
          label: __('Table cell', 'uipress-lite'),
          icon: 'table',
          styleType: 'style',
          class: '.uip-post-table-cell',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'gridItem',
          label: __('Grid item', 'uipress-lite'),
          icon: 'grid_view',
          styleType: 'style',
          class: '.uip-grid-item',
          options: uipress.returnDefaultOptions(),
        },

        //Container options group
        {
          name: 'gridItemTitle',
          label: __('Grid item title', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-grid-item-title',
          options: uipress.returnDefaultOptions(),
        },

        //Container options group
        {
          name: 'navButtons',
          label: __('Pagination buttons', 'uipress-lite'),
          icon: 'smart_button',
          styleType: 'style',
          class: '.uip-nav-button',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'typeLabel',
          label: __('Post type label', 'uipress-lite'),
          icon: 'label',
          styleType: 'style',
          class: '.uip-post-type-label',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'postCount',
          label: __('Table post count', 'uipress-lite'),
          icon: 'pin',
          styleType: 'style',
          class: '.uip-post-count',
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
     * Recent posts
     * @since 3.0.0
     */
    {
      name: __('Recent posts', 'uipress-lite'),
      moduleName: 'recent-posts',
      description: __('Create a list of recent posts', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/recent-posts.min.js',
      icon: 'description',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            { option: 'postTypeSelect', uniqueKey: 'activePostTypes', label: __('Post types', 'uipress-lite') },
            { option: 'number', uniqueKey: 'postsPerPage', label: __('Posts per page', 'uipress-lite'), value: 10 },
            {
              option: 'choiceSelect',
              uniqueKey: 'limitToAuthor',
              label: __('Content', 'uipress-lite'),
              help: __('If enabled, only the users own content will show', 'uipress-lite'),
              value: { value: false },
              args: {
                options: {
                  false: {
                    value: false,
                    label: __('All', 'uipress-lite'),
                  },
                  true: {
                    value: true,
                    label: __('User', 'uipress-lite'),
                  },
                },
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
          name: 'listArea',
          label: __('Posts list', 'uipress-lite'),
          icon: 'list',
          styleType: 'style',
          class: '.uip-list-area',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'itemHeader',
          label: __('Item title', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-post-title',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'itemMeta',
          label: __('Item meta', 'uipress-lite'),
          icon: 'info',
          styleType: 'style',
          class: '.uip-post-meta',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'navButtons',
          label: __('Pagination buttons', 'uipress-lite'),
          icon: 'smart_button',
          styleType: 'style',
          class: '.uip-nav-button',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'typeLabel',
          label: __('Post type label', 'uipress-lite'),
          icon: 'label',
          styleType: 'style',
          class: '.uip-post-type-label',
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
     * Search block
     * @since 3.0.0
     */
    {
      name: __('Search', 'uipress-lite'),
      moduleName: 'search-content',
      description: __('Outputs a search block that queries your sites content', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/search.min.js',
      icon: 'search',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            {
              option: 'choiceSelect',
              uniqueKey: 'limitToAuthor',
              label: __('Content', 'uipress-lite'),
              help: __('If enabled, only the users own content will show', 'uipress-lite'),
              value: { value: false },
              args: {
                options: {
                  false: {
                    value: false,
                    label: __('All', 'uipress-lite'),
                  },
                  true: {
                    value: true,
                    label: __('User', 'uipress-lite'),
                  },
                },
              },
            },
            { option: 'searchPostTypes', label: __('Search post types', 'uipress-lite') },
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
          name: 'search',
          label: __('Search style', 'uipress-lite'),
          icon: 'search',
          styleType: 'style',
          class: '.uip-search-block',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'searchResults',
          label: __('Search results area', 'uipress-lite'),
          icon: 'list',
          styleType: 'style',
          class: '.uip-search-results-area',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'foundItems',
          label: __('Found items list', 'uipress-lite'),
          icon: 'list',
          styleType: 'style',
          class: '.uip-found-items-list',
          options: uipress.returnDefaultOptions(true, false, {
            flexLayout: {
              direction: 'column',
              distribute: 'start',
              align: 'stretch',
              wrap: 'nowrap',
              type: 'stack',
              placeContent: 'normal',
              gap: {
                value: 8,
                units: 'px',
              },
            },
          }),
        },

        //Container options group
        {
          name: 'itemHeader',
          label: __('Search item title', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-search-result-title',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'itemMeta',
          label: __('Search item meta', 'uipress-lite'),
          icon: 'info',
          styleType: 'style',
          class: '.uip-search-result-meta',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'navButtons',
          label: __('Pagination buttons', 'uipress-lite'),
          icon: 'smart_button',
          styleType: 'style',
          class: '.uip-search-nav-button',
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
     * Toolbar
     * @since 3.0.0
     */
    {
      name: __('Toolbar', 'uipress-lite'),
      moduleName: 'uip-toolbar',
      description: __('Outputs default toolbar items', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/toolbar.min.js',
      icon: 'build',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            { option: 'hiddenToolbarItems', label: __('Hidden toolbar items', 'uipress-lite') },
            { option: 'editToolbarItems', label: __('Toolbar icons', 'uipress-lite') },
            {
              option: 'defaultSelect',
              uniqueKey: 'dropdownPosition',
              args: {
                options: [
                  {
                    value: 'bottom-left',
                    label: __('Bottom left', 'uipress-lite'),
                  },
                  {
                    value: 'bottom-right',
                    label: __('Bottom right', 'uipress-lite'),
                  },
                  {
                    value: 'top-left',
                    label: __('Top left', 'uipress-lite'),
                  },
                  {
                    value: 'top-right',
                    label: __('Top right', 'uipress-lite'),
                  },
                  {
                    value: 'left',
                    label: __('Left', 'uipress-lite'),
                  },
                  {
                    value: 'right',
                    label: __('Right', 'uipress-lite'),
                  },
                ],
              },
              value: 'bottom-left',
              label: __('Submenu pos', 'uipress-lite'),
            },
            {
              option: 'defaultSelect',
              uniqueKey: 'subDropdownPosition',
              args: {
                options: [
                  {
                    value: 'bottom-left',
                    label: __('Bottom left', 'uipress-lite'),
                  },
                  {
                    value: 'bottom-right',
                    label: __('Bottom right', 'uipress-lite'),
                  },
                  {
                    value: 'top-left',
                    label: __('Top left', 'uipress-lite'),
                  },
                  {
                    value: 'top-right',
                    label: __('Top right', 'uipress-lite'),
                  },
                  {
                    value: 'left',
                    label: __('Left', 'uipress-lite'),
                  },
                  {
                    value: 'right',
                    label: __('Right', 'uipress-lite'),
                  },
                ],
              },
              value: 'right',
              label: __('Sub submenu pos', 'uipress-lite'),
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
        {
          name: 'toolBarItems',
          label: __('Admin bar', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-admin-toolbar',
          options: uipress.returnDefaultOptions(true, false, {
            flexLayout: {
              direction: 'row',
              distribute: 'start',
              align: 'center',
              wrap: 'nowrap',
              type: 'stack',
              placeContent: 'normal',
              gap: {
                value: 16,
                units: 'px',
              },
            },
          }),
        },
        //Container options group
        {
          name: 'topLevelItemStyle',
          label: __('Toolbar item', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-toolbar-top-item',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group
        {
          name: 'topLevelIcons',
          label: __('Toolbar icons', 'uipress-lite'),
          icon: 'favorite',
          styleType: 'style',
          class: '.uip-toolbar-top-item-icon',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'submenu',
          label: __('Submenu', 'uipress-lite'),
          icon: 'menu',
          styleType: 'style',
          class: '.uip-toolbar-submenu',
          options: uipress.returnDefaultOptions(true, false, {
            flexLayout: {
              direction: 'column',
              distribute: 'start',
              align: 'stretch',
              wrap: 'nowrap',
              type: 'stack',
              placeContent: 'normal',
              gap: {
                value: 2,
                units: 'px',
              },
            },
            spacing: {
              padding: {
                preset: 'S',
                sync: true,
              },
            },
          }),
        },
        //Container options group
        {
          name: 'subLevelItemStyle',
          label: __('Submenu items', 'uipress-lite'),
          icon: 'menu',
          styleType: 'style',
          class: '.uip-toolbar-sub-item',
          options: uipress.returnDefaultOptions(),
        },
        //Container options group

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
     * Breadcrumbs
     * @since 3.0.0
     */
    {
      name: __('Bread crumbs', 'uipress-lite'),
      moduleName: 'uip-breadcrumbs',
      description: __('Shows the current page path (breadcrumbs)', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/breadcrumbs.min.js',
      icon: 'label_important',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [{ option: 'iconSelect', uniqueKey: 'breadIcon', label: __('Icon separator', 'uipress-lite') }],
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
          name: 'crumb',
          label: __('Breadcrumb item', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-crumb',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'icon',
          label: __('Icon separator', 'uipress-lite'),
          icon: 'title',
          styleType: 'style',
          class: '.uip-crumb-icon',
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
     * Breadcrumbs
     * @since 3.0.0
     */
    {
      name: __('Fullscreen toggle', 'uipress-lite'),
      moduleName: 'uip-fullscreen',
      description: __('A customisable button that can toggle the fullscreen mode of the content frame', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/fullscreen.min.js',
      icon: 'fullscreen',
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
                string: __('Fullscreen', 'uipress-lite'),
                dynamic: false,
                dynamicKey: '',
                dynamicPos: 'left',
              },
            },
            { option: 'iconSelect', label: __('Icon', 'uipress-lite'), value: { value: 'fullscreen' } },
            { option: 'iconPosition', label: __('Icon position', 'uipress-lite'), value: { value: 'left' } },
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
     * Breadcrumbs
     * @since 3.0.0
     */
    {
      name: __('Open without frame', 'uipress-lite'),
      moduleName: 'uip-without-uipress',
      description: __('This will open the current page outside the current frame and optionally without UiPress all together', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/open-without-frame.min.js',
      icon: 'whatshot',
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
                string: __('Open outside frame', 'uipress-lite'),
                dynamic: false,
                dynamicKey: '',
                dynamicPos: 'left',
              },
            },
            {
              option: 'choiceSelect',
              uniqueKey: 'openInNewTab',
              label: __('Behaviour', 'uipress-lite'),
              args: {
                options: {
                  false: {
                    value: false,
                    label: __('Default', 'uipress-lite'),
                  },
                  true: {
                    value: true,
                    label: __('New tab', 'uipress-lite'),
                  },
                },
              },
            },
            {
              option: 'choiceSelect',
              uniqueKey: 'openWithoutUiPress',
              label: __('Load without uiPress', 'uipress-lite'),
              args: {
                options: {
                  false: {
                    value: false,
                    label: __('No', 'uipress-lite'),
                  },
                  true: {
                    value: true,
                    label: __('Yes', 'uipress-lite'),
                  },
                },
              },
            },

            { option: 'iconSelect', label: __('Icon', 'uipress-lite'), value: { value: 'fullscreen' } },
            { option: 'iconPosition', label: __('Icon position', 'uipress-lite'), value: { value: 'left' } },
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
    ///Page loader
    {
      name: __('Page loader', 'uipress-lite'),
      moduleName: 'uip-page-loader',
      description: __('This block allows you to place a loading bar wherever you choose and has the option to replace the bar with a custom image.', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/page-loader.min.js',
      icon: 'cached',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [{ option: 'imageSelect', uniqueKey: 'loaderImage', label: __('Image', 'uipress-lite'), args: { hasPositioning: false } }],
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
    ///Open ai
    {
      name: __('Ai chat', 'uipress-lite'),
      moduleName: 'uip-ai-chat',
      description: __('This block allows you to add an ai chat to your templates. OpenAi (chatGPT) API key is required.', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      path: '../blocks/dynamic/ai-chat.min.js',
      icon: 'magic_button',
      settings: {},
      optionsEnabled: [
        //Block options group
        {
          name: 'block',
          label: __('Block options', 'uipress-lite'),
          icon: 'check_box_outline_blank',
          options: [
            {
              option: 'textField',
              uniqueKey: 'apiKey',
              label: __('openAI API key', 'uipress-lite'),
              args: { password: true },
            },
            {
              option: 'textField',
              uniqueKey: 'welcomeMessage',
              label: __('Welcome message', 'uipress-lite'),
              args: { password: false },
            },
            {
              option: 'textField',
              uniqueKey: 'systemMessage',
              label: __('System message', 'uipress-lite'),
              args: { password: false },
              help: __(
                'The system message helps set the behavior of the assistant. For example, you can modify the personality of the assistant or provide specific instructions about how it should behave throughout the conversation.',
                'uipress-lite'
              ),
            },
            {
              option: 'defaultSelect',
              uniqueKey: 'chatModel',
              args: {
                options: [
                  {
                    value: 'gpt-3.5-turbo',
                    label: 'gpt-3.5-turbo',
                  },
                  {
                    value: 'gpt-3.5-turbo-16k',
                    label: 'gpt-3.5-turbo-16k',
                  },
                  {
                    value: 'gpt-4',
                    label: 'gpt-4',
                  },
                  {
                    value: 'gpt-4-32k',
                    label: 'gpt-4-32k',
                  },
                ],
              },
              value: 'gpt-3.5-turbo',
              label: __('Chat model', 'uipress-lite'),
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

        {
          name: 'messagesArea',
          label: __('Messages area', 'uipress-lite'),
          icon: 'forum',
          styleType: 'style',
          class: '.uip-chat-area',
          options: uipress.returnDefaultOptions(true, false, {
            flexLayout: {
              direction: 'column',
              distribute: 'start',
              align: 'stretch',
              wrap: 'nowrap',
              type: 'stack',
              placeContent: 'normal',
              gap: {
                value: 12,
                units: 'px',
              },
            },
          }),
        },

        {
          name: 'botMessage',
          label: __('Bot message', 'uipress-lite'),
          icon: 'sms',
          styleType: 'style',
          class: '.uip-bot-message',
          options: uipress.returnDefaultOptions(),
        },
        {
          name: 'userMessage',
          label: __('User message', 'uipress-lite'),
          icon: 'sms',
          styleType: 'style',
          class: '.uip-user-message',
          options: uipress.returnDefaultOptions(),
        },

        {
          name: 'chatInput',
          label: __('Chat input', 'uipress-lite'),
          icon: 'input',
          styleType: 'style',
          class: '.uip-chat-input',
          options: uipress.returnDefaultOptions(true),
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
    ///Pro placeholders
    ///Pro placeholders
    {
      name: __('Media library', 'uipress-lite'),
      moduleName: 'uip-media-library',
      description: __('Outputs a media library, with upload, delete and folder features', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      icon: 'photo_library',
    },
    ///Pro placeholders
    {
      name: __('Plugin updates', 'uipress-lite'),
      moduleName: 'uip-plugin-updates',
      description: __('Outputs a list of available plugin and allows you update from the block', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      icon: 'upgrade',
    },
    {
      name: __('Plugin search', 'uipress-lite'),
      moduleName: 'uip-plugin-search',
      description: __('Search the plugin directory with quick filters, discover new plugins and install all from one block', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      icon: 'extension',
    },
    {
      name: __('Grouped Date range', 'uipress-lite'),
      moduleName: 'uip-grouped-date-range',
      description: __("Outputs a grouped date picker. This date picker is used for controlling it's siblings range such as analytic blocks.", 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      icon: 'event',
    },
    {
      name: __('User meta', 'uipress-lite'),
      moduleName: 'uip-user-meta-block',
      description: __('Outputs selected user meta, either as a string or an list of values', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      icon: 'manage_accounts',
    },
    {
      name: __('Content navigator', 'uipress-lite'),
      moduleName: 'uip-content-navigator',
      description: __('Creates a navigatable file tree of all your site content like posts, pages and media. Allows for creation of new folders and organisation of content', 'uipress-lite'),
      category: __('Dynamic', 'uipress-lite'),
      group: 'dynamic',
      icon: 'folder_open',
    },

    {
      name: __('Orders kanban', 'uipress-lite'),
      moduleName: 'orders-kanban',
      description: __('Creates a kanban view of recent woocommerce orders and allows for drag and drop management', 'uipress-lite'),
      group: 'dynamic',
      icon: 'view_kanban',
    },
    {
      name: __('Site notifications', 'uipress-lite'),
      moduleName: 'site-notifications',
      description: __('Collects all site notifications and displays theme inside thise block', 'uipress-lite'),
      group: 'dynamic',
      icon: 'notifications',
    },
  ];
}
