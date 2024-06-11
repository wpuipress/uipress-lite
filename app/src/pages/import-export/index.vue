<script setup>
/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __ } = wp.i18n;

// Comps
import GlobalExport from "@/uibuilder/global-export/index.vue";
import GlobalImport from "@/uibuilder/global-import/index.vue";
</script>

<template>
  <div class="uip-flex uip-flex-column uip-gap-m uip-padding-top-s">
    <div class="uip-text-l uip-text-emphasis">{{ __("Import and export uipress settings", "uipress-lite") }}</div>
    <div class="uip-border-bottom"></div>
    <GlobalExport />
    <div class="uip-border-bottom"></div>
    <GlobalImport />
    <div class="uip-border-bottom"></div>
  </div>
</template>
