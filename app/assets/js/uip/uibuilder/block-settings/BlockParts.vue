<script>
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "vue";

/**
 * Handles block parts switch
 *
 * @since 3.2.13
 */
export default {
  emits: ["update"],
  components: {},

  props: {
    block: Object,
    activePart: String,
  },
  data() {
    return {
      part: null,
      strings: {
        blockPart: __("Block part", "uipress-lite"),
        blockParts: __("Block parts", "uipress-lite"),
        root: __("Root", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches changes to active part and emits update
     *
     * @since 3.2.13
     */
    part: {
      handler() {
        this.$emit("update", this.part);
      },
    },
    /**
     * Watches for active part and injects new value
     *
     * @since 3.2.13
     */
    activePart: {
      handler() {
        this.part = this.activePart;
      },
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns active part translatable label
     *
     * @since 3.2.13
     */
    returnActivePart() {
      if (this.part == "root") return this.strings.root;
      const parts = this.returnBlockParts;
      const index = parts.findIndex((block) => block.name == this.part);
      if (index < 0) return;
      return parts[index].label;
    },

    /**
     * Returns the number of block parts the current block has
     *
     * @since 3.2.13
     */
    returnBlockPartsLength() {
      return this.returnBlockParts.length;
    },

    /**
     * Returns block parts list
     *
     * @since 3.2.13
     */
    returnBlockParts() {
      const blockName = this.block.moduleName;
      const allBlocks = this.uipApp.data.blocks;
      const blockIndex = allBlocks.findIndex((block) => block.moduleName == blockName);
      const blockInfo = allBlocks[blockIndex];
      const blockSettings = [...blockInfo.optionsEnabled];

      const keysToRemove = ["advanced", "style", "block"];

      keysToRemove.forEach((key) => {
        const index = blockSettings.findIndex((block) => block.name == key);
        if (index >= 0) {
          blockSettings.splice(index, 1);
        }
      });

      return blockSettings;
    },
  },
  methods: {
    /**
     * Handles part select
     *
     * @param {String} selected - the new selected part
     * @since 3.2.13
     */
    selectPart(selected) {
      this.part = selected;
      this.$refs.blockPartSwitcher.close();
    },
  },
};
</script>

<template>
  <dropdown pos="left top" :snapX="['#uip-block-settings']" v-if="returnBlockPartsLength" ref="blockPartSwitcher" class="uip-position-sticky uip-top-16 uip-z-index-2">
    <template #trigger>
      <div class="uip-background-muted uip-border-rounder uip-padding-xs uip-flex uip-flex-between uip-flex-center uip-link-default">
        <div class="">
          <span class="uip-text-muted">{{ strings.blockPart }}:</span> {{ returnActivePart }}
        </div>
        <div class="uip-icon">expand_more</div>
      </div>
    </template>

    <template #content>
      <div class="uip-padding-s uip-flex uip-flex-column uip-text-weight-normal uip-w-240 uip-row-gap-xs">
        <div class="uip-flex uip-flex-between uip-flex-center">
          <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ strings.blockParts }}</div>

          <div @click="$refs.blockPartSwitcher.close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <span class="uip-icon">close</span>
          </div>
        </div>

        <div class="uip-flex uip-flex-column">
          <a
            @click="selectPart('root')"
            :class="'root' == part ? 'uip-background-muted uip-link-emphasis' : 'hover:uip-background-muted uip-link-default'"
            class="uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s uip-border-rounder"
          >
            <span>root</span>
          </a>

          <template v-for="blockPart in returnBlockParts">
            <a
              @click="selectPart(blockPart.name)"
              :class="blockPart.name == part ? 'uip-background-muted uip-link-emphasis' : 'hover:uip-background-muted uip-link-default'"
              class="uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s uip-border-rounder"
            >
              <div class="uip-flex uip-flex-column">
                <span class="">{{ blockPart.label }}</span>
                <span class="uip-text-muted uip-text-s">{{ blockPart.class }}</span>
              </div>

              <span class="uip-icon">{{ blockPart.icon }}</span>
            </a>
          </template>
        </div>
      </div>
    </template>
  </dropdown>
</template>
