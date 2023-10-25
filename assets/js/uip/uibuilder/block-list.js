/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";

/**
 * Toggle section
 *
 * @since 3.2.13
 */
const ToggleSection = {
  props: {
    title: String,
    startOpen: Boolean,
  },
  data() {
    return {
      open: false,
    };
  },
  created() {
    if (this.startOpen) this.open = true;
  },
  computed: {
    /**
     * Returns the icon depending on open status
     *
     * @since 3.2.13
     */
    returnVisibilityIcon() {
      if (this.open) return "expand_more";
      if (!this.open) return "chevron_left";
    },
  },
  methods: {
    /**
     * Toggles section visibility
     *
     * @since 3.2.13
     */
    toggleVisibility() {
      this.open = !this.open;
    },
  },
  template: `
  
    <div class="uip-flex uip-flex-column uip-row-gap-s">
    
      <!-- Title -->
      <div class="uip-flex uip-gap-s uip-flex-center uip-flex-between">
        
       
        <div class="uip-flex uip-gap-xxs uip-flex-center uip-cursor-pointer uip-flex-between uip-flex-grow"
        @click="toggleVisibility()">
          
          
          <span class="uip-text-bold uip-text-emphasis">{{ title }}</span> 
          
          <a class="uip-link-muted uip-icon">{{ returnVisibilityIcon }}</a>
          
          
        </div>
      
      </div>
      
      <slot v-if="open"></slot>
      
    </div>
  
  `,
};

export default {
  components: {
    ToggleSection: ToggleSection,
  },
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
      return blocks.sort((a, b) => a.name.localeCompare(b.name));
    },

    /**
     * Returns filters categories with blocks as children
     *
     * @since 3.2.13
     */
    returnCats() {
      const excludedModules = ["responsive-grid", "uip-admin-menu", "uip-user-meta-block"];

      return Object.entries(this.returnGroups).map(([catKey, catValue]) => {
        const sortedBlocks = this.uipApp.data.blocks.filter((block) => block.group === catKey && !excludedModules.includes(block.moduleName)).sort((a, b) => a.name.localeCompare(b.name));

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
      let item = JSON.parse(JSON.stringify(block));
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
      const masterblockIndex = allBlocks.findIndex((block) => block.moduleName === blockModule);
      // No block settings so bail
      if (masterblockIndex < 0) return;
      const masterBlock = allBlocks[masterblockIndex];

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
  template: `
    
    <div class="uip-flex uip-flex-column uip-row-gap-s">
    
        <div class="uip-flex uip-padding-xxs uip-search-block uip-border-rounder uip-padding-xxs uip-background-muted">
          <span class="uip-icon uip-text-muted uip-margin-right-xs uip-text-l uip-icon uip-icon-medium">search</span>
          <input class="uip-blank-input uip-flex-grow uip-text-s" type="search" :placeholder="strings.seachBlocks" autofocus="" v-model="search">
        </div>
        
        <!--Searching-->
        <uip-draggable v-if="search != ''"
          :list="sortedBlocks" 
          class="uip-flex uip-flex-column uip-row-gap-xs uip-padding-left-xs"
          handle=".uip-block-drag"
          :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
          animation="300"
          :sort="false"
          :clone="clone"
          ghostClass="uip-drop-in-ghost"
          itemKey="name">
            <template v-for="(element, index) in sortedBlocks" :key="element.name" :index="index">
          
                <div v-show="componentExists(element) && inSearch(element)" class="uip-block-item" :block-name="element.name">
                    <div @click="insertAtPos(element)" class="uip-border-rounder uip-link-default hover:uip-background-muted uip-cursor-pointer uip-block-drag uip-no-text-select">
                      <div class="uip-flex uip-gap-xxs uip-flex-center">
                        <div class="uip-icon uip-text-l uip-padding-xxs uip-background-muted uip-border-rounder uip-text-emphasis uip-margin-right-xs">
                          <span>{{element.icon}}</span>
                        </div> 
                        <div class="uip-text-center uip-text-s uip-text-muted">{{returnGroupLabel(element.group)}}</div>
                        <div class="uip-icon uip-text-muted">chevron_right</div>
                        <div class="uip-text-s">{{element.name}}</div>
                      </div>
                    </div>
                </div>
            
            </template>
        </uip-draggable>
              
        
        <template v-if="search == ''" v-for="cat in returnCats">
          
            <ToggleSection :title="cat.name" :startOpen="true">
              
                <uip-draggable 
                v-if="cat.blocks.length"
                :list="cat.blocks" 
                class="uip-flex uip-flex-column uip-row-gap-xs uip-padding-left-xs"
                handle=".uip-block-drag"
                :group="{ name: 'uip-blocks', pull: 'clone', put: false, revertClone: true }"
                animation="300"
                :sort="false"
                :clone="clone"
                ghostClass="uip-drop-in-ghost"
                itemKey="name">
                  <template v-for="(element, index) in cat.blocks" :key="element.name" :index="index">
                
                       <div v-if="componentExists(element)" @click="insertAtPos(element)" class="uip-border-rounder uip-link-default hover:uip-background-muted uip-cursor-pointer uip-block-drag uip-no-text-select">
                         <div class="uip-flex uip-gap-xxs uip-flex-center">
                           <div class="uip-icon uip-text-l uip-padding-xxs uip-background-muted uip-border-rounder uip-text-emphasis uip-margin-right-xs">
                             <span>{{element.icon}}</span>
                           </div> 
                           <div class="uip-text-s">{{element.name}}</div>
                         </div>
                       </div>
                       
                      <div v-else @mouseenter="element.hover=true" @mouseleave="element.hover = false"
                      class="uip-border-rounder uip-link-default hover:uip-background-muted uip-cursor-pointer uip-block-drag uip-no-text-select">
                        <div class="uip-flex uip-gap-xxs uip-flex-center">
                          <div class="uip-icon uip-icon-medium uip-text-l uip-padding-xxs uip-background-green-wash uip-border-rounder uip-margin-right-xs">
                            <span>redeem</span>
                          </div> 
                          <div class="uip-text-s uip-flex-grow">{{element.name}}</div>
                          
                          <a v-show="element.hover"
                          href="https://uipress.co?utm_source=uipressupgrade&utm_medium=referral" 
                          target="_BLANK" 
                          class="uip-link-muted uip-flex uip-gap-xxxs uip-no-underline uip-flex-center uip-padding-right-xxs uip-fade-in">
                            <span class="uip-text-s">{{strings.upgrade}}</span>
                            <span class="uip-icon">chevron_right</span>
                          </a>
                        </div>
                      </div>
                      
                  
                  </template>
                </uip-draggable>
            
            </ToggleSection>  
            
          
        </template>
      </div>`,
};
