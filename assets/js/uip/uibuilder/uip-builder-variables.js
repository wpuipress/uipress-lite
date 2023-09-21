const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    colourManager: defineAsyncComponent(() => import('../v3.5/styles/color-style-editor.min.js')),
  },
  props: {},
  data: function () {
    return {
      loading: true,
      ui: {
        mode: 'light',
        search: '',
        strings: {
          theme: __('Theme', 'uipress'),
          add: __('Add', 'uipress'),
          variableLabel: __('Variable label', 'uipress'),
          variableName: __('Variable name', 'uipress'),
          deleteVariable: __('Delete variable', 'uipress'),
          custom: __('custom', 'uipress-lite'),
          revertStyle: __('Revert style back to default', 'uipress-lite'),
          searchVariables: __('Search variables...', 'uipress-lite'),
          new: __('New variable', 'uipress-lite'),
          editStyle: __('Edit style', 'uipress-lite'),
        },
        switchOptions: {
          light: {
            value: 'light',
            tip: __('Light', 'uipress-lite'),
            icon: 'light_mode',
          },
          dark: {
            value: 'dark',
            tip: __('Dark', 'uipress-lite'),
            icon: 'dark_mode',
          },
        },
        varTypeSelected: 'color',
        varTypes: {
          color: {
            value: 'color',
            label: __('Colour', 'uipress-lite'),
          },
          units: {
            value: 'units',
            label: __('Units', 'uipress-lite'),
          },
          font: {
            value: 'font',
            label: __('Font', 'uipress-lite'),
          },
        },
        fonts: [
          {
            value: 'Arial, Helvetica, sans-serif',
            label: __('Arial / Helvetica', 'uipress-lite'),
          },
          {
            value: 'Times New Roman, Times, serif',
            label: __('Times New Roman', 'uipress-lite'),
          },
          {
            value: 'Courier New / Courier, Monospace',
            label: __('Courier New', 'uipress-lite'),
          },
          {
            value: 'Tahoma, sans-serif',
            label: __('Tahoma', 'uipress-lite'),
          },
          {
            value: 'Trebuchet MS, sans-serif',
            label: __('Trebuchet MS', 'uipress-lite'),
          },
          {
            value: 'Verdana, sans-serif',
            label: __('Verdana', 'uipress-lite'),
          },
          {
            value: 'Georgia, serif',
            label: __('Georgia', 'uipress-lite'),
          },
          {
            value: 'Garamond, serif',
            label: __('Garamond', 'uipress-lite'),
          },
          {
            value: 'Arial Black, sans-serif',
            label: __('Arial Black', 'uipress-lite'),
          },
          {
            value: 'Impact, sans-serif',
            label: __('Impact', 'uipress-lite'),
          },
          {
            value: 'Brush Script MT, cursive',
            label: __('Brush Script MT', 'uipress-lite'),
          },
          {
            value: 'Material Symbols Rounded',
            label: __('UiPress icons', 'uipress-lite'),
          },
          {
            value: 'inherit',
            label: __('Inherit', 'uipress-lite'),
          },
        ],
      },

      newVariable: {
        label: '',
        var: '',
        type: 'color',
      },
    };
  },
  inject: ['uipData', 'uipress', 'uiTemplate'],
  watch: {
    'newVariable.var': {
      handler(newValue, oldValue) {
        if (newValue && newValue.length > 2) {
          let firstTwo = newValue.slice(0, 2);
          let first = newValue.slice(0, 2);
          let ammended = '';

          if (firstTwo != '--') {
            if (first != '-') {
              ammended = '--' + newValue;
            } else {
              ammended = '-' + newValue;
            }
          } else {
            ammended = newValue;
          }
          ammended = ammended.replace(' ', '-');

          this.newVariable.var = ammended;
        }
      },
      deep: true,
    },
  },
  mounted: function () {
    if (this.uipData.userPrefs.darkTheme) {
      this.ui.mode = 'dark';
    }
  },
  computed: {
    /**
     * Returns the value for the given colour mode (light / dark)
     *
     * @since 3.2.13
     */
    returnActiveMode() {
      if (!this.uipData.userPrefs.darkTheme) return 'value';
      if (this.uipData.userPrefs.darkTheme) return 'darkValue';
    },
  },
  methods: {
    returnVar(item) {
      if (this.ui.mode == 'light') {
        return item.value;
      } else {
        return item.darkValue;
      }
    },
    splitUnitVal(item) {
      let val = false;
      if (this.ui.mode == 'light') {
        val = item.value;
      } else {
        val = item.darkValue;
      }

      if (!val || val == '') {
        return { units: 'px', value: '' };
      }

      let num = val.replace(/\D/g, '');
      if (num == '') {
        return { units: 'px', value: '' };
      }

      let parts = val.split(num);
      let units = parts[1];
      return { value: num, units: units };
    },
    setVar(data, item) {
      if (this.ui.mode == 'light') {
        item.value = data;
      } else {
        item.darkValue = data;
      }
    },
    setUnitVal(data, item) {
      if (this.ui.mode == 'light') {
        if (!data.value) {
          item.value = '';
        } else {
          item.value = data.value + data.units;
        }
      } else {
        if (!data.darkValue) {
          item.darkValue = '';
        } else {
          item.darkValue = data.value + data.units;
        }
      }
    },
    clearVar(item) {
      if (this.ui.mode == 'light') {
        delete item.value;
      } else {
        delete item.darkValue;
      }
    },
    deleteVar(item, key) {
      delete this.uipData.themeStyles[key];
      this.uipress.notify(__('Variable deleted', 'uipress-lite'), '', 'success', true);
    },
    createVariable() {
      if (this.newVariable.label == '') {
        this.uipress.notify(__('Variable label is required', 'uipress-lite'), '', 'error', true);
        return;
      }
      if (this.newVariable.var == '') {
        this.uipress.notify(__('Variable name is required', 'uipress-lite'), '', 'error', true);
        return;
      }
      console.log(this.newVariable.type);
      let style = {
        label: this.newVariable.label,
        darkValue: '',
        value: '',
        type: this.newVariable.type,
        name: this.newVariable.var,
        user: true,
      };

      this.uipData.themeStyles[this.newVariable.var] = style;
      this.uipress.notify(__('Variable created!', 'uipress-lite'), '', 'success', true);

      this.newVariable.label = '';
      this.newVariable.var = '';
    },
    customSet(style) {
      if (this.ui.mode == 'light') {
        if (style.value && style.value != '') {
          return true;
        }
      }
      if (this.ui.mode == 'dark') {
        if (style.darkValue && style.darkValue != '') {
          return true;
        }
      }
      return false;
    },
    /**
     * Checks if var is in search
     *
     * @param {Object} variable - the current variable
     * @since 3.2.13
     */
    inSearch(variable) {
      if (this.ui.search == '') {
        return true;
      }
      let str = this.ui.search.toLowerCase();

      if (variable.name.toLowerCase().includes(str)) {
        return true;
      }
      if (variable.label.toLowerCase().includes(str)) {
        return true;
      }
      return false;
    },
    /**
     * Returns the css background value
     *
     * @param {Object} style - style object
     * @since 3.2.13
     */
    returnStyleBackground(style) {
      const mode = this.returnActiveMode;
      if (!style[mode]) return `var(${style.name})`;
      if (style[mode].includes('--')) return `var(${style[mode]})`;
      return style[mode];
    },
  },
  template: `
		  <div class="uip-flex uip-flex-column uip-row-gap-s">
      
        
        <!-- Var types -->
        <div class="">
          <toggle-switch :options="ui.varTypes" :activeValue="ui.varTypeSelected" :returnValue="function(data){ ui.varTypeSelected = data}"></toggle-switch>
        </div>
        
        
        
        
        
        <div class="uip-padding-right-remove">
          <div class="uip-flex uip-flex-column uip-gap-xxs">
          
			      <template v-for="(item, index) in uipData.themeStyles">
              
              <template v-if="item.type == ui.varTypeSelected && inSearch(item)">
              
                <div class="uip-flex uip-gap-xs uip-flex-center uip-gap-xxxs">
                
                  <div class="uip-w-100p uip-flex-grow uip-flex-center">
                    
                      
                    <!--Color picker dropdown-->
                    <dropdown v-if="item.type == 'color'" :ref="'coloreditor-'+index" pos="left center" :offsetX="56">
                    
                      <template #trigger>
                      
                        <div class="uip-flex uip-gap-s uip-flex-center uip-padding-xxs uip-padding-left-xs uip-link-default uip-border-rounder hover:uip-background-muted">
                        
                          <div class="uip-w-16 uip-border-circle uip-ratio-1-1 uip-background-checkered">
                            <div class="uip-w-16 uip-border-circle uip-ratio-1-1 uip-border" :style="{background:returnStyleBackground(item)}">
                            
                            </div>
                          </div>
                          
                          <div class="">{{item.name}}</div>
                        
                        </div>
                        
                      </template>
                      
                      <template #content>
                      
                        <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-xs uip-w-240">
                        
                          <div class="uip-flex uip-flex-between uip-flex-center">
                            <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ui.strings.editStyle}}</div>
                            
                            <div @click="$refs['coloreditor-'+index][0].close()" 
                            class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                              <span class="uip-icon">close</span>
                            </div>
                          </div>
                          
                          <colourManager :value="item" :returnData="false"/>
                        
                        </div>
                        
                      </template>
                      
                    </dropdown>  
                    
                    <!--Value vars-->
                    <template v-if="item.type == 'units'">
                    
                      <value-units :value="splitUnitVal(item)" size="xsmall" :returnData="function(data){ setUnitVal(data, item)}"></value-units>
                    
                    </template>
                    
                    
                    <!--Font vars-->
                    <template v-if="item.type == 'font'">
                    
                      <select v-if="ui.mode == 'light'" v-model="item.value" class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" 
                      style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large);">
                        <template v-for="font in ui.fonts">
                          <option vlass="font.value" >{{font.label}}</option>
                        </template>
                      </select>
                      
                      <select v-else v-model="item.darkValue" class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" 
                      style="padding-top: 2px; padding-bottom: 2px; border-radius: var(--uip-border-radius-large);">
                        <template v-for="font in ui.fonts">
                          <option vlass="font.value" >{{font.label}}</option>
                        </template>
                      </select>
                    
                    </template>
                    
                    
                  </div>
                  
                  <uip-tooltip :message="ui.strings.revertStyle" :delay="1000" v-if="!item.user && customSet(item)">
                   <a @click="clearVar(item)" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-text-s">format_color_reset</a>
                  </uip-tooltip>
                  
                  <uip-tooltip :message="ui.strings.revertStyle" :delay="1000" v-if="item.user">
                   <a @click="deleteVar(item, index)" class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-text-s">delete</a>
                  </uip-tooltip>
                  
                </div>
                
		          </template>
              
			      </template>
          </div>
        
        </div>
        
     </div>`,
};
