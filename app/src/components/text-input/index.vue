<script setup>
import { defineModel, useAttrs, defineProps, computed } from "vue";
//import { notify } from "@/assets/js/functions/notify.js";
import AppIcon from "@/components/icons/index.vue";

const attrs = useAttrs();
const props = defineProps(["icon", "copy"]);
const model = defineModel();

/**
 * Returns input classes depending on icons and copy
 */
const returnInputClass = computed(() => {
  let classes = "";
  if (props.icon) classes += "pl-8";
  if (props.copy) classes += " pr-8";
  return classes;
});

/**
 * Copies text from model to the clipboard using async/await.
 */
const copyInput = async () => {
  try {
    // Copy the text inside the text field using async/await
    await navigator.clipboard.writeText(model.value);
    notify({ title: "Text copied to clipboard", type: "success" });
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
};
</script>

<template>
  <div class="relative">
    <input
      v-model="model"
      class="px-2 py-1 border border-slate-200 rounded-lg w-full transition-all outline outline-transparent outline-offset-[-2px] focus:outline-indigo-300 focus:shadow-xs text-sm"
      :class="returnInputClass"
      v-bind="attrs"
    />

    <!-- Icon-->
    <div v-if="icon" class="absolute top-0 left-0 h-full flex flex-col place-content-center px-2 py-1">
      <AppIcon :icon="icon" class="text-lg text-zinc-400" />
    </div>

    <!-- Copy-->
    <div v-if="copy" class="absolute top-0 right-0 h-full flex flex-col place-content-center p-1">
      <div class="p-1 rounded hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900 cursor-pointer" @click="copyInput">
        <AppIcon icon="duplicate" class="text-base" />
      </div>
    </div>
  </div>
</template>
