<script>
/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __ } = wp.i18n;
import { nextTick } from "vue";

import BlockToggleSection from "@/components/toggle-section/index.vue";
import AppInput from "@/components/text-input/index.vue";

export default {
  components: { BlockToggleSection, AppInput },
  props: {
    mode: String,
    insertArea: Array,
  },
  data() {
    return {
      loading: true,
      categories: [],
      search: "",
      strings: {
        proBlock: __("This block requires uipress pro. Upgrade to unlock.", "uipress-lite"),
        seachBlocks: __("Search blocks...", "uipress-lite"),
        upgrade: __("Upgrade", "uipress-lite"),
      },
    };
  },
  inject: ["uiTemplate"],
  computed: {
    /**
     * Returns list of blocks sorted alphabetically
     *
     * @since 3.2.13
     */
    sortedBlocks() {
      let blocks = this.removeOldBlocks();
      return blocks.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));
    },

    /**
     * Returns filters categories with blocks as children
     *
     * @since 3.2.13
     */
    returnCats() {
      const excludedModules = ["responsive-grid", "uip-admin-menu", "uip-user-meta-block"];

      return Object.entries(this.returnGroups).map(([catKey, catValue]) => {
        const sortedBlocks = this.uipApp.data.blocks
          .filter((block) => block.metadata.group === catKey && !excludedModules.includes(block.metadata.moduleName))
          .sort((a, b) => a.metadata.name.localeCompare(b.metadata.name));

        return {
          name: catValue.label,
          blocks: sortedBlocks,
        };
      });
    },

    /**
     * Returns categories / groups for blocks
     *
     * @since 3.2.13
     */
    returnGroups() {
      return this.uipApp.data.blockGroups;
    },
  },
  methods: {
    /**
     * Returns group nice name for given block
     *
     * @since 3.2.13
     */
    returnGroupLabel(name) {
      return this.uipApp.data.blockGroups[name].label;
    },
    /**
     * Removes old blocks from list
     *
     * @since 3.2.13
     */
    removeOldBlocks() {
      const excludedModules = ["responsive-grid", "uip-admin-menu", "uip-user-meta-block"];
      return this.uipApp.data.blocks.filter((block) => !excludedModules.includes(block.moduleName));
    },
    /**
     * Clones block upon successful drag
     *
     * @param {Object} block
     * @since 3.2.13
     */
    clone(block) {
      let item = JSON.parse(JSON.stringify(block.metadata));
      item.tooltip = {};
      item.settings = {};

      // Inject presets
      this.inject_block_presets(item);

      delete item.path;
      delete item.args;
      delete item.category;
      delete item.description;
      delete item.optionsEnabled;
      delete item.hover;

      return item;
    },

    /**
     * Injects blocks preset settings
     *
     * @param {Object} block
     * @since 3.2.13
     */
    inject_block_presets(block) {
      const blockModule = block.moduleName;
      const allBlocks = this.uipApp.data.blocks;

      // Find the originally registered block's enabled settings
      let masterBlock = allBlocks.find((block) => block.metadata.moduleName === blockModule);
      // No block settings so bail
      if (!masterBlock) return;

      masterBlock = masterBlock.metadata;

      const allBlockSettings = masterBlock.optionsEnabled;
      const blockOptionsIndex = allBlockSettings.findIndex((option) => option.name === "block");

      // Inject preset styles
      const ignoreParts = ["block", "advanced"];
      for (let part of allBlockSettings) {
        if (ignoreParts.includes(part.name)) continue;
        if (!"presets" in part) continue;

        const stylePresets = part.presets;
        if (!this.isObject(stylePresets)) continue;

        for (let stylePresetKey in stylePresets) {
          this.ensureNestedObject(block, "settings", part.name, "options", stylePresetKey, "value");
          block.settings[part.name].options[stylePresetKey].value = { ...stylePresets[stylePresetKey] };
        }
      }

      // No settings for block so bail
      if (blockOptionsIndex < 0) return;
      const presets = allBlockSettings[blockOptionsIndex].options;

      // Ensure the nested object and inject preset values
      this.ensureNestedObject(block, "settings", "block", "options");
      for (let preset of presets) {
        if (!preset) return;
        if (!("value" in preset)) continue;
        const key = preset.uniqueKey ? preset.uniqueKey : preset.option;
        block.settings.block.options[key] = { value: preset.value };
      }
    },

    /**
     * Checks whether a component exists
     *
     * @param {String} mod - component name
     * @since 3.2.13
     */
    componentExists(mod) {
      if (mod.premium && !this.uiTemplate.proActivated) return false;

      const name = mod.moduleName;
      if (this.$root._.appContext.components[name]) return true;
    },

    /**
     * Inserts block at a given position
     *
     * @param {Object} block
     * @returns {Promise}
     * @since 3.2.13
     */
    async insertAtPos(block) {
      //Check if we allowing click from modal list
      if (this.mode != "click") {
        return;
      }
      if (!Array.isArray(this.insertArea)) return;
      let item = this.clone(block);
      item.uid = this.createUID();
      this.insertArea.push(item);
      await nextTick();
      const addedBlock = this.insertArea[this.insertArea.length - 1];
      this.uipApp.blockControl.setActive(addedBlock, this.insertArea);
      this.$emit("item-added");
    },

    /**
     * Checks whether the block is in the search
     *
     * @param {Object} block - the block to check
     * @since 3.2.13
     */
    inSearch(block) {
      if (this.search == "") {
        return true;
      }
      let str = this.search.toLowerCase();

      if (block.name.toLowerCase().includes(str)) {
        return true;
      }
      if (block.description.toLowerCase().includes(str)) {
        return true;
      }
      return false;
    },
  },
};
</script>

