<script>
import { __ } from "@wordpress/i18n";
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      currentIcon: this.returnIcon,
    };
  },
  created() {
    this.updateIcon();
  },
  computed: {
    /**
     * Returns text for button if exists
     *
     * @since 3.2.13
     */
    returnText() {
      let item = this.get_block_option(this.block, "block", "buttonText", true);
      if (!item) return "";

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return "";
    },

    /**
     * Returns icon for button
     *
     * @since 3.2.13
     */
    returnIcon() {
      let icon = this.get_block_option(this.block, "block", "iconSelect");
      if (!icon) return "";
      if (!this.isObject(icon)) return icon;
      if (icon.value) return icon.value;
      return "";
    },

    /**
     * Returns icon for collapsed state
     *
     * @since 3.2.13
     */
    returnCollapsedIcon() {
      let icon = this.get_block_option(this.block, "block", "collapsedIcon");
      if (!icon) return this.returnIcon;
      if (!this.isObject(icon)) return icon;
      if (icon.value) return icon.value;
      return this.returnIcon;
    },
  },
  methods: {
    /**
     * Sets fullscreen mode
     *
     * @since 3.2.13
     */
    async collapseMenu() {
      document.dispatchEvent(new CustomEvent("uipress/blocks/adminmenu/togglecollapse"));

      await this.$nextTick();

      this.updateIcon();
    },

    /**
     * Updates icon state
     *
     * @since 3.3.091
     */
    updateIcon() {
      const state = document.documentElement.getAttribute("uip-menu-collapsed");
      this.currentIcon = state == "true" ? this.returnCollapsedIcon : this.returnIcon;
    },
  },
};
</script>

<template>
  <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center" @click="collapseMenu()">
    <AppIcon :icon="currentIcon" class="uip-icon" v-if="currentIcon" />
    <span class="uip-flex-grow" v-if="returnText != ''">{{ returnText }}</span>
  </button>
</template>
