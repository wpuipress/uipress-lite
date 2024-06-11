<script>
const { __ } = wp.i18n;
export default {
  name: "SubmenuHandler",
  props: {
    maybeFollowLink: Function,
    item: Object,
    collapsed: Boolean,
    block: Object,
    subMenuStyle: String,
  },
  data() {
    return {};
  },
  computed: {
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
  },
  methods: {
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
     * Returns whether the item has a submenu
     *
     * @param {object} item
     * @since 3.3.0
     */
    itemHasSubmenu(item) {
      if (!item.submenu) return false;
      if (!item.submenu.length) return false;
      return true;
    },

    /**
     * Returns submenu icon for subsub
     *
     * @param {object} item
     * @since 3.3.0
     */
    returnSubIcon(item) {
      if (this.subMenuStyle == "hover") return "chevron_right";
      return this.itemHasSubmenu(item) ? "expand_more" : "chevron_left";
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

    /**
     * Returns the item name
     *
     * @since 3.2.13
     */
    returnName(item) {
      return this.hasNestedPath(item, "custom", "name") ? item.custom.name : item.name;
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
     * Returns items href
     *
     * @since 3.3.09
     */
    returnItemHref(item) {
      return this.hasNestedPath(item, "custom", "url") ? item.custom.url : item.url;
    },

    /**
     * Returns items custom href
     *
     * @since 3.3.09
     */
    returnItemTarget(item) {
      return this.hasNestedPath(item, "custom", "newTab") ? "_BLANK" : "_SELF";
    },
  },
};
</script>

<template>
  <div class="uip-admin-submenu">
    <template v-for="sub in item.submenu">
      <template v-if="!itemHiden(sub)">
        <!--Hover menu-->
        <dropdown v-if="sub.type != 'sep' && subMenuStyle == 'hover'" :pos="returnDropdownPosition" class="uip-flex uip-flex-column uip-row-gap-xs" :hover="true" :disableTeleport="true">
          <template #trigger>
            <!-- Main link -->
            <a
              :target="returnItemTarget(sub)"
              :href="returnItemHref(sub)"
              @click="maybeFollowLink($event, sub)"
              :class="returnItemClasses(sub)"
              class="uip-no-underline uip-link-muted uip-sub-level-item uip-flex-grow uip-flex uip-gap-xs uip-flex-center"
              :active="sub.active ? true : false"
            >
              <span v-html="returnName(sub)"></span>

              <!-- Notifications count -->
              <div
                v-if="sub.notifications && sub.notifications > 0"
                class="uip-border-circle uip-w-14 uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-flex uip-flex-center uip-flex-middle uip-menu-notification"
              >
                <span>{{ sub.notifications }}</span>
              </div>

              <div v-if="itemHasSubmenu(sub)" class="uip-flex uip-flex-grow uip-flex-center uip-flex-center uip-flex-right">
                <AppIcon :icon="returnSubIcon(sub)" class="uip-icon" />
              </div>
            </a>
          </template>

          <template v-if="itemHasSubmenu(sub)" #content>
            <SubmenuHandler :item="sub" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block" />
          </template>
        </dropdown>

        <!-- Normal subitem -->
        <div v-else-if="sub.type != 'sep'" class="uip-flex-grow uip-flex-column uip-flex uip-row-gap-xs" :class="returnItemClasses(sub)">
          <!-- Main link -->
          <a
            :target="returnItemTarget(sub)"
            :href="returnItemHref(sub)"
            @click="maybeFollowLink($event, sub, itemHasSubmenu(sub))"
            :class="returnItemClasses(sub)"
            class="uip-no-underline uip-link-muted uip-sub-level-item uip-flex-grow uip-flex uip-gap-xs uip-flex-center"
            :active="sub.active ? true : false"
          >
            <span v-html="returnName(sub)"></span>

            <!-- Notifications count -->
            <div
              v-if="sub.notifications && sub.notifications > 0"
              class="uip-border-circle uip-w-14 uip-h-14 uip-ratio-1-1 uip-background-secondary uip-text-inverse uip-text-xxs uip-flex uip-flex-center uip-flex-middle uip-menu-notification"
            >
              <span>{{ sub.notifications }}</span>
            </div>

            <div v-if="itemHasSubmenu(sub)" class="uip-flex uip-flex-grow uip-flex-center uip-flex-center uip-flex-right">
              <AppIcon :icon="returnSubIcon(sub)" class="uip-icon" />
            </div>
          </a>

          <!--Sub menu-->
          <SubmenuHandler v-if="itemHasSubmenu(sub) && itemHasOpenSubMenu(sub)" :item="sub" :maybeFollowLink="maybeFollowLink" :collapsed="collapsed" :block="block" />
        </div>

        <!-- Normal seperator-->
        <div v-else-if="!sepHasCustomName(sub)" class="uip-margin-bottom-s uip-menu-separator" :class="returnItemClasses(sub)"></div>

        <!-- Named seperator-->
        <div v-else class="uip-margin-bottom-s uip-margin-top-s uip-flex uip-flex-row uip-gap-xxs uip-menu-separator" :class="returnItemClasses(sub)">
          <AppIcon v-if="sub.custom.icon && sub.custom.icon != 'uipblank'" :icon="sub.custom.icon" class="uip-icon" />
          <span>{{ sub.custom.name }}</span>
        </div>
      </template>
    </template>
  </div>
</template>
