<script>
import { nextTick } from "vue";
import { processMenu } from "./src/processMenu.js";
import { lmnFetch } from "@/assets/js/functions/lmnFetch.js";
const { __ } = wp.i18n;

// Setup store
import { useAppStore } from "@/store/app/app.js";

// Comps
import Confirm from "@/components/confirm/index.vue";
import MenuCollapse from "./src/MenuCollapse.vue";
import MenuSearch from "./src/MenuSearch.vue";
import SubMenuItem from "./src/SubMenuItem.vue";
import TopLevelItem from "./src/TopLevelItem.vue";
import DrillDownMenu from "./src/DrillDown.vue";

export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  components: {
    TopLevelItem,
    SubMenuItem,
    DrillDownMenu,
    MenuSearch,
    MenuCollapse,
    Confirm,
  },
  data() {
    return {
      appStore: useAppStore(),
      menu: [],
      menus: [],
      activeMenu: false,
      loading: false,
      rendered: true,
      ogMenu: [],
      workingMenu: [],
      watchMenu: [],
      iconClasses: [],
      activeLink: "",
      overrides: [
        ["dashboard", "dashboard"],
        ["admin-post", "keep"],
        ["admin-media", "photo_library"],
        ["admin-page", "description"],
        ["admin-comments", "forum"],
        ["admin-appearance", "palette"],
        ["admin-plugins", "extension"],
        ["admin-users", "group"],
        ["admin-tools", "build"],
        ["admin-settings", "tune"],
        ["archive", "inventory"],
        ["chart-bar", "equalizer"],
      ],
      breadCrumbs: [{ name: __("Home", "uipress-lite"), url: this.uipApp.data.dynamicOptions.viewadmin.value }],
      searching: false,
      staticMenuEnabled: false,
      strings: {
        mainmenu: __("Main menu", "uipress-lite"),
        collapseMenu: __("Collapse menu", "uipress-lite"),
        search: __("Search menu", "uipress-lite"),
      },
      collapsed: false,
    };
  },
  inject: ["uiTemplate"],
  watch: {
    /**
     * Watches for changes to the breadcrumbs and emits event
     *
     * @since 3.2.13
     */
    breadCrumbs: {
      handler(newValue, oldValue) {
        let self = this;
        let breadChange = new CustomEvent("uipress/app/breadcrumbs/update", { detail: { crumbs: self.breadCrumbs } });
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
        document.documentElement.setAttribute("uip-menu-collapsed", String(status));
        this.uiTemplate.menuCollapsed = status;
        this.saveUserPreference("menuCollapsed", status, false);

        const uipShadowRoot = document.querySelector("#uipress-shadow-root");

        if (uipShadowRoot) {
          const topLevelApp = uipShadowRoot.shadowRoot.firstElementChild;
          if (topLevelApp) topLevelApp.setAttribute("uip-menu-collapsed", String(status));
        }
      },
    },

    /**
     * Watches for changes to static menu id
     *
     * @since 3.3.0
     */
    hasStaticMenuEnabled: {
      handler() {
        if (!this.hasStaticMenuEnabled && this.uiTemplate.display !== "prod") {
          this.getMenuForUser();
        }
      },
    },

    /**
     * Watches for changes to static menu id
     *
     * @since 3.3.0
     */
    returnStaticMenuID: {
      handler() {
        if (!this.returnStaticMenuID || !this.hasStaticMenuEnabled || this.uiTemplate.display == "prod") return;

        this.setMenuFromStatic();
      },
    },
  },
  created() {
    //this.setMenu();
    //this.buildMenu();

    if (this.uipApp.data.userPrefs.menuCollapsed) {
      this.collapsed = true;
    }

    this.getMenuForUser();
  },
  mounted() {
    this.mountEventListeners();
  },
  computed: {
    returnDashIconClasses() {
      const iconClasses = this.iconClasses
        .map((item) => {
          if (item.before) {
            if (item.before.includes("url(")) {
              item.backGroundImage = item.before;
              item.before = "";
            }
          }

          const shouldSkip = this.overrides.filter((classPair) => `.dashicons-${classPair[0]}` == item.class);

          if (shouldSkip && shouldSkip.length) return;

          return `
        ${item.class}:before {
          content: '${item.before || ""}';
          height: 1.2em;
          width: 1.2em;
          min-height: 1.2em;
          min-width: 1.2em;
          color: currentColor;
          font-size: 1.2em;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center center;
          ${item.font ? `font-family: '${item.font}' !important;` : ""}
          ${item.backGroundImage ? `background-image: ${item.backGroundImage} !important;` : ""}
          ${item.backGroundImage ? `filter: contrast(0.3);` : ""}
        }
        `;
        })
        .join("\n");

      return `${this.returnIconOverrides} ${iconClasses}`;
    },
    returnIconOverrides() {
      const base = this.appStore.state.pluginBase;

      return this.overrides
        .map(
          ([dashicon, icon]) => `
      .dashicons-${dashicon}:before {
      content: '';
      height: 1.2em;
      width: 1.2em;
      min-height: 1.2em;
      min-width: 1.2em;
      background-color: currentColor;
      -webkit-mask: url(${base}assets/icons/${icon}.svg) no-repeat center;
      -webkit-mask-size: contain;
      mask: url(${base}assets/icons/${icon}.svg) no-repeat center;
      mask-size: contain;
      font-size: 1.2em;
      display: inline-block;
      }
    `
        )
        .join("");
    },
    /**
     * Returns whether the block has has static menu enabled
     *
     * @since 3.2.13
     */
    hasStaticMenuEnabled() {
      const staticmenu = this.get_block_option(this.block, "block", "staticMenu");
      return this.isObject(staticmenu) ? staticmenu.enabled : false;
    },

    /**
     * Returns the static menu id
     *
     * @since 3.2.13
     */
    returnStaticMenuID() {
      const staticmenu = this.get_block_option(this.block, "block", "staticMenu");
      return this.isObject(staticmenu) ? staticmenu.menuid : false;
    },

    /**
     * Gets menu style. Returns style or 'dynamic' if not set
     *
     * @since 3.2.13
     */
    subMenuStyle() {
      if (this.collapsed) return "hover";
      let style = this.get_block_option(this.block, "block", "subMenuStyle");
      if (!this.isObject(style)) return "dynamic";
      if (style.value) return style.value;
      return "dynamic";
    },

    /**
     * Returns custom submenu icon. Returns false on failure
     *
     * @since 3.2.13
     */
    subMenuCustomIcon() {
      let icon = this.get_block_option(this.block, "block", "subMenuIcon");
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
    autoLoadIsEnabled() {
      const disbaled = this.get_block_option(this.block, "block", "loadOnClick");
      return this.isObject(disbaled) ? disbaled.value : false;
    },

    /**
     * Returns whether the menu collapse option is available
     *
     * @returns {boolean}
     * @since 3.2.13
     */
    hasMenuCollapse() {
      const menuCollapse = this.get_block_option(this.block, "block", "menuCollapse");
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
      const showSearch = this.get_block_option(this.block, "block", "showSearch");
      if (this.isObject(showSearch)) return showSearch.value;
      return showSearch;
    },

    /**
     * Returns the drop position of the submenu drop. Returns 'right top' if not set
     *
     * @since 3.2.13
     */
    returnDropdownPosition() {
      const pos = this.get_block_option(this.block, "block", "dropdownPosition");
      if (!this.isObject(pos)) return "right top";

      if (pos.value) return pos.value;
      return "right top";
    },

    /**
     * Returns collapsed class when necessary
     *
     * @since 3.2.13
     */
    returnClasses() {
      if (this.collapsed) return "uip-menu-collapsed";
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

      const icons = this.hasNestedPath(this.block, ["settings", "block", "options", "hideIcons", "value"]);
      if (this.isObject(icons)) return icons.value;
      return icons;
    },

    flattenedItems() {
      const flattened = [];

      const flatten = (items) => {
        items.forEach((item) => {
          flattened.push(item);

          if (item.submenu && item.submenu.length > 0) {
            flatten(item.submenu);
          }
        });
      };

      // Assuming this.items is your original nested array
      flatten(this.ogMenu);

      return flattened;
    },
  },

  /**
   * Removes event listeners before unmount
   *
   * @since 3.2.13
   */
  beforeUnmount() {
    document.removeEventListener("uipress/app/page/change", this.updateActiveLink, { once: false });
    document.removeEventListener("uipress/app/page/load/finish", this.updateMenuFromFrame, { once: false });
    document.removeEventListener("uipress/blocks/adminmenu/togglecollapse", this.handleMenuCollapse, { once: false });
  },
  methods: {
    async getMenuForUser() {
      // Ensure the original menu has been parsed before moving on
      await this.generateMenu();
      setTimeout(this.generateMenu, 1000);

      if (this.returnStaticMenuID && this.hasStaticMenuEnabled) {
        this.setMenuFromStatic();
        return;
      }

      // Attempt to fetch menu from cache
      const cachedMenu = this.getMenuFromLocalStorage();
      if (Array.isArray(cachedMenu)) {
        this.workingMenu = cachedMenu;
        this.setActiveItem();
        return;
      } else if (cachedMenu == "no_menus") {
        this.workingMenu = [...this.ogMenu];
        return;
      }

      setTimeout(this.getRemoteMenus, 1);
    },

    // Function to fetch array from localStorage, return null if expired
    getMenuFromLocalStorage() {
      const key = `uipress_menu_${this.appStore.state.userID}_${this.appStore.state.userID}`;

      // Invalidate the cache on menu creator page so it will refresh to any changes
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get("page");
      if (page === "uip-menu-creator") {
        localStorage.setItem(key, false);
        return null;
      }

      const item = localStorage.getItem(key);

      if (!item) {
        return null;
      }

      const parsedItem = JSON.parse(item);
      const now = new Date().getTime();
      const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

      if (now - parsedItem.timestamp > oneHour) {
        localStorage.removeItem(key);
        return null;
      }

      return parsedItem.value;
    },

    async setMenuFromStatic() {
      // Ensure the original menu has been parsed before moving on
      await this.generateMenu();

      this.loading = false;

      const args = { endpoint: `wp/v2/uip-admin-menu/${this.returnStaticMenuID}`, params: { status: "any" } };
      const data = await lmnFetch(args);

      this.loading = false;

      if (!data) {
        this.workingMenu = [...this.ogMenu];
        return;
      }

      const menu_data = data.data?.uipress?.settings?.menu;

      if (menu_data) {
        this.refactorMenu(menu_data);
      }
    },

    async getRemoteMenus() {
      // Ensure the original menu has been parsed before moving on
      await this.generateMenu();

      this.loading = false;

      const args = { endpoint: "wp/v2/uip-admin-menu", params: { per_page: 100, status: "publish" } };
      const data = await lmnFetch(args);

      this.loading = false;

      if (!data) {
        this.workingMenu = [...this.ogMenu];
        return;
      }

      this.menus = data.data;

      this.setActiveMenu();
    },

    setActiveMenu() {
      // No custom menus so bail
      if (!this.menus.length) {
        this.workingMenu = [...this.ogMenu];
        this.cacheMenu("no_menus");
        return;
      }

      for (let remoteMenu of this.menus) {
        const userRoles = this.appStore.state.userRoles;
        const includesRoles = remoteMenu.uipress?.forRoles || [];
        const includesUsers = remoteMenu.uipress?.forUsers || [];

        // Check if user is matched
        const matchedUser = includesUsers.find((item) => item == this.appStore.state.userID);

        // Check if user role matches
        let matchedRole = false;
        for (let role of userRoles) {
          const match = includesRoles.find((item) => item == role);
          if (match) {
            matchedRole = true;
            break;
          }
        }

        const excludedRoles = remoteMenu.uipress?.excludesRoles || [];
        const excludedUsers = remoteMenu.uipress?.excludesUsers || [];

        // Check if user is excluded
        const matchedExcludedUser = excludedUsers.find((item) => item == this.appStore.state.userID);

        // Check if user role matches
        let matchedExcludedRole = false;
        for (let role of userRoles) {
          const match = excludedRoles.find((item) => item == role);
          if (match) {
            matchedExcludedRole = true;
            break;
          }
        }

        // User is either matched by role or user id and not excluded by role or user id
        if ((matchedUser || matchedRole) && !matchedExcludedUser && !matchedExcludedRole) {
          // Update menu

          this.refactorMenu(remoteMenu.uipress.settings.menu);
          //menu.value = [...remoteMenu.uipress.settings.];
          //filterMenu();
          return;
        }
      }
      // Menus applied so set default
      this.workingMenu = [...this.ogMenu];
      this.cacheMenu("no_menus");
    },

    refactorMenu(data) {
      const topLevel = this.uipParseJson(JSON.stringify(data.menu));
      const submenu = this.uipParseJson(JSON.stringify(data.submenu));
      const flattenedMenu = this.flattenedItems;

      const processed = [];

      for (let item of topLevel) {
        // Remove hidden items
        if (item.custom.hidden) continue;

        if (item.type == "sep") {
          processed.push({ ...item, settings: item.custom, submenu: [] });
          continue;
        }

        const itemID = item[5] || item[2];

        const ogItem = flattenedMenu.find((flat) => flat.id == itemID);

        const itemSubmenu = submenu[item[2]] || [];
        const processedSubMenu = [];

        // Loop sub items
        for (let subItem of itemSubmenu) {
          // Remove hidden items
          if (subItem?.custom?.hidden) continue;

          const subID = `${itemID}-${subItem[2]}`;

          const ogSubItem = flattenedMenu.find((subflat) => subflat.id == subID);

          if (ogSubItem) {
            processedSubMenu.push({ ...ogSubItem, settings: subItem.custom, submenu: [] });
          } else if (subItem.customItem) {
            processed.push({ ...subItem, name: subItem.custom.name || subItem.cleanName, settings: subItem.custom, submenu: [] });
          } else {
            const potentialMatch = flattenedMenu.find((subflat) => subflat.original_id == subItem[2]);

            if (potentialMatch) {
              processedSubMenu.push({ ...potentialMatch, settings: subItem.custom, submenu: [] });
            }
          }
        }

        if (ogItem) {
          processed.push({ ...item, ...ogItem, name: ogItem.name || item.cleanName, settings: item.custom, submenu: processedSubMenu });
        } else if (item.customItem) {
          processed.push({ ...item, name: item.custom.name || item.cleanName, settings: item.custom, submenu: processedSubMenu });
        } else {
          const potentialMatch = flattenedMenu.find((subflat) => subflat.original_id == itemID);

          if (potentialMatch) {
            processed.push({ ...item, ...potentialMatch, name: potentialMatch.name || item.cleanName, settings: item.custom, submenu: processedSubMenu });
          }
        }
      }

      this.workingMenu = [...processed];
      this.cacheMenu(processed);
      this.setActiveItem();
    },

    async setActiveItem() {
      await nextTick();

      let activeItem = document.querySelector("#adminmenu a.current") || document.querySelector("#adminmenu .wp-menu-open a") || document.querySelector("#adminmenu a[aria-current='page']");
      let activeURL = "";

      // Get active items URL
      if (activeItem) {
        if (activeItem.tagName && activeItem.tagName.toLowerCase() === "a") {
          activeURL = activeItem.getAttribute("href");
        }
      }

      this.workingMenu = this.workingMenu.map((item) => ({ ...item, active: item.url == activeURL }));

      // Remove sub items that no longer exist
      for (let toplevel of this.workingMenu) {
        // Bail if it's a sep
        if (toplevel.type == "separator" || !Array.isArray(toplevel.submenu)) continue;

        toplevel.submenu = toplevel.submenu.map((item) => ({ ...item, active: activeURL == item.url }));
        const activeItem = toplevel.submenu.find((item) => item.active);

        if (activeItem) {
          toplevel.active = true;
        }
      }
    },

    /**
     * Saves the menu into local storage
     */
    cacheMenu(menu) {
      const key = `uipress_menu_${this.appStore.state.userID}_${this.appStore.state.siteID}`;
      const item = {
        value: menu,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    },

    async generateMenu() {
      const menuNode = document.querySelector("#adminmenumain");
      const { processedMenu, dashIcons } = await processMenu(menuNode);
      this.ogMenu = processedMenu;
      this.iconClasses = dashIcons;
      this.rendered = true;
    },
    /**
     * Sets menu from settings object
     *
     * @since 3.2.13
     */
    setMenu() {
      if (this.uipApp.data.userPrefs.menuCollapsed) this.collapsed = true;

      // Only set the menu if we are not using a static menu
      if (this.returnStaticMenuID && this.hasStaticMenuEnabled) return;
      this.menu = JSON.parse(JSON.stringify(this.uipApp.data.adminMenu.menu));
    },

    /**
     * Mounts event listeners for menu block
     *
     * @since 3.2.13
     */
    mountEventListeners() {
      //document.addEventListener("uipress/app/page/change", this.updateActiveLink, { once: false });
      //document.addEventListener("uipress/app/page/load/finish", this.updateMenuFromFrame, { once: false });
      document.addEventListener("uipress/blocks/adminmenu/togglecollapse", this.handleMenuCollapse, { once: false });
    },

    /**
     * Handles menu collapse event from outside block
     *
     * @param {object} evt
     * @since 3.3.091
     */
    handleMenuCollapse(evt) {
      this.collapsed = !this.collapsed;
    },

    /**
     * Sets new active link from page change event
     *
     * @param {Object} e - page change event
     * @since 3.2.13
     */
    updateActiveLink(e) {
      this.activeLink = e.detail.url ? e.detail.url.replaceAll("%2F", "/") : e.detail.url;
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
      this.breadCrumbs = [{ name: __("Home", "uipress-lite"), url: this.uipApp.data.dynamicOptions.viewadmin.value }];

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

        const foundItem = this.workingMenu.find((obj) => obj.uip_uid === item.uip_uid);
        const state = foundItem ? foundItem.open : false;
        if (state) item.open = true;

        if (item.url === currentLink) {
          item.active = true;
          this.breadCrumbs.push({ name: item.name, url: item.url });
        }

        if (item.submenu) {
          item.submenu.forEach(processSubItem);
          let subState = item.submenu.some((subitem) => subitem.active === true);

          if (subState) {
            item.active = true;
          }
        }
      };

      // Process the menu items
      this.menu.forEach(processMenuItem);
      this.workingMenu = this.menu;
    },

    /**
     * Returns given items URL
     *
     * @param {object} item
     * @since 3.2.0
     */
    returnItemLink(item) {
      return this.hasNestedPath(item, "custom", "url") ? item.custom.url : item.url;
    },

    /**
     * Checks content frame for an updated menu on page load
     *
     * @since 3.2.13
     */
    updateMenuFromFrame() {
      // Don't update because we have a static menu set
      if (this.staticMenuEnabled) return;

      // Watch for menu changes in frame
      const frame = document.querySelector(".uip-page-content-frame");

      // Frame does not exist so bail
      if (!frame) return;

      this.setWatchMenu(frame);

      const menuScript = frame.contentWindow.document.querySelector("#uip-admin-menu");
      const masterMenu = menuScript ? this.uipParseJson(menuScript.getAttribute("data-menu")) : false;
      if (!masterMenu) return;

      if (!masterMenu || typeof masterMenu === "undefined") return;
      if (!("menu" in masterMenu)) return;

      // Update menu
      this.menu = masterMenu.menu;
      this.buildMenu();
    },

    /**
     * Set's a watch menu to detect new items added / removed to menu
     *
     * @since 3.2.13
     */
    setWatchMenu(frame) {
      // Disabled auto update feature for now, needs more work
      return;
      //("menu-top toplevel_page_woocommerce menu-top-first");
      // We only need to watch for changes on a custom menu
      const menuIsCustom = this.uipApp.data.adminMenu.custom;
      if (!menuIsCustom) return;

      // Get menu node
      const menuNode = frame.contentWindow.document.querySelector("#adminmenu");
      let stackedMenuItems = [];

      // No menu node so probably a front end page
      if (!menuNode) return;

      // Get all direct children that are 'li' elements
      const menuItems = menuNode.querySelectorAll(":scope > li");

      // Loop through each link
      const processMenuItems = (link) => {
        const processedLink = this.processWatchMenuItem(link);
        if (processedLink) stackedMenuItems.push(processedLink);
      };

      // Loop items
      menuItems.forEach(processMenuItems);

      // First time setting the menu so need to compare
      if (!this.watchMenu.length) return (this.watchMenu = stackedMenuItems);

      const removedItems = this.findRemovedItems(this.watchMenu, stackedMenuItems);
      const addedItems = this.findAddedItems(this.watchMenu, stackedMenuItems);

      if (addedItems.length) this.handleNewMenuItems(addedItems);
      if (removedItems.length) this.handleRemovedMenuItems(removedItems);

      this.watchMenu = JSON.parse(JSON.stringify(stackedMenuItems));
    },

    /**
     * Handles new items added to the menu
     *
     * @param {Array} newItems - The new items added
     *
     * @since 3.3.095
     */
    async handleNewMenuItems(newItems) {
      const count = newItems.length;

      const itemsExist = this.findExistingObjectsByUID(this.uipApp.data.adminMenu.menu, newItems);

      if (itemsExist.length === newItems.length) {
        return;
      }

      if (itemsExist.length) {
        newItems = this.removeObjectsByUID(newItems, itemsExist);
      }

      let renderedNewItems = `<div class="uip-margin-top-s uip-margin-bottom-s uip-flex uip-flex-column uip-row-gap-xs">`;

      for (let newitem of newItems) {
        renderedNewItems += `<div><div class="uip-text-bold uip-text-normal">${newitem.name}</div>`;
        renderedNewItems += `<a href="${newitem.url}" target="_BLANK" class="uip-text-s">${newitem.url}</a></div>`;
      }

      renderedNewItems += `</div>`;

      const confirm = await this.$refs.confirm.show({
        title: __("New menu items detected!", "uipress-lite"),
        message: __("Do you want to add the below items to your menu?", "uipress-lite") + renderedNewItems,
        okButton: __("Add items to menu", "uipress-lite"),
      });

      if (!confirm) return;

      // Push items to the menu
      this.pushNewItemsToServerMenu(newItems);
      this.menu = [...this.menu, ...newItems];
      this.buildMenu();
    },

    /**
     * Saves new menu items to menu saved in database
     *
     * @param {Array} newItems - The items to add
     *
     * @since 3.3.095
     */
    async pushNewItemsToServerMenu(newItems) {
      const menu_id = this.uipApp.data.adminMenu.menu_id;

      let formData = new FormData();
      formData.append("action", "uip_push_new_custom_menu_items");
      formData.append("security", uip_ajax.security);
      formData.append("menu_id", menu_id);
      formData.append("new_items", JSON.stringify(newItems));

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      if (response.error) {
        this.uipApp.notifications.notify(__("Something went wrong", "uipress-lite"), response.message, "", "error");
        return false;
      }

      if (response.success) {
        this.uipApp.notifications.notify(__("Menu updated", "uipress-lite"), "", "success");
        return true;
      }
    },

    /**
     * Saves new menu items to menu saved in database
     *
     * @param {Array} newItems - The items to add
     *
     * @since 3.3.095
     */
    async removeItemsFromServerMenu(removedItems) {
      const menu_id = this.uipApp.data.adminMenu.menu_id;

      let formData = new FormData();
      formData.append("action", "uip_remove_custom_menu_items");
      formData.append("security", uip_ajax.security);
      formData.append("menu_id", menu_id);
      formData.append("new_items", JSON.stringify(removedItems));

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      if (response.error) {
        this.uipApp.notifications.notify(__("Something went wrong", "uipress-lite"), response.message, "", "error");
        return false;
      }

      if (response.success) {
        this.uipApp.notifications.notify(__("Menu updated", "uipress-lite"), "", "success");
        return true;
      }
    },

    /**
     * Handles new items removed from the menu
     *
     * @param {Array} removedItems - The items removed
     *
     * @since 3.3.095
     */
    async handleRemovedMenuItems(removedItems) {
      const count = removedItems.length;

      const itemsExist = this.findExistingObjectsByUID(this.uipApp.data.adminMenu.menu, removedItems);

      if (!itemsExist.length) {
        return;
      }

      removedItems = itemsExist;

      let renderedNewItems = `<div class="uip-margin-top-s uip-margin-bottom-s uip-flex uip-flex-column uip-row-gap-xs">`;

      for (let newitem of removedItems) {
        renderedNewItems += `<div><div class="uip-text-bold uip-text-normal">${newitem.name}</div>`;
        renderedNewItems += `<a href="${newitem.url}" target="_BLANK" class="uip-text-s">${newitem.url}</a></div>`;
      }

      renderedNewItems += `</div>`;

      const confirm = await this.$refs.confirm.show({
        title: __("Items removed from menu!", "uipress-lite"),
        message: __("Do you want to remove the below items from your menu?", "uipress-lite") + renderedNewItems,
        okButton: __("Remove items from menu", "uipress-lite"),
      });

      if (!confirm) return;

      // Push items to the menu
      this.removeItemsFromServerMenu(removedItems);
      this.menu = this.removeObjectsByUID(this.menu, removedItems);
      this.buildMenu();
    },

    /**
     * Finds removed items from and removes them from the array
     *
     * @param {Array} originalArray - the original array
     * @param {Array} newArray - the new array
     *
     * @since 3.3.095
     */
    removeObjectsByUID(sourceArray, objectsToRemove) {
      // Extract uip_uid values from objectsToRemove array
      const uidsToRemove = objectsToRemove.map((obj) => obj.uip_uid);

      // Filter out objects from sourceArray whose uip_uid is in uidsToRemove
      return sourceArray.filter((obj) => !uidsToRemove.includes(obj.uip_uid));
    },

    /**
     * Compares two arrays and returns items that exists in source array
     *
     * @param {Array} sourceArray - the original array
     * @param {Array} objectsToCheck - the new array
     *
     * @since 3.3.095
     */
    findExistingObjectsByUID(sourceArray, objectsToCheck) {
      // Extract uip_uid values from objectsToCheck array
      const uidsToCheck = objectsToCheck.map((obj) => obj.uip_uid);

      // Filter sourceArray for objects whose uip_uid is in uidsToCheck
      return sourceArray.filter((obj) => uidsToCheck.includes(obj.uip_uid));
    },

    /**
     * Finds removed items from two arrays
     *
     * @param {Array} originalArray - the original array
     * @param {Array} newArray - the new array
     *
     * @since 3.3.095
     */
    findRemovedItems(originalArray, newArray) {
      return originalArray.filter((origItem) => !newArray.find((newItem) => newItem.uip_uid === origItem.uip_uid));
    },

    /**
     * Finds new items from two arrays
     *
     * @param {Array} originalArray - the original array
     * @param {Array} newArray - the new array
     *
     * @since 3.3.095
     */
    findAddedItems(originalArray, newArray) {
      return newArray.filter((newItem) => !originalArray.find((origItem) => origItem.id === newItem.id));
    },

    /**
     * Process menu items and returns an array of items
     *
     * @since 3.3.095
     */
    processWatchMenuItem(link, isSubMenu) {
      let itemID = link.id;
      let linkNode = link.querySelector(":scope > a");

      // Don't track collapse menu object and only track items with links
      if (itemID === "collapse-menu" || !linkNode) return;

      // Don't watch hidden items
      if (linkNode.getAttribute("aria-hidden") == "true") return;

      // Get link name

      let nameNode = !isSubMenu ? linkNode.querySelector(":scope > .wp-menu-name") : linkNode;
      let name = nameNode ? nameNode.innerText : "";
      let cleanName = nameNode ? nameNode.innerHTML.split("<")[0] : "";
      let notifications = nameNode ? this.extractNumberFromHtml(nameNode.innerHTML) : 0;
      let iconNode = !isSubMenu ? linkNode.querySelector(":scope > .wp-menu-image") : false;

      if (iconNode) {
        const classesToAdd = ["uip-w-16", "uip-ratio-1-1", "uip-background-no-repeat", "uip-background-center", "uip-background-contain"];
        if (iconNode.classList.contains("svg")) iconNode.classList.add(...classesToAdd);
      }

      let classes = isSubMenu ? "" : `${itemID} menu-top menu-top-first`;

      let icon = iconNode ? iconNode.outerHTML : "";
      let linkhref = linkNode.getAttribute("href");

      // Get custom uip classes
      let uip_uid_ = this.findClassWithPrefix(link, "uip_uid_");
      uip_uid_ = uip_uid_ ? uip_uid_.replace("uip_uid_", "") : this.createUID();

      let uip_wp_id_ = this.findClassWithPrefix(link, "uip_wp_id_");
      uip_wp_id_ = uip_wp_id_ ? uip_wp_id_.replace("uip_wp_id_", "") : this.createUID();

      let uip_unp_url_ = this.findClassWithPrefix(link, "uip_unp_url_");
      uip_unp_url_ = uip_unp_url_ ? uip_unp_url_.replace("uip_unp_url_", "") : linkhref;

      // Set ID for submenus
      itemID = itemID ? itemID : linkNode.href;

      // Get submenu
      let submenu = link.querySelector(":scope > ul.wp-submenu");

      let processedSubMenu = [];

      if (submenu) {
        const subItems = submenu.querySelectorAll(":scope > li");
        subItems.forEach((sublink) => {
          const processedSubLink = this.processWatchMenuItem(sublink, true);
          if (processedSubLink) processedSubMenu.push(processedSubLink);
        });
      }

      return {
        0: name,
        1: uip_wp_id_,
        2: uip_unp_url_,
        id: itemID,
        url: linkhref,
        submenu: processedSubMenu,
        name: name,
        cleanName: cleanName,
        icon: icon,
        custom: {},
        notifications: notifications,
        type: "menu",
        uip_uid: uip_uid_,
        active: false,
        classes: classes,
      };
    },

    /**
     * Extracts a class with specified prefix if exists
     *
     * @param {Node} node - the html node to search
     * @param {String} html - the html string to parse
     *
     * @since 3.3.095
     */
    findClassWithPrefix(node, prefix) {
      return Array.from(node.classList).find((className) => className.startsWith(prefix));
    },

    /**
     * Extracts a number from a given html string
     *
     * @param {String} html - the html string to parse
     *
     * @since 3.3.095
     */
    extractNumberFromHtml(html) {
      if (!html) {
        return null;
      }

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      const nodes = doc.getElementsByTagName("*"); // get all elements

      for (let i = 0; i < nodes.length; i++) {
        const nodeValue = nodes[i].textContent.trim();
        if (!isNaN(nodeValue) && nodeValue !== "") {
          return parseInt(nodeValue, 10);
        }
      }

      return null;
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
      if (this.uiTemplate.display == "prod") {
        return;
      }

      // If modifier keys allow the event to happen naturally
      if (evt.ctrlKey || evt.shiftKey || evt.metaKey || evt.button == 1) return;

      // New tab so let the browser handle it
      if (this.hasNestedPath(item, "custom", "newTab")) return;

      // Prevent default link click
      evt.preventDefault();

      // If we have disabled autoload on top level items and there is a submenu just open the menu and return
      if (topLevel && !this.autoLoadIsEnabled && item.submenu && item.submenu.length > 0) {
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
      this.updateAppPage(this.returnItemLink(item));
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
      if (this.subMenuStyle == "dynamic") return "chevron_right";

      // If item is open / active then return the open icon
      if (item.open || item.active) return "expand_more";

      // No conditions met so return default
      return "chevron_left";
    },

    /**
     * Utility function to catch uipblank in icon names
     *
     * @param {String} icon - the icon to check
     */
    returnTopIcon(icon) {
      const status = icon ? icon.includes("uipblank") : false;
      if (status) return icon.replace("uipblank", "favorite");
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
      if (!item) return "";

      return item
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/%20/g, " ");
    },

    /**
     * Checks if a separator has a custom name. Returns name on success, false on failure
     *
     * @param {Object} item - the separator object
     * @since 3.2.13
     */
    sepHasCustomName(item) {
      return this.hasNestedPath(item, ["custom", "name"]);
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

    /**
     * Returns items custom classes
     *
     * @since 3.3.09
     */
    returnItemClasses(item) {
      return this.hasNestedPath(item, "custom", "classes") ? item.custom.classes : "";
    },

    /**
     * Returns whether the menu item is hidden
     *
     * @returns {boolean} - whether to hide item
     * @since 3.2.13
     */
    itemHiden(item) {
      return this.hasNestedPath(item, "custom", "hidden");
    },
  },
};
</script>

<template>
  <DrillDownMenu
    v-if="subMenuStyle == 'dynamic' && rendered && workingMenu.length"
    :menuItems="workingMenu"
    :maybeFollowLink="maybeFollowLink"
    :collapsed="collapsed"
    :block="block"
    :activeLink="activeLink"
    :returnDashIconClasses="() => returnDashIconClasses"
    :returnCollapsed="
      (d) => {
        collapsed = d;
      }
    "
  />

  <div v-else-if="rendered" class="uip-admin-menu uip-text-normal" :class="returnClasses">
    <Confirm ref="confirm" />
    <component is="style">{{ returnDashIconClasses }}</component>

    <MenuSearch
      v-if="hasMenuSearch && !collapsed"
      @searching="
        (d) => {
          searching = d;
        }
      "
      :maybeFollowLink="maybeFollowLink"
      :workingMenu="workingMenu"
    />

    <!--INLINE DROP MENU-->
    <template v-if="subMenuStyle == 'inline' && !searching">
      <template v-for="(item, index) in workingMenu">
        <div v-if="item.type != 'sep' && !itemHiden(item)" class="uip-flex uip-flex-column uip-row-gap-xs">
          <TopLevelItem v-model="workingMenu[index]" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block" />

          <Transition name="slide-down">
            <SubMenuItem :subMenuStyle="subMenuStyle" v-if="itemHasOpenSubMenu(item)" :item="item" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block" />
          </Transition>
        </div>

        <div v-else-if="!sepHasCustomName(item) && !itemHiden(item)" class="uip-margin-bottom-s uip-menu-separator" :class="returnItemClasses(item)"></div>

        <div v-else-if="!itemHiden(item)" class="uip-margin-bottom-xs uip-margin-top-xs uip-flex uip-flex-row uip-gap-xxs uip-menu-separator" :class="returnItemClasses(item)">
          <AppIcon v-if="item.custom.icon && item.custom.icon != 'uipblank'" :icon="item.custom.icon" class="uip-icon" />
          <span>{{ item.custom.name }}</span>
        </div>
      </template>
    </template>
    <!--END INLINE DROP MENU-->

    <!--HOVER MENU-->
    <template v-if="subMenuStyle == 'hover' && !searching">
      <template v-for="(item, index) in workingMenu">
        <dropdown v-if="item.type != 'sep' && !itemHiden(item)" :pos="returnDropdownPosition" class="uip-flex uip-flex-column uip-row-gap-xs" :hover="true" :disableTeleport="true">
          <template v-slot:trigger>
            <TopLevelItem v-model="workingMenu[index]" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block" />
          </template>

          <template v-if="item.submenu && item.submenu.length > 0" v-slot:content>
            <SubMenuItem :subMenuStyle="subMenuStyle" :item="item" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block" />
          </template>
        </dropdown>

        <div v-else-if="!sepHasCustomName(item) && !itemHiden(item)" class="uip-margin-bottom-s uip-menu-separator" :class="returnItemClasses(item)"></div>

        <div v-else-if="!itemHiden(item)" class="uip-margin-bottom-xs uip-margin-top-xs uip-flex uip-flex-row uip-gap-xxs uip-menu-separator" :class="returnItemClasses(item)">
          <AppIcon v-if="item.custom.icon && item.custom.icon != 'uipblank'" :icon="item.custom.icon" class="uip-icon" />
          <span>{{ item.custom.name }}</span>
        </div>
      </template>
    </template>

    <a ref="newTab" target="_BLANK" class="uip-hidden"></a>

    <MenuCollapse
      v-if="hasMenuCollapse"
      :collapsed="collapsed"
      :returnData="
        (d) => {
          collapsed = d;
        }
      "
    />
  </div>
</template>
