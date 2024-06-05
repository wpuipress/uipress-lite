<script>
import { __ } from "@wordpress/i18n";

import MenuCollapse from "./MenuCollapse.vue";
import MenuSearch from "./MenuSearch.vue";
import TopLevelItem from "./TopLevelItem.vue";

export default {
  components: { TopLevelItem, MenuSearch, MenuCollapse },
  props: {
    maybeFollowLink: Function,
    item: Object,
    collapsed: Boolean,
    block: Object,
    menuItems: Array,
    returnCollapsed: Function,
    activeLink: String,
  },
  watch: {
    isCollapsed: {
      handler() {
        this.returnCollapsed(this.isCollapsed);
      },
    },
    activeLink() {
      this.handleLinkUpdate();
    },
  },
  data() {
    return {
      currentLevel: [], // This will store the current level of items being displayed.
      levels: [],
      currentItem: null,
      searching: false,
      isCollapsed: this.collapsed,
      strings: {
        goBackPrevious: __("Go back to previous menu", "uipress-lite"),
      },
    };
  },
  mounted() {
    this.initializeMenu();
  },
  computed: {
    /**
     * Returns name of parent menu item
     *
     * @since 3.2.13
     */
    parentItemName() {
      // If currentItem is not null and it has a parent, return the parent's name.
      if (!this.currentItem) return __("Go back", "uipress-lite");
      return this.decodeHtmlEntities(this.returnName(this.currentItem));
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
     * Returns the current depth of the menu
     *
     * @since 3.2.13
     */
    returnLevelsLength() {
      return this.levels.length;
    },

    /**
     * Returns whether to show the search or not
     *
     * @since 3.2.0
     */
    showSearchBox() {
      if (this.searching) return true;
      return this.hasMenuSearch && !this.levels.length;
    },
  },
  methods: {
    /**
     * Returns the item name
     *
     * @since 3.2.13
     */
    returnName(item) {
      return this.hasNestedPath(item, "custom", "name") ? item.custom.name : item.name;
    },
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
      // New tab so let the browser handle it
      if (this.hasNestedPath(item, "custom", "newTab")) return;

      if (item.submenu && item.submenu.length) {
        this.drillDown(item);
        evt.preventDefault();
        return;
      }
      this.maybeFollowLink(evt, item);
      evt.preventDefault();
    },

    /**
     * Handles active link change
     *
     * @param {Array} submenu - optional submenu array
     * @returns {Promise}
     * @since 3.2.13
     */
    async handleLinkUpdate(submenu) {
      // Set the menu level to work with
      const menu = submenu ? submenu : this.currentLevel;
      let foundActiveItem = false;

      // Loop over menu items and update active state
      for (let item of menu) {
        item.active = false;

        // If the item matches the URL then update
        if (item.url == this.activeLink) {
          item.active = true;
          foundActiveItem = true;
        }

        if (item.submenu && Array.isArray(item.submenu)) {
          foundActiveItem = await this.handleLinkUpdate(item.submenu);

          if (foundActiveItem) {
            this.currentLevel = item.submenu;
            this.levels.push(menu);
          }
        }
      }
      return foundActiveItem;
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
     * Returns items custom classes
     *
     * @since 3.3.09
     */
    returnItemClasses(item) {
      return this.hasNestedPath(item, "custom", "classes") ? item.custom.classes : "";
    },
  },
};
</script>

<template>
  <Transition name="translate" mode="out-in">
    <div :key="currentLevel" class="uip-admin-menu uip-text-normal" :class="{ 'uip-menu-collapsed': collapsed }">
      <MenuSearch
        v-if="showSearchBox"
        key="menusearch"
        @searching="
          (d) => {
            searching = d;
          }
        "
        :maybeFollowLink="maybeFollowLink"
        :workingMenu="menuItems"
      />

      <template v-if="!searching">
        <!-- Display Back button if there are levels to go back to -->
        <a
          v-if="levels.length"
          role="button"
          :aria-label="strings.goBackPrevious"
          class="uip-flex uip-gap-xxs uip-flex-center uip-flex-row uip-flex-center uip-text-bold uip-text-l uip-sub-menu-header uip-link-default uip-margin-bottom-s uip-gap-xxs"
          @click="goBack"
        >
          <AppIcon :icon="chevron_left" class="uip-icon" />
          <div class="uip-flex-grow" v-html="parentItemName"></div>
        </a>

        <!-- Loop through currentLevel and display each item -->
        <template v-for="item of currentLevel">
          <TopLevelItem v-if="item.type != 'sep'" :item="item" :maybeFollowLink="handleLinkClick" :collapsed="isCollapsed" :block="block" />

          <div v-else-if="!sepHasCustomName(item)" class="uip-margin-bottom-s uip-menu-separator" :class="returnItemClasses(item)"></div>

          <div v-else class="uip-margin-bottom-xs uip-margin-top-xs uip-flex uip-flex-row uip-gap-xxs uip-menu-separator" :class="returnItemClasses(item)">
            <AppIcon v-if="item.custom.icon && item.custom.icon != 'uipblank'" :icon="item.custom.icon" class="uip-icon" />
            <span>{{ item.custom.name }}</span>
          </div>
        </template>

        <MenuCollapse
          v-if="hasMenuCollapse"
          :collapsed="isCollapsed"
          :returnData="
            (d) => {
              isCollapsed = d;
            }
          "
        />
      </template>
    </div>
  </Transition>
</template>
