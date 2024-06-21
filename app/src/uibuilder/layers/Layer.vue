<script>
const { __ } = wp.i18n;
import { nextTick } from "vue";

import BlockInserter from "./block-inserter.vue";

export default {
  name: "Layer",
  components: { BlockInserter },
  props: {
    block: { type: Object, default: {} },
    returnData: { type: Function },
    items: { type: Array, default: [] },
  },
  data() {
    return {
      open: false,
      queryLoopEnabled: __("Block is using query loop", "uipress-lite"),
      strings: {
        blocks: __("Blocks", "uipress-lite"),
      },
    };
  },
  watch: {
    "$route.query.block": {
      handler(newValue, oldValue) {
        this.maybeOpenLayer();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns if the block is currently selected
     *
     * @returns {boolean}  - whether it's active or not
     * @since 3.2.13
     */
    isActive() {
      if ("block" in this.$route.query && this.$route.query.block == this.block.uid) return true;
    },

    /**
     * Builds and returns a string of CSS classes for a given element.
     *
     * The function calculates the classes based on the active state of the element
     * and whether the element is being hovered over in a block control context.
     *
     * @since 3.2.13
     */
    buildClasses() {
      let classes = "rounded-lg p-2";
      const isActive = this.isActive;

      // Add classes based on active state
      if (isActive) {
        classes += " bg-indigo-600 text-white font-semibold";
      } else {
        classes += " hover:text-zinc-800 mr-2";
      }

      // Add hover class in a block control context if the element is not active
      if (this.uipApp.blockControl && !isActive) {
        if (this.uipApp.blockControl.returnHoveredBlockUID === this.block.uid) {
          classes += " bg-indigo-100 text-zinc-900";
        }
      }

      return classes;
    },
  },
  methods: {
    /**
     * Checks if the current block the current layer or included in the children
     *
     * @since 3.2.0
     */
    maybeOpenLayer() {
      const asString = JSON.stringify(this.block);
      const currentBlock = this.$route.query.block;
      this.open = asString.includes(currentBlock) ? true : this.open;
    },
    /**
     * Opens block settings
     *
     * @since 3.2.13
     */
    openSettings() {
      this.uipApp.blockControl.setActive(this.block, this.items);
    },
  },
};
</script>

<template>
  <div class="rounded-lg" :class="{ 'bg-indigo-100': isActive }">
    <div
      class="flex items-center gap-2"
      :class="buildClasses"
      @click="
        openSettings();
        open = true;
      "
      @mouseenter.prevent.stop="uipApp.blockControl.setHover({}, block)"
      @mouseleave.prevent.stop="uipApp.blockControl.removeHover({}, block)"
      @contextmenu.prevent.stop="uipApp.blockcontextmenu.show({ event: $event, list: items, index: index, block: block })"
    >
      <!--Chevs -->
      <div v-if="block.content" class="aspect-square cursor-pointer flex items-center" @click.prevent.stop="open = !open">
        <AppIcon :icon="open ? 'expand_more' : 'chevron_right'" />
      </div>

      <AppIcon :icon="block.icon" class="cursor-pointer" />

      <div class="cursor-pointer grow text-sm flex-nowrap items-center place-content-between flex">
        <span>{{ block.name }}</span>
        <AppIcon :title="queryLoopEnabled" v-if="hasNestedPath(block, ['query', 'enabled'])" icon="all_inclusive" class="cursor-pointer text-lg" />
      </div>
    </div>

    <div v-if="open && block.content" class="ml-3 p-2 flex flex-col gap-2">
      <!-- Loop children -->
      <VueDraggableNext
        :class="{ 'min-h-[30px]': !block.content.length }"
        class="flex flex-col gap-1 w-full uip-template-layers"
        :group="{ name: 'uip-layer-blocks', pull: true, put: true }"
        :list="block.content"
        ghost-class="uip-block-ghost"
        animation="300"
        :sort="true"
      >
        <template v-for="(element, index) in block.content" :key="element.uid">
          <Layer :block="element" :items="block.content" />
        </template>
      </VueDraggableNext>

      <!-- Push block inserter -->
      <BlockInserter v-if="isActive" :block="block" />
    </div>
  </div>
</template>