<template>
  <div class="flex flex-col gap-8">
    <!--Block search-->

    <AppInput v-model="search" :placeholder="strings.seachBlocks" icon="search" />

    <!--Searching-->
    <VueDraggableNext
      v-if="search != ''"
      :list="sortedBlocks"
      class="uip-flex uip-flex-column uip-row-gap-xs uip-padding-left-xs"
      handle=".uip-block-drag"
      :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
      animation="300"
      :sort="false"
      :clone="clone"
      ghostClass="uip-drop-in-ghost"
      itemKey="name"
    >
      <template v-for="(element, index) in sortedBlocks" :key="element.name" :index="index">
        <div v-show="element.component && inSearch(element.metadata)" class="uip-block-item" :block-name="element.metadata.name">
          <div @click="insertAtPos(element)" class="uip-border-rounder uip-link-default hover:uip-background-muted uip-cursor-pointer uip-block-drag uip-no-text-select">
            <div class="uip-flex uip-gap-xxs uip-flex-center">
              <div class="uip-icon uip-text-l uip-padding-xxs uip-background-secondary uip-border-rounder uip-text-inverse uip-margin-right-xs">
                <AppIcon :icon="element.metadata.icon" />
              </div>
              <div class="uip-text-center uip-text-s uip-text-muted">{{ returnGroupLabel(element.metadata.group) }}</div>
              <AppIcon icon="chevron_right" class="uip-icon uip-text-muted" />
              <div class="uip-text-s">{{ element.metadata.name }}</div>
            </div>
          </div>
        </div>
      </template>
    </VueDraggableNext>

    <template v-if="search == ''" v-for="cat in returnCats">
      <BlockToggleSection :title="cat.name" :startOpen="true">
        <VueDraggableNext
          v-if="cat.blocks.length"
          :list="cat.blocks"
          class="flex flex-col gap-1 pl-3"
          handle=".uip-block-drag"
          :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
          animation="300"
          :sort="false"
          :clone="clone"
          ghostClass="uip-drop-in-ghost"
          itemKey="name"
        >
          <template v-for="(element, index) in cat.blocks" :key="element.name" :index="index">
            <!-- Block exists-->

            <div v-if="element.component" @click="insertAtPos(element)" class="flex flex-row gap-2 items-center p-1 cursor-pointer hover:bg-zinc-100 rounded-lg uip-block-drag">
              <div class="p-1 rounded-lg bg-indigo-600">
                <AppIcon :icon="element.metadata.icon" class="text-white" />
              </div>
              <div class="select-none">{{ element.metadata.name }}</div>
            </div>

            <div v-else @mouseenter="element.hover = true" @mouseleave="element.hover = false" class="flex flex-row gap-2 items-center p-1 cursor-pointer hover:bg-zinc-100 rounded-lg">
              <div class="p-1 rounded-lg bg-purple-600">
                <AppIcon icon="redeem" class="text-white" />
              </div>
              <div class="grow select-none">{{ element.metadata.name }}</div>

              <a
                v-show="element.hover"
                href="https://uipress.co?utm_source=uipressupgrade&utm_medium=referral"
                target="_BLANK"
                class="uip-link-muted uip-flex uip-gap-xxxs uip-no-underline uip-flex-center uip-padding-right-xxs uip-fade-in"
              >
                <span class="">{{ strings.upgrade }}</span>
                <AppIcon icon="chevron_right" />
              </a>
            </div>
          </template>
        </VueDraggableNext>
      </BlockToggleSection>
    </template>
  </div>
</template>
