/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    templateHistory: defineAsyncComponent(() => import('./history.min.js?ver=3.2.12')),
  },
  inject: [ 'uipress', 'uiTemplate', 'layersPanel', 'unsavedChanges'],
  data: function () {
    return {
      loading: true,
      templateID: this.$route.params.templateID,
      saving: false,
      helpLoaded: false,
      allUiTemplates: [],
      tips: {
        allTips: [
          {
            title: __('Dynamic data', 'uipress-lite'),
            content: __('Typing "{{" in any window now opens the new dynamic data flow. Continue typing to search or press enter to select. Dynamic data will render in preview mode.', 'uipress-lite'),
            img: this.uipApp.data.options.pluginURL + 'assets/img/dynamic_data_preview.gif',
          },
          {
            title: __('Query builder', 'uipress-lite'),
            content: __(
              'The new query builder can be enabled on any block and allows you to query posts, pages, users and sites (multsitie only). The query builder is designed to work perfectly with the new dynamic data selector.',
              'uipress-lite'
            ),
            img: this.uipApp.data.options.pluginURL + 'assets/img/query_builder.gif',
          },
          {
            title: __('Style presets', 'uipress-lite'),
            content: __(
              'Style presets allow you to create custom presets that you can apply to any blocks. Presets are global and making changes to them in one place will update them across all of your templates',
              'uipress-lite'
            ),
            img: this.uipApp.data.options.pluginURL + 'assets/img/presets_preview.gif',
          },
          {
            title: __('Redesigned block styles', 'uipress-lite'),
            content: __('The new editor makes it easier to adjust block styles and create more advanced layouts. Use the new pseudo switcher to create detailed templates', 'uipress-lite'),
            img: this.uipApp.data.options.pluginURL + 'assets/img/styles_psuedo.gif',
          },
          {
            title: __('Effects and transitions', 'uipress-lite'),
            content: __('You can add and manage transitions within the uiBuilder. Adjust timings and animation styles to get the perfect result.', 'uipress-lite'),
            img: this.uipApp.data.options.pluginURL + 'assets/img/transitions_preview.gif',
          },
          {
            title: __('Contextual options', 'uipress-lite'),
            content: __('Common actions are just a right click away. Duplicate blocks, copy styles or export your entire template', 'uipress-lite'),
            img: this.uipApp.data.options.pluginURL + 'assets/img/contextual_options.gif',
          },
        ],
        currentTip: 0,
        open: true,
      },
      ui: {
        zoom: 0.9,
        viewDevice: 'desktop',
        contextualMenu: {
          display: false,
          top: '',
          left: '',
          block: false,
        },
        strings: {
          backToList: __('Exit builder', 'uipress-lite'),
          toggleLayers: __('Toggle layers panel', 'uipress-lite'),
          backToList: __('Back to template list', 'uipress-lite'),
          zoomIn: __('Zoom in', 'uipress-lite'),
          zoomOut: __('Zoom out', 'uipress-lite'),
          darkMode: __('Dark mode', 'uipress-lite'),
          preview: __('Preview', 'uipress-lite'),
          import: __('Import template', 'uipress-lite'),
          export: __('Export template', 'uipress-lite'),
          templateLibrary: __('Template Library', 'uipress-lite'),
          mobile: __('Mobile', 'uipress-lite'),
          desktop: __('Desktop', 'uipress-lite'),
          tablet: __('Tablet', 'uipress-lite'),
          saveTemplate: __('Save', 'uipress-lite'),
          help: __('Help', 'uipress-lite'),
          docs: __('Documentation and guides', 'uipress-lite'),
          draft: __('Draft', 'uipress-lite'),
          newTemplate: __('New template', 'uipress-lite'),
          recentTemplates: __('Recent templates', 'uipress-lite'),
          templateName: __('Template name', 'uipress-lite'),
          active: __('Active', 'uipress-lite'),
          draft: __('Draft', 'uipress-lite'),
          exitBuilder: __('Exit builder', 'uipress-lite'),
          patterns: __('Patterns', 'uipress-lite'),
          library: __('Library', 'uipress-lite'),
          siteSettings: __('Site settings', 'uipress-lite'),
          settings: __('Settings', 'uipress-lite'),
          templateSettings: __('Template settings', 'uipress-lite'),
          next: __('Next', 'uipress-lite'),
          previous: __('Previous', 'uipress-lite'),
          done: __('Done', 'uipress-lite'),
          close: __('Close', 'uipress-lite'),
          tips: __('Tips and updates', 'uipress-lite'),
          userInterface: __('User interface', 'uipress-lite'),
          adminPage: __('Admin Page', 'uipress-lite'),
          toolBar: __('Frontend toolbar', 'uipress-lite'),
        },
      },
      previewOptions: [
        {
          value: 'builder',
          label: __('Builder', 'uipress-lite'),
        },
        {
          value: 'preview',
          label: __('Preview', 'uipress-lite'),
        },
      ],
    };
  },
  provide() {
    return {
      saveTemplate: this.saveCleanTemplate,
    };
  },
  watch: {
    'ui.viewDevice': {
      handler(newValue, oldValue) {
        let self = this;
        if (newValue == 'desktop') {
          self.uiTemplate.windowWidth = '1000';
          let frame = document.getElementById('uip-preview-content');
          if (frame) {
            frame.classList.add('uip-desktop-view');
            frame.classList.remove('uip-tablet-view');
            frame.classList.remove('uip-phone-view');
          }
        }
        if (newValue == 'tablet') {
          self.uiTemplate.windowWidth = '699';
          let frame = document.getElementById('uip-preview-content');
          if (frame) {
            frame.classList.add('uip-tablet-view');
            frame.classList.remove('uip-desktop-view');
            frame.classList.remove('uip-phone-view');
          }
        }
        if (newValue == 'phone') {
          self.uiTemplate.windowWidth = '600';
          let frame = document.getElementById('uip-preview-content');
          if (frame) {
            frame.classList.add('uip-phone-view');
            frame.classList.remove('uip-tablet-view');
            frame.classList.remove('uip-desktop-view');
          }
        }
        let previewwidthChange = new CustomEvent('uip_builder_preview_change', { detail: { windowWidth: self.uiTemplate.windowWidth } });
        document.dispatchEvent(previewwidthChange);
      },
      deep: true,
    },
    'uiTemplate.content': {
      handler(newValue, oldValue) {
        if (oldValue.length != 0) {
          this.unsavedChanges = true;
        }
      },
      deep: true,
    },
    'uipApp.data.templateDarkMode': {
      handler(newValue, oldValue) {
        let theme = 'light';
        if (newValue) {
          theme = 'dark';
        }
        let frame = document.getElementsByClassName('uip-page-content-frame');
        if (frame[0]) {
          frame[0].contentWindow.document.documentElement.setAttribute('data-theme', theme);
        }
      },
      deep: true,
    },
    'uipApp.data.userPrefs.darkTheme': {
      handler(newValue, oldValue) {
        //Only adjust preview dark mode if we are not in prod
        if (this.uiTemplate.display != 'prod') {
          this.uipApp.data.templateDarkMode = newValue;
        }
      },
      deep: true,
    },
    'ui.zoom': {
      handler(newValue, oldValue) {
        let rounded = Math.round(newValue * 10) / 10;
        //Only adjust preview dark mode if we are not in prod
        this.uipress.saveUserPreference('builderPrefersZoom', String(rounded), false);
      },
      deep: true,
    },
    '$route.params.templateID': {
      handler() {
        this.templateID = this.$route.params.templateID;
      },
    },
  },
  mounted: function () {
    this.loading = false;
    let self = this;

    self.uipress.saveTemplate = this.saveCleanTemplate;
    //Set zoom level from prefs
    let zoom = parseFloat(this.uipApp.data.userPrefs.builderPrefersZoom);
    if (zoom && typeof zoom !== 'undefined') {
      this.ui.zoom = zoom;
    }
    let isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    let isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) ? true : false;
    let isIOS = navigator.platform.match(/(iPhone|iPod|iPad)/i) ? true : false;

    if (isMac || isMacLike || isIOS) {
      document.body.classList.add('macos');
    }

    if (this.uipApp.data.userPrefs.supressTips) {
      this.tips.open = false;
    }

    window.addEventListener('keydown', function (e) {
      ///CMD S
      if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        self.saveTemplate();
      }
    });

    document.addEventListener(
      'right_click_frame',
      (e) => {
        self.uipress.searchForBlock(self.uiTemplate.content, e.detail.uid).then((response) => {
          if (response) {
            let framePos = document.getElementById(e.detail.uid).getBoundingClientRect();

            e.detail.pos.y = self.ui.zoom * e.detail.pos.y + framePos.y;
            e.detail.pos.x = self.ui.zoom * e.detail.pos.x + framePos.x;

            self.ui.contextualMenu.block = response;
            self.setRightClickPos(e.detail.pos);
            self.ui.contextualMenu.display = true;
          } else {
            return;
          }
        });
      },
      { once: false }
    );
  },
  computed: {
    returnSettingsLink() {
      let ID = this.$route.params.templateID;
      return '/uibuilder/' + ID + '/settings/template';
    },
    returnAllUiTemplates() {
      let self = this;
      if (self.allUiTemplates.length < 1) {
        let formData = new FormData();
        formData.append('action', 'uip_get_ui_templates');
        formData.append('security', uip_ajax.security);
        formData.append('page', 1);
        formData.append('search', '');

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          this.allUiTemplates = response.templates;
          return this.allUiTemplates;
        });
      } else {
        return this.allUiTemplates;
      }
    },
    returnLayout() {
      return this.uiTemplate.layout;
    },
  },
  methods: {
    returnColorMode() {
      if (this.uipApp.data.userPrefs.darkTheme) {
        return 'dark';
      }
      if (this.uipApp.data.templateDarkMode) {
        return 'dark';
      }
      return 'light';
    },

    saveTemplate() {
      let self = this;
      self.saving = true;
      let cleanTemplate = JSON.parse(JSON.stringify(self.uiTemplate.content));
      this.uipress.cleanTemplate(cleanTemplate).then((response) => {
        self.saveCleanTemplate(cleanTemplate);
      });
    },

    async saveCleanTemplate(cleanTemplate) {
      let self = this;
      let savetemplate = {};
      savetemplate.globalSettings = JSON.parse(JSON.stringify(self.uiTemplate.globalSettings));
      savetemplate.content = cleanTemplate;

      let template = JSON.stringify(savetemplate, (k, v) => (v === 'true' ? 'uiptrue' : v === true ? 'uiptrue' : v === 'false' ? 'uipfalse' : v === false ? 'uipfalse' : v === '' ? 'uipblank' : v));

      let styles = this.formatStyles();
      let stylesJson = JSON.stringify(styles, (k, v) => (v === 'true' ? 'uiptrue' : v === true ? 'uiptrue' : v === 'false' ? 'uipfalse' : v === false ? 'uipfalse' : v === '' ? 'uipblank' : v));
      //Build form data for fetch request
      let formData = new FormData();
      formData.append('action', 'uip_save_ui_template');
      formData.append('security', uip_ajax.security);
      formData.append('templateID', self.templateID);
      formData.append('template', template);
      formData.append('styles', stylesJson);

      return await self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.error) {
          self.uipress.notify(__('Unable to save template', 'uipress-lite'), response.message, '', 'error', true);
          self.saving = false;
          return false;
        }
        if (response.success) {
          self.uipress.notify(__('Template saved', 'uipress-lite'), '', 'success', true);
          self.unsavedChanges = false;
          self.saving = false;

          self.saveStylePresets();
          return true;
        }
      });
    },
    saveStylePresets() {
      let self = this;
      let options = JSON.stringify(this.uipress.uipAppData.options.block_preset_styles, (k, v) =>
        v === 'true' ? 'uiptrue' : v === true ? 'uiptrue' : v === 'false' ? 'uipfalse' : v === false ? 'uipfalse' : v === '' ? 'uipblank' : v
      );

      let formData = new FormData();
      formData.append('action', 'uip_save_site_option');
      formData.append('security', uip_ajax.security);
      formData.append('option', options);
      formData.append('optionName', 'block_preset_styles');

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        if (response.success) {
          //this.uipress.notify(__('Preset created', 'uipress-lite'), '', 'success', true);
          //Presets saved
        }
      });
    },
    formatStyles() {
      let styles = this.uipApp.data.themeStyles;
      let formatted = {};
      for (let key in styles) {
        if (styles[key].value) {
          if (!formatted[styles[key].name]) {
            formatted[styles[key].name] = {};
          }
          formatted[styles[key].name].value = styles[key].value;
        }
        if (styles[key].darkValue) {
          if (!formatted[styles[key].name]) {
            formatted[styles[key].name] = {};
          }
          formatted[styles[key].name].darkValue = styles[key].darkValue;
        }
        if (styles[key].user) {
          formatted[styles[key].name].user = styles[key].user;
          formatted[styles[key].name].label = styles[key].label;
          formatted[styles[key].name].name = styles[key].name;
          formatted[styles[key].name].type = styles[key].type;
        }
      }

      return formatted;
    },
    goBackToList() {
      if (this.unsavedChanges) {
        this.uipress.confirm(__('You have unsaved changes!', 'uipress-lite'), __('If you leave this page all unsaved changes will be discarded', 'uipress-lite')).then((response) => {
          if (response) {
            this.$router.push('/');
          }
        });
      } else {
        this.$router.push('/');
      }
    },
    returnLoadStyle() {
      if (this.saving) {
        return 'opacity:0;';
      }
    },
    toggleLayers() {
      this.layersPanel.display = !this.layersPanel.display;

      this.uipress.saveUserPreference('builderLayers', this.layersPanel.display, false);
    },
    toggleDisplay() {
      if (this.uiTemplate.display == 'preview') {
        this.uiTemplate.display = 'builder';
      } else {
        this.uiTemplate.display = 'preview';
      }
    },
    exportStuff(type) {
      self = this;
      let layout;
      let namer = 'uip-ui-template-';
      if (type == 'template') {
        layout = JSON.stringify({ uipLayout: self.uiTemplate.content });
      }

      let name = self.uiTemplate.globalSettings.name;

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();

      let date_today = mm + '-' + dd + '-' + yyyy;
      let filename = namer + name + '-' + date_today + '.json';

      let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(layout);
      let dlAnchorElem = this.$refs.templateexport;
      dlAnchorElem.setAttribute('href', dataStr);
      dlAnchorElem.setAttribute('download', filename);
      dlAnchorElem.click();
      let message = __('Layout exported', 'uipress-lite');
      if (type == 'block') {
        message = __('Block exported', 'uipress-lite');
      }
      if (type == 'blockcontent') {
        message = __('Block content exported', 'uipress-lite');
      }
      self.uipress.notify(message, '', 'success', true);
    },
    importTemplate(event, type) {
      let self = this;
      let notiID = self.uipress.notify(__('Importing layout', 'uipress-lite'), '', 'default', false, true);
      let fileInput = event.target;
      let thefile = fileInput.files[0];

      if (thefile.type != 'application/json') {
        self.uipress.notify(__('Templates must be in valid JSON format', 'uipress-lite'), '', 'error', true, false);
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
            self.uipress.notify('Template is not valid', '', 'error', true, false);
            self.uipress.destroy_notification(notiID);
            return;
          }

          let temper;
          let message = __('Template imported', 'uipress-lite');
          if (type == 'template') {
            if (Array.isArray(parsed)) {
              temper = parsed;
            } else if ('uipLayout' in parsed) {
              if (Array.isArray(parsed.uipLayout)) {
                temper = parsed.uipLayout;
              } else {
                temper = [parsed.uipLayout];
              }
            } else {
              self.uipress.notify(__('Template mismatch', 'uipress-lite'), '', 'error', true, false);
              self.uipress.destroy_notification(notiID);
              return;
            }
          }

          self.uipress.validDateTemplate(temper, true).then((response) => {
            if (!response.includes(false)) {
              if (type == 'template') {
                self.uiTemplate.content = temper;
              }
              self.uipress.notify(message, '', 'success', true, false);
              self.uipress.destroy_notification(notiID);
            } else {
              self.uipress.notify(__('File is not a valid JSON template', 'uipress-lite'), '', 'error', true, false);
              self.uipress.destroy_notification(notiID);
            }
          });
        } else {
          self.uipress.notify(__('JSON parse failed', 'uipress-lite'), '', 'error', true, false);
          self.uipress.destroy_notification(notiID);
        }
      };
    },

    openThemeLibrary() {
      let ID = this.$route.params.templateID;
      this.$router.push('/uibuilder/' + ID + '/library');
    },
    switchLayout(id) {
      let self = this;
      if (this.unsavedChanges) {
        this.uipress.confirm(__('You have unsaved changes!', 'uipress-lite'), __('If you leave this page all unsaved changes will be discarded', 'uipress-lite')).then((response) => {
          if (response) {
            self.$router.push('/uibuilder/' + id + '/');
            self.unsavedChanges = false;
          }
        });
      } else {
        self.$router.push('/uibuilder/' + id + '/');
      }
    },
    confirmNewPage(id) {
      let self = this;
      if (this.unsavedChanges) {
        this.uipress.confirm(__('You have unsaved changes!', 'uipress-lite'), __('If you leave this page all unsaved changes will be discarded', 'uipress-lite')).then((response) => {
          if (response) {
            self.createNewUI();
          }
        });
      } else {
        self.createNewUI();
      }
    },
    /**
     * Creates new draft ui template
     * @since 3.0.0
     */
    createNewUI() {
      let self = this;

      let formData = new FormData();
      formData.append('action', 'uip_create_new_ui_template');
      formData.append('security', uip_ajax.security);
      formData.append('templateType', 'ui-template');

      self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
        self.uipress.notify(__('New template created', 'uipress-lite'), '', 'success', true, false);
        self.$router.push('/');
        self.$router.push('/uibuilder/' + response.id + '/');
        self.returnAllUiTemplates;
      });
    },
    clickHandler(evt) {
      let self = this;

      let target = evt.target.closest('.uip-block-builder-container');

      if (!target) {
        return;
      }
      let targetUID = target.getAttribute('block-uid');
      //No block to select
      if (!targetUID) {
        return;
      }

      //Open block settings
      let ID = self.$route.params.templateID;
      this.$router.push({
        path: '/uibuilder/' + ID + '/settings/blocks/' + targetUID,
        query: { ...this.$route.query },
      });
    },
    hideContextual(evt) {
      let self = this;

      if (self.ui.contextualMenu.display) {
        //Check if click was outside contextual if it's open
        let path = evt.composedPath ? evt.composedPath() : undefined;
        // check if the MouseClick occurs inside the component
        if (path && !path.includes(this.$refs.contextualMenu) && !this.$refs.contextualMenu.contains(evt.target)) {
          self.ui.contextualMenu.display = false;
        }
      }
    },
    showOptions(evt) {
      let self = this;

      let target = evt.target.closest('.uip-block-builder-container');

      if (!target) {
        return;
      }
      let targetUID = target.getAttribute('block-uid');
      //No block to select
      if (!targetUID) {
        return;
      }

      self.uipress.searchForBlock(self.uiTemplate.content, targetUID).then((response) => {
        if (response) {
          self.ui.contextualMenu.block = response;
          self.setRightClickPos(evt);
          self.ui.contextualMenu.display = true;
        } else {
          return;
        }
      });
    },
    setRightClickPos(e) {
      let self = this;
      let x = e.pageX;
      let y = e.pageY;

      if (!('pageX' in e)) {
        x = e.x;
        y = e.y;
      }

      self.ui.contextualMenu.top = `${y}px`;
      self.ui.contextualMenu.left = `${x}px`;
    },
    returnContextMenuStyle() {
      let self = this;
      let style = 'top:' + self.ui.contextualMenu.top + '; left:' + self.ui.contextualMenu.left + ';';
      return style;
    },
    closeContextual() {
      this.ui.contextualMenu.display = false;
    },
    returnTemplateType() {
      let type = this.uiTemplate.globalSettings.type;
      if (type == 'ui-template') {
        return __('User interface', 'uipress-lite');
      }
      if (type == 'ui-admin-page') {
        return __('Admin page', 'uipress-lite');
      }
      if (type == 'ui-front-template') {
        return __('Front end toolbar', 'uipress-lite');
      }
    },
  },
  template: `
      
      <!--PREVIEW TOOLBAR -->
      <div id="uip-ui-preview-toolbar" class="uip-flex uip-padding-s uip-gap-xs uip-flex-center uip-flex-between uip-background-default uip-border-bottom uip-flex-wrap" style="z-index:2">
          <div class="uip-flex  uip-flex-center uip-app-frame">
        
            
            
            <div class="uip-flex uip-gap-s uip-flex-center">
            
              
              
              <dropdown pos="bottom left" triggerClass="uip-dark-mode">
                <template v-slot:trigger>
                  <div class="uip-flex uip-gap-xs uip-flex-center uip-link-default uip-border-rounder uip-background-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs">
                    <div class="uip-logo uip-w-18 uip-ratio-1-1"></div>
                    <div class="uip-icon uip-text-l uip-text-muted">expand_more</div>
                  </div>
                </template>  
                <template v-slot:content>
                  <div class="uip-max-h-600 uip-overflow-auto uip-flex uip-flex-column">
                  
                    
                    <div class="uip-padding-xs uip-flex uip-flex-column uip-row-gap-xxxs">
                    
                      <router-link to="/" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.backToList}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">chevron_left</div>
                      </router-link>
                      
                      <router-link to="/site-settings" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.siteSettings}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">tune</div>
                        
                      </router-link>
                      
                      
                      <div class="uip-border-top uip-margin-top-xxs uip-margin-bottom-xxs"></div>
                    
                    
                      <a @click="confirmNewPage()" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.newTemplate}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">add</div>
                        
                      </a>
                      
                      <router-link :to="returnSettingsLink" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.templateSettings}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">settings</div>
                        
                      </router-link>
                      
                      <label class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.import}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">file_upload</div>
                        <input hidden accept=".json" type="file" single="" id="uip-import-layout" @change="importTemplate($event, 'template')">
                        
                      </label>
                      
                      <a @click="exportStuff('template')" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.export}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">file_download</div>
                        <a ref="templateexport" href="" style="display:none;"></a>
                        
                      </a>
                      
                      
                      
                    
                      <div class="uip-border-top uip-margin-top-xxs uip-margin-bottom-xxs"></div>
                  
                      <a class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted" href="https://uipress.co/docs/#/" target="_BLANK">
                        
                        <div class="uip-flex-grow">{{ui.strings.docs}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">open_in_new</div>
                      </a>
                      
                      
                      <div @click="tips.open = true" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted" >
                        
                        <div class="uip-flex-grow">{{ui.strings.tips}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">tips_and_updates</div>
                      </div>
                    
                    </div>
                    
                  </div>
                </template>
              </dropdown>  
              
              
              <!-- History -->
              <templateHistory/>
              
              
              
            
            
            
            </div>
            
              
            
        
          </div>
          
          <!--Middle actions -->
          <div class="uip-flex uip-gap-xxs uip-flex-center">
          
            <div class="uip-flex uip-flex-center uip-gap-s">
              
              <span class="uip-text-bold uip-blank-input uip-text-right" contenteditable @input="function(event){uiTemplate.globalSettings.name = event.target.innerText}">
                {{uiTemplate.globalSettings.name}}
              </span>
              
              <router-link :to="returnSettingsLink" v-if="uiTemplate.globalSettings.status" 
              class="uip-border-rounder uip-background-green-wash uip-padding-xxs uip-no-underline uip-link-default">{{ui.strings.active}}</router-link>
              
              <router-link :to="returnSettingsLink" v-if="!uiTemplate.globalSettings.status" 
              class="uip-border-rounder uip-background-orange-wash uip-padding-xxs uip-no-underline uip-link-default">{{ui.strings.draft}}</router-link>
            
              <select class="uip-input uip-input-small uip-border-rounder" v-model="uiTemplate.globalSettings.type">
                <option value="ui-template">{{ui.strings.userInterface}}</option>
                <option value="ui-admin-page">{{ui.strings.adminPage}}</option>
                <option value="ui-front-template">{{ui.strings.toolBar}}</option>
              </select>
              
            </div>
            
            
          </div>
          
          <div class="uip-flex uip-gap-xs">
            
            <div @click="uiTemplate.isPreview = !uiTemplate.isPreview" :title="ui.strings.preview" class="uip-border-rounder uip-flex uip-gap-xxs uip-flex-center uip-padding-xxs"
            :class="uiTemplate.isPreview ? 'uip-button-primary uip-text-inverse' : 'uip-button-default'">
              <div class="uip-icon uip-text-xl">play_arrow</div>
            </div>
            
            <router-link :to="returnSettingsLink" class="uip-button-default uip-no-underline uip-flex uip-gap-xxs uip-flex-center">
              <div class="uip-icon uip-text-l">settings</div>
              <div class="">{{ui.strings.settings}}</div>
            </router-link>
            
          
            <button @click="saveTemplate()" class="uip-button-primary uip-flex uip-flex-center uip-flex-middle uip-position-relative uip-text-s" type="button">
              <span :style="returnLoadStyle()" class="uip-flex uip-flex-center uip-flex-middle uip-gap-xs">
                <span>{{ui.strings.saveTemplate}}</span>
                <span class="uip-padding-left-xxxs uip-padding-right-xxxs uip-border uip-border-round uip-text-s uip-flex uip-flex-center uip-flex-row" data-theme="dark">
                  <span class="uip-command-icon uip-text-muted"></span>
                  <span class="uip-text-muted">S</span>
                </span>
              </span>
              <div class="uip-position-absolute uip-left-0 uip-right-0" v-if="saving">
                <span class="uip-load-spinner" ></span>
              </div>
            </button>
            
          </div>
          
      </div>
      
      
      
      <div v-if="tips.open" class="uip-position-fixed uip-top-0 uip-left-0 uip-h-viewport uip-w-vw uip-background-black-wash uip-flex uip-flex-center uip-flex-middle uip-fade-in" style="z-index:10">
      
        <div class="uip-background-default uip-border-rounder uip-overflow-hidden uip-flex uip-flex-column uip-row-gap-s uip-scale-in uip-min-w-350 uip-w-400 uip-padding-m"
        style="border-radius: calc(var(--uip-border-radius-large) + var(--uip-padding-xs));">
          
          
            <div class="uip-flex uip-flex-column uip-row-gap-s">
              
              <img :src="tips.allTips[tips.currentTip].img" :alt="tips.allTips[tips.currentTip].title" class="uip-w-100p uip-border-rounder uip-fade-in">
              <div class="uip-text-emphasis uip-text-l uip-fade-in">{{tips.allTips[tips.currentTip].title}}</div>
              <div class="uip-text-muted uip-fade-in" style="line-height:1.6">{{tips.allTips[tips.currentTip].content}}</div>
              
            </div>
            
            <div class="uip-flex uip-flex-between">
            
              <button class="uip-button-default" @click="tips.open = false;uipress.saveUserPreference('supressTips', true, false);">{{ui.strings.close}}</button>
              
              <div class="uip-flex uip-gap-xs">
              
                <button v-if="tips.currentTip > 0" class="uip-button-default" @click="tips.currentTip -= 1">{{ui.strings.previous}}</button>
                <button v-if="tips.currentTip < tips.allTips.length - 1" class="uip-button-default" @click="tips.currentTip += 1">{{ui.strings.next}}</button>
                
                <button v-if="tips.currentTip == tips.allTips.length - 1" class="uip-button-primary" @click="tips.open = false">{{ui.strings.done}}</button>
                
              </div>
            </div>
          
          
        </div>
        
      </div> 
        `,
};
