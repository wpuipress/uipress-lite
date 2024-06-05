<script>
import { __ } from "@wordpress/i18n";

export default {
  props: {
    collapsed: Boolean,
    returnData: Function,
  },
  data() {
    return {
      strings: {
        collapseMenu: __("Collapse menu", "uipress-lite"),
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
};
</script>

<template>
  <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center uip-link-muted uip-margin-top-s uip-menu-collapse" @click="toggleCollapse()">
    <div v-if="isCollapsed" class="uip-icon uip-text-">arrow_forward_ios</div>
    <div v-if="!isCollapsed" class="uip-icon uip-text-">arrow_back_ios</div>
    <div v-if="!isCollapsed">{{ strings.collapseMenu }}</div>
  </div>
</template>
