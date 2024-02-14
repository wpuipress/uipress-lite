const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm.js';
export default {
  components: {
    Modal: defineAsyncComponent(() => import('../v3.5/utility/modal.min.js?ver=3.3.1')),
  },
  props: {
    args: Object,
    triggerClass: String, // Allows custom classes to be set on the trigger container
  },
  data() {
    return {
      modelOpen: true,
      themeLoading: false,
      themes: [],
      saving: false,
      finished: false,
      validDrop: false,
      strings: {
        globalImport: __('Global import'),
        settingsExplanation: __('If you have global exported uiPress on another site then drag and select the .json file below to import.', 'uipress-lite'),
      },
    };
  },
  
  watch: {
    currentStep: {
      handler(newValue, oldValue) {
        if (newValue == 2) {
          this.fetchThemes();
        }
      },
    },
  },
  computed: {
    /**
     * Returns whether the submit button is enabled
     *
     * @returns {boolean}
     * @since 3.2.13
     */
    isDisabledButton() {
      if (!this.exportOptions.templates && !this.exportOptions.siteSettings && !this.exportOptions.themeStyles && !this.exportOptions.adminMenus) {
        return true;
      }
    },
  },
  methods: {
    /**
     * Imports from JSON file
     *
     * @param {Object} evt - File change event
     * @param {Boolean} dragged - Wheteher it was dragged in or from file input
     * @since 3.2.13
     */
    importEverything(evt, dragged) {
      this.validDrop = false;

      const notificationID = this.uipApp.notifications.notify(__('Importing uiPress content', 'uipress-lite'), '', 'default', false, true);
      let thefile;

      if (dragged) {
        thefile = evt.dataTransfer.files[0];
      } else {
        let fileInput = event.target;
        thefile = fileInput.files[0];
      }

      if (thefile.type != 'application/json') {
        this.uipApp.notifications.notify(__('Global exports must be in valid JSON format', 'uipress-lite'), '', 'error', true, false);
        this.uipApp.notifications.remove(notificationID);
        return;
      }

      let reader = new FileReader();
      reader.readAsText(thefile, 'UTF-8');

      reader.onload = (evt) => this.handleReaderLoad(evt, notificationID);
    },

    /**
     * Handles read loaded event. Attempts to parse JSON and imports
     *
     * @param {Object} evt - Reader load event
     * @since 3.2.13
     */
    handleReaderLoad(evt, notificationID) {
      let json_settings = evt.target.result;
      let parsed;

      //Check for valid JSON data
      try {
        parsed = JSON.parse(json_settings);
      } catch (error) {
        this.uipApp.notifications.notify(error, '', 'error', true, false);
        this.uipApp.notifications.remove(notificationID);
        return;
      }

      //Empty file
      if (!parsed) {
        this.uipApp.notifications.notify(__('JSON parse failed', 'uipress-lite'), '', 'error', true, false);
        this.uipApp.notifications.remove(notificationID);
        return;
      }
      //Invalid format
      if (!Array.isArray(parsed) && !this.isObject(parsed)) {
        this.uipApp.notifications.notify('Export is not valid', '', 'error', true, false);
        this.uipApp.notifications.remove(notificationID);
        return;
      }

      let temper = false;
      if ('uipGlobalExport' in parsed) {
        temper = parsed.uipGlobalExport;
      } else {
        this.uipApp.notifications.notify(__('Template mismatch', 'uipress-lite'), '', 'error', true, false);
        this.uipApp.notifications.remove(notificationID);
        return;
      }

      this.sendImportToServer(temper, notificationID);
    },

    /**
     * Sends imported data to server
     *
     * @param {Object} temper - New settings
     * @param {type} notificationID
     * @since 3.2.13
     */
    async sendImportToServer(temper, notificationID) {
      let formData = new FormData();
      formData.append('action', 'uip_global_import');
      formData.append('security', uip_ajax.security);
      formData.append('content', JSON.stringify(temper));

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle errpr
      if (response.error) {
        this.uipApp.notifications.notify(response.message, '', 'error', true);
        return;
      }

      this.uipApp.notifications.notify(__('Content imported succesfully', 'uipress-lite'), '', 'success');
      this.uipApp.notifications.remove(notificationID);

      this.$router.push('/');

      setTimeout(function () {
        location.reload();
      }, 600);
    },
  },
  template: `
    
    
    <Modal :startOpen="true" ref="globalimportwrap">
      
      <div ref="uipmodal" class="uip-flex uip-flex-column uip-row-gap-m uip-w-400 uip-padding-m">
          
          
          <!-- title -->
          <div class="uip-flex uip-flex-between uip-flex-center">
            <div class="uip-text-bold">{{strings.globalImport}}</div>
            <div class="uip-icon uip-link-muted uip-padding-xxs uip-border-round hover:uip-background-muted" @click="$refs.globalimportwrap.close();this.$router.push('/');">close</div>
          </div>
          <!-- end title -->
          
          <div class="uip-text-muted">{{strings.settingsExplanation}}</div>
          
          
          <label @drop.prevent="importEverything($event, true)"
          @dragenter.prevent="validDrop = true"
          @dragleave.prevent="validDrop = false"
          @dragover.prevent="validDrop = true"
          :class="{'uip-background-primary-wash' : validDrop, 'uip-background-muted' : !validDrop,  }"
          class="uip-background-muted uip-border uip-border-rounder uip-padding-m uip-flex uip-flex-middle uip-flex-center uip-transition-all uip-link-muted">
            
            <div class="uip-icon uip-text-xl">file_upload</div>
            <input hidden accept=".json" type="file" single="" id="uip-import-layout" @change="importEverything($event)">
            
          </label>
          
          
        </div>
        
      </Modal>
    
    `,
};
