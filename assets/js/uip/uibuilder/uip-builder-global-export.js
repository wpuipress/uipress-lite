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
        strings: {
          globalExport: __('Global export'),
          settingsExplanation: __(
            'Choose the sections you wish to export to another site and click export to generate a file containing all of uiPress settings, templates, menus and theme styles',
            'uipress-lite'
          ),
          templates: __('Templates', 'uipress-lite'),
          siteSettings: __('Site settings', 'uipress-lite'),
          themeStyles: __('Theme styles', 'uipress-lite'),
          adminMenus: __('Admin menus', 'uipress-lite'),
          cancel: __('Cancel', 'uipress-lite'),
          export: __('Export', 'uipress-lite'),
        },
        exportOptions: {
          templates: true,
          siteSettings: true,
          themeStyles: true,
          adminMenus: true,
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
    mounted: function () {},
    computed: {
      isDisabledButton() {
        if (!this.exportOptions.templates && !this.exportOptions.siteSettings && !this.exportOptions.themeStyles && !this.exportOptions.adminMenus) {
          return true;
        }
      },
    },
    methods: {
      closeThisComponent() {
        document.documentElement.removeEventListener('click', this.onClickOutside, false);
        this.router.push('/');
      },
      exportEverything() {
        let self = this;

        let formData = new FormData();
        formData.append('action', 'uip_global_export');
        formData.append('security', uip_ajax.security);
        formData.append('options', JSON.stringify(self.exportOptions));
        let notID = self.uipress.notify(__('Exporting uiPress content', 'uipress-lite'), '', 'default', false, true);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            self.uipress.notify(response.message, '', 'error', true);
            return;
          }
          self.downloadExport(response.export, notID);
        });
      },
      downloadExport(exported, notID) {
        self = this;
        let namer = 'uip-global-export-';
        let formateExport = self.uipress.uipEncodeJson({ uipGlobalExport: exported });

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear();

        let date_today = mm + '-' + dd + '-' + yyyy;
        let filename = namer + '-' + date_today + '.json';

        let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(formateExport);
        let dlAnchorElem = self.$refs.globalExport;
        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute('download', filename);
        dlAnchorElem.click();

        self.uipress.notify(__('Export complete', 'uipress-lite'), '', 'success');
        self.uipress.destroy_notification(notID);
      },
    },
    template: `
    
    
      <div class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in uip-text-normal uip-z-index-1" tabindex="1">
        <div ref="uipmodal" class="uip-background-default uip-border-rounder uip-border uip-flex uip-flex-column uip-row-gap-s uip-scale-in uip-w-400 uip-z-index-1 uip-transition-all uip-padding-s">
          
          
          <!-- title -->
          <div class="uip-flex uip-flex-between uip-flex-center">
            <div class="uip-text-bold">{{strings.globalExport}}</div>
            <div class="uip-icon uip-link-muted uip-padding-xxs uip-border-round hover:uip-background-muted" @click="closeThisComponent()">close</div>
          </div>
          <!-- end title -->
          
          <div class="uip-border-top"></div>
          
          <div class="uip-text-muted">{{strings.settingsExplanation}}</div>
          
          <div class="uip-flex uip-flex-column uip-row-gap-xs">
            
            <label class="uip-flex uip-gap-xs uip-flex-center">
              <input class="uip-user-check uip-checkbox uip-margin-remove" v-model="exportOptions.templates" type="checkbox">
              <div class="">{{strings.templates}}</div>
            </label>
            
            <label class="uip-flex uip-gap-xs uip-flex-center">
              <input class="uip-user-check uip-checkbox uip-margin-remove" v-model="exportOptions.siteSettings" type="checkbox">
              <div class="">{{strings.siteSettings}}</div>
            </label>
            
            <label class="uip-flex uip-gap-xs uip-flex-center">
              <input class="uip-user-check uip-checkbox uip-margin-remove" v-model="exportOptions.themeStyles" type="checkbox">
              <div class="">{{strings.themeStyles}}</div>
            </label>
            
            <label class="uip-flex uip-gap-xs uip-flex-center">
              <input class="uip-user-check uip-checkbox uip-margin-remove" v-model="exportOptions.adminMenus" type="checkbox">
              <div class="">{{strings.adminMenus}}</div>
            </label>
          
          </div>
          
          <div class="uip-border-top"></div>
          
          <div class="uip-flex uip-flex-between uip-gap-xs">
            <router-link to="/" class="uip-button-default uip-no-underline">{{strings.cancel}}</router-link>
            
            <button @click="exportEverything()" class="uip-button-primary" :disabled="isDisabledButton">{{strings.export}}</button>
            
          </div>
          
          <a class="uip-hidden" ref="globalExport"></a>
          
          
        </div>
      </div>
    
    `,
  };
}
