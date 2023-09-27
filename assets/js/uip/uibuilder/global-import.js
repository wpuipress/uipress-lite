const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    Modal: defineAsyncComponent(() => import('../v3.5/utility/modal.min.js?ver=3.2.12')),
  },
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
      validDrop: false,
      strings: {
        globalImport: __('Global import'),
        settingsExplanation: __('If you have global exported uiPress on another site then drag and select the .json file below to import.', 'uipress-lite'),
      },
    };
  },
  inject: ['uipress', 'uipData'],
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
    importEverything(evt, dragged) {
      let self = this;
      self.validDrop = false;

      let notiID = self.uipress.notify(__('Importing uiPress content', 'uipress-lite'), '', 'default', false, true);
      let thefile;
      if (dragged) {
        thefile = evt.dataTransfer.files[0];
      } else {
        let fileInput = event.target;
        thefile = fileInput.files[0];
      }

      if (thefile.type != 'application/json') {
        self.uipress.notify(__('Global exports must be in valid JSON format', 'uipress-lite'), '', 'error', true, false);
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

        //Empty file
        if (!parsed) {
          self.uipress.notify(__('JSON parse failed', 'uipress-lite'), '', 'error', true, false);
          self.uipress.destroy_notification(notiID);
          return;
        }
        //Invalid format
        if (!Array.isArray(parsed) && !self.uipress.isObject(parsed)) {
          self.uipress.notify('Export is not valid', '', 'error', true, false);
          self.uipress.destroy_notification(notiID);
          return;
        }

        let temper = false;
        if ('uipGlobalExport' in parsed) {
          temper = parsed.uipGlobalExport;
        } else {
          self.uipress.notify(__('Template mismatch', 'uipress-lite'), '', 'error', true, false);
          self.uipress.destroy_notification(notiID);
          return;
        }

        self.sendImportToServer(temper, notiID);
      };

      return;
    },
    sendImportToServer(temper, notiID) {
      let self = this;

      let formData = new FormData();
      formData.append('action', 'uip_global_import');
      formData.append('security', uip_ajax.security);
      formData.append('content', JSON.stringify(temper));

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          self.uipress.notify(response.message, '', 'error', true);
          return;
        }
        self.uipress.notify(__('Content imported succesfully', 'uipress-lite'), '', 'success');
        self.uipress.destroy_notification(notiID);

        self.router.push('/');

        setTimeout(function () {
          location.reload();
        }, 600);
      });
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
