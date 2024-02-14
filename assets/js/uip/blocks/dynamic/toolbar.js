const { __, _x, _n, _nx } = wp.i18n;
import { nextTick } from "../../../libs/vue-esm.js";

const submenu = {
  name: "SubMenu",
  props: {
    submenu: Object,
    updatePage: Function,
    formatHREF: Function,
    itemHasSubmenu: Function,
    dropPos: String,
  },
  data() {
    return {};
  },

  template: `
    
    <div class="uip-toolbar-submenu uip-min-w-200 uip-border-rounder uip-padding-xs uip-max-h-500" style="overflow:auto">
    
      <template  v-for="sub in submenu">
        
        <dropdown width="200" :pos="dropPos" v-if="sub.title" :hover="true"  :disableTeleport="true">
        
          <template v-slot:trigger>
            <a @click="updatePage(sub, $event)" :href="formatHREF(sub.href)" class="uip-link-default uip-no-underline uip-toolbar-sub-item uip-flex uip-flex-center uip-flex-between uip-gap-s uip-flex-grow uip-padding-xxs uip-border-rounder hover:uip-background-muted" >
              <span v-html="sub.title"></span>
              <span v-if="itemHasSubmenu(sub.submenu)" class="uip-icon">chevron_right</span>
            </a>
          </template>
          
          
          <template v-slot:content v-if="itemHasSubmenu(sub.submenu)">
          
            <SubMenu
            :updatePage="updatePage"
            :formatHREF="formatHREF"
            :itemHasSubmenu="itemHasSubmenu"
            :submenu="sub.submenu"/>
          
          </template>
          
        </dropdown>
        
      </template>
      
    </div>
    <!--END SECOND DROP -->
  
  `,
};

