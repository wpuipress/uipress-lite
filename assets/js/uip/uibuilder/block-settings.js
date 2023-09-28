/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
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
      if (!this.uipress.isObject(this.styleSettings)) return (this.blockStyle = {});
      // Update block style
      this.blockStyle = this.styleSettings;
    },

    /**
     * Checks if a nested object exists. if not, it creates each step
     *
     * @param {Object} obj - the object to check against
     * @param {Array} keys - The nested keys to check
     * @since 3.2.13
     */
    ensureNestedObject(obj, ...keys) {
      keys.reduce((acc, key, index, arr) => {
        if (!acc[key]) acc[key] = {};
        return acc[key];
      }, obj);
    },

    /**
     * Checks if a nested object exists. Returns false if not, true if so
     *
     * @param {Object} obj - the object to check against
     * @param {Array} keys - The nested keys to check
     * @returns {Boolean | Mixed} - returns false on path doesn't exist. Returns value otherwise
     * @since 3.2.13
     */
    hasNestedPath(obj, ...keys) {
      for (let key of keys) {
        if (obj.hasOwnProperty(key)) {
          obj = obj[key];
        } else {
          return false; // or undefined, or any other suitable value to indicate "not found"
        }
      }
      return obj;
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
          class="hover:uip-background-muted uip-link-danger uip-padding-xxs uip-border-rounder uip-text-s uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s">
          
            <span>{{ strings.resetSection }}</span>
            
            <span class="uip-icon">delete</span>
          
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
    BlockStyleHandler: BlockStyleHandler,
  },
  data() {
    return {
      block: {},
      uid: this.$route.params.uid,
      mode: 'light',
      section: 'style',
      missing: true,
      groups: [],
      loading: true,
      options: {},
      activeTab: false,
      buildingSettings: false,
      switchingComponent: false,
      componenetSettings: {},
      block_preset_styles: {},
      activeSelector: 'style',
      newPresetName: '',
      firstLoad: false,
      showSettings: false,
      strings: {
        missingMessage: __('This block no longer exists', 'uipress-lite'),
        goBack: __('Go back', 'uipress-lite'),
        blockID: __('Block ID', 'uipress-lite'),
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
      if (this.uipData.options.block_preset_styles && this.uipress.isObject(this.uipData.options.block_preset_styles)) {
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
      if (!self.uipress.isObject(self.componenetSettings)) {
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
                if (self.uipress.isObject(settingValue)) {
                  lightVal = this.clear_empty_values_from_object(settingValue);
                } else {
                  lightVal = settingValue;
                }
              }

              //Check if the darkValue is set;
              let darkVal;
              if (typeof darkValue !== 'undefined') {
                if (self.uipress.isObject(settingValue)) {
                  darkVal = this.clear_empty_values_from_object(darkValue);
                } else {
                  darkVal = darkValue;
                }
              }

              //Check if pseudo is set
              if (self.uipress.isObject(pseudo)) {
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
      if (self.uipress.isObject(formattedSettings)) {
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

        if (self.uipress.isObject(val)) {
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
    optionFullWidth(option) {
      if (this.uipress.checkNestedValue(option, ['args', 'fullWidth'])) {
        return true;
      }
      return false;
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
      const newparams = { query: { ...this.$route.query, section: section } };
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
      if (!this.block.settings) this.block.settings = {};
      if (!this.block.settings.style) this.block.settings.style = {};
      if (!this.block.settings.style.options) this.block.settings.style.options = {};
      if (!this.block.settings.style.options[styleName]) this.block.settings.style.options[styleName] = {};
      return this.block.settings.style.options[styleName];
    },
  },
  template: `
    
    
    
    <div v-if="showSettings" id="uip-block-settings"
    class="uip-position-fixed uip-top-80 uip-right-16 uip-bottom-16 uip-background-default uip-w-320 uip-flex uip-flex-column uip-row-gap-s uip-overflow-auto uip-fade-in uip-shadow" style="border-radius: calc(var(--uip-border-radius-large) + var(--uip-padding-xs)); z-index: 2;">
    
        
        <div class="uip-flex uip-flex-column uip-gap-m uip-padding-s">
          
          <!-- Block settings header -->
          <div class="uip-flex uip-flex-between uip-flex-center">
          
            <div class="uip-flex uip-flex-column">
              <input class="uip-text-bold uip-blank-input uip-text-l uip-text-emphasis" v-model="block.name">
            </div>
            
            <a class="uip-link-muted hover:uip-background-muted uip-border-rounder uip-icon uip-padding-xxs" @click="close()">close</a>
            
          </div>
          <!-- End block settings header -->
          
          
          <!-- Toggle active tab -->
          <toggle-switch :options="optionsSections" :activeValue="section" :returnValue="handleActiveTabChange"/>
          
          <!-- Styles tab -->
          <template v-if="section == 'style'">
          
            <div class="uip-flex uip-flex-column uip-gap-s">
          
              <!-- Layout -->
              <BlockStyleHandler 
              v-if="block.content"
              :startOpen="true"
              :styleSettings="returnBlockStylePart('flexLayout')" component="flexLayout" 
              styleName="flexLayout"
              :title="strings.layout" @update="(emittedValue) => updateBlockStyle('flexLayout', emittedValue)"/>
              
              <div v-if="block.content" class="uip-border-top"></div>
              
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
              
            </div>  
              
              
          </template>
        
        
        </div>
        
        
    </div>
        
        `,
};
