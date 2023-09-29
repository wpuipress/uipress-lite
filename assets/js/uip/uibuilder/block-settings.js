const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';

/**
 * Presets list
 *
 * @since 3.2.13
 */
const EditPreset = {
  emits: ['update', 'go-back'],
  components: {
    Confirm: defineAsyncComponent(() => import('../v3.5/utility/confirm.min.js?ver=3.2.12')),
  },
  inject: ['uipData', 'uipress'],
  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
    presetID: String,
  },
  data() {
    return {
      presetName: '',
      strings: {
        presetName: __('Preset name', 'uipress-lite'),
        update: __('Update', 'uipress-lite'),
        delete: __('Delete', 'uipress-lite'),
        explanation: __(
          'Create a new style preset from the current block style. Style presets can be used on any block and updating in one place will update across all your templates.',
          'uipress-lite'
        ),
      },
    };
  },
  watch: {},
  mounted() {
    this.setName();
  },
  computed: {
    returnPreset() {},
  },
  methods: {
    /**
     * Set's current preset name
     *
     * @since 3.2.13
     */
    setName() {
      const part = this.activePart == 'root' ? 'style' : this.activePart;
      const presets = this.uipData.options.block_preset_styles;

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
        title: __('Delete preset', 'uipress-lite'),
        message: __('Are you sure you want to delete this custom preset?', 'uipress-lite'),
        okButton: __('Delete preset', 'uipress-lite'),
        disableTeleport: true,
      });

      if (confirm) {
        if (!this.uipData.options.block_preset_styles) return;
        delete this.uipData.options.block_preset_styles[this.presetID];
        this.$emit('go-back');
      }
    },

    /**
     * Updates preset name
     *
     * @since 3.2.13
     */
    updatePreset() {
      if (!this.uipData.options.block_preset_styles) return;
      this.uipData.options.block_preset_styles[this.presetID].name = this.presetName;
      this.$emit('go-back');
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
  emits: ['update', 'go-back'],
  components: {},
  inject: ['uipData', 'uipress'],
  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
  },
  data() {
    return {
      newName: '',
      strings: {
        createPreset: __('Create preset', 'uipress-lite'),
        presetName: __('Preset name', 'uipress-lite'),
        explanation: __(
          'Create a new style preset from the current block style. Style presets can be used on any block and updating in one place will update across all your templates.',
          'uipress-lite'
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
      const maybePresets = this.uipData.options.block_preset_styles;
      let presets = this.isObject(maybePresets) ? maybePresets : {};

      const part = this.activePart == 'root' ? 'style' : this.activePart;
      this.ensureNestedObject(this.block, 'settings', part);
      const presetStyle = this.deepClone(this.block.settings[part]);

      const uid = this.uipress.createUID();
      presets[uid] = {
        preset: presetStyle,
        name: this.newName,
      };

      this.uipData.options.block_preset_styles = { ...presets };
      this.newName = '';
      this.$emit('go-back');
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
  emits: ['update', 'request-screen'],
  components: {},
  inject: ['uipData', 'uipress'],
  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
  },
  data() {
    return {
      open: true,
      strings: {
        searchPresets: __('Search presets', 'uipress-lite'),
        newPreset: __('New preset', 'uipress-lite'),
        noPresets: __('No presets yet', 'uipress-lite'),
        editPreset: __('Edit preset', 'uipress-lite'),
      },
      search: '',
    };
  },
  watch: {},
  computed: {
    /**
     * Returns all presets
     *
     * @since 3.2.13
     */
    returnPresets() {
      const maybePresets = this.uipData.options.block_preset_styles;
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
      const part = this.activePart == 'root' ? 'style' : this.activePart;
      const preset = this.hasNestedPath(this.block, 'settings', part, 'preset');
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
        component: 'NewPreset',
        label: this.strings.newPreset,
      };
      this.$emit('request-screen', newPresetScreen);
    },

    /**
     * Set's the selected preset
     *
     * @param {String} presetID - the preset id to delete
     * @since 3.2.13
     */
    choosePreset(presetID) {
      const part = this.activePart == 'root' ? 'style' : this.activePart;
      this.ensureNestedObject(this.block, 'settings', part, 'preset');
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
        component: 'EditPreset',
        presetID: presetID,
        label: this.strings.editPreset,
      };
      this.$emit('request-screen', editPresetScreen);
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
  emits: ['update'],
  inject: ['uipData', 'uipress'],
  components: {
    screenControl: defineAsyncComponent(() => import('../v3.5/utility/screen-control.min.js?ver=3.2.12')),
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
        presets: __('Preset', 'uipress-lite'),
        usePreset: __('Use preset', 'uipress-lite'),
        add: __('Add', 'uipress-lite'),
      },
    };
  },
  watch: {
    /**
     * Watches changes to style presets and saves
     *
     * @since 3.2.13
     */
    'uipData.options.block_preset_styles': {
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
      if (this.open) return 'expand_more';
      if (!this.open) return 'chevron_left';
    },

    /**
     * Returns the preset list screen
     *
     * @since 3.2.13
     */
    returnPresetScreen() {
      return {
        component: 'PresetList',
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
      const part = this.activePart == 'root' ? 'style' : this.activePart;
      const presetID = this.hasNestedPath(this.block, 'settings', part, 'preset');
      const presets = this.uipData.options.block_preset_styles;

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
      const options = this.prepareJSON(this.uipData.options.block_preset_styles);

      let formData = new FormData();
      formData.append('action', 'uip_save_site_option');
      formData.append('security', uip_ajax.security);
      formData.append('option', options);
      formData.append('optionName', 'block_preset_styles');

      const response = await this.uipress.callServer(uip_ajax.ajax_url, formData);

      if (response.success) {
        //this.uipress.notify(__('Presets updated', 'uipress-lite'), '', 'success', true);
      }
    },

    /**
     * Removes the current preset from the block
     *
     * @since 3.2.13
     */
    removePreset() {
      const part = this.activePart == 'root' ? 'style' : this.activePart;
      const presetID = this.hasNestedPath(this.block, 'settings', part, 'preset');
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
  emits: ['update'],
  components: {},
  inject: ['uipData'],
  props: {
    block: Object,
    activePart: String,
  },
  data() {
    return {
      part: null,
      strings: {
        blockPart: __('Block part', 'uipress-lite'),
        blockParts: __('Block parts', 'uipress-lite'),
        root: __('Root', 'uipress-lite'),
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
        this.$emit('update', this.part);
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
      if (this.part == 'root') return this.strings.root;
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
      const allBlocks = this.uipData.blocks;
      const blockIndex = allBlocks.findIndex((block) => block.moduleName == blockName);
      const blockInfo = allBlocks[blockIndex];
      const blockSettings = [...blockInfo.optionsEnabled];

      const keysToRemove = ['advanced', 'style', 'block'];

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
  
    <dropdown pos="left top" :snapX="['#uip-block-settings']" v-if="returnBlockPartsLength > 0" ref="blockPartSwitcher" class="uip-position-sticky uip-top-16 uip-z-index-2">
      
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
      if (this.open) return 'expand_more';
      if (!this.open) return 'chevron_left';
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
  emits: ['update'],
  inject: ['uipress'],
  components: {
    flexLayout: defineAsyncComponent(() => import('../options/flex-layout.min.js?ver=3.2.12')),
    contextmenu: defineAsyncComponent(() => import('../v3.5/utility/contextmenu.min.js?ver=3.2.12')),
    Dimensions: defineAsyncComponent(() => import('../options/dimensions.min.js?ver=3.2.12')),
    Styles: defineAsyncComponent(() => import('../options/styles.min.js?ver=3.2.12')),
    Spacing: defineAsyncComponent(() => import('../options/spacing.min.js?ver=3.2.12')),
    TextFormat: defineAsyncComponent(() => import('../options/text-format.min.js?ver=3.2.12')),
    PositionDesigner: defineAsyncComponent(() => import('../options/position-designer.min.js?ver=3.2.12')),
    EffectsDesigner: defineAsyncComponent(() => import('../options/effects.min.js?ver=3.2.12')),
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
      activeState: 'default',
      colorTheme: 'light',
      loading: false,
      strings: {
        toggleColour: __('Toggle dark / light mode', 'uipress-lite'),
        resetSection: __('Reset section', 'uipress-lite'),
      },
      pseudoSelectors: [
        { value: 'default', label: __('Default', 'uipress-lite') },
        { value: ':active', label: __(':active', 'uipress-lite') },
        { value: ':focus', label: __(':focus', 'uipress-lite') },
        { value: ':hover', label: __(':hover', 'uipress-lite') },
        { value: ':visited', label: __(':visited', 'uipress-lite') },
        { value: '::before', label: __('::before', 'uipress-lite') },
        { value: '::after', label: __('::after', 'uipress-lite') },
        { value: ':menu-collapsed', label: __('Menu collapsed', 'uipress-lite') },
        { value: 'tablet', label: __('Tablet', 'uipress-lite') },
        { value: 'mobile', label: __('Mobile', 'uipress-lite') },
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
      if (this.open) return 'expand_more';
      if (!this.open) return 'chevron_left';
    },

    /**
     * Returns the current style for block
     *
     * @since 3.2.13
     */
    returnCurrentBlockStyle() {
      let style;
      switch (this.activeState) {
        case 'default':
          style = this.colorTheme == 'light' ? this.blockStyle.value : this.blockStyle.darkValue;
          break;

        default:
          const state = this.activeState;
          const theme = this.colorTheme;
          // Create pseudo object
          this.ensureNestedObject(this.blockStyle, 'pseudo', theme, state);
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
      if (this.colorTheme == 'light') return 'light_mode';
      return 'dark_mode';
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
        case 'default':
          const key = this.colorTheme == 'light' ? 'value' : 'darkValue';
          this.blockStyle[key] = newStyle;

          this.break;

        default:
          const state = this.activeState;
          const theme = this.colorTheme;
          // Create pseudo object
          this.ensureNestedObject(this.blockStyle, 'pseudo', theme, state);
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
      let exists = this.hasNestedPath(this.blockStyle, 'pseudo', theme, pseudo);

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
      const state = this.colorTheme == 'light' ? 'dark' : 'light';
      this.colorTheme = state;
    },

    /**
     * Clears block pseudo settings
     *
     * @param {String} pseudo - pseudo name
     * @since 3.2.13
     */
    clearPseudo(pseudo) {
      let existsLight = this.hasNestedPath(this.blockStyle, 'pseudo', 'light', pseudo);
      if (existsLight) delete this.blockStyle.pseudo.light[pseudo];

      let existsDark = this.hasNestedPath(this.blockStyle, 'pseudo', 'dark', pseudo);
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
            class="uip-link-default uip-padding-xxs uip-border-rounder uip-text-s uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s">
              
              
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
  inject: ['uipData', 'uipress', 'uiTemplate'],
  components: {
    QueryBuilder: defineAsyncComponent(() => import('../options/query-builder.min.js?ver=3.2.12')),
    responsiveControls: defineAsyncComponent(() => import('../options/responsive.min.js?ver=3.2.12')),
    Classes: defineAsyncComponent(() => import('../options/classes.min.js?ver=3.2.12')),
    Conditions: defineAsyncComponent(() => import('../options/conditions.min.js?ver=3.2.12')),
    BlockStyleHandler: BlockStyleHandler,
    BlockParts: BlockParts,
    StylePresets: StylePresets,
    ToggleSection: ToggleSection,
  },
  data() {
    return {
      block: {},
      uid: this.$route.params.uid,
      mode: 'light',
      section: 'settings',
      missing: true,
      groups: [],
      loading: true,
      options: {},
      activeTab: false,
      buildingSettings: false,
      switchingComponent: false,
      componenetSettings: {},
      block_preset_styles: {},
      activeSelector: 'advanced',
      newPresetName: '',
      firstLoad: false,
      showSettings: false,
      activePart: 'root',
      strings: {
        missingMessage: __('This block no longer exists', 'uipress-lite'),
        goBack: __('Go back', 'uipress-lite'),
        blockID: __('ID', 'uipress-lite'),
        proOption: __('This is a pro option. Upgrade to unlock', 'uipress-lite'),
        theme: __('Theme', 'uipress-lite'),
        options: __('Options', 'uipress-lite'),
        buildingSettings: __('Building settings object...', 'uipress-lite'),
        blockUniqueID: __('Block unique id. If you change this it must remain unique and can not be blank', 'uipress-lite'),
        hiddenOnDevice: __('Hidden on device', 'uipress-lite'),
        tooltip: __('Tooltip', 'uipress-lite'),
        tooltipMessage: __('Message', 'uipress-lite'),
        delay: __('Delay (ms)', 'uipress-lite'),
        styles: __('Styles', 'uipress-lite'),
        blockSettings: __('Block options', 'uipress-lite'),
        currentlyEditing: __('Currently editing', 'uipress-lite'),
        blockPart: __('Block part', 'uipress-lite'),
        blockRoot: __('root', 'uipress-lite'),
        options: __('Options', 'uipress-lite'),
        pseudoClasses: __('Element states', 'uipress-lite'),
        editingLightMode: __('Editing for light mode'),
        editingDarkMode: __('Editing for dark mode'),
        pseudoContent: __('Pseudo content', 'uipress-lite'),
        beforeContent: __('::before', 'uipress-lite'),
        afterContent: __('::after', 'uipress-lite'),
        queryLoop: __('Query loop', 'uipress-lite'),
        query: __('Query', 'uipress-lite'),
        stylePresets: __('Style presets', 'uipress-lite'),
        usePreset: __('Use preset', 'uipress-lite'),
        none: __('None', 'uipress-lite'),
        newPreset: __('New preset', 'uipress-lite'),
        createNewPreset: __('Create preset', 'uipress-lite'),
        name: __('Name', 'uipress-lite'),
        presetActive: __('You are currently editing a style preset. Changes made here will apply to all blocks using the same preset.'),
        link: __('Link', 'uipress-lite'),
        menuCollapsed: __('Menu collapsed', 'uipress-lite'),
        tablet: __('Tablet', 'uipress-lite'),
        mobile: __('Mobile', 'uipress-lite'),
        clearState: __('Clear state', 'uipress-lite'),
        discontinued: __('This block has now been discontinued. We recommend replacing it with the new menu block from the blocks list.', 'uipress-lite'),
        general: __('General', 'uipress-lite'),
        layout: __('Layout', 'uipress-lite'),
        size: __('Size', 'uipress-lite'),
        style: __('Style', 'uipress-lite'),
        spacing: __('Spacing', 'uipress-lite'),
        text: __('Text', 'uipress-lite'),
        position: __('Position', 'uipress-lite'),
        effects: __('Effects', 'uipress-lite'),
        general: __('General', 'uipress-lite'),
        code: __('Code', 'uipress-lite'),
        classes: __('Classes', 'uipress-lite'),
        conditions: __('Conditions', 'uipress-lite'),
      },
      pseudoSelectors: [
        {
          value: ':active',
          label: __(':active', 'uipress-lite'),
        },
        {
          value: ':focus',
          label: __(':focus', 'uipress-lite'),
        },
        {
          value: ':hover',
          label: __(':hover', 'uipress-lite'),
        },
        {
          value: ':visited',
          label: __(':visited', 'uipress-lite'),
        },
        {
          value: '::before',
          label: __('::before', 'uipress-lite'),
        },
        {
          value: '::after',
          label: __('::after', 'uipress-lite'),
        },
        {
          value: ':menu-collapsed',
          label: __('Menu collapsed', 'uipress-lite'),
        },
        {
          value: 'tablet',
          label: __('Tablet', 'uipress-lite'),
        },
        {
          value: 'mobile',
          label: __('Mobile', 'uipress-lite'),
        },
      ],
      enabledDisabled: {
        false: {
          value: false,
          label: __('Disabled', 'uipress-lite'),
        },
        true: {
          value: true,
          label: __('Enabled', 'uipress-lite'),
        },
      },
      optionsSections: {
        settings: {
          value: 'settings',
          label: __('Settings', 'uipress-lite'),
        },

        style: {
          value: 'style',
          label: __('Style', 'uipress-lite'),
        },

        advanced: {
          value: 'advanced',
          label: __('Advanced', 'uipress-lite'),
        },
      },
    };
  },
  watch: {
    'block.uid': {
      handler(newValue, oldValue) {
        if (newValue == '') {
          this.block.uid = this.uipress.createUID();
        }
      },
      deep: true,
    },
    block_preset_styles: {
      handler(newValue, oldValue) {
        this.uipress.uipAppData.options.block_preset_styles = this.block_preset_styles;
      },
      deep: true,
    },
  },
  created() {
    this.uipApp.blockSettings = this;
  },
  computed: {
    /**
     * Returns block query settings
     *
     * @since 3.2.13
     */
    returnBlockQuerySettings() {
      if (!this.block.query) this.block.query = { settings: {} };
      return this.block.query.settings;
    },
    returnBlock() {
      return this.block;
    },
    returnSettings() {
      return this.componenetSettings;
    },
    returnBlockPartsCount() {
      let items = Object.keys(this.returnSettings);

      const advancedIndex = items.indexOf('advanced');
      const styleIndex = items.indexOf('style');
      const blockIndex = items.indexOf('block');

      if (advancedIndex >= 0) {
        items.splice(advancedIndex, 1);
      }
      if (styleIndex >= 0) {
        items.splice(styleIndex, 1);
      }
      if (blockIndex >= 0) {
        items.splice(blockIndex, 1);
      }

      return items.length;
    },
    returnCompSettings() {
      let preset = this.uipress.checkNestedValue(this.componenetSettings[this.returnActiveComp], ['preset']);

      if (preset) {
        if (preset in this.block_preset_styles) {
          return this.block_preset_styles[preset].preset;
        }
      }

      return this.componenetSettings[this.returnActiveComp];
    },
    ifUsingPreset() {
      let preset = this.uipress.checkNestedValue(this.componenetSettings[this.returnActiveComp], ['preset']);

      if (preset) {
        if (preset in this.block_preset_styles) {
          return true;
        }
      }
      return false;
    },
    ifBlockExists() {
      let self = this;
      let dataAsString = JSON.stringify(self.uiTemplate.content);
      if (dataAsString.includes(self.uid)) {
        return false;
      } else {
        return true;
      }
    },
    returnBlock() {
      return this.block;
    },
    returnActiveComp() {
      return this.activeSelector;
    },
    returnPresetLoading() {
      return this.uipress.checkNestedValue(this.componenetSettings[this.returnActiveComp], ['preset', 'loading']);
    },
    /**
     * Returns options for current block
     *
     * @since 3.2.13
     */
    returnBlockOptions() {
      const blockModule = this.block.moduleName;
      const allBlocks = this.uipData.blocks;

      // Find the originally registered block's enabled settings
      const masterblockIndex = allBlocks.findIndex((block) => block.moduleName === blockModule);

      // No block settings so bail
      if (masterblockIndex < 0) return [];
      const masterBlock = allBlocks[masterblockIndex];

      const allBlockSettings = masterBlock.optionsEnabled;
      const blockOptionsIndex = allBlockSettings.findIndex((option) => option.name === 'block');

      // No block specific settings so bail
      if (blockOptionsIndex < 0) return [];
      console.log(allBlockSettings[blockOptionsIndex].options);
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

      await nextTick();
      this.showSettings = true;
      this.loading = false;

      return;
      this.componenetSettings = {};
      const status = await this.build_block_settings(this.block);
      if (!status) return;

      // force reload of settings
      this.loading = true;
      await nextTick();

      // Set active tab
      if (tab) this.section = tab;

      // Get block presets
      if (this.uipData.options.block_preset_styles && this.isObject(this.uipData.options.block_preset_styles)) {
        this.block_preset_styles = this.uipData.options.block_preset_styles;
      }

      await nextTick();
      this.showSettings = true;
      this.loading = false;
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
     * Returns settings back to block. Filters out empty options and unnecessary parameters
     * Types: 'error', 'default', 'success', 'warning'
     * @since 3.0.0
     */
    passSettingsToBlock() {
      let self = this;
      //No settings or something has gone wrong so let's not set anything.
      if (!self.isObject(self.componenetSettings)) {
        return;
      }

      //Make a copy of the settings so it isn't reactive
      let clonedSettings = JSON.parse(JSON.stringify(self.componenetSettings));

      const formattedSettings = {};
      //Loop through setting groups
      for (let groupKey in clonedSettings) {
        let groupOptions = clonedSettings[groupKey];

        formattedSettings[groupKey] = {};
        formattedSettings[groupKey].options = {};
        if ('styleType' in groupOptions) {
          formattedSettings[groupKey].styleType = groupOptions.styleType;
        }
        if ('class' in groupOptions) {
          formattedSettings[groupKey].class = groupOptions.class;
        }

        if ('afterContent' in groupOptions) {
          formattedSettings[groupKey].afterContent = groupOptions.afterContent;
        }

        if ('beforeContent' in groupOptions) {
          formattedSettings[groupKey].beforeContent = groupOptions.beforeContent;
        }

        if ('preset' in groupOptions) {
          formattedSettings[groupKey].preset = groupOptions.preset;
        }

        if ('options' in groupOptions) {
          for (let optKey in groupOptions.options) {
            //Light mode
            if ('value' in groupOptions.options[optKey] || 'darkValue' in groupOptions.options[optKey] || 'pseudo' in groupOptions.options[optKey]) {
              //Grab light value
              let settingValue;
              if ('value' in groupOptions.options[optKey]) {
                settingValue = groupOptions.options[optKey].value;
              }
              //Grab light value
              let darkValue;
              if ('darkValue' in groupOptions.options[optKey]) {
                darkValue = groupOptions.options[optKey].darkValue;
              }
              //Grab hover value
              let pseudo;
              if ('pseudo' in groupOptions.options[optKey]) {
                pseudo = groupOptions.options[optKey]['pseudo'];
              }
              ///console.log(hoverValue);
              //Check if the value is set;
              let lightVal;
              if (typeof settingValue !== 'undefined') {
                if (self.isObject(settingValue)) {
                  lightVal = this.clear_empty_values_from_object(settingValue);
                } else {
                  lightVal = settingValue;
                }
              }

              //Check if the darkValue is set;
              let darkVal;
              if (typeof darkValue !== 'undefined') {
                if (self.isObject(settingValue)) {
                  darkVal = this.clear_empty_values_from_object(darkValue);
                } else {
                  darkVal = darkValue;
                }
              }

              //Check if pseudo is set
              if (self.isObject(pseudo)) {
                pseudo = this.clear_empty_values_from_object(pseudo);
              }

              if (typeof lightVal !== 'undefined' || typeof darkVal !== 'undefined' || typeof pseudo !== 'undefined') {
                formattedSettings[groupKey].options[optKey] = {};
                formattedSettings[groupKey].options[optKey].settingName = groupOptions.options[optKey].settingName;
                if (typeof lightVal !== 'undefined') {
                  formattedSettings[groupKey].options[optKey].value = lightVal;
                }
                if (typeof darkVal !== 'undefined') {
                  formattedSettings[groupKey].options[optKey].darkValue = darkVal;
                }
                if (typeof pseudo !== 'undefined') {
                  formattedSettings[groupKey].options[optKey]['pseudo'] = pseudo;
                }
              }
            }
          }
        }
      }

      //console.log(formattedSettings);

      //Ensure the settings were created correctly
      if (self.isObject(formattedSettings)) {
        self.block.settings = formattedSettings;
      }
    },

    /**
     * Loops through settings and only passes back values that are set
     * Types: 'error', 'default', 'success', 'warning'
     * @since 3.0.0
     */
    clear_empty_values_from_object(values) {
      let self = this;
      for (let valueKey in values) {
        let val = values[valueKey];

        if (typeof val === 'undefined') {
          delete values[valueKey];
        }

        if (val == '' && val !== false && val !== 0 && val !== '0') {
          delete values[valueKey];
        }

        if (self.isObject(val)) {
          if (Object.keys(val).length === 0) {
            delete values[valueKey];
          } else {
            val = self.clear_empty_values_from_object(val);
            //Check if the object is now empty after iterating it's children
            if (Object.keys(values[valueKey]).length === 0) {
              delete values[valueKey];
            }
          }
        }
      }
      return values;
    },

    /**
     * Loops through groups in options enabled and builds a usable options object
     * Types: 'error', 'default', 'success', 'warning'
     * @since 3.0.0
     */
    async build_block_settings(block) {
      let self = this;
      let blockMobule = block.moduleName;
      let allBlocks = this.uipData.blocks;
      let blockCurrentSettings = block.settings;

      //Find the originally registered block's enabled settings
      let masterblock = allBlocks.filter((obj) => {
        return obj.moduleName === blockMobule;
      });
      if (masterblock.length < 1) {
        self.missing = true;
        self.loading = false;
        self.buildingSettings = false;
        self.strings.missingMessage = __('This block has no settings', 'uipress-lite');
        return false;
      }

      if (typeof masterblock[0].optionsEnabled === 'undefined') {
        self.missing = true;
        self.loading = false;
        self.buildingSettings = false;
        self.strings.missingMessage = __('This is a pro block. Upgrade to unlock', 'uipress-lite');
        return false;
      }

      //Make a copy of the originally registered block's enabled settings

      let optionsEnabled = JSON.parse(JSON.stringify(masterblock[0].optionsEnabled));

      let tempSettings = JSON.parse(JSON.stringify(self.componenetSettings));

      for (var i = 0; i < optionsEnabled.length; i++) {
        let group = optionsEnabled[i];
        let groupName = group.name;

        let valuesAlreadySet = {};
        if (groupName in blockCurrentSettings) {
          valuesAlreadySet = blockCurrentSettings[groupName];
        }

        if (Object.keys(valuesAlreadySet).length === 0) {
          self.uipress.format_block_presets(group.options, block.settings, group);
          if (groupName in block.settings) {
            valuesAlreadySet = block.settings[groupName];
          }
        }

        self.uipress.format_block_option(group, valuesAlreadySet, self.componenetSettings);
      }

      return true;
    },
    componentExists(name) {
      if (this.$root._.appContext.components[name]) {
        return true;
      } else {
        return false;
      }
    },
    checkIfEmpty(group) {
      let groupOptions = group.options;

      if (this.mode != 'dark') {
        return true;
      }

      for (const [key, value] of Object.entries(groupOptions)) {
        if ('dark' in groupOptions[key]) {
          if (groupOptions[key].dark) {
            return true;
          }
        }
      }

      return false;
    },
    pushActiveSection(section) {
      this.$router.push({
        query: { ...this.$route.query, section: section },
      });
    },
    returnActivePart() {
      if (this.activeSelector == 'style') {
        return this.block.name;
      }

      return this.returnSettings[this.activeSelector].label;
    },
    setSubComponent(comp) {
      let self = this;
      self.activeSelector = comp;
      self.switchingComponent = true;

      //Force the styles to re-rener
      setTimeout(function () {
        self.switchingComponent = false;
      }, 250);
    },
    returnLightModeSetting(mode) {
      if (!mode || typeof mode === 'undefined') {
        return 'light';
      } else {
        return mode;
      }
    },
    formatPseudoValue(val) {
      let isSet = this.uipress.checkNestedValue(val, ['pseudo', this.returnOptionTheme(val), val.activePseudo]);

      if (!isSet) {
        this.uipress.createNestedObject(val, ['pseudo', this.returnOptionTheme(val), val.activePseudo]);
        return {};
      }
      return isSet;
    },
    returnOptionTheme(val) {
      let theme = 'light';
      if (val.themeMode == 'dark') {
        theme = 'dark';
      }
      return theme;
    },
    switchOptionTheme(option) {
      option.loading = true;
      if (option.themeMode == 'dark') {
        option.themeMode = 'light';
      } else {
        option.themeMode = 'dark';
      }
      //Force the styles to re-rener
      setTimeout(function () {
        option.loading = false;
      }, 250);
    },
    hasPseudo() {
      let stringer = JSON.stringify(this.componenetSettings[this.returnActiveComp]);
      if (typeof stringer === 'undefined') {
        return;
      }
      if (stringer.includes(':before') || stringer.includes(':after')) {
        return true;
      }
    },
    switchPseudo(option, pseudo) {
      option.loading = true;
      option.activePseudo = pseudo;
      //Force the styles to re-rener
      setTimeout(function () {
        option.loading = false;
      }, 250);
    },
    returnQueryVal() {
      if (!('query' in this.block)) {
        this.block.query = {
          enabled: false,
          settings: {},
        };
        return this.block.query.enabled;
      }

      return this.block.query.enabled;
    },
    createNewPreset() {
      let self = this;

      if (this.newPresetName == '') {
        this.uipress.notify(__('Preset name is required', 'uipress-lite'), '', 'error', true);
        return;
      }

      let uid = this.uipress.createUID();
      this.block_preset_styles[uid] = {
        preset: this.componenetSettings[this.returnActiveComp],
        name: this.newPresetName,
      };
      this.newPresetName = '';

      this.saveStylePresets();
    },

    saveStylePresets() {
      let self = this;
      let options = JSON.stringify(this.block_preset_styles, (k, v) =>
        v === 'true' ? 'uiptrue' : v === true ? 'uiptrue' : v === 'false' ? 'uipfalse' : v === false ? 'uipfalse' : v === '' ? 'uipblank' : v
      );

      let formData = new FormData();
      formData.append('action', 'uip_save_site_option');
      formData.append('security', uip_ajax.security);
      formData.append('option', options);
      formData.append('optionName', 'block_preset_styles');

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.success) {
          this.uipress.notify(__('Presets updated', 'uipress-lite'), '', 'success', true);
        }
      });
    },

    forceLoad() {
      let self = this;

      for (const key in self.returnCompSettings.options) {
        self.returnCompSettings.options[key].loading = true;
      }

      setTimeout(function () {
        for (const key in self.returnCompSettings.options) {
          self.returnCompSettings.options[key].loading = false;
        }
      }, 250);
    },
    returnPresetName() {
      if (this.componenetSettings[this.returnActiveComp].preset in this.block_preset_styles) {
        return this.block_preset_styles[this.componenetSettings[this.returnActiveComp].preset].name;
      }
      return __('Preset missing', 'uipress-lite');
    },
    updatePresetValue(value) {
      this.componenetSettings[this.returnActiveComp].preset = value;
      this.forceLoad();
    },
    deleteStylePreset(style) {
      let self = this;
      self.uipress.confirm(__('Are yous sure?', 'uipress-lite'), __('Are you sure you want to delete this style preset?', 'uipress-lite')).then((response) => {
        if (response) {
          if (style in this.block_preset_styles) {
            delete self.block_preset_styles[style];
            self.saveStylePresets();
          }
        }
      });
    },

    /**
     * Checks if the given option is full width option
     *
     * @param {Object} option - the option object
     * @since 3.2.13
     */
    optionFullWidth(option) {
      return this.hasNestedPath(option, 'args', 'fullWidth');
    },
    clearStyles() {
      for (let option in this.componenetSettings[this.returnActiveComp].options) {
        if ('value' in this.componenetSettings[this.returnActiveComp].options[option]) {
          this.componenetSettings[this.returnActiveComp].options[option].loading = true;
          delete this.componenetSettings[this.returnActiveComp].options[option].value;
        }
        if ('pseudo' in this.componenetSettings[this.returnActiveComp].options[option]) {
          this.componenetSettings[this.returnActiveComp].options[option].loading = true;
          delete this.componenetSettings[this.returnActiveComp].options[option].pseudo;
        }
      }
      requestAnimationFrame(() => {
        for (let option in this.componenetSettings[this.returnActiveComp].options) {
          this.componenetSettings[this.returnActiveComp].options[option].loading = false;
        }
      });
    },
    hasPseudoSpecific(pseudoName, option) {
      if (!('pseudo' in option)) {
        return false;
      }
      if (!('light' in option.pseudo)) {
        return false;
      }
      if (!(pseudoName in option.pseudo.light)) {
        return false;
      }
      if (Object.keys(option.pseudo.light[pseudoName]).length === 0) {
        return false;
      }
      return true;
    },
    clearPseudoState(pseudoName, option) {
      delete option.pseudo.light[pseudoName];
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
     * Handles changes to a block style object
     *
     * @param {String} styleName - the name of the current style
     * @param {Object} newValue - the new style value
     * @since 3.2.13
     */
    updateBlockStyle(styleName, newValue) {
      //this.block.settings.style.options[styleName] = newValue;
      //this.block.settings.style.options[styleName] = newValue;
      //console.log(this.block.settings.style.options);
    },

    /**
     * Returns current style for block
     *
     * @param {String} styleName - the name of the current style
     * @param {Object} newValue - the new style value
     * @since 3.2.13
     */
    returnBlockStylePart(styleName) {
      const part = this.activePart == 'root' ? 'style' : this.activePart;
      const presetID = this.hasNestedPath(this.block, 'settings', part, 'preset');
      const presets = this.uipData.options.block_preset_styles;

      // Return preset style if set and exists
      if (presetID && this.isObject(presets)) {
        if (presetID in presets) {
          const preset = presets[presetID];
          this.ensureNestedObject(preset, 'preset', 'options', styleName);
          return preset.preset.options[styleName];
        }
      }

      this.ensureNestedObject(this.block, 'settings', part, 'options', styleName);
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
      const blockOptions = this.hasNestedPath(this.block, 'settings', 'block', 'options');
      if (!blockOptions) return;

      // Get the option key
      const key = option.uniqueKey ? option.uniqueKey : option;

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
      const key = option.uniqueKey ? option.uniqueKey : option;

      this.ensureNestedObject(this.block, 'settings', 'block', 'options', key);
      this.block.settings.block.options[key].value = data;
    },

    /**
     * Returns specific value for advanced settings
     *
     * @param {String} option - the name of the required option
     * @since 3.2.13
     */
    returnAdvancedValue(option) {
      const blockOptions = this.hasNestedPath(this.block, 'settings', 'advanced', 'options');
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
      this.ensureNestedObject(this.block, 'settings', 'advanced', 'options', option);
      this.block.settings.advanced.options[option].value = data;
    },
  },
  template: `
    
    
    
    <div v-if="showSettings" id="uip-block-settings"
    class="uip-position-fixed uip-top-80 uip-right-16 uip-bottom-16 uip-background-default uip-w-320 uip-flex uip-flex-column uip-row-gap-s uip-fade-in uip-shadow" style="border-radius: calc(var(--uip-border-radius-large) + var(--uip-padding-xs)); z-index: 2;overflow:auto">
    
        
        <div class="uip-flex uip-flex-column uip-gap-s uip-padding-s">
          
          <!-- Block settings header -->
          <div class="uip-flex uip-flex-between uip-flex-center uip-margin-bottom-s">
          
            <div class="uip-flex uip-flex-column">
              <input class="uip-text-bold uip-blank-input uip-text-l uip-text-emphasis" v-model="block.name">
            </div>
            
            <a class="uip-link-muted hover:uip-background-muted uip-border-rounder uip-icon uip-padding-xxs" @click="close()">close</a>
            
          </div>
          <!-- End block settings header -->
          
          
          <!-- Toggle active tab -->
          <toggle-switch :options="optionsSections" :activeValue="section" :returnValue="handleActiveTabChange"/>
          
          
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
            
              <QueryBuilder v-if="uiTemplate.proActivated" :block="block" :value="returnBlockQuerySettings" :returnData="(d)=>{ block.query.settings = d}"/>
              
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
                      
                        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                          <span>{{option.label}}</span>
                          
                          <uip-tooltip v-if="option.help" :message="option.help">
                            <span class="uip-icon uip-border-circle uip-background-grey uip-cursor-pointer" style="font-size:12px">question_mark</span>
                          </uip-tooltip>
                          
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
                  <code-editor :args="{language:'javascript'}" :value="returnAdvancedValue('css')" :returnData="(d)=>{handleBlockAdavancedUpdate('js', d)}"/>
                                      
              </div>
            </ToggleSection>
            
          
          </div>
          <!-- Advanced tab-->
          
          
          <!-- Styles tab -->
          <div v-if="section == 'style'" class="uip-flex uip-flex-column uip-gap-s">
          
            <BlockParts :block="block" :activePart="activePart" @update="(d)=>{activePart=d}"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Presets -->
            <StylePresets :activePart="activePart" :block="block"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Layout -->
            <BlockStyleHandler 
            :startOpen="!!block.content"
            :styleSettings="returnBlockStylePart('flexLayout')" component="flexLayout" 
            styleName="flexLayout"
            :title="strings.layout" @update="(emittedValue) => updateBlockStyle('flexLayout', emittedValue)"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Dimensions -->
            <BlockStyleHandler 
            :startOpen="true"
            styleName="dimensions"
            :styleSettings="returnBlockStylePart('dimensions')" component="Dimensions" 
            :title="strings.size" @update="(emittedValue) => updateBlockStyle('dimensions', emittedValue)"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Styles -->
            <BlockStyleHandler 
            :startOpen="true"
            styleName="styles"
            :styleSettings="returnBlockStylePart('styles')" component="Styles" 
            :title="strings.style" @update="(emittedValue) => updateBlockStyle('styles', emittedValue)"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Spacing -->
            <BlockStyleHandler 
            :startOpen="true"
            styleName="spacing"
            :styleSettings="returnBlockStylePart('spacing')" component="Spacing" 
            :title="strings.spacing" @update="(emittedValue) => updateBlockStyle('spacing', emittedValue)"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Text -->
            <BlockStyleHandler 
            styleName="textFormat"
            :styleSettings="returnBlockStylePart('textFormat')" component="TextFormat" 
            :title="strings.text" @update="(emittedValue) => updateBlockStyle('textFormat', emittedValue)"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Position -->
            <BlockStyleHandler 
            styleName="positionDesigner"
            :styleSettings="returnBlockStylePart('positionDesigner')" component="PositionDesigner" 
            :title="strings.position" @update="(emittedValue) => updateBlockStyle('positionDesigner', emittedValue)"/>
            
            <div class="uip-border-top"></div>
            
            <!-- Effects -->
            <BlockStyleHandler 
            styleName="effectsDesigner"
            :styleSettings="returnBlockStylePart('effectsDesigner')" component="EffectsDesigner" 
            :title="strings.effects" @update="(emittedValue) => updateBlockStyle('effectsDesigner', emittedValue)"/>
            
            <div class="uip-border-top"></div>
            
            
            
          </div>  
        
        
        </div>
        
        
    </div>
        
        `,
};
