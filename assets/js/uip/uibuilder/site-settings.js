/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    globalVariables: defineAsyncComponent(() => import('./variables.min.js?ver=3.2.12')),
  },
  data() {
    return {
      loading: false,
      globalSettings: {},
      search: '',
      render: true,
      ui: {
        strings: {
          siteSettings: __('Site settings', 'uipress-lite'),
          saveSettings: __('Save settings', 'uipress-lite'),
          settingsSaved: __('Settings saved', 'uipress-lite'),
          proOption: __('This is a pro option. Upgrade to unlock', 'uipress-lite'),
          searchSettings: __('Search settings', 'uipress-lite'),
        },
      },
    };
  },
  inject: ['uipData', 'uipress'],
  mounted() {
    this.loading = false;
    this.getSettings();
    console.log('cheese');
  },
  watch: {
    'uiTemplate.globalSettings': {
      handler(newValue, oldValue) {
        return;
        this.checkTemplateApplies();
      },
      deep: true,
    },
    'uiTemplate.globalSettings': {
      handler(newValue, oldValue) {
        return;
        this.checkTemplateApplies();
      },
      deep: true,
    },
  },
  computed: {
    returnGlobalSettings() {
      return this.globalSettings;
    },
  },
  methods: {
    getSettings() {
      let self = this;
      self.loading = true;

      let formData = new FormData();
      formData.append('action', 'uip_get_global_settings');
      formData.append('security', uip_ajax.security);

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        self.loading = false;
        if (response.error) {
          self.uipress.notify(response.message, '', 'error', true);
          return;
        }

        //Get theme options
        this.getUserStyles();

        if (response.options) {
          if (self.isObject(response.options)) {
            if (Object.keys(response.options).length > 0) {
              self.globalSettings = response.options;
            }
          }
        }
      });
    },
    getUserStyles() {
      let self = this;

      //Build form data for fetch request
      let formData = new FormData();
      formData.append('action', 'uip_get_ui_styles');
      formData.append('security', uip_ajax.security);

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          return;
        }

        if (response.styles) {
          self.injectSavedStyles(response.styles);
        }
      });
    },
    injectSavedStyles(styles) {
      let themeStyles = this.uipData.themeStyles;
      for (let key in themeStyles) {
        let item = themeStyles[key];

        if (styles[item.name]) {
          if ('value' in styles[item.name]) {
            item.value = styles[item.name].value;
          }
          if ('darkValue' in styles[item.name]) {
            item.darkValue = styles[item.name].darkValue;
          }
        }
      }

      for (let key in styles) {
        let item = styles[key];
        if (item.user) {
          this.uipData.themeStyles[item.name] = item;
        }
      }
    },
    returnTemplateOption(group, option) {
      let key = option.uniqueKey;
      let options = this.globalSettings;
      if (!(group in options)) {
        options[group] = {};
      }
      if (!(key in options[group])) {
        if (option.accepts === String) {
          options[group][key] = '';
        }
        if (option.accepts === Array) {
          options[group][key] = [];
        }
        if (option.accepts === Object) {
          options[group][key] = {};
        }
        if (option.accepts === Boolean) {
          options[group][key] = false;
        }
      }
      return options[group][key];
    },
    saveTemplateOption(group, key, value) {
      let options = this.globalSettings;
      options[group][key] = value;
    },
    saveSettings() {
      let self = this;

      let sendData = self.uipress.uipEncodeJson(self.globalSettings);

      let formData = new FormData();
      formData.append('action', 'uip_save_global_settings');
      formData.append('security', uip_ajax.security);
      formData.append('settings', sendData);

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          self.uipress.notify(response.message, '', 'error', true);
          return;
        }

        self.uipress.notify(self.ui.strings.settingsSaved, '', 'success', true);
      });
    },
    conditionalShowGroup(group) {
      if (!('condition' in group)) {
        return true;
      }

      return group.condition(this.globalSettings);
    },
    inSearch(option) {
      let sq = this.search.toLowerCase();
      let lqN = option.label.toLowerCase();
      let lqDes = option.help.toLowerCase();

      if (lqN.includes(sq) || lqDes.includes(sq)) {
        return true;
      }
      return false;
    },
    exportSettings() {
      self = this;
      let layout;
      let namer = 'uip-site-settings-';
      layout = JSON.stringify({ uipSettings: self.globalSettings });

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();

      let date_today = mm + '-' + dd + '-' + yyyy;
      let filename = namer + '-' + date_today + '.json';

      let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(layout);
      let dlAnchorElem = this.$refs.exporter;
      dlAnchorElem.setAttribute('href', dataStr);
      dlAnchorElem.setAttribute('download', filename);
      dlAnchorElem.click();

      let message = __('Settings exported', 'uipress-lite');
      self.uipress.notify(message, '', 'success', true);
    },
    importSettings() {
      let self = this;
      let notiID = self.uipress.notify(__('Importing settings', 'uipress-lite'), '', 'default', false, true);
      let fileInput = event.target;
      let thefile = fileInput.files[0];

      if (thefile.type != 'application/json') {
        self.uipress.notify(__('Settings must be in valid JSON format', 'uipress-lite'), '', 'error', true, false);
        self.uipress.destroy_notification(notiID);
        return;
      }

      if (thefile.size > 1000000) {
        self.uipress.notify(__('Uploaded file is too big', 'uipress-lite'), '', 'error', true, false);
        self.uipress.destroy_notification(notiID);
        return;
      }

      let reader = new FileReader();
      reader.readAsText(thefile, 'UTF-8');

      reader.onload = function (evt) {
        let json_settings = evt.target.result;
        let parsed;

        //Check for valid JSON data
        try {
          parsed = JSON.parse(json_settings);
        } catch (error) {
          self.uipress.notify(error, '', 'error', true, false);
          self.uipress.destroy_notification(notiID);
          return;
        }

        if (parsed != null) {
          if (!Array.isArray(parsed) && !self.isObject(parsed)) {
            self.uipress.notify('Settings is not valid', '', 'error', true, false);
            self.uipress.destroy_notification(notiID);
            return;
          }

          let temper;

          if ('uipSettings' in parsed) {
            if (self.isObject(parsed.uipSettings)) {
              temper = parsed.uipSettings;
            } else {
              self.uipress.notify(__('Settings mismatch', 'uipress-lite'), '', 'error', true, false);
              self.uipress.destroy_notification(notiID);
              return;
            }
          } else {
            self.uipress.notify(__('Settings mismatch', 'uipress-lite'), '', 'error', true, false);
            self.uipress.destroy_notification(notiID);
            return;
          }

          self.globalSettings = temper;
          self.uipress.notify(__('Settings imported', 'uipress-lite'), '', 'success', true, false);
          self.uipress.destroy_notification(notiID);

          self.render = false;
          requestAnimationFrame(() => {
            self.render = true;
          });
          return;
        } else {
          self.uipress.notify(__('JSON parse failed', 'uipress-lite'), '', 'error', true, false);
          self.uipress.destroy_notification(notiID);
        }
      };
    },
  },
  template: `
    
      <uip-floating-panel closeRoute="/" id="uip-global-settings">
      
      
        <!-- Site settings -->
        <div class="uip-flex uip-w-100p uip-h-100p">
        
          <div class="uip-flex uip-flex-column uip-w-100p uip-max-h-100p uip-flex-no-wrap uip-row-gap-xs ">
          
            <div class="uip-text-l uip-text-emphasis uip-padding-m uip-padding-remove-bottom">{{ui.strings.siteSettings}}</div>
            
            <div class="uip-padding-m uip-padding-remove-bottom  uip-padding-remove-top">
              <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
            </div>
            
            <div v-if="loading" class="uip-w-100p uip-flex uip-flex-middle uip-flex-center uip-padding-s"><loading-chart></loading-chart></div>
            
            <div v-if="!loading" class="uip-flex-grow uip-flex uip-flex-column uip-row-gap-s uip-overflow-auto uip-padding-m uip-padding-remove-bottom  uip-padding-remove-top">
            
            
              <div class="uip-border-round uip-flex uip-flex-center uip-gap-xs uip-margin-bottom-xs uip-margin-top-xs"> 
                <div class="uip-icon uip-icon-l uip-text-muted">search</div>
                <input class="uip-blank-input uip-flex-grow" type="text" v-model="search" :placeholder="ui.strings.searchSettings">
              </div>
              
              
              
              <!--Searching Dynamic settings -->
              <div  v-if="search != ''" class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-m">
                <template v-for="group in uipData.globalGroupOptions">
                    
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
                            :returnData="function(data){saveTemplateOption(group.name, option.uniqueKey, data)}"></component>
                          
                          </div>
                          
                          <div class="uip-border-top"></div>
                        </template>
                        
                      </template>
                    
                </template>
              </div>
              
              
              <!-- Dynamic settings -->
              <template v-else v-for="(group, index) in uipData.globalGroupOptions">
                <accordion :openOnTick="false" v-if="conditionalShowGroup(group)">
                  <template v-slot:title>
                    <div class="uip-flex-grow uip-flex uip-gap-xxs uip-flex-center uip-text-bold">
                      <div class="">{{group.label}}</div>
                    </div>
                  </template>
                  <template v-slot:content>
                    <div class="uip-padding-xs uip-padding-left-s uip-flex uip-flex-column uip-row-gap-s">
                      <!--Loop through group settings -->
                      
                      <template v-for="option in group.settings" v-if="render">
                        <div v-if="conditionalShowGroup(option)"  class="uip-grid-col-4-6">
                          
                          <div class="uip-flex uip-flex-center uip-gap-xs uip-h-30">
                          
                              <div class="uip-text-muted uip-flex uip-flex-center uip-flex uip-gap-xs">
                              
                                
                                
                                <dropdown v-if="option.help" pos="left center" :openOnHover="true" class="uip-flex-no-shrink" triggerClass="uip-flex-no-shrink" :hover="true">
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
            
            <div v-if="!loading" class="uip-flex uip-flex-between uip-padding-m">
            
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
