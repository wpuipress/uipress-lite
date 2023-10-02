import { nextTick } from '../../libs/vue-esm-dev.js';
export default {
  props: {},
  data: function () {
    return {
      template: {
        display: 'prod',
        notifications: [],
        settings: null,
        content: null,
        globalSettings: null,
        updated: null,
        id: null,
      },
      loading: true,
      updateAvailable: false,
      windowWidth: window.innerWidth,
    };
  },
  provide() {
    return {
      uiTemplate: this.template,
    };
  },
  created() {
    this.initiateApp();
  },
  async mounted() {
    await this.mountEventListeners();
    await nextTick();
    this.loading = false;
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    document.removeEventListener('uip_page_change_loaded', this.getNotifications, { once: false });
  },
  computed: {
    /**
     * Returns template javascript if it exists
     *
     * @since 3.2.13
     */
    returnTemplateJS() {
      if (typeof this.template.globalSettings.options === 'undefined') return;
      return this.hasNestedPath(this.template, 'globalSettings', 'options', 'advanced', 'js');
    },

    /**
     * Returns template css if it exists
     *
     * @since 3.2.13
     */
    returnTemplateCSS() {
      if (typeof this.template.globalSettings.options === 'undefined') return;
      return this.hasNestedPath(this.template, 'globalSettings', 'options', 'advanced', 'css');
    },

    /**
     * Returns the current responsive class for the app
     *
     * @since 3.2.13
     */
    returnResponsiveClass() {
      if (this.windowWidth >= 990) return 'uip-desktop-view';
      if (this.windowWidth >= 699) return 'uip-tablet-view';
      if (this.windowWidth < 699) return 'uip-phone-view';
    },

    /**
     * Returns the current loading state of the app
     *
     * @returns {boolean}
     * @since 3.2.13
     */
    isLoading() {
      return this.loading;
    },
  },
  methods: {
    /**
     * Sets up and parses main app data
     *
     * @since 3.2.13
     */
    initiateApp() {
      this.template.settings = this.uipParseJson(JSON.stringify(uipUserTemplate.settings));
      this.template.content = this.uipParseJson(JSON.stringify(uipUserTemplate.content));
      this.template.globalSettings = this.uipParseJson(JSON.stringify(uipUserTemplate.settings));
      this.template.updated = this.uipParseJson(uipUserTemplate.updated);
      this.template.id = uipUserTemplate.id;
    },
    /**
     * mounts app events listeners
     *
     * @since 3.2.13
     */
    mountEventListeners() {
      window.addEventListener('resize', this.handleWindowResize);
      document.addEventListener('uip_page_change_loaded', this.getNotifications, { once: false });

      // Check if it's a ui template and watch for updates
      if (this.template.globalSettings.type != 'ui-template') return;
      setInterval(this.checkForUpdates, 60000);
    },

    /**
     * Handles window resize event
     *
     * @since 3.2.13
     */
    handleWindowResize() {
      this.windowWidth = window.innerWidth;
    },

    /**
     * Gets notifications from frames
     *
     * @since 3.2.13
     */
    getNotifications() {
      const frame = document.querySelector('.uip-page-content-frame');
      //Frame does not exist so abort
      let notifications;

      // Get notifications from frame or current document
      const searchDocument = frame ? frame.contentWindow.document : document;
      notifications = searchDocument.querySelectorAll('.notice:not(#message):not(.inline):not(.update-message),.wp-analytify-notification');
      if (!notifications) return;

      this.template.notifications = [];

      let notiActive = false;
      const stringTemplate = JSON.stringify(this.template.content);
      if (stringTemplate.includes('site-notifications')) notiActive = true;

      for (const noti of notifications) {
        this.template.notifications.push(noti.outerHTML.replace('uip-framed-page=1', ''));
        if (notiActive) {
          noti.setAttribute('style', 'display:none !important; visibility: hidden !important; opacity: 0 !important;');
        }
      }

      this.uipApp.data.dynamicOptions.notificationCount.value = this.template.notifications.length;
    },

    /**
     * Checks for updates
     *
     * @since 3.2.13
     */
    async checkForUpdates() {
      // Exit if there is already an update
      if (this.updateAvailable) return;

      let formData = new FormData();
      formData.append('action', 'uip_check_for_template_updates');
      formData.append('security', uip_ajax.security);
      formData.append('template_id', this.template.id);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      if (!response.success) return;
      if (response.updated > this.template.updated) {
        this.updateAvailable = true;
        this.updateNotification();
      }
    },

    /**
     * Pushes a new update notification
     *
     * @since 3.2.13
     */
    updateNotification() {
      let string = __('Changes have been made to your current app. Refresh the page to update', 'uipress-lite');
      this.uipApp.notifications.notify(__('Update available', 'uipress-lite'), string, '', true);
    },

    /**
     * Checks if a component exists
     *
     * @param {String} name - the name of the component to check
     * @since 3.2.13
     */
    componentExists(name) {
      if (this.$root._.appContext.components[name]) {
        return true;
      } else {
        return false;
      }
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
    <template v-for="plugin in uipApp.data.plugins">
      <component v-if="componentExists(plugin.component) && plugin.loadInApp"
      :is="plugin.component">
      </component>
    </template>
    <!-- end plugin import -->`,
};
