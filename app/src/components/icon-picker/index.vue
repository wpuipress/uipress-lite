<script>
import { __ } from "@wordpress/i18n";
import { defineAsyncComponent, nextTick } from "vue";

import virtualList from "@/components/virtual-list/index.vue";

export default {
  components: { virtualList },
  props: {
    value: String,
    returnData: Function,
  },
  data() {
    return {
      search: "",
      icon: this.value,
      icons: [],
      strings: {
        search: __("Search", "uipress-lite"),
        viewAllIcons: __("View all icons on the", "uipress-lite"),
        materialSite: __("Material site", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches changes to icons and returns to caller
     *
     * @since 3.2.13
     */
    icon: {
      handler() {
        this.returnData(this.icon);
      },
    },
  },
  mounted() {
    this.setIcons();
  },
  computed: {
    /**
     * Returns icons with search
     *
     * @since 3.2.13
     */
    returnIcons() {
      if (!this.search) return this.icons;
      const st = this.search.toLowerCase();
      return this.icons.filter((element) => element.toLowerCase().includes(st));
    },
  },
  methods: {
    /**
     * Imports icons from icon list
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async setIcons() {
      const icons = await import("@/data/icons.js");
      this.icons = icons.default;
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-row-gap-s">
    <input class="uip-input" type="text" v-model="search" :placeholder="strings.search" autofocus />

    <virtualList :allItems="returnIcons" containerClass="uip-grid-col-3 uip-grid-gap-xs" :startRowHeight="80" :perRow="3">
      <template #item="{ item }">
        <div
          :class="{ 'uip-background-primary uip-dark-mode uip-text-inverse': icon == item, 'uip-background-muted uip-link-default': icon != item }"
          class="uip-border-rounder uip-padding-xxs uip-flex uip-flex-center uip-flex-middle uip-ratio-1-1 uip-transition-all uip-flex uip-fade-in"
          @click="icon = item"
        >
          <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-center uip-flex-middle uip-max-w-100p">
            <AppIcon :icon="item" class="uip-icon uip-text-xl" />
            <span class="uip-text-muted uip-text-xs uip-max-w-100p uip-overflow-auto uip-no-wrap uip-text-ellipsis">{{ item }}</span>
          </div>
        </div>
      </template>
    </virtualList>

    <div class="uip-text-muted uip-text-s">
      {{ strings.viewAllIcons }} <a href="https://fonts.google.com/icons" target="_BLANK">{{ strings.materialSite }}</a>
    </div>
  </div>
</template>
