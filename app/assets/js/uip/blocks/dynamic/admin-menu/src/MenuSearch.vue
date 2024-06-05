<script>
import { __ } from "@wordpress/i18n";

export default {
  emits: ["searching"],
  props: {
    workingMenu: Array,
    maybeFollowLink: Function,
  },
  data() {
    return {
      strings: {
        search: __("Search menu", "uipress-lite"),
      },
      menuSearch: "",
      menuSearchIndex: 0,
    };
  },
  watch: {
    menuSearch: {
      handler() {
        this.menuSearchIndex = 0;
        if (this.menuSearch == "") return this.$emit("searching", false);
        this.$emit("searching", true);
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

      const maybeLowerCase = (name) => {
        if (!name || typeof name === "undefined") return "";
        return name.toLowerCase();
      };
      const itemMatchesTerm = (item) => item.type !== "sep" && maybeLowerCase(this.returnName(item)).includes(term);

      const results = this.workingMenu
        .filter(itemMatchesTerm)
        .concat(this.workingMenu.filter((item) => item.submenu).flatMap((item) => item.submenu.filter(itemMatchesTerm).map((sub) => ({ ...sub, parent: item.name }))));

      return results;
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
     * Returns items custom href
     *
     * @since 3.3.09
     */
    returnItemTarget(item) {
      return this.hasNestedPath(item, "custom", "newTab") ? "_BLANK" : "_SELF";
    },

    /**
     * Watches keydown event for arrows up / down when searching
     *
     * @param {Object} event - the keydown event
     * @since 3.2.13
     */
    watchForArrows(event) {
      switch (event.key) {
        case "Enter":
          const ele = document.querySelector(`#uip-menu-search-results [data-id="${this.menuSearchIndex}"]`);
          if (ele) ele.click();
          break;

        case "ArrowDown":
          this.menuSearchIndex = this.menuSearchIndex >= this.searchItems.length - 1 ? 0 : this.menuSearchIndex + 1;
          break;

        case "ArrowUp":
          this.menuSearchIndex = this.menuSearchIndex <= 0 ? this.searchItems.length - 1 : this.menuSearchIndex - 1;
          break;
      }
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-menu-search uip-border-round uip-margin-bottom-s uip-flex-center uip-menu-search">
    <span class="uip-icon uip-text-muted uip-margin-right-xs uip-icon">search</span>
    <input @keydown="watchForArrows" ref="menusearcher" class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.search" v-model="menuSearch" />
  </div>

  <div v-if="menuSearch" class="uip-flex uip-flex-column uip-row-gap-xxs" id="uip-menu-search-results">
    <template v-for="(item, index) in searchItems">
      <a
        :target="returnItemTarget(item)"
        class="uip-flex uip-flex- uip-gap-xxxs uip-link-default uip-no-underline uip-flex-center uip-text-s uip-padding-xxxs uip-border-rounder"
        @click="maybeFollowLink($event, item)"
        :class="menuSearchIndex == index ? 'uip-background-high-light' : ''"
        :href="item.url"
        :data-id="index"
      >
        <span class="uip-text-muted" v-if="item.parent">{{ item.parent }}</span>
        <span class="uip-icon" v-if="item.parent">chevron_right</span>
        <span v-html="returnName(item)"></span>
      </a>
    </template>
  </div>
</template>
