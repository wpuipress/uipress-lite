<script>
import { __ } from "@wordpress/i18n";
import { defineAsyncComponent } from "vue";

import preview from "./preview.vue";
import core from "./core.vue";

export default {
  components: {
    PostTypeSelect: core,
    PostTypePreview: preview,
  },
  props: {
    selected: Array,
    value: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    returnData: Function,
  },
  data() {
    return {
      strings: {
        postTypeSelect: __("Post type select", "uipress-lite"),
      },
    };
  },
  computed: {
    returnValue() {
      if (this.value) return this.value;
      if (this.selected) return this.selected;
    },
  },
  methods: {
    updateDataSelected(data) {
      if (this.updateSelected) this.updateSelected(data);
      if (this.returnData) this.returnData(data);
    },
  },
};
</script>

<template>
  <dropdown pos="left center" class="uip-w-100p" ref="postselect" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
    <template #trigger>
      <PostTypePreview :selected="returnValue" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateDataSelected" />
    </template>

    <template #content>
      <div class="uip-padding-s uip-w-260 uip-flex uip-flex-column uip-row-gap-s">
        <div class="uip-flex uip-flex-between uip-flex-center">
          <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ strings.postTypeSelect }}</div>
          <div @click="$refs.postselect.close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <AppIcon icon="close" class="uip-icon" />
          </div>
        </div>

        <PostTypeSelect :selected="returnValue" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateDataSelected" />
      </div>
    </template>
  </dropdown>
</template>
