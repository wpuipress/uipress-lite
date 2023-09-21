export function moduleData() {
  return {
    props: {},
    inject: ['uipData', 'router', 'uipress'],
    data: function () {
      return {
        template: {
          display: 'prod',
          notifications: [],
          settings: this.formatTemplate(uipUserTemplate.settings),
          content: this.formatTemplate(uipUserTemplate.content),
          globalSettings: this.formatTemplate(uipUserTemplate.settings),
          updated: this.formatTemplate(uipUserTemplate.updated),
          id: uipUserTemplate.id,
          styles: uipUserStyles,
          iconFile: './',
        },
        loading: true,
        updateAvailable: false,
        blocksForUpdating: [],
        windowWidth: window.innerWidth,
        iconsLoading: true,
      };
    },
    watch: {
      'blocksForUpdating': {
        handler(newValue, oldValue) {
          let self = this;
          if (!self.updating) {
            self.updating = true;
            self.uipress.updateBlocksV312(self.blocksForUpdating).then((response) => {
              for (let holder of self.blocksForUpdating) {
                let index = self.blocksForUpdating.findIndex((item) => item.uid === holder.uid);
                if (index > -1) {
                  self.blocksForUpdating.splice(index, 1);
                }
              }
              self.blocksForUpdating = [];
              requestAnimationFrame(() => {
                self.updating = false;
              });
              //self.items = response;
            });
          }
        },
      },
    },
    provide() {
      return {
        uiTemplate: this.template,
      };
    },
    mounted: function () {
      let self = this;

      self.blocksForUpdating = [];
      self.uipress.findOutdatedBlocks(self.template.content, self.blocksForUpdating);

      requestAnimationFrame(() => {
        self.loading = false;
      });

      if (this.template.globalSettings.type == 'ui-template') {
        setInterval(function () {
          self.checkForUpdates();
        }, 60000);
      }

      window.addEventListener('resize', function () {
        self.windowWidth = window.innerWidth;
      });

      document.addEventListener(
        'uip_page_change_loaded',
        (e) => {
          self.getNotifications();
        },
        { once: false }
      );
    },
    computed: {
      returnTemplateJS() {
        if (typeof this.template.globalSettings.options === 'undefined') {
          return;
        }
        if ('advanced' in this.template.globalSettings.options) {
          if ('js' in this.template.globalSettings.options.advanced) {
            return this.template.globalSettings.options.advanced.js;
          }
        }
      },
      returnTemplateCSS() {
        if (typeof this.template.globalSettings.options === 'undefined') {
          return;
        }
        if ('advanced' in this.template.globalSettings.options) {
          if ('css' in this.template.globalSettings.options.advanced) {
            return this.template.globalSettings.options.advanced.css;
          }
        }
      },
      returnResponsiveClass() {
        if (this.windowWidth >= 990) {
          return 'uip-desktop-view';
        }
        if (this.windowWidth >= 699) {
          return 'uip-tablet-view';
        }
        if (this.windowWidth < 699) {
          return 'uip-phone-view';
        }
      },
      isLoading() {
        if (!this.loading) {
          return false;
        }
        return true;
      },
    },
    methods: {
      getNotifications() {
        let self = this;
        //Get frame
        let frames = document.getElementsByClassName('uip-page-content-frame');
        //Frame does not exist so abort
        let notifications;

        if (!frames[0]) {
          notifications = document.querySelectorAll('.notice:not(#message):not(.inline):not(.update-message),.wp-analytify-notification');
        } else {
          let contentframe = frames[0];
          notifications = contentframe.contentWindow.document.querySelectorAll('.notice:not(#message):not(.inline):not(.update-message),.wp-analytify-notification');
        }

        this.template.notifications = [];
        if (!notifications) return;

        let notiActive = false;
        if (JSON.stringify(self.template.content).includes('site-notifications')) {
          notiActive = true;
        }

        for (const noti of notifications) {
          this.template.notifications.push(noti.outerHTML.replace('uip-framed-page=1', ''));
          if (notiActive) {
            noti.setAttribute('style', 'display:none !important; visibility: hidden !important; opacity: 0 !important;');
          }
        }

        this.uipData.dynamicOptions.notificationCount.value = this.template.notifications.length;
      },
      checkForUpdates() {
        let self = this;

        if (this.updateAvailable) {
          return;
        }

        let formData = new FormData();
        formData.append('action', 'uip_check_for_template_updates');
        formData.append('security', uip_ajax.security);
        formData.append('template_id', self.template.id);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          if (response.error) {
            //self.uipress.notify(response.message, 'uipress-lite', '', 'error', true);
            //self.saving = false;
          }
          if (response.success) {
            if (response.updated > self.template.updated) {
              this.updateAvailable = true;
              self.updateNotification();
              return;
            }
          }
        });
      },
      updateNotification() {
        let string = __('Changes have been made to your current app. Refresh the page to update', 'uipress-lite');
        let update = __('Update', 'uipress-lite');

        let message = `
        <div class="uip-margin-bottom-s uip-margin-top-xs uip-max-w-260">${string}</div>
        <button class="uip-button-primary" type='button' onclick="location.reload()">${update}</button>
        `;

        this.uipress.notify(__('Update available', 'uipress-lite'), message, '', true);
      },
      formatTemplate(template) {
        return this.uipress.uipParsJson(JSON.stringify(template));
      },
      componentExists(name) {
        if (this.$root._.appContext.components[name]) {
          return true;
        } else {
          return false;
        }
      },
      appReady() {
        let self = this;
        self.iconsLoading = false;
      },
    },

    template: `
    
    <component is="style" scoped >
      .uip-user-frame:not(.uip-app-frame){
        <template v-for="(item, index) in template.styles">
          <template v-if="item.value">{{index}}:{{item.value}};</template>
        </template>
      }
      [data-theme="dark"] :not(.uip-app-frame) *{
        <template v-for="(item, index) in template.styles">
          <template v-if="item.darkValue"> {{index}}:{{item.darkValue}};</template>
        </template>
      }
      {{returnTemplateCSS}}
    </component>
    
    <component is="script" scoped>
      {{returnTemplateJS}}
    </component>
    
    <component is="style">
      .v-enter-active, .v-leave-active {transition: opacity 0.6s ease;}
      .v-enter-from, .v-leave-to {opacity: 0;}
    </component>
    
    <!--<link rel="stylesheet" :href="uipData.options.pluginURL + 'assets/css/uip-icons.css'" id="uip-icons" @load="appReady">-->
    
    <TransitionGroup>
    
      <div v-if="isLoading" class="uip-background-default uip-body-font uip-h-viewport uip-max-h-viewport uip-flex uip-flex-center uip-flex-middle uip-position-fixed uip-z-index-9" 
      style="min-height: 100vh; max-height: 100vh; min-width: 100vw; max-width: 100vw">
        <loading-chart></loading-chart>
      </div>
      
      <uip-content-area v-else :content="template.content" :class="returnResponsiveClass"
      :returnData="function(data) {template.content = data} ">
      </uip-content-area>
    
    </TransitionGroup>
    
   
    
    
    
    <!--Import plugins -->
    <template v-for="plugin in uipData.plugins">
      <component v-if="componentExists(plugin.component) && plugin.loadInApp"
      :is="plugin.component">
      </component>
    </template>
    <!-- end plugin import -->`,
  };
}
