const { __, _x, _n, _nx } = wp.i18n;

const MenuCollapse = {
  inject: ['uipress'],
  props: {
    collapsed: Boolean,
    returnData: Function,
  },
  data() {
    return {
      strings: {
        collapseMenu: __('Collapse menu', 'uipress-lite'),
      },
      isCollapsed: this.collapsed,
    };
  },
  methods: {
    /**
     * Toggle collapsed menu. Returns collapsed state back up the chain
     *
     * @since 3.2.13
     */
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.returnData(this.isCollapsed);
    },
  },
  template: `
    
          <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center uip-link-muted uip-margin-top-s uip-menu-collapse" 
          @click="toggleCollapse()">
            <div v-if="isCollapsed" class="uip-icon uip-text-">arrow_forward_ios</div>
            <div v-if="!isCollapsed" class="uip-icon uip-text-">arrow_back_ios</div>
            <div v-if="!isCollapsed">{{strings.collapseMenu}}</div>
          </div>
    
  `,
};

const MenuSearch = {
  inject: ['uipress'],
  emits: ['searching'],
  props: {
    workingMenu: Array,
    maybeFollowLink: Function,
  },
  data() {
    return {
      strings: {
        search: __('Search menu', 'uipress-lite'),
      },
      menuSearch: '',
      menuSearchIndex: 0,
    };
  },
  watch: {
    menuSearch: {
      handler() {
        this.menuSearchIndex = 0;
        if (this.menuSearch == '') return this.$emit('searching', false);
        this.$emit('searching', true);
      },
    },
  },
  computed: {
    /**
     * Returns current menu items filtered by search term
     *
     * @returns {Array} - array of filtered items
     * @since 3.2.13
     */
    searchItems() {
      const term = this.menuSearch.toLowerCase();

      const itemMatchesTerm = ({ name, type }) => type !== 'sep' && name.toLowerCase().includes(term);

      const results = this.workingMenu
        .filter(itemMatchesTerm)
        .concat(this.workingMenu.filter((item) => item.submenu).flatMap((item) => item.submenu.filter(itemMatchesTerm).map((sub) => ({ ...sub, parent: item.name }))));

      return results;
    },
  },
  methods: {
    /**
     * Watches keydown event for arrows up / down when searching
     *
     * @param {Object} event - the keydown event
     * @since 3.2.13
     */
    watchForArrows(event) {
      switch (event.key) {
        case 'Enter':
          const ele = document.querySelector(`#uip-menu-search-results [data-id="${this.menuSearchIndex}"]`);
          if (ele) ele.click();
          break;

        case 'ArrowDown':
          this.menuSearchIndex = this.menuSearchIndex >= this.searchItems.length - 1 ? 0 : this.menuSearchIndex++;
          break;

        case 'ArrowUp':
          this.menuSearchIndex = this.menuSearchIndex <= 0 ? this.searchItems.length - 1 : this.menuSearchIndex--;
          break;
      }
    },
  },
  template: `
    
          <div class="uip-flex uip-menu-search uip-border-round uip-margin-bottom-s uip-flex-center">
            <span class="uip-icon uip-text-muted uip-margin-right-xs uip-icon">search</span>
            <input @keydown="watchForArrows" ref="menusearcher" class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.search" v-model="menuSearch">
          </div>
          
          
          <div v-if="menuSearch" class="uip-flex uip-flex-column uip-row-gap-xxs" id="uip-menu-search-results">
          
            <template v-for="(item, index) in searchItems">
            
                <a class="uip-flex uip-flex- uip-gap-xxxs uip-link-default uip-no-underline uip-flex-center uip-text-s uip-padding-xxxs uip-border-rounder"
                @click="maybeFollowLink($event, item)"
                :class="menuSearchIndex == index ? 'uip-background-high-light' : ''" :href="item.url" :data-id="index">
                  
                  <span class="uip-text-muted" v-if="item.parent">{{item.parent}}</span>
                  <span class="uip-icon" v-if="item.parent">chevron_right</span>
                  <span class="">{{item.name}}</span>
                  
                </a>
              
            </template>
          
          </div>
    
  `,
};

