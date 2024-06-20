<script setup>
import { defineModel, useAttrs, defineProps } from "vue";
import AppIcon from "@/components/icons/index.vue";
const attrs = useAttrs();
const props = defineProps(["options", "categories"]);
const model = defineModel();
</script>

<template>
  <div class="relative">
    <select v-bind="attrs" v-model="model" class="bg-white border border-zinc-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full px-2 py-1 appearance-none pr-7">
      <template v-for="item in options">
        <option :value="item.value">{{ item.label }}</option>
      </template>

      <template v-if="categories" v-for="cat in categories">
        <optgroup :label="cat.label">
          <template v-for="item in cat.items">
            <option :value="item.value">{{ item.label }}</option>
          </template>
        </optgroup>
      </template>
    </select>
    <div class="absolute right-0 top-0 bottom-0 px-2 py-1 z-[1] flex pointer-events-none">
      <AppIcon icon="unfold" class="text-lg my-auto" />
    </div>
  </div>
</template>
