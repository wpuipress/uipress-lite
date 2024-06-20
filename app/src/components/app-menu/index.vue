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
  <div class="flex flex-col gap-2">
    <!-- Logo -->
    <div class="p-2 rounded-lg bg-white shadow-md mb-4 self-start">
      <div class="uip-logo w-5 aspect-square"></div>
    </div>

    <!-- Links -->
    <template v-for="link in links">
      <RouterLink
        v-if="link.type != 'divider' && !link.external"
        :to="link.url"
        class="flex flex-row gap-4 py-1 px-4 rounded-lg hover:bg-zinc-100 items-center hover:text-zinc-900 transition-all"
        active-class="bg-zinc-100 text-zinc-900"
      >
        <AppIcon :icon="link.icon" class="text-lg" />
        <span>{{ link.name }}</span>
      </RouterLink>

      <a
        v-else-if="link.type != 'divider' && link.external"
        :href="link.url"
        target="_BLANK"
        class="flex flex-row gap-4 py-1 px-4 rounded-lg hover:bg-zinc-100 items-center hover:text-zinc-900 transition-all"
        active-class="bg-zinc-100 text-zinc-900"
      >
        <AppIcon :icon="link.icon" class="text-lg" />
        <span>{{ link.name }}</span>
      </a>

      <div v-else class="border-t border-zinc-200 my-2"></div>
    </template>
  </div>
</template>
