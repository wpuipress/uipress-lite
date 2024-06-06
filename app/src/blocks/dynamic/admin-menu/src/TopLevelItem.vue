<script>
export default {
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

    /**
     * Returns whether the menu item is hidden
     *
     * @returns {boolean} - whether to hide item
     * @since 3.2.13
     */
    itemHiden() {
      return this.hasNestedPath(this.item, "custom", "hidden");
    },

    /**
     * Returns the item name
     *
     * @since 3.2.13
     */
    returnName() {
      return this.hasNestedPath(this.item, "custom", "name") ? this.item.custom.name : this.item.name;
    },

    /**
     * Returns the item name
     *
     * @since 3.2.13
     */
    returnName() {
      return this.hasNestedPath(this.item, "custom", "name") ? this.item.custom.name : this.item.name;
    },

    /**
     * Returns the item icon
     *
     * @since 3.2.13
     */
    returnIcon() {
      return this.hasNestedPath(this.item, "custom", "icon") ? this.item.custom.icon : this.item.icon;
    },

    /**
     * Returns items custom classes
     *
     * @since 3.3.09
     */
    returnItemClasses() {
      return this.hasNestedPath(this.item, "custom", "classes") ? this.item.custom.classes : "";
    },

    /**
     * Returns items custom href
     *
     * @since 3.3.09
     */
    returnItemHref() {
      return this.hasNestedPath(this.item, "custom", "url") ? this.item.custom.url : this.item.url;
    },

    /**
     * Returns items custom href
     *
     * @since 3.3.09
     */
    returnItemTarget() {
      return this.hasNestedPath(this.item, "custom", "newTab") ? "_BLANK" : "_SELF";
    },
  },
  methods: {
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

      // If hover menu always return chevron right
      if (this.subMenuStyle == "hover") return "chevron_right";

      // If item is open / active then return the open icon
      if (item.open || item.active) return "expand_more";
      return "chevron_left";
    },

    /**
     * Checks whether the icon is a plain text icon or html
     *
     * @param {string} item
     * @since 3.4
     */
    isBasicIcon(str) {
      return /^[a-zA-Z0-9_]+$/.test(str);
    },
  },
};
</script>

<template>
  <a
    v-if="!itemHiden"
    :target="returnItemTarget"
    :href="returnItemHref"
    @click="maybeFollowLink($event, item, true)"
    class="uip-no-underline uip-link-default uip-top-level-item"
    :class="returnItemClasses"
    :active="item.active ? true : false"
  >
    <div v-if="!hideIcons && returnIcon && !isBasicIcon(returnTopIcon(returnIcon))" v-html="returnTopIcon(returnIcon)" class="uip-flex uip-flex-center uip-menu-icon uip-icon uip-icon-medium"></div>

    <AppIcon v-else-if="!hideIcons && returnIcon && isBasicIcon(returnTopIcon(returnIcon))" class="uip-flex-center uip-menu-icon uip-icon" :icon="returnTopIcon(returnIcon)" />

    <div v-if="!collapsed" class="uip-flex-grow uip-flex uip-gap-xs uip-flex-center">
      <div class="uip-line-height-1" v-html="returnName"></div>
      <div
        v-if="item.notifications && item.notifications > 0"
        class="uip-border-round uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-text-bold uip-flex uip-flex-center uip-flex-middle uip-menu-notification"
      >
        <span>{{ item.notifications }}</span>
      </div>
    </div>

    <AppIcon v-if="item.submenu && item.submenu.length > 0 && !collapsed" class="uip-icon uip-link-muted" :icon="returnSubIcon(item)" />
  </a>
</template>
