const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";

/**
 * Presets list
 *
 * @since 3.2.13
 */
const EditPreset = {
  emits: ["update", "go-back"],
  components: {
    Confirm: defineAsyncComponent(() => import("../v3.5/utility/confirm.min.js?ver=3.3.1")),
  },

  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
    presetID: String,
  },
  data() {
    return {
      presetName: "",
      strings: {
        presetName: __("Preset name", "uipress-lite"),
        update: __("Update", "uipress-lite"),
        delete: __("Delete", "uipress-lite"),
        explanation: __(
          "Create a new style preset from the current block style. Style presets can be used on any block and updating in one place will update across all your templates.",
          "uipress-lite"
        ),
      },
    };
  },
  mounted() {
    this.setName();
  },
  methods: {
    /**
     * Set's current preset name
     *
     * @since 3.2.13
     */
    setName() {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const presets = this.uipApp.data.options.block_preset_styles;

      if (!this.presetID) return false;
      if (!this.isObject(presets)) return;
      if (!(this.presetID in presets)) return;
      this.presetName = presets[this.presetID].name;
    },

    /**
     * Confirms deletion of preset
     *
     * @param {String} presetID - the preset id to delete
     * @since 3.2.13
     */
    async deletePreset() {
      const confirm = await this.$refs.confirm.show({
        title: __("Delete preset", "uipress-lite"),
        message: __("Are you sure you want to delete this custom preset?", "uipress-lite"),
        okButton: __("Delete preset", "uipress-lite"),
        disableTeleport: true,
      });

      if (confirm) {
        if (!this.uipApp.data.options.block_preset_styles) return;
        delete this.uipApp.data.options.block_preset_styles[this.presetID];
        this.$emit("go-back");
      }
    },

    /**
     * Updates preset name
     *
     * @since 3.2.13
     */
    updatePreset() {
      if (!this.uipApp.data.options.block_preset_styles) return;
      this.uipApp.data.options.block_preset_styles[this.presetID].name = this.presetName;
      this.$emit("go-back");
    },
  },
  template: `
  
  <div class="uip-flex uip-flex-column uip-padding-left-xs uip-gap-s">
  
    <input class="uip-input" type="text" v-model="presetName" :placeholder="strings.presetName">
    
    <div class="uip-flex uip-flex-between uip-gap-xs">
    
      <button @click="deletePreset()" class="uip-button-danger uip-flex-grow">
        {{ strings.delete }}
      </button>
      
      <button @click="updatePreset" class="uip-button-default uip-flex-grow" :disabled="!presetName">
        {{ strings.update }}
      </button>
      
    </div>
    
    <Confirm ref="confirm"/>
    
  </div>  
  


`,
};

/**
 * Presets list
 *
 * @since 3.2.13
 */
const NewPreset = {
  emits: ["update", "go-back"],
  components: {},

  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
  },
  data() {
    return {
      newName: "",
      strings: {
        createPreset: __("Create preset", "uipress-lite"),
        presetName: __("Preset name", "uipress-lite"),
        explanation: __(
          "Create a new style preset from the current block style. Style presets can be used on any block and updating in one place will update across all your templates.",
          "uipress-lite"
        ),
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    /**
     * Creates a new preset from the current block style
     *
     * @since 3.2.13
     */
    newPreset() {
      const maybePresets = this.uipApp.data.options.block_preset_styles;
      let presets = this.isObject(maybePresets) ? maybePresets : {};

      const part = this.activePart == "root" ? "style" : this.activePart;
      this.ensureNestedObject(this.block, "settings", part);
      const presetStyle = this.deepClone(this.block.settings[part]);

      const uid = this.createUID();
      presets[uid] = {
        preset: presetStyle,
        name: this.newName,
      };

      this.uipApp.data.options.block_preset_styles = { ...presets };
      this.newName = "";
      this.$emit("go-back");
    },
  },
  template: `
  
  <div class="uip-flex uip-flex-column uip-padding-left-xs uip-gap-s">
  
    <div class="uip-text-s">{{strings.explanation}}</div>
  
    <input class="uip-input" type="text" v-model="newName" :placeholder="strings.presetName">
    
    <button @click="newPreset" class="uip-button-default" :disabled="!newName">
      {{ strings.createPreset }}
    </button>
    
  </div>  
  


`,
};

/**
 * Presets list
 *
 * @since 3.2.13
 */
const PresetList = {
  emits: ["update", "request-screen"],
  components: {},

  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
  },
  data() {
    return {
      open: true,
      strings: {
        searchPresets: __("Search presets", "uipress-lite"),
        newPreset: __("New preset", "uipress-lite"),
        noPresets: __("No presets yet", "uipress-lite"),
        editPreset: __("Edit preset", "uipress-lite"),
      },
      search: "",
    };
  },
  computed: {
    /**
     * Returns all presets
     *
     * @since 3.2.13
     */
    returnPresets() {
      const maybePresets = this.uipApp.data.options.block_preset_styles;
      const search = this.search.toLowerCase();

      let presets = this.isObject(maybePresets) ? maybePresets : {};
      let searched = {};

      for (let key in presets) {
        const name = presets[key].name.toLowerCase();
        if (!name.includes(search)) continue;
        searched[key] = presets[key];
      }

      return searched;
    },

    /**
     * Returns whether the block has a preset applied
     *
     * @since 3.2.13
     */
    returnCurrentPreset() {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const preset = this.hasNestedPath(this.block, "settings", part, "preset");
      return preset;
    },
  },
  methods: {
    /**
     * Requests new preset screen
     *
     * @since 3.2.13
     */
    requestNewPreset() {
      const newPresetScreen = {
        component: "NewPreset",
        label: this.strings.newPreset,
      };
      this.$emit("request-screen", newPresetScreen);
    },

    /**
     * Set's the selected preset
     *
     * @param {String} presetID - the preset id to delete
     * @since 3.2.13
     */
    choosePreset(presetID) {
      const part = this.activePart == "root" ? "style" : this.activePart;
      this.ensureNestedObject(this.block, "settings", part, "preset");
      this.block.settings[part].preset = presetID;
    },

    /**
     * Requests edit preset screen
     *
     * @param {String} presetID - preset id to edit
     * @since 3.2.13
     */
    editPreset(presetID) {
      const editPresetScreen = {
        component: "EditPreset",
        presetID: presetID,
        label: this.strings.editPreset,
      };
      this.$emit("request-screen", editPresetScreen);
    },
  },
  template: `
  
  <div class="uip-flex uip-flex-column">
  
    <div class="uip-flex uip-flex-center uip-gap-xs uip-margin-bottom-s">
    
      <div class="uip-flex uip-gap-xs uip-flex-center uip-padding-xxs uip-padding-left-xs uip-background-muted uip-border-rounder uip-flex-grow">
        <span class="uip-icon">search</span>
        <input class="uip-blank-input uip-text-s" type="text" v-model="search" :placeholder="strings.searchPresets">
      </div>
      
      <a @click="requestNewPreset" class="uip-link-muted uip-background-muted uip-border-rounder uip-icon uip-padding-xxs">add</a>
    </div>
    
    <div class="uip-text-s" v-if="!Object.keys(returnPresets).length">{{strings.noPresets}}</div>
    
    <div class="uip-flex uip-flex-column uip-row-gap-xxs">
      <template v-for="(preset, key) in returnPresets"> 
      
        <a @click="choosePreset(key)"
        :class=" returnCurrentPreset == key ? 'uip-background-muted uip-link-emphasis' : 'hover:uip-background-muted uip-link-muted'"
        class="uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s uip-border-rounder">
        
          <span class="">{{ preset.name }}</span>
          
          <span @click.prevent.stop="editPreset(key)" class="uip-icon">edit</span>
        
        </a>
      
      </template>  
    </div>
    
  </div>  
  


`,
};

