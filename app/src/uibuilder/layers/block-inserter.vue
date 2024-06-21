<script setup>
import { defineProps, ref } from "vue";
const { __ } = wp.i18n;
import BlockList from "@/uibuilder/block-list/index.vue";
import AppButton from "@/components/app-button/index.vue";

const props = defineProps(["block"]);
const blockSelector = ref(null);
</script>

<template>
  <!--Block selector-->
  <dropdown width="260" pos="right center" ref="blockSelector">
    <template v-slot:trigger>
      <AppButton type="default" class="bg-white w-full">
        <AppIcon icon="add" class="mx-auto" />
      </AppButton>
    </template>
    <template v-slot:content>
      <div class="p-4 max-w-[300px] w-[300px] max-h-[500px] flex flex-col gap-4 overflow-auto" style="overflow: auto">
        <div class="flex place-content-between items-center">
          <div class="text-zinc-900 font-semibold text-sm">{{ __("Blocks", "uipress-lite") }}</div>
          <AppButton type="transparent" @click="blockSelector.close()"> <AppIcon icon="close" /></AppButton>
        </div>

        <BlockList mode="click" :insertArea="block.content" @item-added="blockSelector.close()" />
      </div>
    </template>
  </dropdown>
  <!--End block selector-->
</template>
