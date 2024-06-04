<script>
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "vue";

import Layer from "./Layer.vue";

export default {
  name: "layersRecursive",
  props: {
    content: Array,
    returnData: Function,
  },
  components: {
    BlockList: defineAsyncComponent(() => import("@/js/uip/uibuilder/block-list/index.vue")),
    Layer: Layer,
  },
  data() {
    return {
      items: this.content,
      queryLoopEnabled: __("Block is using query loop", "uipress-lite"),
      drag: false,
      strings: {
        blocks: __("Blocks", "uipress-lite"),
      },
    };
  },
  inject: ["uiTemplate"],
  watch: {
    content: {
      handler(newValue, oldValue) {
        this.items = newValue;
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Returns the drag class for the drop area
     *
     * @since 3.2.13
     */
    returnDragStyle() {
      if (this.uiTemplate.drag) {
        return "border-color:var(--uip-background-primary);";
      }
    },

    /**
     * Opens block settings
     *
     * @param {Object} item - block item
     */
    openSettings(item) {
      this.uipApp.blockControl.setActive(item, this.items);
    },

    /**
     * Builds and returns a string of CSS classes for a given element.
     *
     * The function calculates the classes based on the active state of the element
     * and whether the element is being hovered over in a block control context.
     *
     * @param {Object} element - The target element for which the classes are being constructed.
     * @property {string} element.uid - The unique identifier of the element.
     * @returns {string} - A string of space-separated CSS classes.
     * @since [YOUR_VERSION_HERE]
     */
    buildClasses(element) {
      let classes = "uip-border-rounder uip-padding-xxs";
      const isActive = this.isActive(element.uid);

      // Add classes based on active state
      if (isActive) {
        classes += " uip-background-secondary uip-text-bold uip-text-inverse";
      } else {
        classes += " uip-background-muted";
      }

      // Add hover class in a block control context if the element is not active
      if (this.uipApp.blockControl && !isActive) {
        if (this.uipApp.blockControl.returnHoveredBlockUID === element.uid) {
          classes += " uip-background-primary-wash";
        }
      }

      return classes;
    },
  },
};
</script>

<template>
  <uip-draggable
    class="uip-flex uip-flex-column uip-row-gap-xxs uip-w-100p uip-template-layers"
    :group="{ name: 'uip-layer-blocks', pull: true, put: true }"
    :list="items"
    ghost-class="uip-block-ghost"
    animation="300"
    :sort="true"
  >
    <template v-for="(element, index) in items" :key="element.uid">
      <Layer :block="element" :items="items" />
    </template>
  </uip-draggable>

  <!--Block selector-->
  <dropdown pos="right center" ref="blockSelector" class="uip-w-100p uip-flex uip-flex-center uip-flex-middle uip-flex-row">
    <template v-slot:trigger>
      <button class="uip-button-default uip-icon uip-w-100p uip-text-s uip-padding-xxs">add</button>
    </template>
    <template v-slot:content>
      <div class="uip-padding-s uip-max-w-300 uip-w-300 uip-max-h-500 uip-flex uip-flex-column uip-gap-s" style="overflow: auto">
        <div class="uip-flex uip-flex-between uip-flex-center">
          <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ strings.blocks }}</div>
          <div @click="$refs.blockSelector.close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <span class="uip-icon">close</span>
          </div>
        </div>

        <BlockList mode="click" :insertArea="items" @item-added="$refs.blockSelector.close()" />
      </div>
    </template>
  </dropdown>
  <!--End block selector-->
</template>