const SubMenuItem = {
  inject: ['uipress'],
  props: {
    maybeFollowLink: Function,
    item: Object,
    collapsed: Boolean,
    block: Object,
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    /**
     * Checks if a separator has a custom name. Returns name on success, false on failure
     *
     * @param {Object} item - the separator object
     * @since 3.2.13
     */
    sepHasCustomName(item) {
      return this.uipress.checkNestedValue(item, ['custom', 'name']);
    },
  },
  template: `
    
          <div class="uip-admin-submenu">
          
              <template v-for="sub in item.submenu">
              
                  <!-- Normal subitem -->
                  <div v-if="sub.type != 'sep'" class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
                    
                    <!-- Main link -->
                    <a :href="sub.url" @click="maybeFollowLink($event, sub)" :class="sub.customClasses" 
                    class="uip-no-underline uip-link-muted uip-sub-level-item" :active="sub.active ? true : false">
                      {{sub.name}}
                    </a>
                    
                    <!-- Notifications count -->
                    <div v-if="sub.notifications && sub.notifications > 0" 
                    class="uip-border-circle uip-w-14 uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-flex uip-flex-center uip-flex-middle uip-menu-notification">
                      <span>{{sub.notifications}}</span>
                    </div>
                    
                  </div>
                  
                  <!-- Normal seperator-->
                  <div v-else-if="!sepHasCustomName(sub)" class="uip-margin-bottom-s uip-menu-separator"></div>
                  
                  <!-- Named seperator-->
                  <div v-else class="uip-margin-bottom-s uip-margin-top-s uip-flex uip-flex-row uip-gap-xxs uip-menu-separator">
                    <span v-if="sub.custom.icon && sub.custom.icon != 'uipblank'" class="uip-icon">{{sub.custom.icon}}</span>
                    <span>{{sub.custom.name}}</span>
                  </div>
                
              </template>
              
          </div>
    
  `,
};

const TopLevelItem = {
  inject: ['uipress'],
  props: {
    maybeFollowLink: Function,
    item: Object,
    collapsed: Boolean,
    block: Object,
  },
  data() {
    return {};
  },
  computed: {
    /**
     * Gets menu style. Returns style or 'dynamic' if not set
     *
     * @since 3.2.13
     */
    subMenuStyle() {
      if (this.collapsed) return 'hover';

      let style = this.uipress.get_block_option(this.block, 'block', 'subMenuStyle');
      if (!this.isObject(style)) return 'dynamic';
      if (style.value) return style.value;
      return 'dynamic';
    },

    /**
     * Returns custom submenu icon. Returns false on failure
     *
     * @since 3.2.13
     */
    subMenuCustomIcon() {
      let icon = this.uipress.get_block_option(this.block, 'block', 'subMenuIcon');
      if (!this.isObject(icon)) return false;
      if (icon.value) return icon.value;
      return false;
    },

    /**
     * Returns whether the menu has icons for current state
     *
     * @returns {boolean} - whether to hide icons
     * @since 3.2.13
     */
    hideIcons() {
      // Don't hide icons if we are collapsed
      if (this.collapsed) return false;

      const icons = this.uipress.checkNestedValue(this.block, ['settings', 'block', 'options', 'hideIcons', 'value']);
      if (this.isObject(icons)) return icons.value;
      return icons;
    },
  },
  methods: {
    /**
     * Utility function to catch uipblank in icon names
     *
     * @param {String} icon - the icon to check
     */
    returnTopIcon(icon) {
      const status = icon ? icon.includes('uipblank') : false;
      if (status) return icon.replace('uipblank', 'favorite');
      return icon;
    },

    /**
     * Returns the appropriate sub menu icon indicator for the given item
     *
     * @param {Object} item - top level menu item
     * @since 3.2.13
     */
    returnSubIcon(item) {
      // has custom icon so return that
      if (this.subMenuCustomIcon) return this.subMenuCustomIcon;

      // If dynamic menu always return chevron right
      if (this.subMenuStyle == 'dynamic') return 'chevron_right';

      // If hover menu always return chevron right
      if (this.subMenuStyle == 'hover') return 'chevron_right';

      // If item is open / active then return the open icon
      if (item.open || item.active) return 'expand_more';
      return 'chevron_left';
    },
  },
  template: `
    
    <a :href="item.url" @click="maybeFollowLink($event, item, true)" class="uip-no-underline uip-link-default uip-top-level-item" :class="item.customClasses" :active="item.active ? true : false">
    
      <div v-if="!hideIcons && item.icon" v-html="returnTopIcon(item.icon)" class="uip-flex uip-flex-center uip-menu-icon uip-icon uip-icon-medium"></div>
      
      <div v-if="!collapsed" class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
        <div class="uip-line-height-1" v-html="item.name"></div>
        <div v-if="item.notifications && item.notifications > 0" class="uip-border-round uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-text-bold uip-flex uip-flex-center uip-flex-middle uip-menu-notification"><span>{{item.notifications}}</span></div>
      </div>
      
      <div v-if="item.submenu && item.submenu.length > 0 && !collapsed" class="uip-icon uip-link-muted">{{returnSubIcon(item)}}</div>
      
    </a>
    
  `,
};

