<script>
import Confirm from "@/components/confirm/index.vue";
const { __ } = wp.i18n;

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
      menu: [],
      activeMenu: false,
      rendered: true,
      workingMenu: [],
      watchMenu: [],
      activeLink: "",
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
      },
    },

    /**
     * Watches for changes to static menu status
     *
     * @since 3.3.0
     */
    hasStaticMenuEnabled: {
      handler() {
        if (!this.hasStaticMenuEnabled) {
          this.staticMenuEnabled = false;
          this.setMenu();
          this.buildMenu();
        } else if (this.returnStaticMenuID) {
          this.getStaticMenu();
        }
      },
      deep: true,
    },

    /**
     * Watches for changes to static menu id
     *
     * @since 3.3.0
     */
    returnStaticMenuID: {
      handler() {
        if (!this.returnStaticMenuID || !this.hasStaticMenuEnabled) return;
        this.getStaticMenu();
      },
      immediate: true,
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
     * Fetches a custom static menu
     *
     * @returns {Promise}
     */
    async getStaticMenu() {
      await this.$nextTick();
      if (!this.returnStaticMenuID) return;

      // Ensures it only fetches menu once in production
      if (this.uiTemplate.display == "prod" && this.staticMenuEnabled) return;

      this.rendered = false;

      const isMultisite = this.uipApp.data.options.multisite && this.uipApp.data.options.networkActivated ? "uiptrue" : false;

      let formData = new FormData();
      formData.append("action", "uip_get_custom_static_menu");
      formData.append("security", uip_ajax.security);
      formData.append("menuid", this.returnStaticMenuID);
      formData.append("isMultisite", isMultisite);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      const fallBack = () => {
        this.menu = JSON.parse(JSON.stringify(this.uipApp.data.adminMenu.menu));
        this.buildMenu();
        this.rendered = true;
      };

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true, false);
        return fallBack();
      }

      if (!("data" in response)) return fallBack();
      if (!Array.isArray(response.data.menu)) return fallBack();

      this.menu = response.data.menu;
      this.buildMenu();
      this.staticMenuEnabled = true;
      this.rendered = true;
    },

    /**
     * Mounts event listeners for menu block
     *
     * @since 3.2.13
     */
    mountEventListeners() {
      document.addEventListener("uipress/app/page/change", this.updateActiveLink, { once: false });
      document.addEventListener("uipress/app/page/load/finish", this.updateMenuFromFrame, { once: false });
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

      //console.log(stackedMenuItems);
      console.log(this.uipApp.data.adminMenu.menu);

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
        console.log("aborted all items already exist");
        return;
      }

      console.log(itemsExist);

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

      console.log("added");

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
        console.log("aborted");
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

      console.log("removed");

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
    v-if="subMenuStyle == 'dynamic' && rendered"
    :menuItems="workingMenu"
    :maybeFollowLink="maybeFollowLink"
    :collapsed="collapsed"
    :block="block"
    :activeLink="activeLink"
    :returnCollapsed="
      (d) => {
        collapsed = d;
      }
    "
  />

  <div v-else-if="rendered" class="uip-admin-menu uip-text-normal" :class="returnClasses">
    <Confirm ref="confirm" />

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
      <template v-for="item in workingMenu">
        <div v-if="item.type != 'sep' && !itemHiden(item)" class="uip-flex uip-flex-column uip-row-gap-xs">
          <TopLevelItem :item="item" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block" />

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
      <template v-for="item in workingMenu">
        <dropdown v-if="item.type != 'sep' && !itemHiden(item)" :pos="returnDropdownPosition" class="uip-flex uip-flex-column uip-row-gap-xs" :hover="true" :disableTeleport="true">
          <template v-slot:trigger>
            <TopLevelItem :item="item" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block" />
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
