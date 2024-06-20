<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { ShadowRoot } from "vue-shadow-dom";

import Notify from "@/components/notify/index.vue";
import AppMenu from "@/components/app-menu/index.vue";
import Tips from "@/uibuilder/tips/index.vue";

const route = useRoute();
const adoptedStyleSheets = ref(new CSSStyleSheet());

const isUiBuilderRoute = computed(() => {
  return route.matched.some((record) => record.name === "uibuilder");
});

const setStyles = () => {
  const appStyleNode = document.querySelector("#uip-app-css");
  const appStyles = appStyleNode.sheet;

  // Iterate over the rules in the existing stylesheet
  for (const rule of [...appStyles.cssRules].reverse()) {
    adoptedStyleSheets.value.insertRule(rule.cssText);
  }
};

setStyles();
</script>

<template>
  <ShadowRoot tag="section" :adopted-style-sheets="[adoptedStyleSheets]" id="uip-editor">
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
  </ShadowRoot>
</template>
