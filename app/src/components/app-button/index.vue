<script setup>
import { ref, computed, defineProps, useAttrs } from "vue";

const props = defineProps(["type", "loading", "buttontype"]);
const attrs = useAttrs();

const primary =
  "bg-slate-800 px-3 py-1 text-slate-200 hover:text-slate-50 hover:bg-slate-900 transition-all border border-slate-900 disabled:text-slate-600 outline outline-1 outline-offset-[-2px] outline-slate-100/10";
const defaultclass = "px-3 py-1 bg-transparent border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-800 shadow-sm";
const dangerclass = "px-3 py-1 bg-red-50 border border-red-200 hover:border-red-300 hover:bg-red-100 text-red-600 shadow-sm";
const warningclass = "px-3 py-1 bg-orange-50 border border-orange-200 hover:border-orange-300 hover:bg-orange-100 text-orange-500 shadow-sm";
const transparent = "p-1 border-transparent hover:border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-600";

const hasLoader = computed(() => {
  return typeof props.loading !== "undefined";
});

const isLoading = computed(() => {
  return typeof props.loading === "function" ? props.loading() : props.loading;
});

const returnButtonStyles = computed(() => {
  if (props.type === "transparent") return transparent;
  if (props.type === "primary") return primary;
  if (props.type === "danger") return dangerclass;
  if (props.type === "warning") return warningclass;
  return defaultclass;
});
</script>

<template>
  <button :type="buttontype" class="transition-all rounded-lg w-auto cursor-pointer relative group whitespace-nowrap" :class="returnButtonStyles" v-bind="attrs">
    <div class="transition-opacity group-disabled:opacity-60 flex flex-row gap-3 items-center" :class="isLoading ? 'opacity-0' : 'opacity-100'">
      <slot />
    </div>
    <div v-if="hasLoader" class="absolute left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] transition-opacity" :class="!isLoading ? 'opacity-0' : 'opacity-100'">
      <svg class="animate-spin h-[1.2rem] aspect-square" :class="type === 'primary' ? 'text-white' : 'text-slate-400'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  </button>
</template>