/**
 * Handles style presets switch
 *
 * @since 3.2.13
 */
const StylePresets = {
  emits: ["update"],

  components: {
    screenControl: defineAsyncComponent(() => import("../v3.5/utility/screen-control.min.js?ver=3.3.1")),
    PresetList: PresetList,
    NewPreset: NewPreset,
    EditPreset: EditPreset,
  },
  props: {
    block: Object,
    activePart: String,
  },
  data() {
    return {
      open: false,
      preset: true,
      strings: {
        presets: __("Preset", "uipress-lite"),
        usePreset: __("Use preset", "uipress-lite"),
        add: __("Add", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches changes to style presets and saves
     *
     * @since 3.2.13
     */
    "uipApp.data.options.block_preset_styles": {
      handler() {
        this.saveStylePresets();
      },
      deep: true,
    },
  },
  mounted() {
    // Start open if block has preset
    if (this.returnCurrentPresetName) this.open = true;
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

    /**
     * Returns the preset list screen
     *
     * @since 3.2.13
     */
    returnPresetScreen() {
      return {
        component: "PresetList",
        preset: this.preset,
        label: this.strings.presets,
      };
    },

    /**
     * Returns the current preset name or returns false
     *
     * @since 3.2.13
     */
    returnCurrentPresetName() {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const presetID = this.hasNestedPath(this.block, "settings", part, "preset");
      const presets = this.uipApp.data.options.block_preset_styles;

      if (!presetID) return false;
      if (!this.isObject(presets)) return;
      if (!(presetID in presets)) return;
      return presets[presetID].name;
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

    /**
     * Saves style presets
     *
     * @param {String} preset - the selected preset
     */
    async saveStylePresets() {
      const options = this.prepareJSON(this.uipApp.data.options.block_preset_styles);

      let formData = new FormData();
      formData.append("action", "uip_save_site_option");
      formData.append("security", uip_ajax.security);
      formData.append("option", options);
      formData.append("optionName", "block_preset_styles");

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
    },

    /**
     * Removes the current preset from the block
     *
     * @since 3.2.13
     */
    removePreset() {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const presetID = this.hasNestedPath(this.block, "settings", part, "preset");
      if (!presetID) return;
      delete this.block.settings[part].preset;
    },
  },
  template: `
  
      <div class="uip-flex uip-flex-column uip-row-gap-s">
      
        <!-- Title -->
        <div class="uip-flex uip-gap-s uip-flex-center uip-flex-between">
          
         
          <div class="uip-flex uip-gap-xs uip-flex-center uip-cursor-pointer uip-flex-between uip-flex-grow"
          @click="toggleVisibility()">
            
            
            <span class="uip-text-bold uip-text-emphasis">{{ strings.presets }}</span> 
            
            <div v-if="returnCurrentPresetName"  class="uip-flex-grow">
              <div class="uip-w-6 uip-ratio-1-1 uip-border-circle uip-background-secondary"></div>
            </div>
            
            <a class="uip-link-muted uip-icon">{{ returnVisibilityIcon }}</a>
            
            
          </div>
          
        
        </div>
        
        <div v-if="open" class="uip-padding-left-s uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.usePreset}}</span></div>
          
          <!-- Select presets -->
          <dropdown pos="left top" :snapX="['#uip-block-settings']" ref="presetsSwitcher">
          
            <template #trigger>
              <div class="uip-background-muted uip-border-rounder uip-padding-xxxs uip-padding-right-xxs uip-flex uip-flex-between uip-flex-center uip-link-default">
                
                <div v-if="!returnCurrentPresetName" 
                class="uip-flex-grow uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s">
                  {{strings.add}}...
                </div>
                
                <div v-else 
                class="uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s">
                  {{returnCurrentPresetName}}
                </div>
                
                <div v-if="returnCurrentPresetName" @click.prevent.stop="removePreset()" class="uip-icon">close</div>
                
              </div>
            </template>
            
            <template #content>
            
              <div class="uip-padding-s uip-w-240">
                <screenControl :startScreen="returnPresetScreen" :homeScreen="returnPresetScreen.component"
                :closer="$refs.presetsSwitcher.close" :showNavigation="true">
                  
                  <template #componenthandler="{ processScreen, currentScreen, goBack }">
                    <KeepAlive>
                      <component @request-screen="(d)=>{processScreen(d)}" @go-back="goBack()"
                      :block="block"
                      :preset="currentScreen.preset"
                      :presetID="currentScreen.presetID"
                      :activePart="activePart"
                      :is="currentScreen.component"/>
                    </KeepAlive>
                  </template>
                  
                </screenControl>
              </div>  
            
            </template>
          </dropdown>
          
        </div>
        
      </div>  
  
  
  `,
};

/**
 * Handles block parts switch
 *
 * @since 3.2.13
 */
const BlockParts = {
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
  template: `
  
    <dropdown pos="left top" :snapX="['#uip-block-settings']" v-if="returnBlockPartsLength" ref="blockPartSwitcher" class="uip-position-sticky uip-top-16 uip-z-index-2">
      
      <template #trigger>
        <div class="uip-background-muted uip-border-rounder uip-padding-xs uip-flex uip-flex-between uip-flex-center uip-link-default">
          
          <div class=""><span class="uip-text-muted">{{strings.blockPart}}:</span> {{returnActivePart}}</div>
          <div class="uip-icon">expand_more</div>
          
        </div>
      </template>
      
      <template #content>
        
        <div class="uip-padding-s uip-flex uip-flex-column uip-text-weight-normal uip-w-240 uip-row-gap-xs">
        
          <div class="uip-flex uip-flex-between uip-flex-center">
            
            <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ strings.blockParts }}</div>
            
            <div @click="$refs.blockPartSwitcher.close()" 
            class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
              <span class="uip-icon">close</span>
            </div>
          
          </div>  
          
          <div class="uip-flex uip-flex-column">
          
            <a @click="selectPart('root')"
            :class="'root' == part ? 'uip-background-muted uip-link-emphasis' : 'hover:uip-background-muted uip-link-default'"
            class="uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s uip-border-rounder">
            
              <span>root</span>
            
            </a>
          
            <template v-for="blockPart in returnBlockParts"> 
            
              <a @click="selectPart(blockPart.name)"
              :class="blockPart.name == part ? 'uip-background-muted uip-link-emphasis' : 'hover:uip-background-muted uip-link-default'"
              class="uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s uip-border-rounder">
              
                <div class="uip-flex uip-flex-column">
                  <span class="">{{ blockPart.label }}</span>
                  <span class="uip-text-muted uip-text-s">{{ blockPart.class }}</span>
                </div>
                
                <span class="uip-icon">{{blockPart.icon}}</span>
              
              </a>
            
            </template>
          </div>
        
        </div>
        
      </template>
    
    </dropdown>
  `,
};

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
  mounted() {
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
      
      <div v-if="open" class="uip-padding-left-s">
        <slot></slot>
      </div>
      
    </div>
  
  `,
};

/**
 * Builds the block styles list and handles style changes
 *
 * @since 3.2.13
 */

const BlockStyleHandler = {
  emits: ["update"],

  components: {
    flexLayout: defineAsyncComponent(() => import("../options/flex-layout.min.js?ver=3.3.1")),
    contextmenu: defineAsyncComponent(() => import("../v3.5/utility/contextmenu.min.js?ver=3.3.1")),
    Dimensions: defineAsyncComponent(() => import("../options/dimensions.min.js?ver=3.3.1")),
    Styles: defineAsyncComponent(() => import("../options/styles.min.js?ver=3.3.1")),
    Spacing: defineAsyncComponent(() => import("../options/spacing.min.js?ver=3.3.1")),
    TextFormat: defineAsyncComponent(() => import("../options/text-format.min.js?ver=3.3.1")),
    PositionDesigner: defineAsyncComponent(() => import("../options/position-designer.min.js?ver=3.3.1")),
    EffectsDesigner: defineAsyncComponent(() => import("../options/effects.min.js?ver=3.3.1")),
  },
  props: {
    styleSettings: Object,
    component: String,
    title: String,
    startOpen: Boolean,
    styleName: String,
  },
  data() {
    return {
      blockStyle: {},
      open: false,
      activeState: "default",
      colorTheme: "light",
      loading: false,
      strings: {
        toggleColour: __("Toggle dark / light mode", "uipress-lite"),
        resetSection: __("Reset section", "uipress-lite"),
      },
      pseudoSelectors: [
        { value: "default", label: __("Default", "uipress-lite") },
        { value: ":active", label: __(":active", "uipress-lite") },
        { value: ":focus", label: __(":focus", "uipress-lite") },
        { value: ":hover", label: __(":hover", "uipress-lite") },
        { value: ":visited", label: __(":visited", "uipress-lite") },
        { value: "::before", label: __("::before", "uipress-lite") },
        { value: "::after", label: __("::after", "uipress-lite") },
        { value: ":menu-collapsed", label: __("Menu collapsed", "uipress-lite") },
        { value: "tablet", label: __("Tablet", "uipress-lite") },
        { value: "mobile", label: __("Mobile", "uipress-lite") },
      ],
    };
  },
  watch: {
    /**
     * Watch for changes to incoming style settings
     *
     * @since 3.2.13
     */
    styleSettings: {
      handler() {
        this.injectPropValue();
      },
      deep: true,
      immediate: true,
    },
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

    /**
     * Returns the current style for block
     *
     * @since 3.2.13
     */
    returnCurrentBlockStyle() {
      let style;
      switch (this.activeState) {
        case "default":
          style = this.colorTheme == "light" ? this.blockStyle.value : this.blockStyle.darkValue;
          break;

        default:
          const state = this.activeState;
          const theme = this.colorTheme;
          // Create pseudo object
          this.ensureNestedObject(this.blockStyle, "pseudo", theme, state);
          style = this.blockStyle.pseudo[theme][state];
          break;
      }

      if (!style) style = {};

      return style;
    },

    /**
     * Returns the current active setting state
     *
     * @since 3.2.13
     */
    returnActiveState() {
      const index = this.pseudoSelectors.findIndex((item) => item.value == this.activeState);
      return this.pseudoSelectors[index].label;
    },

    /**
     * Returns the current theme
     *
     * @since 3.2.13
     */
    returnThemeIcon() {
      if (this.colorTheme == "light") return "light_mode";
      return "dark_mode";
    },
  },
  mounted() {
    if (this.startOpen) this.open = true;
  },
  methods: {
    /**
     * Injects prop value if exists
     *
     * @since 3.2.13
     */
    injectPropValue() {
      // Reset block style if value doesn't exist
      if (!this.isObject(this.styleSettings)) return (this.blockStyle = {});
      // Update block style
      this.blockStyle = this.styleSettings;
    },

    /**
     * Toggles section visibility
     *
     * @since 3.2.13
     */
    toggleVisibility() {
      this.open = !this.open;
    },

    /**
     * Handles style updates
     *
     * @since 3.2.13
     */
    handleStyleUpdate(newStyle) {
      if (!this.blockStyle.settingName) this.blockStyle.settingName = this.styleName;

      switch (this.activeState) {
        case "default":
          const key = this.colorTheme == "light" ? "value" : "darkValue";
          this.blockStyle[key] = newStyle;

          this.break;

        default:
          const state = this.activeState;
          const theme = this.colorTheme;
          // Create pseudo object
          this.ensureNestedObject(this.blockStyle, "pseudo", theme, state);
          this.blockStyle.pseudo[theme][state] = newStyle;
          break;
      }
    },

    /**
     * Returns whether an item has styles in pseudo
     *
     * @param {String} pseudo - name of pseudo
     * @since 3.2.13
     */
    itemHasPseudo(pseudo) {
      const theme = this.colorTheme;
      let exists = this.hasNestedPath(this.blockStyle, "pseudo", theme, pseudo);

      // Doesn't exist or is empty
      if (!exists) return false;
      if (Object.keys(exists).length === 0) return false;

      // Exists
      return true;
    },

    /**
     * Toggles colour mode
     *
     * @since 3.2.13
     */
    toggleColorMode() {
      const state = this.colorTheme == "light" ? "dark" : "light";
      this.colorTheme = state;
    },

    /**
     * Clears block pseudo settings
     *
     * @param {String} pseudo - pseudo name
     * @since 3.2.13
     */
    clearPseudo(pseudo) {
      let existsLight = this.hasNestedPath(this.blockStyle, "pseudo", "light", pseudo);
      if (existsLight) delete this.blockStyle.pseudo.light[pseudo];

      let existsDark = this.hasNestedPath(this.blockStyle, "pseudo", "dark", pseudo);
      if (existsDark) delete this.blockStyle.pseudo.dark[pseudo];
    },

    /**
     * Resets whole style section and removes all pseudos
     *
     * @since 3.2.13
     */
    resetStyleSection() {
      delete this.blockStyle.value;
      delete this.blockStyle.darkValue;
      delete this.blockStyle.pseudo;
      this.$refs.styleoptions.close();
    },
  },
  template: `
  
    <div class="uip-flex uip-flex-column uip-row-gap-s">
    
      <!-- Title -->
      <div class="uip-flex uip-gap-s uip-flex-center uip-flex-between" @contextmenu.prevent.stop="$refs.styleoptions.show($event)">
        
       
        <div class="uip-flex uip-gap-xxs uip-flex-center uip-cursor-pointer uip-flex-between"
        :class="{'uip-flex-grow' : !open}"
        @click="toggleVisibility()">
          
          
          <span class="uip-text-bold uip-text-emphasis">{{ title }}</span> 
          
          <a class="uip-link-muted uip-icon">{{ returnVisibilityIcon }}</a>
          
          
        </div>
        
        
        <div @click.prevent.stop="$refs.blockstates.show($event)" 
        class="uip-flex uip-gap-xs uip-fade-in" v-if="open">
        
          <span @click.prevent.stop="toggleColorMode" :title="strings.toggleColour"
          class="uip-link-default hover:uip-background-muted uip-border-rounder uip-icon uip-padding-xxs uip-padding-top-xxxs uip-padding-bottom-xxxs">
            {{returnThemeIcon}}
          </span>
        
          <div @click.prevent.stop="$refs.blockstates.show($event)" 
          class="uip-text-xs uip-padding-xxxs uip-padding-left-xs uip-padding-right-xxs uip-border-rounder uip-background-muted uip-link-default uip-flex uip-gap-xxs uip-flex-center">
            <span>{{returnActiveState}}</span>
            <a class="uip-link-muted uip-icon">expand_more</a>
          </div>
        
        </div>
      
      </div>
      
      <div v-if="open" class="uip-padding-left-s">
        <component :is="component" :value="returnCurrentBlockStyle" @update="handleStyleUpdate"/>
      </div>
      
      
      <contextmenu ref="blockstates">
      
        <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
        
          <template v-for="item in pseudoSelectors">
          
            <a @click="activeState = item.value; $refs.blockstates.close()"
            :class="activeState == item.value ? 'uip-background-muted uip-text-emphasis' : 'hover:uip-background-muted'"
            class="uip-link-default uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s">
              
              
              <span>{{ item.label }}</span>
              
              
              <a v-if="itemHasPseudo(item.value)" 
              @click.prevent.stop="clearPseudo(item.value)" class="uip-link-muted uip-icon uip-link-muted">close</a>
            
            </a>
            
          </template>
        
        </div>
      
      </contextmenu>
      
      
      <contextmenu ref="styleoptions">
      
        <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
        
          <a @click="resetStyleSection"
          class="hover:uip-background-muted uip-link-danger uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s">
          
            <span>{{ strings.resetSection }}</span>
            
            <span class="uip-icon">restart_alt</span>
          
          </a>
        
        </div>
      
      </contextmenu>
    
    </div>
  
  `,
};

export default {
  inject: ["uiTemplate"],
  components: {
    QueryBuilder: defineAsyncComponent(() => import("../options/query-builder.min.js?ver=3.3.1")),
    Interactions: defineAsyncComponent(() => import("../options/interactions.min.js?ver=3.3.1")),
    responsiveControls: defineAsyncComponent(() => import("../options/responsive.min.js?ver=3.3.1")),
    Classes: defineAsyncComponent(() => import("../options/classes.min.js?ver=3.3.1")),
    Conditions: defineAsyncComponent(() => import("../options/conditions.min.js?ver=3.3.1")),
    BlockStyleHandler: BlockStyleHandler,
    BlockParts: BlockParts,
    StylePresets: StylePresets,
    ToggleSection: ToggleSection,
  },
  data() {
    return {
      block: {},
      uid: this.$route.params.uid,
      section: "settings",
      loading: true,
      activeTab: false,
      showSettings: false,
      activePart: "root",
      strings: {
        blockID: __("ID", "uipress-lite"),
        proOption: __("This is a pro option. Upgrade to unlock", "uipress-lite"),
        options: __("Options", "uipress-lite"),
        hiddenOnDevice: __("Hidden on device", "uipress-lite"),
        tooltip: __("Tooltip", "uipress-lite"),
        tooltipMessage: __("Message", "uipress-lite"),
        styles: __("Styles", "uipress-lite"),
        queryLoop: __("Query loop", "uipress-lite"),
        query: __("Query", "uipress-lite"),
        none: __("None", "uipress-lite"),
        name: __("Name", "uipress-lite"),
        link: __("Link", "uipress-lite"),
        general: __("General", "uipress-lite"),
        layout: __("Layout", "uipress-lite"),
        size: __("Size", "uipress-lite"),
        style: __("Style", "uipress-lite"),
        spacing: __("Spacing", "uipress-lite"),
        text: __("Text", "uipress-lite"),
        position: __("Position", "uipress-lite"),
        effects: __("Effects", "uipress-lite"),
        general: __("General", "uipress-lite"),
        code: __("Code", "uipress-lite"),
        classes: __("Classes", "uipress-lite"),
        conditions: __("Conditions", "uipress-lite"),
        content: __("Content", "uipress-lite"),
        interactions: __("Interactions", "uipress-lite"),
      },
      optionsSections: {
        settings: {
          value: "settings",
          label: __("Settings", "uipress-lite"),
        },

        style: {
          value: "style",
          label: __("Style", "uipress-lite"),
        },

        advanced: {
          value: "advanced",
          label: __("Advanced", "uipress-lite"),
        },
      },
    };
  },
  created() {
    this.uipApp.blockSettings = this;
  },
  computed: {
    /**
     * Shows interaction panel on open if interactions applied
     *
     * @since 3.3.095
     */
    maybeShowInteractionPanel() {
      if (this.block.interactions) return this.block.interactions.length;
      return false;
    },

    /**
     * Returns the current blocks component name
     *
     * @since 3.2.13
     */
    returnBlockRealName() {
      const modName = this.block.moduleName;
      const allBlocks = this.uipApp.data.blocks;
      const masterBlock = allBlocks.find((block) => block.moduleName === modName);
      if (!masterBlock) return this.block.name;
      return masterBlock.name;
    },
    /**
     * Returns block query settings
     *
     * @since 3.2.13
     */
    returnBlockQuerySettings() {
      if (!this.block.query) this.block.query = { settings: {} };
      return this.block.query.settings;
    },
    /**
     * Returns options for current block
     *
     * @since 3.2.13
     */
    returnBlockOptions() {
      const blockModule = this.block.moduleName;
      const allBlocks = this.uipApp.data.blocks;

      // Find the originally registered block's enabled settings
      const masterblockIndex = allBlocks.findIndex((block) => block.moduleName === blockModule);

      // No block settings so bail
      if (masterblockIndex < 0) return [];
      const masterBlock = allBlocks[masterblockIndex];

      const allBlockSettings = masterBlock.optionsEnabled;
      const blockOptionsIndex = allBlockSettings.findIndex((option) => option.name === "block");

      // No block specific settings so bail
      if (blockOptionsIndex < 0) return [];
      return allBlockSettings[blockOptionsIndex].options;
    },
  },
  methods: {
    /**
     * Opens block settings
     *
     * @param {Object} block - the current block
     * @since 3.2.13
     */
    async show(block, tab) {
      this.block = block;
      this.activePart = "root";

      await nextTick();
      this.showSettings = true;
      this.loading = false;

      // Set active tab
      if (tab) this.section = tab;
    },
    /**
     * Closes block settings
     *
     * @since 3.2.13
     */
    close() {
      this.showSettings = false;
      this.block = null;
    },

    /**
     * Checks whether a component exists
     *
     * @param {String} name - the name of the component
     */
    componentExists(name) {
      if (this.$root._.appContext.components[name]) {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Checks if the given option is full width option
     *
     * @param {Object} option - the option object
     * @since 3.2.13
     */
    optionFullWidth(option) {
      return this.hasNestedPath(option, "args", "fullWidth");
    },

    /**
     * Handles tab changes and pushes to query params
     *
     * @param {String} tab - new tab to switch to
     * @since 3.2.13
     */
    handleActiveTabChange(tab) {
      this.section = tab;
      const newparams = { query: { ...this.$route.query, section: this.section } };
      this.$router.push(newparams);
    },

    /**
     * Returns current style for block
     *
     * @param {String} styleName - the name of the current style
     * @param {Object} newValue - the new style value
     * @since 3.2.13
     */
    returnBlockStylePart(styleName) {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const presetID = this.hasNestedPath(this.block, "settings", part, "preset");
      const presets = this.uipApp.data.options.block_preset_styles;

      // Return preset style if set and exists
      if (presetID && this.isObject(presets)) {
        if (presetID in presets) {
          const preset = presets[presetID];
          this.ensureNestedObject(preset, "preset", "options", styleName);
          return preset.preset.options[styleName];
        }
      }

      this.ensureNestedObject(this.block, "settings", part, "options", styleName);
      return this.block.settings[part].options[styleName];
    },

    /**
     * Returns whether the setting is available to the current plugin
     *
     * @param {Object} option - the object to check
     * @returns {boolean}
     * @since 3.2.13
     */
    isAvailable(option) {
      if (!option.requiresUpgrade) return true;
      if (this.uiTemplate.proActivated) return true;
      return false;
    },

    /**
     * Returns the block setting value for specific option if it exists
     *
     * @param {Object} option - the requested option
     * @since 3.2.13
     */
    returnBlockSettingValue(option) {
      const blockOptions = this.hasNestedPath(this.block, "settings", "block", "options");
      if (!blockOptions) return;

      // Get the option key
      const key = option.uniqueKey ? option.uniqueKey : option.option;

      // Key doesn't exist
      if (!(key in blockOptions)) return;

      return blockOptions[key].value;
    },

    /**
     * Handles block option updates
     *
     * @param {Object} option - the requested option
     * @param {Mixed} data - the new option value
     * @since 3.2.13
     */
    handleBlockSettingUpdate(option, data) {
      // Get the option key
      const key = option.uniqueKey ? option.uniqueKey : option.option;

      this.ensureNestedObject(this.block, "settings", "block", "options", key);
      this.block.settings.block.options[key].value = data;
    },

    /**
     * Returns specific value for advanced settings
     *
     * @param {String} option - the name of the required option
     * @since 3.2.13
     */
    returnAdvancedValue(option) {
      const blockOptions = this.hasNestedPath(this.block, "settings", "advanced", "options");
      if (!blockOptions) return;

      // Key doesn't exist
      if (!(option in blockOptions)) return;

      return blockOptions[option].value;
    },

    /**
     * Handles block option updates
     *
     * @param {Object} option - the requested option
     * @param {Mixed} data - the new option value
     * @since 3.2.13
     */
    handleBlockAdavancedUpdate(option, data) {
      this.ensureNestedObject(this.block, "settings", "advanced", "options", option);
      this.block.settings.advanced.options[option].value = data;
    },

    /**
     * Returns the current value of the pseudo content
     *
     * @param {type} pseudo - type of pseudo (beforeContent | afterContent)
     * @since 3.2.13
     */
    returnBlockPseudo(pseudo) {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const value = this.hasNestedPath(this.block, "settings", part, pseudo);
      if (!value) return "";
      return value;
    },

    /**
     * Handles pseudo change and updates the requested content setting
     *
     * @param {type} pseudo - type of pseudo (::before | ::after)
     * @since 3.2.13
     */
    handleBlockPseudoChange(data, pseudo) {
      const part = this.activePart == "root" ? "style" : this.activePart;
      this.ensureNestedObject(this.block, "settings", part, pseudo);
      this.block.settings[part][pseudo] = data;
    },
  },
  template: `
    
    
    
    <div v-if="showSettings" id="uip-block-settings"
    class="uip-position-fixed uip-top-80 uip-right-16 uip-bottom-16 uip-background-default uip-w-320 uip-flex uip-flex-column uip-row-gap-s uip-fade-in uip-shadow" style="border-radius: calc(var(--uip-border-radius-large) + var(--uip-padding-xs)); z-index: 2;overflow:auto">
    
        
        <div class="uip-flex uip-flex-column uip-gap-s uip-padding-s">
          
          <!-- Block settings header -->
          <div class="uip-flex uip-flex-between uip-flex-center">
          
            <div class="uip-flex uip-flex-column">
              <div class="uip-text-bold uip-blank-input uip-text-l uip-text-emphasis">{{ returnBlockRealName }}</div>
            </div>
            
            <a class="uip-link-muted hover:uip-background-muted uip-border-rounder uip-icon uip-padding-xxs" @click="close()">close</a>
            
          </div>
          <!-- End block settings header -->
          
          
          <!-- Toggle active tab -->
          <toggle-switch :options="optionsSections" :activeValue="section" :returnValue="handleActiveTabChange" class="uip-margin-bottom-xxs"/>
          
          
          <!-- Settings Tab -->
          <div v-if="section == 'settings'" class="uip-flex uip-flex-column uip-gap-s">
          
            <!-- General settings -->
            <ToggleSection :title="strings.general" :startOpen="true">
              <div class="uip-grid-col-1-3">
              
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.name}}</span></div>
                  <input class="uip-input uip-input-small" type="text" v-model="block.name">
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.blockID}}</span></div>
                  <div class="uip-flex uip-flex-center uip-background-muted uip-border-rounder uip-padding-xxxs uip-padding-left-xs uip-padding-right-xxs uip-overflow-hidden">
                  
                    <div class="uip-blank-input uip-text-s uip-flex-grow uip-overflow-hidden uip-text-ellipsis uip-no-wrap">{{block.uid}}</div>
                    <span class="uip-icon uip-link-muted" @click="copyToClipboard(block.uid)">content_copy</span>
                    
                  </div>
                  
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-max-h-30"><span>{{strings.link}}</span></div>
                  <link-select :value="block.linkTo" :returnData="(d)=>{block.linkTo = d}"/>
                  
                  <!--Tooltip text -->
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.tooltip}}</span></div>
                  <input type="text" v-model="block.tooltip.message" class="uip-input uip-input-small">
                                      
              </div>
            </ToggleSection>
            <!-- End general settings -->
            
            <div class="uip-border-top"></div>
            
            <!-- Query loop  -->
            <ToggleSection :title="strings.queryLoop">
            
              <QueryBuilder v-if="uiTemplate.proActivated" :block="block" :value="returnBlockQuerySettings"/>
              
              <div class="uip-grid-col-1-3" v-else>
                <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{ strings.queryLoop }}</span></div>
                <div class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">{{strings.proOption}}</div>
              </div>
              
            </ToggleSection>
            <!-- End query -->
            
            <div class="uip-border-top"></div>
            
            <!-- Interactions  -->
            <ToggleSection :title="strings.interactions" :startOpen="maybeShowInteractionPanel">
            
              <Interactions v-if="uiTemplate.proActivated" :block="block"/>
              
              <div class="uip-grid-col-1-3" v-else>
                <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{ strings.queryLoop }}</span></div>
                <div class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">{{strings.proOption}}</div>
              </div>
              
            </ToggleSection>
            <!-- End query -->
            
            <div class="uip-border-top"></div>
            
            <!-- Responsive  -->
            <ToggleSection :title="strings.hiddenOnDevice">
            
                  <responsiveControls :value="block.responsive" :returnData="(e)=>{block.responsive = e}"/>
              
            </ToggleSection>
            <!-- End Responsive -->
            
            <div class="uip-border-top" v-if="returnBlockOptions.length"></div>
            
            <!-- Block options  -->
            <ToggleSection :title="strings.options" :startOpen="true" v-if="returnBlockOptions.length">
                  
                  <div class="uip-flex uip-flex-column uip-row-gap-xs">
                  
                    <template v-for="option in returnBlockOptions">
                      
                      <div :class="optionFullWidth(option) ? 'uip-flex uip-flex-column uip-row-gap-xxs' : 'uip-grid-col-1-3'">
                      
                        <div v-if="!optionFullWidth(option)" class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs uip-position-relative">
                          
                          <dropdown pos="left center" :openOnHover="true" 
                          :snapX="['#uip-block-settings']" :hover="true">
                            <template class="uip-flex-no-shrink" v-slot:trigger>
                              <span :class="option.help ? 'uip-text-underline' : ''">{{option.label}}</span>
                            </template>
                            <template v-if="option.help" v-slot:content>
                              <div class="uip-text-s uip-padding-xs uip-max-w-200">{{option.help}}</div>
                            </template>
                          </dropdown>
                          
                        </div>
                          
                        <div class="uip-flex uip-flex-center uip-w-100p">
                        
                          <component v-if="componentExists(option.componentName) && isAvailable(option)" 
                          :is="option.componentName"
                          v-bind="option"
                          :value="returnBlockSettingValue(option)"
                          :returnData="(data)=>handleBlockSettingUpdate(option, data)"/>
                          
                          <div v-else class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">
                             {{strings.proOption}}
                          </div>
                        </div>
                        
                      </div>
                      
                    </template>
                    
                  </div>
              
            </ToggleSection>
            <!-- End block options -->
            
          
          </div>
          <!-- End setting tab -->
          
          
          <!-- Advanced Tab -->
          <div v-if="section == 'advanced'" class="uip-flex uip-flex-column uip-gap-s">
          
            <!-- Classes  -->
            <ToggleSection :title="strings.classes" :startOpen="true">
              <div class="uip-grid-col-1-3">
              
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-padding-top-xxs uip-flex-start"><span>{{strings.classes}}</span></div>
                  <Classes :value="returnAdvancedValue('classes')" :returnData="(d)=>{handleBlockAdavancedUpdate('classes', d)}"/>
                                      
              </div>
            </ToggleSection>


            <!-- Conditions  -->
            <ToggleSection :title="strings.conditions" :startOpen="true">
              <div class="uip-grid-col-1-3">
              
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-padding-top-xxs uip-flex-start"><span>{{strings.conditions}}</span></div>
                  <Conditions :value="returnAdvancedValue('conditions')" :returnData="(d)=>{handleBlockAdavancedUpdate('conditions', d)}"/>
                                      
              </div>
            </ToggleSection>
                      
            <!-- Code  -->
            <ToggleSection :title="strings.code" :startOpen="true">
              <div class="uip-grid-col-1-3">
              
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>css</span></div>
                  <code-editor :args="{language:'css'}" :value="returnAdvancedValue('css')" :returnData="(d)=>{handleBlockAdavancedUpdate('css', d)}"/>
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>Javscript</span></div>
                  <code-editor :args="{language:'javascript'}" :value="returnAdvancedValue('js')" :returnData="(d)=>{handleBlockAdavancedUpdate('js', d)}"/>
                                      
              </div>
            </ToggleSection>
            
          
          </div>
          <!-- Advanced tab-->
          
          
          <!-- Styles tab -->
          <div v-if="section == 'style'" class="uip-flex uip-flex-column uip-gap-s">
          
            <BlockParts :block="block" :activePart="activePart" @update="(d)=>{activePart=d}"/>
            
            <!-- Presets -->
            <StylePresets :activePart="activePart" :block="block"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Layout -->
            <BlockStyleHandler 
            :startOpen="!!block.content"
            :styleSettings="returnBlockStylePart('flexLayout')" component="flexLayout" 
            styleName="flexLayout"
            :title="strings.layout"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Dimensions -->
            <BlockStyleHandler 
            :startOpen="true"
            styleName="dimensions"
            :styleSettings="returnBlockStylePart('dimensions')" component="Dimensions" 
            :title="strings.size"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Styles -->
            <BlockStyleHandler 
            :startOpen="true"
            styleName="styles"
            :styleSettings="returnBlockStylePart('styles')" component="Styles" 
            :title="strings.style"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Spacing -->
            <BlockStyleHandler 
            :startOpen="true"
            styleName="spacing"
            :styleSettings="returnBlockStylePart('spacing')" component="Spacing" 
            :title="strings.spacing"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Text -->
            <BlockStyleHandler 
            styleName="textFormat"
            :styleSettings="returnBlockStylePart('textFormat')" component="TextFormat" 
            :title="strings.text"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Before / after  -->
            <ToggleSection :title="strings.content">
              <div class="uip-grid-col-1-3">
              
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>::before</span></div>
                  <uip-input :value="returnBlockPseudo('beforeContent')" :returnData="(data) => { handleBlockPseudoChange(data,'beforeContent') }"/>
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>::after</span></div>
                  <uip-input :value="returnBlockPseudo('afterContent')" :returnData="(data) => handleBlockPseudoChange(data,'afterContent')"/>
                                      
              </div>
            </ToggleSection>
            
            <div class="uip-border-top"></div>
            
            <!-- Position -->
            <BlockStyleHandler 
            styleName="positionDesigner"
            :styleSettings="returnBlockStylePart('positionDesigner')" component="PositionDesigner" 
            :title="strings.position"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Effects -->
            <BlockStyleHandler 
            styleName="effectsDesigner"
            :styleSettings="returnBlockStylePart('effectsDesigner')" component="EffectsDesigner" 
            :title="strings.effects"/>
            
            <div class="uip-border-top"></div>
            
            
            
          </div>  
        
        
        </div>
        
        
    </div>
        
        `,
};
