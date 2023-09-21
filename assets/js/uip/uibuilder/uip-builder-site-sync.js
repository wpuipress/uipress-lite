const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      args: Object,
      triggerClass: String, // Allows custom classes to be set on the trigger container
    },
    data: function () {
      return {
        modelOpen: true,
        themeLoading: false,
        themes: [],
        saving: false,
        finished: false,
        importPath: '',
        fetchingSettings: true,
        strings: {
          siteSync: __('Site sync', 'uipress-lite'),
          hostExplanation: __("Enabling this site as a host allows you to sync other sites to this site's uiPress settings. Please note, rest API needs to be enabled to use this feature."),
          settingsExplanation: __(
            'Choose the sections you sync with a remote site. Enabling auto update will allow uiPress to routinely check for changes at the host site and sync updates.',
            'uipress-lite'
          ),
          templates: __('Templates', 'uipress-lite'),
          siteSettings: __('Site settings', 'uipress-lite'),
          themeStyles: __('Theme styles', 'uipress-lite'),
          adminMenus: __('Admin menus', 'uipress-lite'),
          cancel: __('Cancel', 'uipress-lite'),
          export: __('Export', 'uipress-lite'),
          hostEnabled: __('Host enabled', 'uipress-lite'),
          importPath: __('Import URL', 'uipress-lite'),
          importKey: __('Import key', 'uipress-lite'),
          save: __('Save', 'uipress-lite'),
          refreshKey: __('Refresh key', 'uipress-lite'),
          syncOptions: __('Sync options', 'uipress-lite'),
          autoUpdate: __('Auto update', 'uipress-lite'),
          syncNow: __('Sync now', 'uipress-lite'),
        },
        hostOptions: {
          hostEnabled: false,
          key: '',
        },
        syncOptions: {
          importOptions: {
            templates: true,
            siteSettings: true,
            themeStyles: true,
            adminMenus: true,
          },
          key: '',
          path: '',
          keepUpToDate: false,
        },
        activeTab: 'host',
        switchOptions: {
          host: {
            value: 'host',
            label: __('Host', 'uipress-lite'),
          },
          sync: {
            value: 'sync',
            label: __('Sync', 'uipress-lite'),
          },
        },
      };
    },
    inject: ['uipress', 'uipData', 'uiTemplate', 'router'],
    watch: {
      currentStep: {
        handler(newValue, oldValue) {
          if (newValue == 2) {
            this.fetchThemes();
          }
        },
      },
    },
    created: function () {
      this.getSyncOptions();
    },
    mounted: function () {},
    computed: {
      isDisabledButton() {
        if (!this.syncOptions.importOptions.templates && !this.syncOptions.importOptions.siteSettings && !this.syncOptions.importOptions.themeStyles && !this.syncOptions.importOptions.adminMenus) {
          return true;
        }
      },
    },
    methods: {
      getSyncOptions() {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_get_sync_options');
        formData.append('security', uip_ajax.security);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.fetchingSettings = false;
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }

          self.importPath = response.restURL;

          if (response.options) {
            if ('key' in response.options) {
              self.hostOptions.key = response.options.key;
            }
            if ('hostEnabled' in response.options) {
              self.hostOptions.hostEnabled = response.options.hostEnabled;
            }

            if (!('syncOptions' in response.options)) return;

            if ('importOptions' in response.options.syncOptions) {
              self.syncOptions.importOptions = { ...self.syncOptions.importOptions, ...response.options.syncOptions.importOptions };
            }

            if ('key' in response.options.syncOptions) {
              self.syncOptions.key = response.options.syncOptions.key;
            }

            if ('keepUpToDate' in response.options.syncOptions) {
              self.syncOptions.keepUpToDate = response.options.syncOptions.keepUpToDate;
            }

            if ('path' in response.options.syncOptions) {
              self.syncOptions.path = response.options.syncOptions.path;
            }
          }
        });
      },
      refreshKey() {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_refresh_sync_key');
        formData.append('security', uip_ajax.security);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.fetchingSettings = false;
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          if (response.options) {
            if ('key' in response.options) {
              self.hostOptions.key = response.options.key;
            }
          }
        });
      },
      saveHostSettings() {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_save_sync_options');
        formData.append('security', uip_ajax.security);
        formData.append('options', self.uipress.uipEncodeJson(self.hostOptions));
        formData.append('syncOptions', self.uipress.uipEncodeJson(self.syncOptions));

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.fetchingSettings = false;
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          self.uipress.notify(__('Settings saved', 'uipress-lite'), '', 'success');
        });
      },
      closeThisComponent() {
        document.documentElement.removeEventListener('click', this.onClickOutside, false);
        this.router.push('/');
      },
      syncNow() {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_start_site_sync');
        formData.append('security', uip_ajax.security);
        formData.append('options', JSON.stringify(self.syncOptions));
        let notID = self.uipress.notify(__('Importing uiPress content', 'uipress-lite'), '', 'default', false, true);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          self.uipress.destroy_notification(notID);
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          self.uipress.notify(__('Import complete', 'uipress-lite'), '', 'success');

          self.router.push('/');

          setTimeout(function () {
            location.reload();
          }, 600);
        });
      },
    },
    template: `
    
    
      <div class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in uip-text-normal uip-z-index-1" tabindex="1">
        <div ref="uipmodal" class="uip-background-default uip-border-rounder uip-border uip-flex uip-flex-column uip-row-gap-s uip-scale-in uip-w-400 uip-z-index-1 uip-transition-all uip-padding-s">
          
          
          
          
          <!-- title -->
          <div class="uip-flex uip-flex-between uip-flex-center">
            <div class="uip-text-bold">{{strings.siteSync}}</div>
            <div class="uip-icon uip-link-muted uip-padding-xxs uip-border-round hover:uip-background-muted" @click="closeThisComponent()">close</div>
          </div>
          <!-- end title -->
          
          <choice-select :args="{options:switchOptions}" :value="{value:activeTab}" :returnData="function(d){activeTab = d.value}"/>
          
          <div v-if="fetchingSettings" class="uip-padding-l uip-flex uip-flex-center uip-flex-middle">
            <loading-chart/>
          </div>
          
          <template v-else-if="activeTab == 'host'">
          
            <div class="uip-text-muted">{{strings.hostExplanation}}</div>
            
            <div class="uip-grid-col-1-3 uip-row-gap-s" style="grid-gap:var(--uip-margin-s)">
            
              <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.hostEnabled}}</span></div>
              
              <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                <switch-select :args="{asText: true}" :value="hostOptions.hostEnabled" :returnData="function(d){hostOptions.hostEnabled = d}"/>
              </div>
              
              <template v-if="hostOptions.hostEnabled">
              
                <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.importPath}}</span></div>
                
                <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  <input :value="importPath" class="uip-input-small uip-w-100p" disabled type="text">
                </div>
                
                <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.importKey}}</span></div>
                
                <div class="uip-flex uip-gap-xxs uip-flex-no-wrap uip-flex-center">
                  <input v-model="hostOptions.key" disabled class="uip-input-small uip-w-100p" type="text">
                  <button @click="refreshKey()" :title="strings.refreshKey" class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs">refresh</button>
                </div>
              
              </template>
              
            </div>
            
            <div class="uip-border-top uip-margin-top-xs uip-margin-bottom-xs"></div>
            
            <div class="uip-flex uip-flex-between uip-gap-xs">
              <router-link to="/" class="uip-button-default uip-no-underline">{{strings.cancel}}</router-link>
              
              <button @click="saveHostSettings()" class="uip-button-primary">{{strings.save}}</button>
              
            </div>
          
          </template>
          
          
          <template v-else>
          
            <div class="uip-text-muted">{{strings.settingsExplanation}}</div>
            
            
            <div class="uip-grid-col-1-3 uip-row-gap-s" style="grid-gap:var(--uip-margin-s)">
            
            
              <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.importPath}}</span></div>
              
              <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                <input v-model="syncOptions.path" class="uip-input-small uip-w-100p" type="text">
              </div>
              
              <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.importKey}}</span></div>
              
              <div class="uip-flex uip-gap-xxs uip-flex-no-wrap uip-flex-center">
                <input v-model="syncOptions.key" class="uip-input-small uip-w-100p" type="password">
              </div>
              
            
              <div class="uip-text-muted uip-flex"><span>{{strings.syncOptions}}</span></div>
            
              <div class="uip-flex uip-flex-column uip-row-gap-xs">
                
                <label class="uip-flex uip-gap-xs uip-flex-center">
                  <input class="uip-user-check uip-checkbox uip-margin-remove" v-model="syncOptions.importOptions.templates" type="checkbox">
                  <div class="">{{strings.templates}}</div>
                </label>
                
                <label class="uip-flex uip-gap-xs uip-flex-center">
                  <input class="uip-user-check uip-checkbox uip-margin-remove" v-model="syncOptions.importOptions.siteSettings" type="checkbox">
                  <div class="">{{strings.siteSettings}}</div>
                </label>
                
                <label class="uip-flex uip-gap-xs uip-flex-center">
                  <input class="uip-user-check uip-checkbox uip-margin-remove" v-model="syncOptions.importOptions.themeStyles" type="checkbox">
                  <div class="">{{strings.themeStyles}}</div>
                </label>
                
                <label class="uip-flex uip-gap-xs uip-flex-center">
                  <input class="uip-user-check uip-checkbox uip-margin-remove" v-model="syncOptions.importOptions.adminMenus" type="checkbox">
                  <div class="">{{strings.adminMenus}}</div>
                </label>
              
              </div>
              
              <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.autoUpdate}}</span></div>
              
              <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                <switch-select :args="{asText: true}" :value="syncOptions.keepUpToDate" :returnData="function(d){syncOptions.keepUpToDate = d}"/>
              </div>
              
              
            </div>
            
            <div class="uip-border-top"></div>
            
            <div class="uip-flex uip-flex-between uip-gap-xs">
              <router-link to="/" class="uip-button-default uip-no-underline">{{strings.cancel}}</router-link>
              
              <div class="uip-flex uip-gap-xs">
                <button @click="syncNow()" class="uip-button-secondary">{{strings.syncNow}}</button>
                
                <button @click="saveHostSettings()" class="uip-button-primary" :disabled="isDisabledButton">{{strings.save}}</button>
              </div>
              
            </div>
            
            <a class="uip-hidden" ref="globalExport"></a>
          
          </template>
          
          
        </div>
      </div>
    
    `,
  };
}
