<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Notify from "@/components/notify/index.vue";
import AppMenu from "@/components/app-menu/index.vue";
import Tips from "@/uibuilder/tips/index.vue";

const route = useRoute();

const isUiBuilderRoute = computed(() => {
  return route.matched.some((record) => record.name === "uibuilder");
});
</script>

<template>
  <div class="uip-flex-column uip-flex uip-h-100p uip-w-100p" style="min-height: 100dvh">
    <Notify />
    <Tips />

    <div class="uip-flex uip-flex-row uip-background-default uip-flex-grow uip-h-100p" v-if="!isUiBuilderRoute">
      <div class="uip-w-240 uip-flex-no-grow uip-padding-s uip-border-right" style="flex-shrink: 0"><AppMenu /></div>

      <div class="uip-flex uip-flex-grow uip-padding-s">
        <RouterView v-slot="{ Component }">
          <template v-if="Component">
            <Suspense>
              <!-- main content -->
              <component :is="Component"></component>

              <!-- loading state -->
              <template #fallback> Loading... </template>
            </Suspense>
          </template>
        </RouterView>
      </div>
    </div>

    <RouterView v-else v-slot="{ Component }">
      <template v-if="Component">
        <Transition mode="out-in">
          <Suspense>
            <!-- main content -->
            <component :is="Component"></component>

            <!-- loading state -->
            <template #fallback> Loading... </template>
          </Suspense>
        </Transition>
      </template>
    </RouterView>
  </div>
</template>