const DrillDown = {
  inject: ['uipress'],
  components: {
    TopLevelItem: TopLevelItem,
    SubMenuItem: SubMenuItem,
    MenuSearch: MenuSearch,
    MenuCollapse: MenuCollapse,
  },
  props: {
    maybeFollowLink: Function,
    item: Object,
    collapsed: Boolean,
    block: Object,
    menuItems: Array,
    returnCollapsed: Function,
  },
  watch: {
    menuItems: {
      handler() {
        this.initializeMenu();
      },
      immediate: true,
      deep: true,
    },
    isCollapsed: {
      handler() {
        this.returnCollapsed(this.isCollapsed);
      },
    },
  },
  data() {
    return {
      currentLevel: [], // This will store the current level of items being displayed.
      levels: [],
      currentItem: null,
      searching: false,
      isCollapsed: this.collapsed,
    };
  },
  computed: {
    /**
     * Returns name of parent menu item
     *
     * @since 3.2.13
     */
    parentItemName() {
      // If currentItem is not null and it has a parent, return the parent's name.
      if (!this.currentItem) return __('Go back', 'uipress-lite');
      return this.decodeHtmlEntities(this.currentItem.name);
    },

    /**
     * Returns whether the mneu search is enabled
     *
     * @returns {boolean}  - whether the search is enabled
     * @since 3.2.13
     */
    hasMenuSearch() {
      const showSearch = this.uipress.get_block_option(this.block, 'block', 'showSearch');
      if (this.isObject(showSearch)) return showSearch.value;
      return showSearch;
    },

    /**
     * Returns whether the menu collapse option is available
     *
     * @returns {boolean}
     * @since 3.2.13
     */
    hasMenuCollapse() {
      const menuCollapse = this.uipress.get_block_option(this.block, 'block', 'menuCollapse');
      if (this.isObject(menuCollapse)) return menuCollapse.value;
      return menuCollapse;
    },
  },
  methods: {
    /**
     * Sets new items as current menu and logs parent
     *
     * @param {Object} item - item to set as active
     * @since 3.2.13
     */
    drillDown(item) {
      this.levels.push(this.currentLevel);
      this.currentItem = item;
      this.currentLevel = item.submenu;
    },

    /**
     * Goes back up the drilldown list
     *
     * @since 3.2.13
     */
    goBack() {
      this.currentLevel = this.levels.pop();
    },

    /**
     * Sets the menu from prop
     *
     * @since 3.2.13
     */
    initializeMenu() {
      this.currentLevel = this.menuItems;
    },

    /**
     * Handles menu link clicks
     *
     * @param {Object} evt - Click event
     * @param {Object} item - Menu item clicked
     * @since 3.2.13
     */
    handleLinkClick(evt, item) {
      if (item.submenu && item.submenu.length) {
        this.drillDown(item);
        evt.preventDefault();
        return;
      }
      this.maybeFollowLink(evt, item);
    },

    /**
     * Decodes html entities from a given string
     *
     * @param {String} item - the item to be decoded
     * @since 3.2.12
     */
    decodeHtmlEntities(item) {
      // Return blank if item doesn't have a set value
      if (!item) return '';

      return item
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .replace(/%20/g, ' ');
    },
  },
  template: `
    
             
              
              <Transition name="translate" mode="out-in">
                <div :key="currentLevel" class="uip-admin-menu uip-text-normal" :class="{'uip-menu-collapsed' : collapsed}">
                
                  <MenuSearch v-if="hasMenuSearch" 
                  key="menusearch"
                  @searching="(d)=>{searching = d}"
                  :maybeFollowLink="maybeFollowLink" :workingMenu="menuItems"/>
                
                  <!-- Display Back button if there are levels to go back to -->
                  <a v-if="levels.length" 
                  class="uip-flex uip-gap-xxs uip-flex-center uip-flex-row uip-flex-center uip-text-bold uip-text-l uip-sub-menu-header uip-link-default uip-margin-bottom-s uip-gap-xxs" 
                  @click="goBack">
                    <div class="uip-icon">chevron_left</div>
                    <div class="uip-flex-grow" v-html="parentItemName"></div>
                  </a>
                  
                  <!-- Loop through currentLevel and display each item -->
                  <template v-for="item of currentLevel">
                    <TopLevelItem :item="item" :maybeFollowLink="handleLinkClick" :collapsed="isCollapsed" :block="block"/>
                  </template>
                  
                  <MenuCollapse v-if="hasMenuCollapse" :collapsed="isCollapsed" :returnData="(d) => {isCollapsed = d}"/>
                  
                </div>
              </Transition>
              
    
  `,
};

