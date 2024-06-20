<script setup>
import { defineProps } from "vue";

const props = defineProps(["links"]);
</script>

<template>
  <div class="flex flex-col gap-2">
    <!-- Links -->
    <template v-for="link in links">
      <RouterLink
        v-if="link.type != 'divider' && !link.external"
        :to="link.url ? link.url : ''"
        @click="link.action ? link.action() : false"
        class="flex flex-row gap-4 py-1 px-2 rounded-lg hover:bg-zinc-100 items-center hover:text-zinc-900 transition-all"
      >
        <span class="grow">{{ link.name }}</span>
        <AppIcon :icon="link.icon" class="text-lg" />
      </RouterLink>

      <a
        v-else-if="link.type != 'divider' && link.external"
        :href="link.url"
        target="_BLANK"
        class="flex flex-row gap-4 py-1 px-2 rounded-lg hover:bg-zinc-100 items-center hover:text-zinc-900 transition-all"
        active-class="bg-zinc-100 text-zinc-900"
      >
        <span class="grow">{{ link.name }}</span>
        <AppIcon :icon="link.icon" class="text-lg" />
      </a>

      <div v-else class="border-t border-zinc-200 my-2"></div>
    </template>
  </div>
</template>
