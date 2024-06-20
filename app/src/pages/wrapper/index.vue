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
  const tailwindStylesNode = document.querySelector("#uip-builder-styles-css");
  const appStyles = appStyleNode.sheet;
  const tailwindStyles = tailwindStylesNode.sheet;

  // Iterate over the rules in the existing stylesheet
  for (const rule of [...appStyles.cssRules].reverse()) {
    adoptedStyleSheets.value.insertRule(rule.cssText);
  }

  // Iterate over the rules in the existing stylesheet
  for (const rule of [...tailwindStyles.cssRules].reverse()) {
    adoptedStyleSheets.value.insertRule(rule.cssText);
  }
};

setStyles();
</script>

<template>
  <ShadowRoot tag="section" :adopted-style-sheets="[adoptedStyleSheets]" id="uip-shadow-editor">
    <div class="flex flex-col h-full w-full min-h-screen text-zinc-600" :class="isUiBuilderRoute ? 'fixed top-0 left-0 right-0 bottom-0 z-[1] w-screen' : ''">
      <Notify />
      <Tips />

      <Teleport v-if="isUiBuilderRoute" to="body">
        <component is="style"> #wpcontent{margin:0 !important;} #wpadminbar{display:none !important;} html.wp-toolbar{padding-top:0;} #adminmenumain{display:none} </component>
      </Teleport>

      <div class="flex flex-row bg-white grow h-full" v-if="!isUiBuilderRoute">
        <div class="w-[260px] shrink-0 p-6 border-r border-zinc-200" style="flex-shrink: 0"><AppMenu /></div>

        <div class="flex grow p-6">
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
