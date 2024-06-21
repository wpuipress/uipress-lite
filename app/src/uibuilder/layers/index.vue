<script>
const { __ } = wp.i18n;
import { nextTick } from "vue";

import Layer from "./Layer.vue";
import BlockInserter from "./block-inserter.vue";

export default {
  name: "layersRecursive",
  props: {
    content: Array,
    returnData: Function,
  },
  components: { BlockInserter, Layer },
  data() {
    return {
      rendered: false,
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
  mounted() {
    console.log(this.content);
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
  <div class="flex flex-col gap-2">
    <VueDraggableNext
      class="flex flex-col gap-1 w-full uip-template-layers"
      :group="{ name: 'uip-layer-blocks', pull: true, put: true }"
      :list="items"
      ghost-class="uip-block-ghost"
      animation="300"
      :sort="true"
    >
      <template v-for="(element, index) in items" :key="element.uid">
        <Layer :block="element" :items="items" />
      </template>
    </VueDraggableNext>

    <!--Block selector-->
    <BlockInserter :block="{ content: items }" />
  </div>

  <!--End block selector-->
</template>
