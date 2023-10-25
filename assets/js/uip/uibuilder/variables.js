const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent } from "../../libs/vue-esm.js";
import Fonts from "../v3.5/lists/fonts.min.js";
export default {
  components: {
    colourManager: defineAsyncComponent(() => import("../v3.5/styles/color-style-editor.min.js")),
    contextmenu: defineAsyncComponent(() => import("../v3.5/utility/contextmenu.min.js")),
  },
  props: {},
  data() {
    return {
      loading: true,
      newUnitItem: {},
      ui: {
        mode: "light",
        search: "",
        strings: {
          theme: __("Theme"),
          add: __("Add"),
          variableLabel: __("Variable label"),
          variableName: __("Variable name"),
          deleteVariable: __("Delete variable"),
          custom: __("custom", "uipress-lite"),
          revertStyle: __("Revert style back to default", "uipress-lite"),
          searchVariables: __("Search variables...", "uipress-lite"),
          new: __("New variable", "uipress-lite"),
          editStyle: __("Edit style", "uipress-lite"),
          colours: __("Colours", "uipress-lite"),
          units: __("Units", "uipress-lite"),
          fonts: __("Fonts", "uipress-lite"),
          text: __("Text", "uipress-lite"),
          newStyle: __("New style variable", "uipress-lite"),
          newUnit: __("New unit variable", "uipress-lite"),
          editUnit: __("Edit unit", "uipress-lite"),
          styleName: __("Style name", "uipress-lite"),
          value: __("Value", "uipress-lite"),
          create: __("Create", "uipress-lite"),
          editText: __("Edit text", "uipress-lite"),
          newTextVariable: __("New text variable", "uipress-lite"),
        },
        tabs: {
          color: false,
          units: false,
          font: false,
        },

        fonts: Fonts,
      },

      newVariable: {
        label: "",
        var: "",
        type: "color",
      },
    };
  },
  watch: {
    /**
     * Watches changes to styles and then saves
     *
     * @since 3.2.13
     */
    "uipApp.data.themeStyles": {
      handler() {
        this.saveStyles();
      },
      deep: true,
    },
  },
  mounted() {
    this.getLocalFonts();
  },
  computed: {
    /**
     * Returns the value for the given colour mode (light / dark)
     *
     * @since 3.2.13
     */
    returnActiveMode() {
      if (!this.uipApp.data.userPrefs.darkTheme) return "value";
      if (this.uipApp.data.userPrefs.darkTheme) return "darkValue";
    },
    /**
     * Returns a list of filtered variables for type color
     *
     * @returns {Object}
     * @since 3.2.13
     */
    returnColorVars() {
      return Object.entries(this.uipApp.data.themeStyles)
        .filter(([key, item]) => item.type === "color" || !("name" in item))
        .map(([key, item]) => {
          item.name = key;
          item.type = "color";
          return item;
        });
    },
    /**
     * Returns a list of filtered variables for type units
     *
     * @returns {Object}
     * @since 3.2.13
     */
    returnUnitsVars() {
      return Object.values(this.uipApp.data.themeStyles).filter((item) => item.type === "units");
    },
    /**
     * Returns a list of filtered variables for type font
     *
     * @returns {Object}
     * @since 3.2.13
     */
    returnFontsVars() {
      return Object.values(this.uipApp.data.themeStyles).filter((item) => item.type === "font");
    },
  },
  methods: {
    /**
     * Saves users styles
     *
     * @returns {Promise}  - whether styles where saved succesfully
     * @since 3.2.13
     */
    async saveStyles() {
      // Format styles
      let stylesJson = JSON.stringify(this.uipApp.data.themeStyles);

      // Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_save_user_styles");
      formData.append("security", uip_ajax.security);
      formData.append("styles", stylesJson);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Error saving styles
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "uipress-lite", "", "error", true);
      }

      return true;
    },
    /**
     * Gets current page fonts
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async getLocalFonts() {
      await document.fonts.ready;

      const fonts = [...document.fonts].map((font) => font.family);
      const uniqueFonts = [...new Set(fonts)];

      const sortedFonts = uniqueFonts.map((fontName) => {
        return {
          value: fontName.replace(/["']/g, ""), // Removing any quotes around font names
          label: fontName.replace(/["']/g, "").split(",")[0], // Taking the first font name if there's a fallback list
        };
      });
      this.ui.fonts = [...sortedFonts, ...this.ui.fonts];
    },

    /**
     * Splits a unit's value into number and unit
     *
     * @param {String} item - the string to split
     * @since 3.2.13
     */
    splitUnitVal(item) {
      let val = false;
      if (this.ui.mode == "light") {
        val = item.value;
      } else {
        val = item.darkValue;
      }

      if (!val || val == "") {
        return { units: "px", value: "" };
      }

      let num = val.replace(/\D/g, "");
      if (num == "") {
        return { units: "px", value: "" };
      }

      let parts = val.split(num);
      let units = parts[1];
      return { value: num, units: units };
    },
    /**
     * Sets a unit variable value
     *
     * @param {Object} data - the new value object
     * @param {Object} item - the variable to update
     * @since 3.2.13
     */
    setUnitVal(data, item) {
      if (!data.value) {
        item.value = "";
      } else {
        item.value = data.value + data.units;
      }
    },
    /**
     * Clears custom variable value
     *
     * @param {Object} item - the variable to clear
     * @since 3.213
     */
    clearVar(item) {
      delete item.value;
      delete item.darkValue;
    },
    /**
     * Deletes a variable
     *
     * @param {Object} item - variable to delete
     * @since 3.2.13
     */
    deleteVar(item) {
      delete this.uipApp.data.themeStyles[item.name];
      this.uipApp.notifications.notify(__("Variable deleted", "uipress-lite"), "", "success", true);
    },
    /**
     * Checks if the variable has a custom value
     *
     * @param {Object} style - the variable object to check
     * @since 3.2.13
     */
    customSet(style) {
      if (this.ui.mode == "light") {
        if (style.value && style.value != "") {
          return true;
        }
      }
      if (this.ui.mode == "dark") {
        if (style.darkValue && style.darkValue != "") {
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
      if (this.ui.search == "") {
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
     * Cleans variable name
     *
     * @param {String} value - the name to clean
     */
    cleanKeyName(value) {
      value = value.replace(" ", "-");
      value = value.replace(",", "");
      value = value.replace(".", "");
      value = value.replace(/[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/]/gi, "");
      value = value.toLowerCase();
      value = this.ensureDoubleDashPrefix(value);
      return value;
    },
    /**
     * Enforces double dash at start of string
     *
     * @param {String} str - the string to add dashed too@since 3.2.13
     */
    ensureDoubleDashPrefix(str) {
      // If string is null or undefined, return '--'
      if (!str) return "--";

      // If string starts with '--', return it as is
      if (str.startsWith("--")) return str;

      // If string starts with '-', but not followed by another '-'
      if (str.startsWith("-")) return "--" + str.slice(1);

      // If string doesn't start with '-', prefix it with '--'
      return "--" + str;
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
      if (style[mode].includes("--")) return `var(${style[mode]})`;
      return style[mode];
    },
    /**
     * Adds a new color var from the picker menu
     *
     * @param {Object} d - color object
     * @since 3.2.13
     */
    addNewColorVar(d) {
      let newCol = { name: "", type: "color", value: "", darkValue: "", user: true };
      newCol = { ...newCol, ...d };
      this.uipApp.data.themeStyles[newCol.name] = newCol;
      this.$refs.newcolourdrop.close();
    },
    /**
     * Adds a new units var from the picker menu
     *
     * @param {Object} d - color object
     * @since 3.2.13
     */
    addNewUnitVar() {
      let newCol = { name: "", type: "units", value: "", darkValue: "", user: true };
      newCol = { ...newCol, ...this.newUnitItem };
      this.uipApp.data.themeStyles[newCol.name] = newCol;
      this.$refs.newunitdrop.close();
      this.newUnitItem = {};
    },
    /**
     * Adds a new text var from the picker menu
     *
     * @param {Object} d - color object
     * @since 3.2.13
     */
    addNewTextVar() {
      let newCol = { name: "", type: "font", value: "", darkValue: "", user: true };
      newCol = { ...newCol, ...this.newUnitItem };
      this.uipApp.data.themeStyles[newCol.name] = newCol;
      this.$refs.newtextdrop.close();
      this.newUnitItem = {};
    },
    /**
     * Returns variable custom value if set, otherwise returns calculated value from document
     *
     * @param {Object} variable - variable object
     * @since 3.2.13
     */
    getCalculatedValue(variable) {
      if (variable.value) return variable.value;
      // Attempt to get value from document
      const rootStyle = getComputedStyle(document.documentElement);
      const varName = variable.name.trim();
      const variableValue = rootStyle.getPropertyValue(varName).trim();
      if (variableValue) return variableValue;
    },
  },
  template: `
  <div class="uip-flex uip-flex-column uip-row-gap-s">
  
  
        <!--Color vars-->
        <div class="uip-flex uip-gap-xxs uip-flex-center uip-link-default" @click="ui.tabs.color = !ui.tabs.color">
        
          <div class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <span v-if="!ui.tabs.color" class="uip-icon">chevron_right</span>
            <span v-if="ui.tabs.color" class="uip-icon">expand_more</span>
          </div>
          
          <div class="uip-text-emphasis uip-text-bold uip-text-s uip-flex-grow">{{ui.strings.colours}}</div>
          
          <div @click.prevent.stop="$refs.newcolourdrop.show($event)" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-default hover:uip-background-muted uip-border-rounder">
            <span class="uip-icon">add</span>
          </div>
          
        </div>
        
        <div v-if="ui.tabs.color" class="uip-flex uip-flex-column uip-padding-left-xs">
        
          <template v-for="(item, index) in returnColorVars">
            
            <div class="uip-flex uip-gap-xs uip-flex-center uip-gap-xxxs">
              
              <!--Color picker dropdown-->
              <dropdown
              :ref="'coloreditor-'+index" 
              pos="left center" 
              :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']" class="uip-flex-grow">
              
                <template #trigger>
                
                  <div class="uip-flex uip-gap-s uip-flex-center uip-padding-xxs uip-padding-left-xs uip-link-default uip-border-rounder hover:uip-background-muted">
                  
                    <div class="uip-w-16 uip-border-circle uip-ratio-1-1 uip-background-checkered">
                      <div class="uip-w-16 uip-border-circle uip-ratio-1-1 uip-border" :style="{background:returnStyleBackground(item)}">
                      
                      </div>
                    </div>
                    
                    <div class="uip-text-s">{{item.name}}</div>
                  
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
              
               <a @click="clearVar(item)" 
               v-if="!item.user && customSet(item)"
               :title="ui.strings.revertStyle"
               class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-text-s">format_color_reset</a>
              
               <a v-if="item.user" 
               @click="deleteVar(item)"
               :title="ui.strings.deleteVariable" 
               class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-text-s">delete</a>              
               
            </div>  
          
          </template>
        </div>
        
        
        <!--Units vars-->
        <div class="uip-flex uip-gap-xxs uip-flex-center uip-link-default" @click="ui.tabs.units = !ui.tabs.units">
        
          <div class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <span v-if="!ui.tabs.units" class="uip-icon">chevron_right</span>
            <span v-if="ui.tabs.units" class="uip-icon">expand_more</span>
          </div>
          
          <div class="uip-text-emphasis uip-text-bold uip-text-s uip-flex-grow">{{ui.strings.units}}</div>
          
          <div @click.prevent.stop="$refs.newunitdrop.show($event)" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-default hover:uip-background-muted uip-border-rounder">
            <span class="uip-icon">add</span>
          </div>
          
        </div>
        
        <div v-if="ui.tabs.units" class="uip-flex uip-flex-column uip-padding-left-s uip-row-gap-xxs">
        
          <template v-for="(item, index) in returnUnitsVars">
            
            <div class="uip-flex uip-gap-xs uip-flex-center uip-gap-xxxs">
              
              <!--Units dropdown dropdown-->
              <dropdown
              :ref="'uniteditor-'+index" 
              pos="left center" 
              :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']" class="uip-flex-grow">
              
                <template #trigger>
                
                  <div class="uip-flex uip-gap-s uip-flex-center uip-padding-xxs uip-padding-left-xs uip-link-default uip-border-rounder hover:uip-background-muted">
                    
                    <div class="uip-text-bold uip-text-s uip-w-40">{{getCalculatedValue(item)}}</div>
                    
                    <div class="uip-text-s">{{item.name}}</div>
                  
                  </div>
                  
                </template>
                
                <template #content>
                
                  <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-xs uip-w-240">
                  
                    <div class="uip-flex uip-flex-between uip-flex-center">
                      <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ui.strings.editUnit}}</div>
                      
                      <div @click="$refs['uniteditor-'+index][0].close()" 
                      class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                        <span class="uip-icon">close</span>
                      </div>
                    </div>
                    
                    <div class="uip-grid-col-1-3 uip-padding-left-xs">
                      
                      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-no-wrap"><span>{{ ui.strings.styleName }}</span></div>
                      <input :disabled="!item.user"
                      @input="item.name = cleanKeyName(item.name)"
                      class="uip-input uip-w-100p" type="text" v-model="item.name" :placeholder="ui.strings.styleName" autofocus>
                      
                      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-no-wrap"><span>{{ ui.strings.value }}</span></div>
                      <value-units :value="splitUnitVal(item)" size="xsmall" :returnData="(data)=>{ setUnitVal(data, item)}" class="uip-w-100p"></value-units>
                    
                    </div>
                  
                  </div>
                  
                </template>
                
              </dropdown>  
              
              <a @click="clearVar(item)" 
              v-if="!item.user && customSet(item)"
              :title="ui.strings.revertStyle"
              class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-text-s">format_color_reset</a>
              
              <a v-if="item.user" 
              @click="deleteVar(item)"
              :title="ui.strings.deleteVariable" 
              class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-text-s">delete</a>              
               
            </div>  
          
          </template>
        </div>
        
        
        
        <!--Font vars-->
        <div class="uip-flex uip-gap-xxs uip-flex-center uip-link-default" @click="ui.tabs.font = !ui.tabs.font">
        
          <div class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <span v-if="!ui.tabs.font" class="uip-icon">chevron_right</span>
            <span v-if="ui.tabs.font" class="uip-icon">expand_more</span>
          </div>
          
          <div class="uip-text-emphasis uip-text-bold uip-text-s uip-flex-grow">{{ui.strings.text}}</div>
          
          <div @click.prevent.stop="$refs.newtextdrop.show($event)" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-default hover:uip-background-muted uip-border-rounder">
            <span class="uip-icon">add</span>
          </div>
          
        </div>
        
        <div v-if="ui.tabs.font" class="uip-flex uip-flex-column uip-padding-left-s uip-row-gap-xxs">
        
          <template v-for="(item, index) in returnFontsVars">
            
            <div class="uip-flex uip-gap-xs uip-flex-center uip-gap-xxxs">
              
              <!--Units dropdown dropdown-->
              <dropdown
              :ref="'fonteditor-'+index" 
              pos="left center" 
              :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']" class="uip-flex-grow">
              
                <template #trigger>
                
                  <div class="uip-flex uip-gap-s uip-flex-center uip-padding-xxs uip-padding-left-xs uip-link-default uip-border-rounder hover:uip-background-muted">
                    
                    <div class="uip-text-bold uip-text-s uip-w-40 uip-overflow-hidden uip-text-ellipsis uip-no-wrap">{{getCalculatedValue(item)}}</div>
                    
                    <div class="uip-text-s">{{item.name}}</div>
                  
                  </div>
                  
                </template>
                
                <template #content>
                
                  <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-xs uip-w-240">
                  
                    <div class="uip-flex uip-flex-between uip-flex-center">
                      <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ui.strings.editText}}</div>
                      
                      <div @click="$refs['fonteditor-'+index][0].close()" 
                      class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                        <span class="uip-icon">close</span>
                      </div>
                    </div>
                    
                    <div class="uip-grid-col-1-3 uip-padding-left-xs">
                      
                      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-no-wrap"><span>{{ ui.strings.styleName }}</span></div>
                      <input :disabled="!item.user"
                      @input="item.name = cleanKeyName(item.name)"
                      class="uip-input uip-w-100p" type="text" v-model="item.name" :placeholder="ui.strings.styleName" autofocus>
                      
                      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-no-wrap"><span>{{ ui.strings.value }}</span></div>
                      <select class="uip-input uip-w-100p" v-model="item.value">
                        <template v-for="font in ui.fonts">
                          <option :value="font.value">{{ font.label }}</option>
                        </template>
                      </select>
                    
                    </div>
                  
                  </div>
                  
                </template>
                
              </dropdown>  
              
              <a @click="clearVar(item)" 
              v-if="!item.user && customSet(item)"
              :title="ui.strings.revertStyle"
              class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-text-s">format_color_reset</a>
              
              <a v-if="item.user" 
              @click="deleteVar(item)"
              :title="ui.strings.deleteVariable" 
              class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-text-s">delete</a>              
               
            </div>  
          
          </template>
        </div>
        
        
        
        <!-- New color dropdown-->
        <contextmenu
        ref="newcolourdrop" 
        :snapRight="true"
        :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']"
        :offsetX="-8">
        
          
            <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-xs uip-w-280">
            
              <div class="uip-flex uip-flex-between uip-flex-center">
                <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ui.strings.newStyle}}</div>
                
                <div @click="$refs.newcolourdrop.close()" 
                class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">close</span>
                </div>
              </div>
              
              <colourManager :value="{user:true}" :returnData="(d)=>{addNewColorVar(d)}"/>
            
            </div>
          
        </contextmenu>
        
        
        <!-- New Unit dropdown-->
        <contextmenu
        ref="newunitdrop" 
        :snapRight="true"
        :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']"
        :offsetX="-8">
        
          
            <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s uip-w-280">
            
              <div class="uip-flex uip-flex-between uip-flex-center">
                <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ui.strings.newUnit}}</div>
                
                <div @click="$refs.newunitdrop.close()" 
                class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">close</span>
                </div>
              </div>
              
              <div class="uip-grid-col-1-3 uip-padding-left-xs">
                
                <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-no-wrap"><span>{{ ui.strings.styleName }}</span></div>
                <input
                @input="newUnitItem.name = cleanKeyName(newUnitItem.name)"
                class="uip-input uip-flex-grow uip-w-100p" type="text" v-model="newUnitItem.name" :placeholder="ui.strings.styleName" autofocus>
                
                <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-no-wrap"><span>{{ ui.strings.value }}</span></div>
                <value-units :value="splitUnitVal(newUnitItem)" size="xsmall" :returnData="(data)=>{ setUnitVal(data, newUnitItem)}" class="uip-w-100p"></value-units>
              
              </div>
              
              <button @click="addNewUnitVar" class="uip-button-primary" :disabled="!newUnitItem.name">{{ui.strings.create}}</button>
            
            </div>
          
        </contextmenu>
        
        
        <!-- New Text dropdown-->
        <contextmenu
        ref="newtextdrop" 
        :snapRight="true"
        :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']"
        :offsetX="-8">
        
          
            <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s uip-w-280">
            
              <div class="uip-flex uip-flex-between uip-flex-center">
                <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ui.strings.newTextVariable}}</div>
                
                <div @click="$refs.newtextdrop.close()" 
                class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">close</span>
                </div>
              </div>
              
              <div class="uip-grid-col-1-3 uip-padding-left-xs">
                
                <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-no-wrap"><span>{{ ui.strings.styleName }}</span></div>
                <input @input="newUnitItem.name = cleanKeyName(newUnitItem.name)"
                class="uip-input uip-w-100p" type="text" v-model="newUnitItem.name" :placeholder="ui.strings.styleName" autofocus>
                
                <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-no-wrap"><span>{{ ui.strings.value }}</span></div>
                <select class="uip-input uip-w-100p" v-model="newUnitItem.value">
                  <template v-for="font in ui.fonts">
                    <option :value="font.value">{{ font.label }}</option>
                  </template>
                </select>
              
              </div>
              
              <button @click="addNewTextVar" class="uip-button-primary" :disabled="!newUnitItem.name">{{ui.strings.create}}</button>
            
            </div>
          
        </contextmenu>
        
     </div>`,
};