export default {
  components: {
    SubMenu: submenu,
  },
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      toolbar: {},
      rendered: false,
    };
  },
  async mounted() {
    this.dequeueAdminBarStyles();
    this.importToolBar();

    await nextTick();
    this.updateFromDom();
  },
  beforeUnmount() {
    document.removeEventListener("uipress/app/page/load/finish", this.handlePagechange);
  },
  computed: {
    /**
     * Returns list of hidden toolbar items
     *
     * @since 3.2.12
     */
    getHidden() {
      let hidden = this.get_block_option(this.block, "block", "hiddenToolbarItems");
      return Array.isArray(hidden) ? hidden : [];
    },

    /**
     * Returns toolbar object
     *
     * @since 3.2.13
     */
    returnToolbar() {
      return this.toolbar;
    },

    /**
     * Returns dropdown position
     *
     * @since 3.2.12
     */
    returnDropdownPosition() {
      let position = this.get_block_option(this.block, "block", "dropdownPosition");
      position = this.isObject(position) ? position.value : false;
      position = position ? position : "bottom left";
      position = position.includes(" ") ? position : "bottom left";
      return position;
    },

    /**
     * Returns submenu items position
     *
     * @since 3.2.13
     */
    returnSubDropdownPosition() {
      let position = this.get_block_option(this.block, "block", "subDropdownPosition");
      position = this.isObject(position) ? position.value : false;
      position = position ? position : "right top";
      position = position.includes(" ") ? position : "right top";
      return position;
    },
  },
  methods: {
    /**
     * Imports the toolbar and mounts page change listener
     *
     * @since 3.2.13
     */
    importToolBar() {
      this.toolbar = JSON.parse(JSON.stringify(this.uipApp.data.toolbar));
      document.addEventListener("uipress/app/page/load/finish", this.handlePagechange);
    },

    /**
     * Handles page event
     *
     * @param {Object} evt - page change event
     * @since 3.2.13
     */
    async handlePagechange(evt) {
      this.updateToolBarFromFrame();
      // Wait a short period for QM to update it's self before fetching results
      setTimeout(() => {
        this.updateQM();
        this.updateFromDom();
      }, 300);
    },

    /**
     * Removes default toolbar styling
     *
     * @since 3.2.0
     */
    dequeueAdminBarStyles() {
      let styleblock = document.querySelector('link[href*="load-styles.php?"]');
      if (!styleblock) return (this.rendered = true);

      const newLink = styleblock.href.replace("admin-bar,", ",");
      const link = document.createElement("link");
      link.href = newLink;
      link.setAttribute("rel", "stylesheet");

      // Event listener function
      const onLoad = () => {
        styleblock.remove();
        link.removeEventListener("load", onLoad); // Remove the event listener
        this.rendered = true;
      };

      const head = document.head;
      if (head.firstChild) {
        head.insertBefore(link, head.firstChild);
      } else {
        head.appendChild(link);
      }

      // Add the event listener
      link.addEventListener("load", onLoad);
    },

    /**
     * Updates toolbar list from frame toolbar
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async updateFromDom() {
      // Determine the content frame.
      const frameElement = document.querySelector(".uip-page-content-frame");
      const contentFrame = frameElement ? frameElement.contentWindow.document : document;

      const toolbarItems = contentFrame.getElementById("wp-admin-bar-root-default");
      const secondaryToolbarItems = contentFrame.getElementById("wp-admin-bar-top-secondary");

      // If there are no toolbar items, exit early.
      if (!toolbarItems) return;

      const primaryItems = Array.from(toolbarItems.children);
      const secondaryItems = Array.from(secondaryToolbarItems.children);

      const allItems = [...primaryItems, ...secondaryItems];

      const adminURL = this.uipApp.data.options.adminURL;
      const homeURL = this.uipApp.data.options.domain;
      const adminPath = adminURL.replace(homeURL, "");

      allItems.forEach((item) => {
        let itemId = item.getAttribute("id");

        itemId = itemId.replace("wp-admin-bar-", "");

        // Continue if certain conditions aren't met.
        if (!this.toolbar) return;
        if (!itemId || this.toolbar[itemId] || ["site-name", "menu-toggle", "app-logo", "my-account"].includes(itemId)) return;

        const newItem = this.createToolbarItem(item, adminPath, adminURL);
        if (newItem) this.toolbar[itemId] = newItem;
      });
    },

    /**
     * Creates a new toolbar item
     *
     * @param {DomObject} item
     * @param {String} adminPath
     * @param {String} adminURL
     */
    createToolbarItem(item, adminPath, adminURL) {
      let itemId = item.getAttribute("id");
      itemId = itemId.replace("wp-admin-bar-", "");

      const link = item.querySelector("a.ab-item");
      if (!link) return false;
      let href = link.getAttribute("href") || "";

      if (href.startsWith(adminPath)) {
        href = href ? href.replace(adminPath, adminURL) : "";
      }

      const newItem = {
        id: itemId,
        group: "",
        meta: [],
        parent: "",
        submenu: {},
        title: link.innerHTML || "",
        href: href || "",
      };

      const subItems = Array.from(item.querySelectorAll(".ab-sub-wrapper .ab-submenu > *"));

      const processSubs = (subItem) => {
        let subItemId = subItem.getAttribute("id");
        subItemId = subItemId ? subItemId.replace("wp-admin-bar-", "") : "";
        if (subItemId) {
          const subItemObject = this.createToolbarItem(subItem, adminPath, adminURL);
          newItem.submenu[subItemId] = subItemObject;
        }
      };

      subItems.forEach(processSubs);

      return newItem;
    },

    /**
     * Update Query Monitor details in the toolbar based on the content frame.
     *
     * @since 3.2.13
     */
    async updateQM() {
      // Check if query monitor is active
      if (!this.toolbar["query-monitor"]) return;
      await nextTick();

      const contentFrameElement = document.querySelector(".uip-page-content-frame");
      if (!contentFrameElement) return;

      const qmElement = contentFrameElement.contentWindow.document.querySelector("#wp-admin-bar-query-monitor");
      if (!qmElement) return;

      this.updateQMToolbarTitle(qmElement);
      this.updateQMSubItems(qmElement);
    },

    /**
     * Update the title for the Query Monitor toolbar item based on the QM element status.
     *
     * @param {HTMLElement} qmElement - The QM element to check.
     * @since 3.2.13
     */
    updateQMToolbarTitle(qmElement) {
      const labelElement = qmElement.querySelector(".ab-item");
      const title = labelElement ? labelElement.innerHTML : this.toolbar["query-monitor"].title;
      this.toolbar["query-monitor"].title = title;
      this.toolbar["query-monitor"].frameLink = true;

      if (qmElement.classList.contains("qm-warning")) {
        this.appendToolbarStatusIndicator("red");
      }

      const alertClasses = ["qm-alert", "qm-notice", "qm-deprecated", "qm-strict", "qm-expensive"];
      if (alertClasses.some((cls) => qmElement.classList.contains(cls))) {
        this.appendToolbarStatusIndicator("orange");
      }
    },

    /**
     * Append a status indicator to the Query Monitor toolbar title.
     *
     * @param {string} color - Color of the indicator (e.g., 'red' or 'orange').
     * @since 3.2.13
     */
    appendToolbarStatusIndicator(color) {
      this.toolbar["query-monitor"].title += `<span class="uip-display-inline-block uip-border-circle uip-w-8 uip-ratio-1-1 uip-background-${color} uip-margin-left-xxs"></span>`;
    },

    /**
     * Update subitems for the Query Monitor toolbar item based on the QM element.
     *
     * @param {HTMLElement} qmElement - The QM element containing subitems.
     * @since 3.2.13
     */
    updateQMSubItems(qmElement) {
      const subItems = qmElement.querySelectorAll("#wp-admin-bar-query-monitor-default > li");
      const newSubItems = {};

      subItems.forEach((subItem) => {
        const originalId = subItem.getAttribute("id");
        const itemId = originalId.replace("wp-admin-bar-query-monitor-", "");
        const link = subItem.querySelector("a");

        newSubItems[itemId] = {
          group: "",
          href: link.getAttribute("href"),
          id: originalId,
          meta: [],
          parent: "query-monitor",
          submenu: {},
          title: link.textContent,
          frameLink: true,
        };
      });

      this.toolbar["query-monitor"].submenu = newSubItems;
    },

    /**
     * Updates the toolbar from the content inside an iframe.
     *
     * @since 3.2.13
     */
    updateToolBarFromFrame() {
      const frame = document.querySelector(".uip-page-content-frame");

      // Ensure the frame exists and it has the required toolbar data.
      if (frame) {
        const toolbarScript = frame.contentWindow.document.querySelector("#uip-admin-toolbar");
        const toolbar = toolbarScript ? this.uipParseJson(toolbarScript.getAttribute("data-toolbar")) : false;
        if (!toolbar) return;

        // If the toolbar is not an array, clone it to the current component.
        if (!Array.isArray(toolbar)) {
          this.toolbar = { ...toolbar };
        }
      }
    },

    /**
     * Determines if a given UID is hidden.
     *
     * @param {string} uid - The unique identifier to check.
     * @returns {boolean} - Returns `false` if hidden, otherwise `true`.
     * @since 3.2.13
     */
    ifHidden(uid) {
      return !this.getHidden.includes(uid);
    },

    /**
     * Retrieves a custom icon for a given ID.
     *
     * @param {string} id - The ID for which to retrieve the icon.
     * @returns {string|false} - Returns the custom icon if it exists, otherwise `false`.
     * @since 3.2.13
     */
    customIcon(id) {
      const icons = this.get_block_option(this.block, "block", "editToolbarItems");

      if (this.isObject(icons) && Object.hasOwn(icons, id) && icons[id].icon) {
        return icons[id].icon;
      }

      return false;
    },

    /**
     * Retrieves a custom title for a given ID.
     *
     * @param {string} id - The ID for which to retrieve the title.
     * @returns {string|false} - Returns the custom title if it exists, otherwise `false`.
     * @since 3.2.13
     */
    customTitle(id) {
      const titles = this.get_block_option(this.block, "block", "editToolbarItems");

      if (this.isObject(titles) && Object.hasOwn(titles, id) && titles[id].title) {
        return titles[id].title;
      }

      return false;
    },

    /**
     * Navigates to a specified page or triggers an event based on conditions.
     *
     * @param {Object} item - The item containing navigation details.
     * @param {Event} evt - The event that triggered the navigation.
     * @param {boolean} [forceReload=false] - If `true`, forces the page to reload.
     * @since 3.2.13
     */
    updatePage(item, evt, forceReload = false) {
      if (evt.ctrlKey || evt.shiftKey || evt.metaKey || evt.button === 1) {
        return;
      }

      evt.preventDefault();

      if (item.frameLink) {
        const contentFrame = document.querySelector(".uip-page-content-frame");

        if (contentFrame) {
          const originalLink = contentFrame.contentWindow.document.querySelector(`#${item.id} a`);
          if (originalLink) originalLink.click();
        }

        return;
      }

      this.updateAppPage(this.formatHREF(item.href), forceReload);
    },

    /**
     * Formats a given link to make it suitable for navigation.
     *
     * @param {string} link - The original link to be formatted.
     * @returns {string} - Returns the formatted link.
     * @since 3.2.13
     */
    formatHREF(link) {
      const { adminURL, domain: homeURL } = this.uipApp.data.options;
      const adminPath = adminURL.replace(homeURL, "");

      if (link && link.startsWith(adminPath)) {
        return link.replace(adminPath, adminURL);
      }

      return link;
    },

    /**
     * Checks if a given submenu exists and has items
     *
     * @param {mixed} submenu - the submenu to check
     * @since 3.2.13
     */
    itemHasSubmenu(submenu) {
      if (!this.isObject(submenu)) return false;
      if (Object.keys(submenu).length > 0) return true;
    },
  },
  template: `
            
              <div id="wpadminbar" style="display: block !important;" class="uip-text-normal" v-if="rendered">
              
                <component is="style">
                  .uip-admin-toolbar #wpadminbar {all:unset}
                  .uip-admin-toolbar #wpadminbar .ab-icon {font-size:18px; filter: contrast(0.6);}
                </component>
              
                <div class="uip-admin-toolbar uip-flex">
                
                  <template v-for="(item, key) in returnToolbar">
                  
                      <!--FIRST DROP -->
                      <dropdown :hover="true" :pos="returnDropdownPosition" :disableTeleport="true"
                      v-if="ifHidden(key)" :id="'wp-admin-bar-' + item.id" :class="item.meta.class">
                        <template v-slot:trigger>
                        
                          <a :href="formatHREF(item.href)" @click="updatePage(item, $event)" class="uip-link-default uip-no-underline uip-toolbar-top-item uip-flex uip-gap-xs uip-flex-center">
                            <div class="uip-icon uip-toolbar-top-item-icon uip-text-l" v-if="customIcon(item.id)">{{customIcon(item.id)}}</div>
                            
                            <component v-if="customIcon(item.id)" is="style" scoped>
                              #{{'wp-admin-bar-' + item.id}} .ab-icon{display:none}
                            </component>
                            
                            <div class="uip-line-height-1 uip-flex uip-gap-xxs" v-if="customTitle(item.id)">{{customTitle(item.id)}}</div>
                            <div class="uip-line-height-1 uip-flex uip-gap-xxs uip-flex-center" v-if="!customTitle(item.id)" v-html="item.title"></div>
                          </a>
                        </template>
                        
                        <template v-slot:content v-if="itemHasSubmenu(item.submenu)">
                        
                          
                          
                          
                            <!-- NETWORK ADMIN TOOLBAR -->
                            <div v-if="item.id == 'my-sites'" class="uip-toolbar-submenu uip-min-w-200 uip-padding-xs uip-max-h-500" style="overflow:auto">
                              <template  v-for="subsection in item.submenu">
                                <div class="uip-padding-xxs uip-flex uip-flex-column uip-row-gap-xxs uip-min-w-130">
                                  <template v-for="sub in subsection.submenu">
                                  
                                    <!--SECOND DROP -->
                                    <dropdown :hover="true" :pos="returnSubDropdownPosition" :disableTeleport="true">
                                        <template v-slot:trigger>
                                          <a :href="formatHREF(sub.href)" @click="updatePage(sub, $event, true)"  class="uip-link-default uip-no-underline uip-toolbar-sub-item uip-flex uip-flex-center uip-flex-between uip-gap-s uip-flex-grow uip-padding-xxs uip-border-rounder hover:uip-background-muted" >
                                            <span v-html="sub.title"></span>
                                            <span v-if="sub.submenu" class="uip-icon">chevron_right</span>
                                          </a>
                                        </template>
                                        <template v-slot:content v-if="sub.submenu">
                                          <div class="uip-toolbar-submenu uip-min-w-200 uip-padding-xs">
                                            <template v-for="subsub in sub.submenu">
                                              <a :href="formatHREF(subsub.href)" @click="updatePage(subsub, $event, true)"  class="uip-link-default uip-no-underline uip-toolbar-sub-item uip-flex uip-flex-center uip-flex-between uip-gap-s uip-flex-grow uip-padding-xxs uip-border-rounder hover:uip-background-muted" v-html="subsub.title"></a>
                                            </template>
                                          </div>
                                        </template>
                                      </dropdown>
                                      <!--END SECOND DROP -->
                                      
                                  </template>
                                </div>
                                <div v-if="subsection.id == 'my-sites-super-admin'" class="uip-border-bottom"></div>\
                              </template>
                            </div>
                            <!-- END NETWORK ADMIN TOOLBAR -->
                            
                            
                           <SubMenu v-else
                           :updatePage="updatePage"
                           :formatHREF="formatHREF"
                           :itemHasSubmenu="itemHasSubmenu"
                           :submenu="item.submenu"
                           :dropPos="returnSubDropdownPosition"/>
                            
                        
                        </template>
                      </dropdown>
                      <!--END FIRST DROP -->
                      
                  </template>
                </div>
              
              </div>
              `,
};
