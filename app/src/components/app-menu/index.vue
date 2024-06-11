<script setup>
const { __ } = wp.i18n;

const links = [
  {
    name: __("Templates", "uipress-lite"),
    url: "/",
    icon: "dashboard",
  },
  {
    name: __("Site settings", "uipress-lite"),
    url: "/site-settings",
    icon: "tune",
  },
  {
    type: "divider",
  },
  {
    name: __("Import / Export", "uipress-lite"),
    url: "/import-export",
    icon: "file_download",
  },
  {
    name: __("Remote sync", "uipress-lite"),
    url: "/remote-sync",
    icon: "sync",
  },
  {
    name: __("PHP error log", "uipress-lite"),
    url: "/error-log",
    icon: "code",
  },
  {
    type: "divider",
  },
  {
    name: __("Documentation", "uipress-lite"),
    url: "https://docs.uipress.co/",
    icon: "bookmarks",
    external: true,
  },
];
</script>

<template>
  <div class="uip-flex uip-flex-column uip-gap-xs">
    <!-- Logo -->
    <div class="uip-padding-xs uip-border-rounder uip-background-default uip-shadow uip-margin-bottom-s uip-self-flex-start">
      <div class="uip-logo uip-w-16 uip-ratio-1-1"></div>
    </div>

    <!-- Links -->
    <template v-for="link in links">
      <RouterLink
        v-if="link.type != 'divider' && !link.external"
        :to="link.url"
        class="uip-flex uip-flex-row uip-flex-center uip-gap-s uip-padding-xxs uip-padding-left-s uip-padding-right-s uip-link-default uip-no-underline uip-border-rounder hover:uip-background-muted"
        active-class="uip-background-muted uip-text-emphasis"
      >
        <AppIcon :icon="link.icon" class="uip-text-l" />
        <span>{{ link.name }}</span>
      </RouterLink>

      <a
        v-else-if="link.type != 'divider' && link.external"
        :href="link.url"
        target="_BLANK"
        class="uip-flex uip-flex-row uip-flex-center uip-gap-s uip-padding-xxs uip-padding-left-s uip-padding-right-s uip-link-default uip-no-underline uip-border-rounder hover:uip-background-muted"
        active-class="uip-background-muted uip-text-emphasis"
      >
        <AppIcon :icon="link.icon" class="uip-text-l" />
        <span>{{ link.name }}</span>
      </a>

      <div v-else class="uip-border-top uip-margin-top-xxs uip-margin-bottom-xxs"></div>
    </template>
  </div>
</template>
