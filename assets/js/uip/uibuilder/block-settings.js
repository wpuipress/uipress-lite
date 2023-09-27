/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  inject: ['uipData', 'router', 'uipress', 'uiTemplate'],
  components: {
    QueryBuilder: defineAsyncComponent(() => import('../options/uip-query-builder.min.js?ver=3.2.12')),
    responsiveControls: defineAsyncComponent(() => import('../options/uip-responsive.min.js?ver=3.2.12')),
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
      switchOptions: {
        light: {
          value: 'light',
          label: __('Light mode', 'uipress-lite'),
        },
        dark: {
          value: 'dark',
          label: __('Dark mode', 'uipress-lite'),
        },
      },
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
      lightModeSwitchOptions: {
        light: {
          value: 'light',
          icon: 'light_mode',
          tip: __('Light mode styles'),
        },
        dark: {
          value: 'dark',
          icon: 'dark_mode',
          tip: __('Dark mode styles', 'uipress-lite'),
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
    componenetSettings: {
      handler(newValue, oldValue) {
        let self = this;
        if (!self.loading) {
          if (JSON.stringify(self.componenetSettings) != JSON.stringify(self.block.settings)) {
            this.passSettingsToBlock();
          }
        }
      },
      deep: true,
    },
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
  updated: function () {
    this.firstLoad = true;
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
  },
  template: `
    
    
    
    <div v-if="showSettings" id="uip-block-settings"
    class="uip-position-fixed uip-top-80 uip-right-16 uip-bottom-16 uip-background-default uip-w-320 uip-flex uip-flex-column uip-row-gap-s uip-overflow-auto uip-fade-in uip-shadow" style="border-radius: calc(var(--uip-border-radius-large) + var(--uip-padding-xs)); z-index: 2;">
    
        <div v-if="loading" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle "><loading-chart></loading-chart></div>
        <div v-if="buildingSettings" class="uip-text-muted uip-text-center">{{strings.buildingSettings}}</div>
        
		<div class="uip-flex uip-flex-column uip-h-100p uip-max-h-100p uip-h-vh uip-position-relative uip-flex-grow" v-if="!loading">
          
          
          <!-- Block settings header -->
          <div class="uip-padding-s uip-padding-remove-bottom">
          
            <div class="uip-flex uip-gap-xxs uip-flex-center">
            
            
              <div class="uip-flex uip-flex-column uip-flex-grow">
                <input class="uip-text-bold uip-blank-input uip-text-l uip-text-emphasis" v-model="block.name">
              </div>
              
              <a class="uip-link-muted hover:uip-background-muted uip-border-rounder uip-icon uip-padding-xxs" @click="close()">close</a>
              
            </div>
            
          </div>
          <!-- End block settings header -->
          
          <!-- Settings group -->
          <div class="uip-padding-s uip-border-box ">
            <toggle-switch :options="optionsSections" :activeValue="section" :dontAccentActive="true" :returnValue="function(data){ section = data; pushActiveSection(data)}"></toggle-switch>
          </div>
          
          
          <!-- End settings group -->
          
          <div class="uip-padding-s uip-padding-top-remove uip-overflow-auto uip-scrollbar">
            
            <!--BLOCK SETTINGS -->
            <div class="uip-margin-bottom-m" v-if="section == 'settings'">
              <div class=" uip-flex uip-flex-column uip-gap-s">
              
                <div v-if="block.moduleName == 'uip-admin-menu'" class="uip-border-rounder uip-background-orange-wash uip-padding-xs">
                  {{strings.discontinued}}
                </div>
                
                <div>
                  <div class="uip-margin-bottom-xxs uip-text-bold uip-text-emphasis">{{strings.general}}</div>
                
                  <div class="uip-padding-s uip-padding-right-remove">
                    
                    <div class="uip-grid-col-1-3">
                    
                      
                        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.name}}</span></div>
                        <input class="uip-input uip-input-small" type="text" v-model="block.name">
                      
                        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.blockID}}</span></div>
                        <uip-tooltip :message="strings.blockUniqueID" :delay="200">
                          <div class="uip-flex uip-flex-center uip-background-muted uip-border-rounder uip-padding-xxxs uip-padding-left-xxs uip-padding-right-xxs">
                            <div class="uip-text-muted uip-text-xs">#</div>
                            <input class="uip-blank-input uip-text-muted uip-text-xs uip-padding-remove uip-w-100p" style="color:var(--uip-text-color-muted) !important" v-model="block.uid">
                          </div>
                        </uip-tooltip>
                        
                        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-max-h-30"><span>{{strings.link}}</span></div>
                        <link-select :value="block.linkTo" :returnData="function(d){block.linkTo = d}"></link-select>
                        
                        <!--Tooltip text -->
                        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.tooltip}}</span></div>
                        
                        <uip-input :value="block.tooltip.message" :returnData="function(d){block.tooltip.message = d}"/>
                                            
                    </div>
                    
                  </div>
                
                </div>
                
                
                <div class="uip-border-top"></div>
                
                
                <!--Query builder-->
                <div class="" >
                  <div class="uip-margin-bottom-xxs uip-text-bold uip-text-emphasis">{{strings.queryLoop}}</div>
                  
                  <div class="uip-padding-s uip-padding-right-remove uip-flex uip-flex-column uip-row-gap-xs" v-if="uiTemplate.proActivated">
                    
                    
                    <QueryBuilder :block="block" :value="returnBlockQuerySettings" :returnData="(d)=>{ block.query.settings = d}"/>
                  
                  </div>
                  
                  <div v-else class="uip-padding-s uip-padding-right-remove">
                    <div class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">{{strings.proOption}}</div>
                  </div>
                  
                  
                </div>
                
                <div class="uip-border-top"></div>
              
                
                <div class="">
                  <div class="uip-margin-bottom-xxs uip-text-bold uip-text-emphasis">{{strings.hiddenOnDevice}}</div>
                  <div class="uip-padding-s uip-padding-right-remove">
                    <responsiveControls :value="block.responsive" :returnData="(e)=>{block.responsive = e}"/>
                  </div>
                </div>
                
                <div class="uip-border-top"></div>
                
                <div v-if="returnSettings.block" class="uip-flex uip-flex-column">
                
                
                  <div class="uip-margin-bottom-xxs uip-text-bold uip-text-emphasis">{{strings.options}}</div>
                  
                  <div class="uip-padding-s uip-padding-right-remove uip-flex uip-flex-column uip-row-gap-s">
                  
                  
                    <template v-for="option in returnSettings.block.options">
                    
                    
                      <!--Options -->
                      <div :class="optionFullWidth(option) ? 'uip-flex uip-flex-column uip-row-gap-xxs' : 'uip-grid-col-1-3'">
                      
                        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                          <span>{{option.label}}</span>
                          
                          <uip-tooltip v-if="option.help" :message="option.help">
                            <span class="uip-icon uip-border-circle uip-background-grey uip-cursor-pointer" style="font-size:12px">question_mark</span>
                          </uip-tooltip>
                          
                        </div>
                          
                        <div class="uip-flex uip-flex-center uip-w-100p">
                          <component v-if="componentExists(option.component)" :is="option.component" :value="option.value" :args="option.args" :returnData="function(data){option.value = data}"></component>
                          
                          <div v-else class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">
                             {{strings.proOption}}
                          </div>
                        </div>
                        
                      </div>
                      
                    </template>
                  
                  </div>
                  
                </div>
              </div>
            </div>
            
            
            
            <!--Block styles -->
            <div class="uip-flex uip-flex-column uip-row-gap-s uip-margin-bottom-l" v-if="section == 'style'">
            
              <dropdown pos="left top" 
              :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']"
              v-if="returnBlockPartsCount > 0" class="uip-position-sticky uip-top-0" style="z-index:2">
                
                <template v-slot:trigger>
                  
                  <div class="uip-padding-xs uip-flex uip-flex-between uip-border-rounder uip-flex-center uip-background-muted">
                  
                    <div class="uip-flex uip-flex-column">
                      <div class="uip-text-muted">{{strings.blockPart}}</div>
                      <div>{{returnActivePart()}}</div>
                    </div>
                    
                    <div class="uip-icon">expand_more</div>
                  
                  </div>
                  
                </template>
                
                <template v-slot:content> 
                  
                  <div class="uip-padding-xs uip-flex uip-flex-column">
                    
                    <div class="uip-flex uip-gap-xs uip-padding-xs hover:uip-background-muted uip-link-default uip-border-rounder uip-flex-center" @click="setSubComponent('style')"
                    :class="{'uip-background-muted' : activeSelector == 'style'}">
                      <div class="uip-icon uip-text-l">crop_free</div>
                      <div class="uip-flex uip-flex-grow uip-flex-center uip-flex-between">
                        <span class="">{{block.name}} {{strings.blockRoot}}</span>
                        <span v-if="activeSelector == 'style'" class="uip-icon uip-icon-large">done</span>
                      </div>
                    </div>
                    
                      
                    <template v-for="(group, index) in returnSettings">
                      <div class="uip-flex uip-gap-xxs uip-gap-xs uip-flex-center uip-padding-xs hover:uip-background-muted uip-link-default uip-border-rounder" v-if="checkIfEmpty(group) && group.name != 'block' && group.name != 'style' && group.name != 'advanced' && group.name != 'container'" @click="setSubComponent(group.name)" :class="{'uip-background-muted' : activeSelector == group.name}">
                        <div class="uip-icon uip-text-l">{{group.icon}}</div>
                        <div class="uip-flex uip-flex-row uip-flex-grow uip-gap-xxs uip-flex-center">
                          <span class="">{{group.label}}</span>
                          <span v-if="group.class" class="uip-text-muted">({{group.class}})</span>
                        </div>
                        <span v-if="activeSelector == group.name" class="uip-icon uip-icon-large">done</span>
                      </div>
                      
                    </template>
                    
                  </div>
                  
                </template>
              
              </dropdown>
              
              
              <div v-if="switchingComponent" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle "><loading-chart></loading-chart></div>
            
              <div v-else class="uip-flex uip-flex-column uip-row-gap-s uip-fade-in">
              
                <!--Style preset warning-->
                
                <div v-if="ifUsingPreset" class="uip-background-orange-wash uip-border-rounder uip-text-s uip-padding-xs uip-scale-in-top uip-flex uip-flex-column uip-row-gap-xs">
                  {{strings.presetActive}}
                </div>
              
              
                <!--Pseudo-->
                
                <div v-if="hasPseudo()">
                  <div class="uip-margin-bottom-xxs uip-flex uip-flex-center uip-flex-between">
                   <div class="uip-flex uip-gap-xxs uip-flex-center uip-text-bold uip-text-emphasis">{{strings.pseudoContent}}</div>
                  </div> 
                
                  <div class="uip-padding-s uip-padding-right-remove uip-flex uip-flex-column uip-row-gap-xs">
                    
                    <!--Before -->
                    <div class="uip-grid-col-1-3">
                    
                      <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.beforeContent}}</span></div>
                        
                      <input class="uip-input uip-w-100p" type="text" v-model="componenetSettings[returnActiveComp].beforeContent">
                      
                      
                    </div>
                    
                    <!--After -->
                    <div class="uip-grid-col-1-3">
                    
                      <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.afterContent}}</span></div>
                        
                      <input class="uip-input uip-w-100p" type="text" v-model="componenetSettings[returnActiveComp].afterContent">
                      
                      
                    </div>
                    
                  </div>
                </div>
                
                <!--Pseudo-->
              
                <template v-for="option in returnCompSettings.options">
                
                  <div class="">
                  
                    <div class="uip-margin-bottom-xxs uip-flex uip-flex-center uip-flex-between">
                       <div class="uip-flex uip-gap-xxs uip-flex-center">
                        <span class="uip-text-bold uip-text-emphasis">{{option.label}}</span>
                        <span class="uip-text-muted" v-if="option.activePseudo && option.activePseudo != 'none'">{{option.activePseudo}}</span>
                        
                        <span v-if="returnLightModeSetting(option.themeMode) == 'dark'"
                        :title="strings.editingDarkMode" class="uip-icon uip-text-muted uip-padding-xxxs uip-border-round uip-link-default uip-background-grey uip-margin-left-xxs"  @click="switchOptionTheme(option)">dark_mode</span>
                        
                        <span v-else
                        :title="strings.editingLightMode" class="uip-icon uip-text-muted uip-padding-xxxs uip-border-round uip-link-default uip-background-grey uip-margin-left-xxs" @click="switchOptionTheme(option)">light_mode</span>
                        
                       </div>
                       
                       <dropdown pos="left top" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
                        <template v-slot:trigger>
                          <div v-if="'pseudo' in option" class="uip-w-6 uip-ratio-1-1 uip-border-circle uip-background-green-wash" style="border:1px solid var(--uip-color-green)"></div>
                          <div class="uip-icon uip-link-default uip-text-l">add</div>
                        </template>
                        <template v-slot:content>
                        
                          <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s uip-min-w-200">
                          
                            <div class="">{{strings.pseudoClasses}}</div>
                            
                            <div class="uip-flex uip-flex-column uip-row-gap-xxs">
                            
                              <div class="uip-link-muted uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-flex uip-flex-between uip-flex-center" 
                              :class="{'uip-background-muted' : !option.activePseudo || option.activePseudo == 'none' }" @click="switchPseudo(option, 'none')">
                                <span>none</span>
                                <span v-if="!option.activePseudo || option.activePseudo == 'none'" class="uip-icon">done</span>
                              </div>
                              
                              <template v-for="pseudo in pseudoSelectors">
                              
                                <div class="uip-flex uip-gap-xxs">
                                
                                  <div class="uip-link-muted uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-flex uip-flex-between uip-flex-center uip-gap-xxs uip-flex-grow" 
                                  :class="{'uip-background-muted' : option.activePseudo == pseudo.value }" @click="switchPseudo(option, pseudo.value)">
                                    
                                    <span class="uip-flex-grow">{{pseudo.label}}</span>
                                    <div v-if="hasPseudoSpecific(pseudo.value,option)" class="uip-w-6 uip-ratio-1-1 uip-border-circle uip-background-green-wash" style="border:1px solid var(--uip-color-green)"></div>
                                    
                                    <span v-if="option.activePseudo == pseudo.value" class="uip-icon">done</span>
                                    
                                  </div>
                                  
                                  <button :title="strings.clearState" v-if="hasPseudoSpecific(pseudo.value,option)" @click="clearPseudoState(pseudo.value,option)"
                                  class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs">close</button>
                                  
                                </div>
                                
                                
                                
                              </template>
                              
                              
                            </div>
                          </div>
                          
                        </template>
                      </dropdown>
                      
                    </div>
                    
                    <div class="uip-padding-s uip-padding-right-remove">
                    
                      <div v-if="option.loading" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle "><loading-chart></loading-chart></div>
                    
                      <template v-else-if="!option.activePseudo || option.activePseudo == 'none'">
                      
                       <component v-if="option.themeMode == 'light' || !option.themeMode" :is="option.component" :value="option.value" :args="option.args" 
                       :returnData="function(data){option.value = data}" 
                       :blockSettings="block.settings"/>
                       
                       <component v-else :is="option.component" :args="option.args" :value="option.darkValue" 
                       :returnData="function(data){option.darkValue = data}"
                       :blockSettings="block.settings"/>
                       
                      </template>
                      
                      <template v-else>
                      
                       <component :is="option.component" :value="formatPseudoValue(option)" :args="option.args" 
                       :returnData="function(data){option.pseudo[returnOptionTheme(option)][option.activePseudo] = data}" 
                       :blockSettings="block.settings"/>
                       
                      </template>
                       
                    </div>
                    <div v-if="!componentExists(option.component)" class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">
                       {{strings.proOption}}
                    </div>
                  </div>
                  
                  <div class="uip-border-top"></div>
                </template>
                
                
                
                <!--Style presets-->
                <div v-if="!switchingComponent">
                  <div class="uip-margin-bottom-xxs uip-text-bold uip-text-emphasis">{{strings.stylePresets}}</div>
                  
                  <div v-if="returnPresetLoading" class="uip-padding-m uip-flex uip-flex-center uip-flex-middle "><loading-chart></loading-chart></div>
                  
                  <!--Options -->
                  <div class="uip-padding-s uip-padding-right-remove">
                  
                    <div class="uip-grid-col-1-3">
                  
                      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                        {{strings.usePreset}}
                      </div>
                        
                      <div class="uip-flex uip-flex-center uip-gap-xxs">
                      
                        
                        <dropdown pos="left center" class="uip-w-100p" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
                          
                          <template v-slot:trigger>
                          
                            <button v-if="!componenetSettings[returnActiveComp].preset" class="uip-button-default uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p uip-flex uip-gap-xxs uip-flex-center uip-flex-middle">
                              <span class="uip-icon">add</span>
                            </button>  
                            
                            <button v-else class="uip-button-default uip-border-rounder uip-padding-xxs uip-w-100p uip-flex uip-gap-xxs uip-flex-center uip-flex-between">
                              <span>{{returnPresetName()}}</span>
                              <span class="uip-icon">expand_more</span>
                            </button>  
                          
                          </template>
                          
                          <template v-slot:content>
                            
                              <div class="uip-padding-xs uip-flex uip-flex-column uip-w-200 uip-overflow-auto" style="max-height:300px">
                                
                                <div class="uip-link-muted uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-flex uip-flex-between" @click="updatePresetValue(false)"
                                :class="!componenetSettings[returnActiveComp].preset ? 'uip-background-muted' : ''">
                                  <span>{{strings.none}}</span>
                                </div>
                                
                                <template v-for="(item, index) in block_preset_styles">
                                    <div class="uip-link-muted uip-padding-xxs uip-border-rounder hover:uip-background-muted uip-flex-grow uip-flex uip-flex-between uip-flex-center"
                                    :class="componenetSettings[returnActiveComp].preset == index ? 'uip-background-muted'  : ''">
                                      <span class="uip-flex" @click="updatePresetValue(index)">{{item.name}}</span>
                                      <div class="uip-icon uip-link-danger" @click="deleteStylePreset(index)">delete</div>
                                    </div>
                                    
                                    
                                    
                                </template>
                              </div>
                            
                          </template>
                        
                        
                        </dropdown>
                        
                        <button v-if="componenetSettings[returnActiveComp].preset" class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs" @click="updatePresetValue(false)">close</button>
                        
                      </div> 
                      
                      <template v-if="!componenetSettings[returnActiveComp].preset">
                      
                        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs">
                          {{strings.newPreset}}
                        </div>
                        
                        <div class="uip-flex uip-flex-center uip-w-100p">
                          <input type="text" class="uip-input uip-input-small uip-w-100p" v-model="newPresetName" :placeholder="strings.name">
                        </div>
                         
                        <div></div>
                         
                        <div class="uip-flex uip-flex-center">
                          <button class="uip-button-default uip-border-rounder uip-w-100p" @click="createNewPreset()">{{strings.createNewPreset}}</button>
                        </div>
                      
                      </template>
                      
                      
                    
                    </div>
                    
                    
                    
                  </div>
                  
                  
                </div>  
                
                <div class="uip-border-top"></div>
                
                <button class="uip-button-warning" @click="clearStyles()">
                Clear all styles
                </button>
                
              </div>
              
              
              
              
            </div>
            
            
            
            
            
            
            
            
            <!--Advanced settings -->
            <div class="uip-flex uip-flex-column uip-row-gap-xs uip-margin-bottom-l uip-padding-s uip-padding-right-remove" v-if="section == 'advanced' && returnSettings.advanced">
              <div class="uip-grid-col-1-3">
                <template v-for="option in returnSettings.advanced.options">
                  
                  
                    <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-gap-xs uip-h-30">
                      <span>{{option.label}}</span>
                      
                      <uip-tooltip v-if="option.help" :message="option.help">
                        <span class="uip-icon uip-border-circle uip-background-grey uip-cursor-pointer" style="font-size:12px">question_mark</span>
                      </uip-tooltip>
                      
                    </div>
                      
                    <div class="uip-flex uip-flex-center uip-flex-right uip-w-100p uip-margin-bottom-s">
                      <component v-if="componentExists(option.component)" :is="option.component" :value="option.value" :args="option.args" :returnData="function(data){option.value = data}"></component>
                      
                      <div v-else class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">
                         {{strings.proOption}}
                      </div>
                    </div>
                    
                  
                </template>
              </div>
            </div>
            
            
          </div>
	</div>
        
  </div>
        
        `,
};
