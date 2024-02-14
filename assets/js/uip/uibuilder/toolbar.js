/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
import { validDateTemplate } from "../v3.5/utility/functions.min.js";
export default {
  components: {
    templateHistory: defineAsyncComponent(() => import("./history.min.js?ver=3.3.1")),
  },
  inject: ["uiTemplate"],
  data() {
    return {
      templateID: this.$route.params.templateID,
      saving: false,
      helpLoaded: false,
      allUiTemplates: [],
      ui: {
        strings: {
          backToList: __("Back to template list", "uipress-lite"),
          zoomIn: __("Zoom in", "uipress-lite"),
          zoomOut: __("Zoom out", "uipress-lite"),
          darkMode: __("Dark mode", "uipress-lite"),
          preview: __("Preview", "uipress-lite"),
          import: __("Import template", "uipress-lite"),
          export: __("Export template", "uipress-lite"),
          templateLibrary: __("Template Library", "uipress-lite"),
          mobile: __("Mobile", "uipress-lite"),
          desktop: __("Desktop", "uipress-lite"),
          tablet: __("Tablet", "uipress-lite"),
          saveTemplate: __("Save", "uipress-lite"),
          help: __("Help", "uipress-lite"),
          docs: __("Documentation and guides", "uipress-lite"),
          draft: __("Draft", "uipress-lite"),
          newTemplate: __("New template", "uipress-lite"),
          recentTemplates: __("Recent templates", "uipress-lite"),
          templateName: __("Template name", "uipress-lite"),
          active: __("Active", "uipress-lite"),
          draft: __("Draft", "uipress-lite"),
          exitBuilder: __("Exit builder", "uipress-lite"),
          patterns: __("Patterns", "uipress-lite"),
          library: __("Library", "uipress-lite"),
          siteSettings: __("Site settings", "uipress-lite"),
          settings: __("Settings", "uipress-lite"),
          templateSettings: __("Template settings", "uipress-lite"),
          next: __("Next", "uipress-lite"),
          previous: __("Previous", "uipress-lite"),
          done: __("Done", "uipress-lite"),
          close: __("Close", "uipress-lite"),
          tips: __("Tips and updates", "uipress-lite"),
          userInterface: __("User interface", "uipress-lite"),
          adminPage: __("Admin Page", "uipress-lite"),
          toolBar: __("Frontend toolbar", "uipress-lite"),
        },
      },
      previewOptions: [
        {
          value: "builder",
          label: __("Builder", "uipress-lite"),
        },
        {
          value: "preview",
          label: __("Preview", "uipress-lite"),
        },
      ],
    };
  },
  watch: {
    "uipApp.data.templateDarkMode": {
      handler(newValue, oldValue) {
        const theme = newValue ? "dark" : "light";
        const frames = document.querySelectorAll("iframe");
        if (!frames) return;

        frames.forEach((frame) => {
          frame.contentWindow.document.documentElement.setAttribute("data-theme", theme);
        });
      },
      deep: true,
    },
    "uipApp.data.userPrefs.darkTheme": {
      handler(newValue, oldValue) {
        //Only adjust preview dark mode if we are not in prod
        if (this.uiTemplate.display === "prod") return;
        this.uipApp.data.templateDarkMode = newValue;
      },
      deep: true,
    },
    "$route.params.templateID": {
      handler() {
        this.templateID = this.$route.params.templateID;
      },
    },
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleCommandS);
  },
  mounted() {
    this.mountShortCuts();
  },
  computed: {
    /**
     * Returns link to the settings page
     *
     * @since 3.2.13
     */
    returnSettingsLink() {
      let ID = this.$route.params.templateID;
      return "/uibuilder/" + ID + "/settings/template";
    },

    /**
     * Returns loading style
     *
     * @since 3.2.13
     */
    returnLoadStyle() {
      if (this.saving) {
        return "opacity:0;";
      }
    },
  },
  methods: {
    /**
     * Mounts shortcuts
     *
     * @since 3.2.13
     */
    mountShortCuts() {
      window.addEventListener("keydown", this.handleCommandS);
    },

    /**
     * Handles key down event and saves template
     *
     * @param {Object} e - keydown event
     */
    handleCommandS(e) {
      if (e.keyCode == 83 && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.saveTemplate();
      }
    },
    /**
     * Detects whether we are on a mac or windows
     *
     * @returns {String} - operating machine
     * @since 3.2.13
     */
    detectOperatingSystem() {
      const userAgent = window.navigator.userAgent.toLowerCase();

      if (userAgent.includes("mac") || userAgent.includes("ipad") || userAgent.includes("iphone")) {
        return "Mac";
      } else {
        return "Windows";
      }
    },

    /**
     * Saves template to the server
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async saveTemplate() {
      const templateObject = {
        globalSettings: JSON.parse(JSON.stringify(this.uiTemplate.globalSettings)),
        content: this.uiTemplate.content,
      };

      const template = JSON.stringify(templateObject, (k, v) =>
        v === "true" ? "uiptrue" : v === true ? "uiptrue" : v === "false" ? "uipfalse" : v === false ? "uipfalse" : v === "" ? "uipblank" : v
      );
      //Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_save_ui_template");
      formData.append("security", uip_ajax.security);
      formData.append("templateID", this.templateID);
      formData.append("template", template);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      if (response.error) {
        this.uipApp.notifications.notify(__("Unable to save template", "uipress-lite"), response.message, "", "error", true);
        this.saving = false;
        return false;
      }

      if (response.success) {
        await this.saveStylePresets();

        this.uipApp.notifications.notify(__("Template saved", "uipress-lite"), "", "success", true);
        this.unsavedChanges = false;
        this.saving = false;
        return true;
      }
    },

    /**
     * Saves style presets
     *
     * @since 3.2.13
     */
    async saveStylePresets() {
      const options = JSON.stringify(this.uipApp.data.options.block_preset_styles, (k, v) =>
        v === "true" ? "uiptrue" : v === true ? "uiptrue" : v === "false" ? "uipfalse" : v === false ? "uipfalse" : v === "" ? "uipblank" : v
      );

      let formData = new FormData();
      formData.append("action", "uip_save_site_option");
      formData.append("security", uip_ajax.security);
      formData.append("option", options);
      formData.append("optionName", "block_preset_styles");

      await this.sendServerRequest(uip_ajax.ajax_url, formData);
      return true;
    },

    /**
     * Exports template
     *
     * @since 3.2.13
     */
    exportTemplate() {
      let namer = "uip-ui-template-";
      let layout = JSON.stringify({ uipLayout: this.uiTemplate.content });

      let name = this.uiTemplate.globalSettings.name;

      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();

      let date_today = mm + "-" + dd + "-" + yyyy;
      let filename = namer + name + "-" + date_today + ".json";

      let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(layout);
      let dlAnchorElem = this.$refs.templateexport;
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", filename);
      dlAnchorElem.click();
      let message = __("Layout exported", "uipress-lite");
      this.uipApp.notifications.notify(message, "", "success", true);
    },

    /**
     * Imports template
     *
     * @param {Object} event - file input event
     * @since 3.2.13
     */
    importTemplate(event) {
      let notiID = this.uipApp.notifications.notify(__("Importing layout", "uipress-lite"), "", "default", false, true);
      let fileInput = event.target;
      let thefile = fileInput.files[0];

      if (thefile.type != "application/json") {
        this.uipApp.notifications.notify(__("Templates must be in valid JSON format", "uipress-lite"), "", "error", true, false);
        this.uipApp.notifications.remove(notiID);
        return;
      }

      if (thefile.size > 1000000) {
        this.uipApp.notifications.notify(__("Uploaded file is too big", "uipress-lite"), "", "error", true, false);
        this.uipApp.notifications.remove(notiID);
        return;
      }

      let reader = new FileReader();
      reader.readAsText(thefile, "UTF-8");

      reader.onload = (evt) => {
        let json_settings = evt.target.result;
        let parsed;

        //Check for valid JSON data
        try {
          parsed = JSON.parse(json_settings);
        } catch (error) {
          this.uipApp.notifications.notify(error, "", "error", true, false);
          this.uipApp.notifications.remove(notiID);
          return;
        }

        if (parsed != null) {
          if (!Array.isArray(parsed) && !this.isObject(parsed)) {
            this.uipApp.notifications.notify("Template is not valid", "", "error", true, false);
            this.uipApp.notifications.remove(notiID);
            return;
          }

          let temper;
          let message = __("Template imported", "uipress-lite");
          if (Array.isArray(parsed)) {
            temper = parsed;
          } else if ("uipLayout" in parsed) {
            if (Array.isArray(parsed.uipLayout)) {
              temper = parsed.uipLayout;
            } else {
              temper = [parsed.uipLayout];
            }
          } else {
            this.uipApp.notifications.notify(__("Template mismatch", "uipress-lite"), "", "error", true, false);
            this.uipApp.notifications.remove(notiID);
            return;
          }

          validDateTemplate(temper, true).then((response) => {
            if (!response.includes(false)) {
              this.uiTemplate.content = temper;

              this.uipApp.notifications.notify(message, "", "success", true, false);
              this.uipApp.notifications.remove(notiID);
            } else {
              this.uipApp.notifications.notify(__("File is not a valid JSON template", "uipress-lite"), "", "error", true, false);
              this.uipApp.notifications.remove(notiID);
            }
          });
        } else {
          this.uipApp.notifications.notify(__("JSON parse failed", "uipress-lite"), "", "error", true, false);
          this.uipApp.notifications.remove(notiID);
        }
      };
    },

    /**
     * Creates new draft ui template
     *
     * @since 3.0.0
     */
    async createNewUI() {
      let formData = new FormData();
      formData.append("action", "uip_create_new_ui_template");
      formData.append("security", uip_ajax.security);
      formData.append("templateType", "ui-template");

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      this.uipApp.notifications.notify(__("New template created", "uipress-lite"), "", "success", true, false);
      this.$router.push("/");
      this.$router.push("/uibuilder/" + response.id + "/");
    },
  },
  template: `
      
      <!--PREVIEW TOOLBAR -->
      <div id="uip-ui-preview-toolbar" class="uip-flex uip-padding-s uip-gap-xs uip-flex-center uip-flex-between uip-background-default uip-border-bottom uip-flex-wrap uip-position-relative" style="z-index:2">
          <div class="uip-flex  uip-flex-center uip-app-frame">
        
            
            
            <div class="uip-flex uip-gap-s uip-flex-center">
            
              
              
              <dropdown pos="bottom left" ref="logomenu">
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
                      
                      <router-link @click="$refs.logomenu.close()"
                      to="/site-settings" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.siteSettings}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">tune</div>
                        
                      </router-link>
                      
                      
                      <div class="uip-border-top uip-margin-top-xxs uip-margin-bottom-xxs"></div>
                    
                    
                      <a @click="createNewUI();$refs.logomenu.close()" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.newTemplate}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">add</div>
                        
                      </a>
                      
                      <router-link @click="$refs.logomenu.close()"
                      :to="returnSettingsLink" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.templateSettings}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">settings</div>
                        
                      </router-link>
                      
                      <label class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.import}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">file_upload</div>
                        <input hidden accept=".json" type="file" single="" id="uip-import-layout" @change="importTemplate($event, 'template')">
                        
                      </label>
                      
                      <a @click="exportTemplate('template');$refs.logomenu.close()" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted">
                        
                        <div class="uip-flex-grow">{{ui.strings.export}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">file_download</div>
                        <a ref="templateexport" href="" style="display:none;"></a>
                        
                      </a>
                      
                      
                      
                    
                      <div class="uip-border-top uip-margin-top-xxs uip-margin-bottom-xxs"></div>
                  
                      <a @click="$refs.logomenu.close()" class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted" href="https://uipress.co/docs/#/" target="_BLANK">
                        
                        <div class="uip-flex-grow">{{ui.strings.docs}}</div>
                        <div class="uip-icon uip-text-l uip-text-muted">open_in_new</div>
                      </a>
                      
                      
                      <div @click="uipApp.tipsAndTricks.show();$refs.logomenu.close()" 
                      class="uip-link-default uip-no-underline uip-flex uip-flex-center uip-gap-m uip-padding-xxs uip-border-round hover:uip-background-muted" >
                        
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
            
            <div @click="uiTemplate.isPreview = !uiTemplate.isPreview;uipApp.blockSettings.close()" :title="ui.strings.preview" class="uip-border-rounder uip-flex uip-gap-xxs uip-flex-center uip-padding-xxs"
            :class="uiTemplate.isPreview ? 'uip-button-primary uip-text-inverse' : 'uip-button-default'">
              <div class="uip-icon uip-text-xl">play_arrow</div>
            </div>
            
            <router-link :to="returnSettingsLink" class="uip-button-default uip-no-underline uip-flex uip-gap-xxs uip-flex-center uip-text-s">
              <div class="uip-icon uip-text-l">settings</div>
              <div class="">{{ui.strings.settings}}</div>
            </router-link>
            
          
            <button @click="saveTemplate()" class="uip-button-primary uip-flex uip-flex-center uip-flex-middle uip-position-relative uip-text-s" type="button">
              <span :style="returnLoadStyle" class="uip-flex uip-flex-center uip-flex-middle uip-gap-xs">
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
      
      
      
      
        `,
};
