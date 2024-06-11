<script>
const { __ } = wp.i18n;
import { nextTick } from "vue";

const submenu = {
  name: "SubMenu",
  props: {
    submenu: Object,
    updatePage: Function,
    formatHREF: Function,
    itemHasSubmenu: Function,
    dropPos: String,
  },
  data() {
    return {};
  },
};
</script>

<template>
  <div class="uip-toolbar-submenu uip-min-w-200 uip-border-rounder uip-padding-xs uip-max-h-500" style="overflow: auto">
    <template v-for="sub in submenu">
      <dropdown width="200" :pos="dropPos" v-if="sub.title" :hover="true" :disableTeleport="true">
        <template v-slot:trigger>
          <a
            @click="updatePage(sub, $event)"
            :href="formatHREF(sub.href)"
            class="uip-link-default uip-no-underline uip-toolbar-sub-item uip-flex uip-flex-center uip-flex-between uip-gap-s uip-flex-grow uip-padding-xxs uip-border-rounder hover:uip-background-muted"
          >
            <span v-html="sub.title"></span>
            <AppIcon v-if="itemHasSubmenu(sub.submenu)" icon="chevron_right" class="uip-icon" />
          </a>
        </template>

        <template v-slot:content v-if="itemHasSubmenu(sub.submenu)">
          <SubMenu :updatePage="updatePage" :formatHREF="formatHREF" :itemHasSubmenu="itemHasSubmenu" :submenu="sub.submenu" />
        </template>
      </dropdown>
    </template>
  </div>
  <!--END SECOND DROP -->
</template>
