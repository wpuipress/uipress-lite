const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data() {
      return {
        menu: [],
        activeMenu: false,
        workingMenu: [],
        activeLink: '',
        breadCrumbs: [{ name: __('Home', 'uipress-lite'), url: this.uipData.dynamicOptions.viewadmin.value }],
        menuSearch: '',
        menuSearchIndex: 0,
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
      breadCrumbs: {
        handler(newValue, oldValue) {
          let self = this;
          let breadChange = new CustomEvent('uip_breadcrumbs_change', { detail: { crumbs: self.breadCrumbs } });
          document.dispatchEvent(breadChange);
        },
        deep: true,
      },
      collapsed: {
        handler(newVal, oldVal) {
          if (newVal) {
            document.documentElement.setAttribute('uip-menu-collapsed', 'true');
            this.uiTemplate.menuCollapsed = true;
          } else {
            document.documentElement.setAttribute('uip-menu-collapsed', 'false');
            this.uiTemplate.menuCollapsed = false;
          }

          this.uipress.saveUserPreference('menuCollapsed', newVal, false);
        },
      },
      menuSearch: {
        handler(newVal, oldVal) {
          this.menuSearchIndex = 0;
        },
      },
    },
    mounted() {
      this.setMenu();
      this.buildMenu();
      this.mountEventListeners();

      if (this.uipData.userPrefs.menuCollapsed && this.showCollapse) {
        this.collapsed = true;
      }
    },
    computed: {
      isCollapsed() {
        return this.collapsed;
      },
      hasStaticMenu() {
        let staticMenu = this.uipress.get_block_option(this.block, 'block', 'customMenu');
        if (staticMenu == 'none') return false;
        return staticMenu;
      },
      subMenuStyle() {
        if (this.collapsed) {
          return 'hover';
        }
        let style = this.uipress.get_block_option(this.block, 'block', 'subMenuStyle');
        if (this.uipress.isObject(style)) {
          if ('value' in style) {
            return style.value;
          }
        }
        return style;
      },

      subMenuCustomIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'subMenuIcon');
        if (icon.value) {
          return icon.value;
        } else {
          return false;
        }
      },
      menuAutoUpdate() {
        let update = this.uipress.get_block_option(this.block, 'block', 'disableAutoUpdate');
        if (this.uipress.isObject(update)) {
          return update.value;
        }
        return update;
      },
      disableAutoLoad() {
        let update = this.uipress.get_block_option(this.block, 'block', 'loadOnClick');
        if (this.uipress.isObject(update)) {
          return update.value;
        }
        return update;
      },
      showCollapse() {
        let update = this.uipress.get_block_option(this.block, 'block', 'menuCollapse');
        if (this.uipress.isObject(update)) {
          return update.value;
        }
        return update;
      },
      showSearch() {
        let update = this.uipress.get_block_option(this.block, 'block', 'showSearch');
        if (this.uipress.isObject(update)) {
          return update.value;
        }
        return update;
      },
      returnDropdownPosition() {
        let update = this.uipress.get_block_option(this.block, 'block', 'dropdownPosition');
        if (this.uipress.isObject(update)) {
          return update.value;
        }

        if (update == '') {
          return 'right';
        }
        return update;
      },
      searchItems() {
        let term = this.menuSearch.toLowerCase();
        let results = [];
        let self = this;

        for (let item of self.workingMenu) {
          if (item.type == 'sep') {
            continue;
          }
          let name = item.name.toLowerCase();
          if (name.includes(term)) {
            results.push(item);
          }

          if (!item.submenu) {
            continue;
          }

          for (let sub of item.submenu) {
            if (sub.type == 'sep') {
              continue;
            }
            let subname = sub.name.toLowerCase();
            if (subname.includes(term)) {
              sub.parent = item.name;
              results.push(sub);
            }
          }
        }
        return results;
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
      /**
       * Builds menu from basic array
       *
       * @since 3.2.13
       */
      buildMenu() {
        const currentLink = this.activeLink;

        // If no currentLink, no need to process items for active status
        if (!currentLink) return this.menu;

        // Default breadcrumbs
        this.breadCrumbs = [{ name: __('Home', 'uipress-lite'), url: this.uipData.dynamicOptions.viewadmin.value }];

        // Main function for handling sub items
        const processSubItem = (sub) => {
          sub.active = false;
          sub.url = sub.url ? this.santize(sub.url) : undefined;
          sub.name = sub.name ? this.santize(sub.name) : undefined;

          if (sub.url === currentLink) {
            sub.active = true;
            this.breadCrumbs.push({ name: sub.name, url: sub.url });
          }
        };

        // Top level item handler
        const processMenuItem = (item) => {
          item.active = false;

          item.url = item.url ? this.santize(item.url) : undefined;
          item.name = item.name ? this.santize(item.name) : undefined;

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
      activeItem(item, evt, topLevel) {
        if (evt.ctrlKey || evt.shiftKey || evt.metaKey || (evt.button && evt.button == 1)) {
          return;
        } else {
          evt.preventDefault();
        }

        //If auto load is disabled
        if (topLevel) {
          if (this.disableAutoLoad && item.submenu && item.submenu.length > 0) {
            item.open = !item.open;
            this.activeMenu = item;
            //item.active = !item.active;
            return;
          } else {
            item.active = true;
          }
        }

        let self = this;

        if (item.submenu && item.submenu.length > 0) {
          this.activeMenu = item;
        }

        let absoluteCheck = new RegExp('^(?:[a-z+]+:)?//', 'i');
        let absoluteURL = item.url;
        if (!absoluteCheck.test(absoluteURL)) {
          absoluteURL = this.uipData.dynamicOptions.viewadmin.value + absoluteURL;
        }

        //Open without frame
        if (item.withoutFrame) {
          let url = new URL(absoluteURL);
          url.searchParams.set('uip-framed-page', 1);
          absoluteURL = url.href;
        }

        //Open without uipress
        if (item.withoutUiPress) {
          let url = new URL(absoluteURL);
          let uid = self.uipress.createUID();
          url.searchParams.set('uipwf', uid);
          url.searchParams.set('uip-framed-page', 0);
          absoluteURL = url.href;

          //Set data
          let formData = new FormData();
          formData.append('action', 'uip_create_frame_switch');
          formData.append('security', uip_ajax.security);
          formData.append('uid', uid);

          self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
            if (item.newTab) {
              this.$refs.newTab.href = absoluteURL;
              this.$refs.newTab.click();
              this.$refs.newTab.href = '';
              this.$refs.newTab.blur();
            } else {
              this.uipress.updatePage(absoluteURL, true);
            }
          });
          return;
        }

        //Open in new tab
        if (item.newTab || item.withoutFrame) {
          this.$refs.newTab.href = absoluteURL;
          this.$refs.newTab.click();
          this.$refs.newTab.href = '';
          this.$refs.newTab.blur();
          return;
        }

        this.uipress.updatePage(item.url);
        //this.returnMenu;
      },
      hideIcons() {
        if (this.collapsed) {
          return false;
        }

        let icons = this.uipress.checkNestedValue(this.block, ['settings', 'block', 'options', 'hideIcons', 'value']);
        if (this.uipress.isObject(icons)) {
          return icons.value;
        }
        return icons;
      },
      returnDropPos() {
        let pos = this.uipress.get_block_option(this.block, 'block', 'menuDirection');
        if (!pos) {
          return 'bottom-left';
        }
        if (!('value' in pos)) {
          return 'bottom-left';
        }
        if (pos.value == 'horizontal') {
          return 'bottom-left';
        } else {
          return 'right';
        }
      },
      returnClasses() {
        let classes = '';
        if (this.collapsed) {
          classes += ' uip-menu-collapsed';
        }
        return classes;
      },
      returnSubIcon(item) {
        if (this.subMenuCustomIcon) {
          return this.subMenuCustomIcon;
        }
        if (this.subMenuStyle == 'dynamic') {
          return 'chevron_right';
        }
        if (item.open || item.active) {
          return 'expand_more';
        }
        return 'chevron_left';
      },
      returnTopIcon(icon) {
        if (icon && icon.includes('uipblank')) {
          return icon.replace('uipblank', 'favorite');
        }
        return icon;
      },
      santize(item) {
        if (typeof item === 'undefined') {
          return '';
        }
        if (item.url == '') {
          return '';
        }
        return item.replace(/&amp;/g, '&');
      },
      collapseOptions() {
        if (!this.activeMenu.submenu && this.subMenuStyle == 'dynamic') {
          return true;
        }
        if (this.activeMenu.submenu && this.subMenuStyle == 'dynamic') {
          return false;
        }
        return true;
      },
      sepHasCustomName(item) {
        let name = this.uipress.checkNestedValue(item, ['custom', 'name']);
        return name;
      },
    },
    template: `
    
          <div class="uip-admin-menu uip-text-normal" :class="returnClasses()">
          
            <div v-show="showSearch" class="uip-flex uip-menu-search uip-border-round uip-margin-bottom-s uip-flex-center" v-if="!collapsed">
              <span class="uip-icon uip-text-muted uip-margin-right-xs uip-icon">search</span>
              <input @keydown="watchForArrows" ref="menusearcher" class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.search" v-model="menuSearch">
            </div>
            
            
            <div v-if="menuSearch != ''" class="uip-flex uip-flex-column uip-row-gap-xxs" id="uip-menu-search-results">
            
              <template v-for="(item, index) in searchItems">
              
                  <a class="uip-flex uip-flex- uip-gap-xxxs uip-link-default uip-no-underline uip-flex-center uip-text-s uip-padding-xxxs uip-border-rounder"
                  @click="activeItem(item, $event)"
                  :class="menuSearchIndex == index ? 'uip-background-high-light' : ''" :href="item.url" :data-id="index">
                    
                    <span class="uip-text-muted" v-if="item.parent">{{item.parent}}</span>
                    <span class="uip-icon" v-if="item.parent">chevron_right</span>
                    <span class="">{{item.name}}</span>
                    
                  </a>
                
              </template>
            
            </div>
    
            
            <!--INLINE DROP MENU-->
            <template v-if="subMenuStyle == 'inline' && menuSearch == ''">
            
                <template v-for="item in workingMenu">
                
                  <div v-if="item.type != 'sep'" class="uip-flex uip-flex-column uip-row-gap-xs">
                  
                    <a :href="item.url" @click="activeItem(item, $event, true)" class="uip-no-underline uip-link-default uip-top-level-item" :class="item.customClasses" :active="item.active ? true : false">
                    
                      <div v-if="!hideIcons()" v-html="returnTopIcon(item.icon)" class="uip-flex uip-flex-center uip-menu-icon uip-icon uip-icon-medium"></div>
                      
                      <div class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
                        <div class="uip-line-height-1" v-html="item.name"></div>
                        <div v-if="item.notifications && item.notifications > 0" class="uip-border-round uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-text-bold uip-flex uip-flex-center uip-flex-middle uip-menu-notification"><span>{{item.notifications}}</span></div>
                      </div>
                      
                      <div v-if="item.submenu && item.submenu.length > 0" class="uip-icon uip-link-muted">{{returnSubIcon(item)}}</div>
                      
                    </a>
                    
                    <Transition name="slide-down">
                      <div v-if="item.submenu && (item.active || item.open) && item.submenu.length > 0" class="uip-admin-submenu">
                      
                          <template v-for="sub in item.submenu">
                          
                              <div v-if="sub.type != 'sep'" class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
                                <a :href="sub.url" @click="activeItem(sub, $event)" :class="sub.customClasses" class="uip-no-underline uip-link-muted uip-sub-level-item" :active="sub.active ? true : false">{{sub.name}}</a>
                                <div v-if="sub.notifications && sub.notifications > 0" class="uip-border-circle uip-w-14 uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-flex uip-flex-center uip-flex-middle uip-menu-notification"><span>{{sub.notifications}}</span></div>
                              </div>
                              
                              <div v-else-if="!sepHasCustomName(sub)" class="uip-margin-bottom-s uip-menu-separator"></div>
                              
                              <div v-else class="uip-margin-bottom-s uip-margin-top-s uip-flex uip-flex-row uip-gap-xxs uip-menu-separator">
                                <span v-if="sub.custom.icon && sub.custom.icon != 'uipblank'" class="uip-icon">{{sub.custom.icon}}</span>
                                <span>{{sub.custom.name}}</span>
                              </div>
                            
                          </template>
                          
                      </div>
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
            <template v-if="subMenuStyle == 'hover' && menuSearch == ''">
            
                <template v-for="item in workingMenu">
                
                  <dropdown v-if="item.type != 'sep'"  :pos="returnDropdownPosition" class="uip-flex uip-flex-column uip-row-gap-xs" :hover="true" slotClass="uip-admin-submenu" triggerClass="uip-flex uip-flex-grow uip-w-100p">
                    
                    <template v-slot:trigger>
                    
                      <a :href="item.url" @click="activeItem(item, $event, true)" class="uip-no-underline uip-link-default uip-top-level-item" :class="item.customClasses" :active="item.active ? true : false">
                      
                        <div v-if="!hideIcons()" v-html="returnTopIcon(item.icon)" class="uip-flex uip-flex-center uip-menu-icon uip-icon uip-icon-medium"></div>
                        
                        <div v-if="!collapsed" class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
                          <div v-html="item.name"></div>
                          <div v-if="item.notifications && item.notifications > 0" class="uip-border-round uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-text-bold uip-flex uip-flex-center uip-flex-middle uip-menu-notification"><span>{{item.notifications}}</span></div>
                        </div>
                        
                        
                      </a>
                      
                    </template>
                    
                    <template v-if="item.submenu && item.submenu.length > 0" v-slot:content>
                      
                          <template v-for="sub in item.submenu">
                          
                              <div v-if="sub.type != 'sep'" class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
                                <a :href="sub.url" @click="activeItem(sub, $event)" :class="sub.customClasses" class="uip-no-underline uip-link-default uip-sub-level-item" :active="sub.active ? true : false">{{sub.name}}</a>
                                <div v-if="sub.notifications && sub.notifications > 0" class="uip-border-circle uip-w-14 uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-flex uip-flex-center uip-flex-middle uip-menu-notification"><span>{{sub.notifications}}</span></div>
                              </div>
                              
                              <div v-else-if="!sepHasCustomName(sub)" class="uip-margin-bottom-s uip-menu-separator"></div>
                              
                              <div v-else class="uip-margin-bottom-s uip-margin-top-s uip-flex uip-flex-row uip-gap-xxs uip-menu-separator">
                                <span v-if="sub.custom.icon && sub.custom.icon != 'uipblank'" class="uip-icon">{{sub.custom.icon}}</span>
                                <span>{{sub.custom.name}}</span>
                              </div>
                            
                          </template>
                          
                    </template>
                  </dropdown>
                  
                  
                  <div v-else-if="!sepHasCustomName(item)" class="uip-margin-bottom-s uip-menu-separator"></div>
                  
                  <div v-else class="uip-margin-bottom-xs uip-margin-top-xs uip-flex uip-flex-row uip-gap-xxs uip-menu-separator">
                    <span v-if="item.custom.icon && item.custom.icon != 'uipblank'" class="uip-icon">{{item.custom.icon}}</span>
                    <span>{{item.custom.name}}</span>
                  </div>
                
                  
                </template>
              
            </template>
            <!--END INLINE DROP MENU-->
            
            
            
            <!--DYNAMIC MENU-->
            <template v-if="subMenuStyle == 'dynamic' && menuSearch == ''">
                
                <TransitionGroup name="slide-left">
                
                  <template v-if="activeMenu == false" v-for="item in workingMenu">
                  
                    <div v-if="item.type != 'sep'" class="uip-flex uip-flex-column uip-row-gap-xs">
                    
                      <a :href="item.url" @click="activeItem(item, $event, true)" class="uip-no-underline uip-link-default uip-top-level-item" :class="item.customClasses" :active="item.active ? true : false">
                      
                        <div v-if="!hideIcons()" v-html="returnTopIcon(item.icon)" class="uip-flex uip-flex-center uip-menu-icon uip-icon uip-icon-medium"></div>
                        
                        <div class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
                          <div class="uip-line-height-1" v-html="item.name"></div>
                          <div v-if="item.notifications && item.notifications > 0" class="uip-border-round uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-text-bold uip-flex uip-flex-center uip-flex-middle uip-menu-notification"><span>{{item.notifications}}</span></div>
                        </div>
                        
                        <div v-if="item.submenu && item.submenu.length > 0" class="uip-icon uip-link-muted">{{returnSubIcon(item, true)}}</div>
                        
                      </a>
                      
                    </div>
                    
                    <div v-else-if="!sepHasCustomName(item)" class="uip-margin-bottom-s uip-menu-separator"></div>
                    
                    <div v-else class="uip-margin-bottom-xs uip-margin-top-xs uip-flex uip-flex-row uip-gap-xxs uip-menu-separator">
                      <span v-if="item.custom.icon && item.custom.icon != 'uipblank'" class="uip-icon">{{item.custom.icon}}</span>
                      <span>{{item.custom.name}}</span>
                    </div>
                  
                    
                  </template>
                  
                </TransitionGroup>
                
                
                <Transition name="slide-right">
                  <div v-if="activeMenu.submenu && activeMenu.submenu.length > 0" class="uip-admin-submenu">
                  
                      
                      <div class="uip-flex uip-gap-xxs uip-flex-center uip-flex-row uip-flex-center uip-text-bold uip-text-l uip-sub-menu-header uip-margin-bottom-s uip-gap-xxs" @click="activeMenu = false">
                        <div class="uip-icon uip-icon-medium">arrow_back</div>
                        <div class="uip-flex-grow" v-html="activeMenu.name"></div>
                      </div>
                  
                      <template v-for="sub in activeMenu.submenu">
                      
                          <div v-if="sub.type != 'sep'" class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
                            <a :href="sub.url" @click="activeItem(sub, $event)" :class="sub.customClasses" class="uip-no-underline uip-link-muted uip-sub-level-item" :active="sub.active ? true : false">{{sub.name}}</a>
                            <div v-if="sub.notifications && sub.notifications > 0" class="uip-border-circle uip-w-14 uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-flex uip-flex-center uip-flex-middle uip-menu-notification"><span>{{sub.notifications}}</span></div>
                          </div>
                          
                          <div v-else-if="!sepHasCustomName(sub)" class="uip-margin-bottom-s uip-menu-separator"></div>
                          
                          <div v-else class="uip-margin-bottom-s uip-margin-top-s uip-flex uip-flex-row uip-gap-xxs uip-menu-separator">
                            <span v-if="sub.custom.icon && sub.custom.icon != 'uipblank'" class="uip-icon">{{sub.custom.icon}}</span>
                            <span>{{sub.custom.name}}</span>
                          </div>
                        
                      </template>
                      
                  </div>
                </Transition>
              
            </template>
            <!--END DYNAMIC-->
            
            
            
            
            
            <a ref="newTab" target="_BLANK" class="uip-hidden"></a>
            
            
            
            <div v-if="showCollapse && collapseOptions()" class="uip-flex uip-flex-row uip-gap-xs uip-flex-center uip-link-muted uip-margin-top-s uip-menu-collapse" @click="collapsed = !collapsed">
              <div v-if="collapsed" class="uip-icon uip-text-">arrow_forward_ios</div>
              <div v-if="!collapsed" class="uip-icon uip-text-">arrow_back_ios</div>
              <div v-if="!collapsed">{{strings.collapseMenu}}</div>
            </div>
            
          </div>`,
  };
}
