/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
export default {
  components: {
    globalVariables: defineAsyncComponent(() => import("./variables.min.js?ver=3.3.1")),
    LicenceManager: defineAsyncComponent(() => import("./licence-manager.min.js?ver=3.3.1")),
  },
  data() {
    return {
      loading: false,
      globalSettings: {},
      search: "",
      render: true,
      ui: {
        strings: {
          siteSettings: __("Site settings", "uipress-lite"),
          saveSettings: __("Save settings", "uipress-lite"),
          settingsSaved: __("Settings saved", "uipress-lite"),
          proOption: __("This is a pro option. Upgrade to unlock", "uipress-lite"),
          searchSettings: __("Search settings", "uipress-lite"),
          licence: __("Licence", "uipress-lite"),
        },
      },
    };
  },

  mounted() {
    this.loading = false;
    this.getSettings();
  },
  watch: {
    "uiTemplate.globalSettings": {
      handler(newValue, oldValue) {
        return;
        this.checkTemplateApplies();
      },
      deep: true,
    },
    "uiTemplate.globalSettings": {
      handler(newValue, oldValue) {
        return;
        this.checkTemplateApplies();
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Checks if pro plugin is activated
     *
     * @since 3.3.095
     */
    proPluginActivated() {
      let activePlugins = this.uipApp.data.options.activePlugins;
      activePlugins = this.isObject(activePlugins) ? Object.values(activePlugins) : activePlugins;
      return activePlugins.includes("uipress-pro/uipress-pro.php");
    },
  },
  methods: {
    /**
     * Get's settings object
     *
     * @since 3.2.13
     */
    async getSettings() {
      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_get_global_settings");
      formData.append("security", uip_ajax.security);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      this.loading = false;

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      //Get theme options
      await this.getUserStyles();

      if (!response.options) return;
      if (this.isObject(response.options)) {
        if (Object.keys(response.options).length > 0) {
          this.globalSettings = response.options;
        }
      }
    },

    /**
     * Get's user styles
     *
     * @since 3.2.13
     */
    async getUserStyles() {
      //Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_get_ui_styles");
      formData.append("security", uip_ajax.security);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      if (response.error) return;
      if (response.styles) this.uipApp.data.themeStyles = { ...this.uipApp.data.themeStyles, ...response.styles };
    },

    /**
     * Returns template option or it's required default value
     *
     * @param {String} group
     * @param {Object} option
     * @since 3.2.1.3
     */
    returnTemplateOption(group, option) {
      let key = option.uniqueKey;
      let options = this.globalSettings;
      if (!(group in options)) {
        options[group] = {};
      }
      if (key in options[group]) return options[group][key];

      // Set default values
      switch (option.accepts) {
        case String:
          options[group][key] = "";
          break;
        case Array:
          options[group][key] = [];
          break;
        case Object:
          options[group][key] = {};
          break;
        case Boolean:
          options[group][key] = false;
          break;
      }

      return options[group][key];
    },

    /**
     * Saves a template option
     *
     * @param {String} group
     * @param {String} key
     * @param {*} value
     * @since 3.2.13
     */
    saveTemplateOption(group, key, value) {
      let options = this.globalSettings;
      options[group][key] = value;
    },

    /**
     * Saves template settings
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async saveSettings() {
      let sendData = this.prepareJSON(this.globalSettings);

      let formData = new FormData();
      formData.append("action", "uip_save_global_settings");
      formData.append("security", uip_ajax.security);
      formData.append("settings", sendData);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      this.uipApp.notifications.notify(this.ui.strings.settingsSaved, "", "success", true);
    },

    /**
     * Returns options condition if it has one
     *
     * @param {Object} group
     * @since 3.2.13
     */
    conditionalShowGroup(group) {
      if (!("condition" in group)) {
        return true;
      }

      return group.condition(this.globalSettings);
    },

    /**
     * Returns whether an item is in a given search
     *
     * @param {Object} option
     * @since 3.2.13
     */
    inSearch(option) {
      const sq = this.search.toLowerCase();
      const lqN = option.label.toLowerCase();
      const lqDes = option.help.toLowerCase();

      if (lqN.includes(sq) || lqDes.includes(sq)) return true;

      return false;
    },

    /**
     * Exports global settings into a JSON file.
     *
     * @since 3.2.13
     */
    exportSettings() {
      // Prepare the settings data.
      const layout = JSON.stringify({ uipSettings: this.globalSettings });

      // Get today's date in the format: mm-dd-yyyy.
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}-${today.getFullYear()}`;

      // Construct the filename for the exported settings.
      const filename = `uip-site-settings-${formattedDate}.json`;

      // Create a data URI for the JSON content.
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(layout)}`;

      // Set the attributes for the download link and trigger the download.
      const dlAnchorElem = this.$refs.exporter;
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", filename);
      dlAnchorElem.click();

      // Notify the user about the successful export.
      const message = __("Settings exported", "uipress-lite");
      this.uipApp.notifications.notify(message, "", "success", true);
    },

    /**
     * Imports settings from json file
     *
     * @param {Object} event - the file change event
     * @since 3.2.13
     */
    importSettings(event) {
      const notiID = this.uipApp.notifications.notify(__("Importing settings", "uipress-lite"), "", "default", false, true);
      const fileInput = event.target;
      const thefile = fileInput.files[0];

      const handleError = (message) => {
        this.uipApp.notifications.notify(message, "", "error", true, false);
        this.uipApp.notifications.remove(notiID);
      };

      if (thefile.type !== "application/json") {
        return handleError(__("Settings must be in valid JSON format", "uipress-lite"));
      }

      if (thefile.size > 1000000) {
        return handleError(__("Uploaded file is too big", "uipress-lite"));
      }

      const reader = new FileReader();
      reader.readAsText(thefile, "UTF-8");

      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);

          if (!parsed || !parsed.uipSettings || !this.isObject(parsed.uipSettings)) {
            return handleError(__("Settings mismatch", "uipress-lite"));
          }

          this.globalSettings = parsed.uipSettings;

          this.uipApp.notifications.notify(__("Settings imported", "uipress-lite"), "", "success", true, false);
          this.uipApp.notifications.remove(notiID);

          this.render = false;
          this.$nextTick(() => {
            this.render = true;
          });
        } catch (error) {
          handleError(__("JSON parse failed", "uipress-lite"));
        }
      };
    },
  },
  template: `
    
      <uip-floating-panel ref="panel" closeRoute="/" id="uip-global-settings">
      
      
        <!-- Site settings -->
        <div class="uip-flex uip-w-100p uip-h-100p">
        
          <div class="uip-flex uip-flex-column uip-w-100p uip-max-h-100p uip-flex-no-wrap uip-row-gap-m uip-padding-m">
          
            <div class="uip-flex uip-flex-between uip-flex-center">
              <div class="uip-text-l uip-text-emphasis">{{ui.strings.siteSettings}}</div>
              <a @click="$refs.panel.close()" class="uip-link-muted hover:uip-background-muted uip-border-rounder uip-icon uip-padding-xxs">close</a>
            </div>
            
            
            <div v-if="loading" class="uip-w-100p uip-flex uip-flex-middle uip-flex-center uip-padding-s"><loading-chart></loading-chart></div>
            
            <div v-if="!loading" class="uip-border-rounder uip-flex uip-flex-center uip-gap-xs uip-background-muted uip-padding-xs"> 
              <div class="uip-icon uip-icon-l uip-text-muted">search</div>
              <input class="uip-blank-input uip-flex-grow" type="text" v-model="search" :placeholder="ui.strings.searchSettings">
            </div>
            
            <div v-if="!loading" class="uip-flex-grow uip-flex uip-flex-column uip-row-gap-s" style="overflow:auto">
              
              
              
              <!--Searching Dynamic settings -->
              <div  v-if="search != ''" class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-m">
                <template v-for="group in uipApp.data.globalGroupOptions">
                    
                      <!--Loop through group settings -->
                      
                      <template v-for="option in group.settings">
                        <template v-if="conditionalShowGroup(option) && inSearch(option)">
                          <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
                          
                            
                            <div class="uip-flex uip-gap-xxxs uip-flex-center">
                              <div class="uip-text-bold uip-text-muted">{{group.label}}</div>
                              <div class="uip-icon uip-text-muted">chevron_right</div>
                              <div class="uip-text-bold">{{option.label}}</div>
                            </div>
                            <div v-if="option.help" class="uip-text-s uip-text-muted">{{option.help}}</div>
                            
                            <a href="https://uipress.co?utm_source=uipressupgrade&utm_medium=referral" target="_BLANK" v-if="option.proOption" class="uip-padding-xxs uip-border-round uip-background-green-wash uip-text-s uip-link-default uip-no-underline">
                              {{ui.strings.proOption}}
                            </a>
                            
                            <component v-else :is="option.component" :value="returnTemplateOption(group.name, option)" :args="option.args"
                            :returnData="function(data){saveTemplateOption(group.name, option.uniqueKey, data)}" class="uip-inline-flex"></component>
                          
                          </div>
                          
                        </template>
                        
                      </template>
                    
                </template>
              </div>
              
              
              <template v-if="proPluginActivated">
                <accordion v-if="!search" :openOnTick="false" :startOpen="true">
                
                  <template #title>
                    <div class="uip-flex-grow uip-flex uip-gap-xxs uip-flex-center uip-text-bold">
                      <div class="">{{ui.strings.licence}}</div>
                    </div>
                  </template>
                  
                  <template #content>
                  
                    <LicenceManager/>
                  
                  </template>
                
                </accordion>
                
                <div class="uip-border-top"></div>
                
              </template>
              
             
              
              <!-- Dynamic settings -->
              <template v-if="!search" v-for="(group, index) in uipApp.data.globalGroupOptions">
                <accordion :openOnTick="false" v-if="conditionalShowGroup(group)">
                  <template v-slot:title>
                    <div class="uip-flex-grow uip-flex uip-gap-xxs uip-flex-center uip-text-bold">
                      <div class="">{{group.label}}</div>
                    </div>
                  </template>
                  <template v-slot:content>
                    <div class="uip-padding-xs uip-padding-left-m uip-flex uip-flex-column uip-row-gap-s">
                      <!--Loop through group settings -->
                      
                      <template v-for="option in group.settings" v-if="render">
                        <div v-if="conditionalShowGroup(option)"  class="uip-grid-col-4-6">
                          
                          <div class="uip-flex uip-flex-center uip-gap-xs uip-h-30">
                          
                              <div class="uip-text-muted uip-flex uip-flex-center uip-flex uip-gap-xs uip-position-relative">
                              
                                
                                
                                <dropdown v-if="option.help" pos="left center" :openOnHover="true" class="uip-flex-no-shrink uip-position-absolute uip-left--32" :hover="true">
                                  <template class="uip-flex-no-shrink" v-slot:trigger>
                                    <div class="uip-link-muted hover:uip-background-grey uip-text-center uip-border-round uip-background-muted uip-text-bold uip-text-xs uip-w-16 uip-ratio-1-1 uip-text-s uip-flex-no-shrink">i</div>
                                  </template>
                                  <template v-slot:content>
                                    <div class="uip-text-s uip-padding-xs uip-max-w-200">{{option.help}}</div>
                                  </template>
                                </dropdown>
                                
                                <span>{{option.label}}</span>
                                
                              </div>
                            
                          </div>
                          
                          
                          <div class="uip-w-100p">
                            <a href="https://uipress.co?utm_source=uipressupgrade&utm_medium=referral" target="_BLANK" v-if="option.proOption" class="uip-padding-xxs uip-border-round uip-background-green-wash uip-text-s uip-link-default uip-no-underline uip-w-100p uip-text-center uip-flex">
                              {{ui.strings.proOption}}
                            </a>
                            <component v-else :is="option.component" :value="returnTemplateOption(group.name, option)" :args="option.args"
                            :returnData="function(data){saveTemplateOption(group.name, option.uniqueKey, data)}"></component>
                          </div>
                        
                        </div>
                        
                      </template>
                      
                      <template v-if="group.name == 'theme'">
                        <globalVariables/>
                      </template>
                      <!--End loop through group settings -->
                    </div>
                  </template>
                </accordion>
                <div class="uip-border-top" v-if="conditionalShowGroup(group)"></div>
              </template>
              <!-- End dynamic settings -->
            </div>
            
            <div v-if="!loading" class="uip-flex uip-flex-between">
            
              <div class="uip-flex uip-gap-xs">
                <button class="uip-button-default uip-icon" @click="exportSettings()">download</button>
                <a class="uip-hidden" ref="exporter"></a>
                
                <label class="uip-button-default">
                  
                  <div class="uip-icon">upload</div>
                  <input hidden accept=".json" type="file" single="" id="uip-import-layout" @change="importSettings($event)">
                  
                </label>
              </div>
            
              <button class="uip-button-primary" @click="saveSettings()">{{ui.strings.saveSettings}}</button>
              
            </div>
            
            
          </div>
        </div>
        
        <!-- site settings -->
      
      </uip-floating-panel>
      `,
};
