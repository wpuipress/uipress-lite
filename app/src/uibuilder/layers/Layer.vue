<script>
const { __ } = wp.i18n;
import { nextTick } from "vue";

import BlockList from "@/uibuilder/block-list/index.vue";

export default {
  name: "Layer",
  components: { BlockList },
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
      let classes = "uip-border-rounder uip-padding-xxs";
      const isActive = this.isActive;

      // Add classes based on active state
      if (isActive) {
        classes += " uip-text-emphasis uip-background-secondary uip-text-bold uip-text-inverse ";
      } else {
        classes += " uip-link-default uip-margin-right-xs";
      }

      // Add hover class in a block control context if the element is not active
      if (this.uipApp.blockControl && !isActive) {
        if (this.uipApp.blockControl.returnHoveredBlockUID === this.block.uid) {
          classes += " uip-background-primary-wash uip-text-emphasis";
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
  <div class="uip-border-rounder" :class="{ 'uip-background-primary-wash': isActive }">
    <div
      class="uip-flex ui-flex-middle uip-flex-center uip-gap-xxs"
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
      <div v-if="block.content" class="uip-ratio-1-1 uip-icon uip-line-height-1 uip-cursor-pointer uip-flex uip-flex-center" @click.prevent.stop="open = !open">
        <AppIcon :icon="open ? 'expand_more' : 'chevron_right'" />
      </div>

      <AppIcon :icon="block.icon" class="uip-cursor-pointer uip-icon uip-icon-small-emphasis" />

      <div class="uip-cursor-pointer uip-flex-grow uip-text-s uip-no-wrap uip-flex-center uip-flex-between uip-flex">
        <span>{{ block.name }}</span>
        <AppIcon :title="queryLoopEnabled" v-if="hasNestedPath(block, ['query', 'enabled'])" icon="all_inclusive" class="uip-cursor-pointer uip-icon uip-icon-small-emphasis uip-text-l" />
      </div>
    </div>

    <div v-if="open && block.content" class="uip-margin-left-xs uip-padding-xs uip-padding-right-remove uip-flex uip-flex-column uip-gap-xs">
      <VueDraggableNext
        :class="{ 'uip-min-h-30': !block.content.length }"
        class="uip-flex uip-flex-column uip-row-gap-xxs uip-w-100p uip-template-layers"
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

      <!--Block selector-->
      <dropdown width="260" pos="right center" ref="blockSelector" class="uip-w-100p uip-flex uip-flex-center uip-flex-middle uip-flex-row uip-padding-right-xs">
        <template v-slot:trigger>
          <button class="uip-button-default uip-icon uip-w-100p uip-text-s uip-padding-xxs"><AppIcon icon="add" style="margin-left: auto; margin-right: auto" /></button>
        </template>
        <template v-slot:content>
          <div class="uip-padding-s uip-max-w-300 uip-w-300 uip-max-h-500 uip-flex uip-flex-column uip-gap-s" style="overflow: auto">
            <div class="uip-flex uip-flex-between uip-flex-center">
              <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ strings.blocks }}</div>
              <div @click="$refs.blockSelector.close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                <AppIcon icon="close" />
              </div>
            </div>

            <BlockList mode="click" :insertArea="block.content" @item-added="$refs.blockSelector.close()" />
          </div>
        </template>
      </dropdown>
      <!--End block selector-->
    </div>
  </div>
</template>
