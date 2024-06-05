<script>
import { defineAsyncComponent } from "vue";
import { __ } from "@wordpress/i18n";

import core from "./core.vue";
import preview from "./preview.vue";

export default {
  components: {
    PostTypeSelect: core,
    PostTypePreview: preview,
  },
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    availableOptions: Array,
  },
  data() {
    return {};
  },
};
</script>

<template>
  <dropdown pos="left center" class="uip-w-100p" ref="postselect" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
    <template #trigger>
      <PostTypePreview :selected="selected" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateSelected" />
    </template>

    <template #content>
      <div class="uip-padding-s uip-w-260 uip-flex uip-flex-column uip-row-gap-s">
        <div class="uip-flex uip-flex-between uip-flex-center">
          <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ placeHolder }}</div>
          <div @click="$refs.postselect.close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <AppIcon icon="close" class="uip-icon" />
          </div>
        </div>

        <PostTypeSelect :availableOptions="availableOptions" :selected="selected" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateSelected" />
      </div>
    </template>
  </dropdown>
</template>