export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    components: {
      TopLevelItem: TopLevelItem,
      SubMenuItem: SubMenuItem,
      DrillDownMenu: DrillDown,
      MenuSearch: MenuSearch,
      MenuCollapse: MenuCollapse,
    },
    data() {
      return {
        menu: [],
        activeMenu: false,
        workingMenu: [],
        activeLink: '',
        breadCrumbs: [{ name: __('Home', 'uipress-lite'), url: this.uipData.dynamicOptions.viewadmin.value }],
        searching: false,
        staticMenu: [],
        strings: {
          mainmenu: __('Main menu', 'uipress-lite'),
          collapseMenu: __('Collapse menu', 'uipress-lite'),
          search: __('Search menu', 'uipress-lite'),
        },
        collapsed: false,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      /**
       * Watches for changes to the breadcrumbs and emits event
       *
       * @since 3.2.13
       */
      breadCrumbs: {
        handler(newValue, oldValue) {
          let self = this;
          let breadChange = new CustomEvent('uip_breadcrumbs_change', { detail: { crumbs: self.breadCrumbs } });
          document.dispatchEvent(breadChange);
        },
        deep: true,
      },
      /**
       * Watches for changes to the collapsed value and saves status
       *
       * @since 3.2.13
       */
      collapsed: {
        handler(newVal, oldVal) {
          let status = newVal ? true : false;
          document.documentElement.setAttribute('uip-menu-collapsed', String(status));
          this.uiTemplate.menuCollapsed = status;
          this.uipress.saveUserPreference('menuCollapsed', status, false);
        },
      },
    },
    created() {
      this.setMenu();
      this.buildMenu();
    },
    mounted() {
      this.mountEventListeners();
    },
    computed: {
      /**
       * Gets menu style. Returns style or 'dynamic' if not set
       *
       * @since 3.2.13
       */
      subMenuStyle() {
        if (this.collapsed) return 'hover';
        let style = this.uipress.get_block_option(this.block, 'block', 'subMenuStyle');
        if (!this.isObject(style)) return 'dynamic';
        if (style.value) return style.value;
        return 'dynamic';
      },

      /**
       * Returns custom submenu icon. Returns false on failure
       *
       * @since 3.2.13
       */
      subMenuCustomIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'subMenuIcon');
        if (!this.isObject(icon)) return false;
        if (icon.value) return icon.value;
        return false;
      },

      /**
       * Returns whether auto load is enabled / disabled
       *
       * @returns {boolean}
       * @since 3.2.13
       */
      autoLoadIsDisabled() {
        const disbaled = this.uipress.get_block_option(this.block, 'block', 'loadOnClick');
        if (this.isObject(disbaled)) return disbaled.value;
        return disbaled;
      },

      /**
       * Returns whether the menu collapse option is available
       *
       * @returns {boolean}
       * @since 3.2.13
       */
      hasMenuCollapse() {
        const menuCollapse = this.uipress.get_block_option(this.block, 'block', 'menuCollapse');
        if (this.isObject(menuCollapse)) return menuCollapse.value;
        return menuCollapse;
      },

      /**
       * Returns whether the mneu search is enabled
       *
       * @returns {boolean}  - whether the search is enabled
       * @since 3.2.13
       */
      hasMenuSearch() {
        const showSearch = this.uipress.get_block_option(this.block, 'block', 'showSearch');
        if (this.isObject(showSearch)) return showSearch.value;
        return showSearch;
      },

      /**
       * Returns the drop position of the submenu drop. Returns 'right top' if not set
       *
       * @since 3.2.13
       */
      returnDropdownPosition() {
        const pos = this.uipress.get_block_option(this.block, 'block', 'dropdownPosition');
        if (!this.isObject(pos)) return 'right top';

        if (pos.value) return pos.value;
        return 'right top';
      },

      /**
       * Returns collapsed class when necessary
       *
       * @since 3.2.13
       */
      returnClasses() {
        if (this.collapsed) return 'uip-menu-collapsed';
      },

      /**
       * Returns whether the menu has icons for current state
       *
       * @returns {boolean} - whether to hide icons
       * @since 3.2.13
       */
      hideIcons() {
        // Don't hide icons if we are collapsed
        if (this.collapsed) return false;

        const icons = this.uipress.checkNestedValue(this.block, ['settings', 'block', 'options', 'hideIcons', 'value']);
        if (this.isObject(icons)) return icons.value;
        return icons;
      },
    },

    /**
     * Removes event listeners before unmount
     *
     * @since 3.2.13
     */
    beforeUnmount() {
      document.removeEventListener('uip_page_change', this.updateActiveLink, { once: false });
      document.removeEventListener('uip_page_change_loaded', this.updateMenuFromFrame, { once: false });
    },
    methods: {
      /**
       * Sets menu from settings object
       *
       * @since 3.2.13
       */
      setMenu() {
        this.menu = JSON.parse(JSON.stringify(this.uipData.adminMenu.menu));
        if (this.uipData.userPrefs.menuCollapsed && this.hasMenuCollapse) this.collapsed = true;
      },

      /**
       * Mounts event listeners for menu block
       *
       * @since 3.2.13
       */
      mountEventListeners() {
        document.addEventListener('uip_page_change', this.updateActiveLink, { once: false });
        document.addEventListener('uip_page_change_loaded', this.updateMenuFromFrame, { once: false });
      },

      /**
       * Sets new active link from page change event
       *
       * @param {Object} e - page change event
       * @since 3.2.13
       */
      updateActiveLink(e) {
        this.activeLink = e.detail.url ? e.detail.url.replaceAll('%2F', '/') : e.detail.url;
      },

      /**
       * Builds menu from basic array
       *
       * @since 3.2.13
       */
      buildMenu() {
        const currentLink = this.activeLink;

        // If no currentLink, no need to process items for active status
        if (!currentLink) return (this.workingMenu = this.menu);

        // Default breadcrumbs
        this.breadCrumbs = [{ name: __('Home', 'uipress-lite'), url: this.uipData.dynamicOptions.viewadmin.value }];

        // Main function for handling sub items
        const processSubItem = (sub) => {
          sub.active = false;
          sub.url = sub.url ? this.decodeHtmlEntities(sub.url) : undefined;
          sub.name = sub.name ? this.decodeHtmlEntities(sub.name) : undefined;

          if (sub.url === currentLink) {
            sub.active = true;
            this.breadCrumbs.push({ name: sub.name, url: sub.url });
          }
        };

        // Top level item handler
        const processMenuItem = (item) => {
          item.active = false;

          item.url = item.url ? this.decodeHtmlEntities(item.url) : undefined;
          item.name = item.name ? this.decodeHtmlEntities(item.name) : undefined;

          const foundItem = this.workingMenu.find((obj) => obj.uid === item.uid);
          const state = foundItem ? foundItem.open : false;
          if (state) item.open = true;

          if (item.url === currentLink) {
            item.active = true;
            this.breadCrumbs.push({ name: item.name, url: item.url });
          }

          if (item.submenu) {
            item.submenu.forEach(processSubItem);
          }
        };

        // Process the menu items
        this.menu.forEach(processMenuItem);
        this.workingMenu = this.menu;
      },

      /**
       * Checks content frame for an updated menu on page load
       *
       * @since 3.2.13
       */
      updateMenuFromFrame() {
        //Watch for menu changes in frame
        const frame = document.querySelector('.uip-page-content-frame');

        // Frame does not exist so bail
        if (!frame) return;

        const masterMenu = frame.contentWindow.uipMasterMenu;
        if (!masterMenu || typeof masterMenu === 'undefined') return;
        if (!('menu' in masterMenu)) return;

        // Update menu
        this.menu = JSON.parse(JSON.stringify(masterMenu.menu));
        this.buildMenu();
      },

      /**
       * Follows menu link. If modifier keys are pressed then follows browser default
       *
       * @param {Object} evt - click event
       * @param {Object} item - The menu item clicked
       * @param {Boolean} topLevel - Whether the item is top level or not
       * @since 3.2.13
       */
      maybeFollowLink(evt, item, topLevel) {
        // If modifier keys allow the event to happen naturally
        if (evt.ctrlKey || evt.shiftKey || evt.metaKey || evt.button == 1) return;

        // Prevent default link click
        evt.preventDefault();

        // If we have disabled autoload on top level items and there is a submenu just open the menu and return
        if (topLevel && this.autoLoadIsDisabled && item.submenu && item.submenu.length > 0) {
          item.open = !item.open;
          this.activeMenu = item;
          return;
        }

        // Set item as active
        item.active = true;

        // If there is a submenu then set the active menu for dynamic menu
        if (item.submenu && item.submenu.length > 0) {
          this.activeMenu = item;
        }

        // Update the active link
        this.uipress.updatePage(item.url);
      },

      /**
       * Returns the appropriate sub menu icon indicator for the given item
       *
       * @param {Object} item - top level menu item
       * @since 3.2.13
       */
      returnSubIcon(item) {
        // has custom icon so return that
        if (this.subMenuCustomIcon) return this.subMenuCustomIcon;

        // If dynamic menu always return chevron right
        if (this.subMenuStyle == 'dynamic') return 'chevron_right';

        // If item is open / active then return the open icon
        if (item.open || item.active) return 'expand_more';

        // No conditions met so return default
        return 'chevron_left';
      },

      /**
       * Utility function to catch uipblank in icon names
       *
       * @param {String} icon - the icon to check
       */
      returnTopIcon(icon) {
        const status = icon ? icon.includes('uipblank') : false;
        if (status) return icon.replace('uipblank', 'favorite');
        return icon;
      },

      /**
       * Decodes html entities from a given string
       *
       * @param {String} item - the item to be decoded
       * @since 3.2.12
       */
      decodeHtmlEntities(item) {
        // Return blank if item doesn't have a set value
        if (!item) return '';

        return item
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' ')
          .replace(/%20/g, ' ');
      },

      /**
       * Checks if a separator has a custom name. Returns name on success, false on failure
       *
       * @param {Object} item - the separator object
       * @since 3.2.13
       */
      sepHasCustomName(item) {
        return this.uipress.checkNestedValue(item, ['custom', 'name']);
      },

      /**
       * Returns whether the given item has an open submenu
       *
       * @param {Object} item - the menu item
       * @since 3.2.13
       */
      itemHasOpenSubMenu(item) {
        if (!item.submenu) return false;
        if (!item.submenu.length) return false;
        if (item.active || item.open) return true;
      },
    },
    template: `
    
          <DrillDownMenu v-if="subMenuStyle == 'dynamic'" :menuItems="workingMenu" 
          :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block"
          :returnCollapsed="(d)=>{collapsed=d}"/>
    
          <div v-else class="uip-admin-menu uip-text-normal" :class="returnClasses">
          
            <MenuSearch v-if="hasMenuSearch && !collapsed" 
            @searching="(d)=>{searching = d}"
            :maybeFollowLink="maybeFollowLink" :workingMenu="workingMenu"/>
            
            <!--INLINE DROP MENU-->
            <template v-if="subMenuStyle == 'inline' && !searching">
            
                <template v-for="item in workingMenu">
                
                  <div v-if="item.type != 'sep'" class="uip-flex uip-flex-column uip-row-gap-xs">
                  
                    <TopLevelItem :item="item" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block"/>
                    
                    <Transition name="slide-down">
                      <SubMenuItem v-if="itemHasOpenSubMenu(item)" :item="item" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block"/>
                    </Transition>
                    
                  </div>
                  
                  <div v-else-if="!sepHasCustomName(item)" class="uip-margin-bottom-s uip-menu-separator"></div>
                  
                  <div v-else class="uip-margin-bottom-xs uip-margin-top-xs uip-flex uip-flex-row uip-gap-xxs uip-menu-separator">
                    <span v-if="item.custom.icon && item.custom.icon != 'uipblank'" class="uip-icon">{{item.custom.icon}}</span>
                    <span>{{item.custom.name}}</span>
                  </div>
                  
                </template>
              
            </template>
            <!--END INLINE DROP MENU-->
            
            
            
            <!--HOVER MENU-->
            <template v-if="subMenuStyle == 'hover' && !searching">
            
                <template v-for="item in workingMenu">
                
                  <dropdown v-if="item.type != 'sep'"  :pos="returnDropdownPosition" class="uip-flex uip-flex-column uip-row-gap-xs" 
                  :hover="true" :disableTeleport="true">
                    
                    <template v-slot:trigger>
                    
                      <TopLevelItem :item="item" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block"/>
                      
                    </template>
                    
                    <template v-if="item.submenu && item.submenu.length > 0" v-slot:content>
                      
                          <SubMenuItem :item="item" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block"/>
                          
                    </template>
                  </dropdown>
                  
                  
                  <div v-else-if="!sepHasCustomName(item)" class="uip-margin-bottom-s uip-menu-separator"></div>
                  
                  <div v-else class="uip-margin-bottom-xs uip-margin-top-xs uip-flex uip-flex-row uip-gap-xxs uip-menu-separator">
                    <span v-if="item.custom.icon && item.custom.icon != 'uipblank'" class="uip-icon">{{item.custom.icon}}</span>
                    <span>{{item.custom.name}}</span>
                  </div>
                
                  
                </template>
              
            </template>
            
            
            
            
            
            <a ref="newTab" target="_BLANK" class="uip-hidden"></a>
            
            <MenuCollapse v-if="hasMenuCollapse" :collapsed="collapsed" :returnData="(d) => {collapsed = d}"/>
            
          </div>`,
  };
}
