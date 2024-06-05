<script>
import { __ } from "@wordpress/i18n";
import { defineAsyncComponent } from "vue";

import core from "./core.vue";
import preview from "./preview.vue";

export default {
  components: {
    UserRoleSelect: core,
    UserRoleSelectPreview: preview,
  },
  props: {
    selected: Array,
    placeHolder: String,
    searchPlaceHolder: String,
    single: Boolean,
    updateSelected: Function,
    type: String,
    roleOnly: Boolean,
  },
  data() {
    return {
      strings: {
        roleSelect: __("Role select", "uipress-lite"),
      },
    };
  },
};
</script>

<template>
  <dropdown pos="left center" class="uip-w-100p" ref="userDropdown" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
    <template v-slot:trigger>
      <UserRoleSelectPreview :selected="selected" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateSelected" :type="type" />
    </template>

    <template v-slot:content>
      <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
        <div class="uip-flex uip-flex-between uip-flex-center">
          <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ strings.roleSelect }}</div>
          <div @click.prevent.stop="$refs.userDropdown.close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <AppIcon icon="close" class="uip-icon" />
          </div>
        </div>

        <UserRoleSelect :roleOnly="roleOnly" :selected="selected" :placeHolder="placeHolder" :searchPlaceHolder="searchPlaceHolder" :single="single" :updateSelected="updateSelected" :type="type" />
      </div>
    </template>
  </dropdown>
</template>
