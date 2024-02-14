/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
export default {
  components: {
    layersPanels: defineAsyncComponent(() => import("./layers.min.js?ver=3.3.1")),
    blockcontextmenu: defineAsyncComponent(() => import("./block-contextmenu.min.js?ver=3.3.1")),
    ToolBar: defineAsyncComponent(() => import("./toolbar.min.js?ver=3.3.1")),
    Canvas: defineAsyncComponent(() => import("./canvas.min.js?ver=3.3.1")),
    BlockList: defineAsyncComponent(() => import("./block-list.min.js?ver=3.3.1")),
    TemplateLibrary: defineAsyncComponent(() => import("./template-library.min.js?ver=3.3.1")),
    DynamicData: defineAsyncComponent(() => import("./dynamic-data-watcher.min.js?ver=3.3.1")),
  },

  data() {
    return {
      templateID: this.$route.params.templateID,
      layoutFetched: false,
      unsavedChanges: false,
      welcomeMessage: true,
      updating: false,
      selectedBlocks: [],
      ui: {
        contextualMenu: {
          display: false,
          top: "",
          left: "",
          block: false,
        },

        modal: {
          open: false,
          activeModule: "",
          title: "",
          args: {},
        },
        settingsPanel: {
          pos: {},
        },
        sideBar: {
          activeTab: "blocks",
        },
        strings: {
          layers: __("Layers", "uipress-lite"),
          welcomeTitle: __("Welcome to the uiBuilder", "uipress-lite"),
          welcomeMeta: __(
            "Brand new for UiPress 3, the uiBuilder is a powerful drag and drop tool for building great looking, functional admin experiences for yourself or your clients",
            "uipress-lite"
          ),
          blankCanvas: __("Blank canvas", "uipress-lite"),
          viewTemplates: __("View templates", "uipress-lite"),
          dontShowAgain: __("Don't show this again", "uipress-lite"),
          close: __("Close", "uipress-lite"),
          deletesAllBlocks: __("Deletes all blocks", "uipress-lite"),
          hideLayers: __("Hide layers", "uipress-lite"),
          shortCuts: __("Block shortcuts", "uipress-lite"),
          deleteLayout: __("Clear layers", "uipress-lite"),
          searchData: __("Search", "uipress-lite"),
        },
        keyBlocks: [],
      },
      template: {
        copied: false,
        notifications: [],
        activePath: [],
        activePathLock: false,
        windowWidth: window.innerWidth,
        patterns: [],
        isPreview: false,
        googleAnalyticsRequest: {
          range: {
            start: "",
            end: "",
          },
          fetching: false,
          data: {},
        },
        display: "preview",
        globalSettings: {
          name: __("Draft Layout", "uipress-lite"),
          status: false,
          rolesAndUsers: [],
          excludesRolesAndUsers: [],
          type: "ui-template",
          options: {},
          menuIcon: {
            value: "",
          },
          code: {
            css: "",
            js: "",
          },
        },
        content: [],
      },
      switchOptions: {
        blocks: {
          value: "blocks",
          label: __("Blocks", "uipress-lite"),
        },
        layers: {
          value: "layers",
          label: __("Layers", "uipress-lite"),
        },
        library: {
          value: "library",
          label: __("Library", "uipress-lite"),
        },
      },
    };
  },
  watch: {
    "ui.sideBar.activeTab": {
      handler(newValue, oldValue) {
        this.$router.push({
          query: { ...this.$route.query, ...{ tab: newValue } },
        });
      },
      deep: true,
    },
    "$route.params.templateID": {
      handler() {
        this.templateID = this.$route.params.templateID;
        this.template.globalSettings = [];
        this.template.content = [];
        this.getTemplate();
      },
    },
  },
  provide() {
    return {
      uiTemplate: this.returnTemplateData,
    };
  },
  async created() {
    await this.getTemplate();
  },
  mounted() {
    this.mountWatchers();
    this.setTab();
  },
  beforeUnmount() {
    document.removeEventListener("uipress/app/page/load/finish", this.getNotifications, { once: false });
    document.removeEventListener("uipress/app/darkmode/toggle", this.toggleDarkMode, { once: false });
  },
  computed: {
    /**
     * Returns the current template
     *
     * @since 3.2.13
     */
    returnTemplateData() {
      return this.template;
    },

    /**
     * Returns left panel style depending on preview / builder mode
     *
     * @since 3.2.13
     */
    returnLeftPanelStyle() {
      if (this.template.isPreview) {
        return "transform:scale(0,1);max-width:0%;transition: all 0.2s ease-in-out;transform-origin: left;";
      } else {
        return "max-width:100%;transition:all 0.2s ease-in-out;transform-origin: left;";
      }
    },
  },
  methods: {
    /**
     * Sets active sidebar tab from router query
     *
     * @since 3.2.13
     */
    setTab() {
      if (!this.$route.query) return;
      if (!this.$route.query.tab) return;
      this.ui.sideBar.activeTab = this.$route.query.tab;
    },

    /**
     * Mounts app watchers and requests fullscreen if loading in iframe
     *
     * @since 3.2.13
     */
    mountWatchers() {
      document.addEventListener("uipress/app/page/load/finish", this.getNotifications, { once: false });
      document.addEventListener("uipress/app/darkmode/toggle", this.toggleDarkMode, { once: false });
      if (!window.parent) return;
      window.parent.postMessage({ eventName: "uip_request_fullscreen" }, "*");
    },

    /**
     * Toggles dark mode
     *
     * @since 3.3.095
     */
    toggleDarkMode() {
      const state = this.uipApp.data.userPrefs.darkTheme;

      this.uipApp.data.userPrefs.darkTheme = state ? false : true;

      const theme = state ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", theme);
      const frames = document.querySelectorAll("iframe");

      // No iframes to update so bail
      if (!frames) return;

      // Update all iframes with data theme tag
      for (const iframe of frames) {
        const head = iframe.contentWindow.document.documentElement;
        if (!head) continue;
        head.setAttribute("data-theme", theme);
      }

      this.saveUserPreference("darkTheme", !state, false);
    },

    /**
     * Gets notifications from frames
     *
     * @since 3.2.13
     */
    getNotifications() {
      const frame = document.querySelector(".uip-page-content-frame");
      //Frame does not exist so abort
      let notifications;

      // Get notifications from frame or current document
      const searchDocument = frame ? frame.contentWindow.document : document;
      notifications = searchDocument.querySelectorAll(".notice:not(#message):not(.inline):not(.update-message),.wp-analytify-notification");
      if (!notifications) return;

      this.template.notifications = [];

      let notiActive = false;
      const stringTemplate = JSON.stringify(this.template.content);
      if (stringTemplate.includes("site-notifications")) notiActive = true;

      for (const noti of notifications) {
        this.template.notifications.push(noti.outerHTML.replace("uip-framed-page=1", ""));
        if (notiActive) {
          noti.setAttribute("style", "display:none !important; visibility: hidden !important; opacity: 0 !important;");
        }
      }

      this.uipApp.data.dynamicOptions.notificationCount.value = this.template.notifications.length;
    },

    /**
     * Pushes a blank canvas block
     *
     * @since 3.2.13
     */
    async addCanvas() {
      const containerBlock = this.uipApp.data.blocks.filter((obj) => {
        return obj.moduleName == "uip-container";
      });

      let copiedConatiner = JSON.parse(JSON.stringify(containerBlock[0]));

      delete copiedConatiner.path;
      delete copiedConatiner.args;
      delete copiedConatiner.category;
      delete copiedConatiner.description;
      delete copiedConatiner.optionsEnabled;

      copiedConatiner.uid = this.createUID();
      copiedConatiner.name = __("Canvas", "uipress-lite");
      copiedConatiner.settings = {};
      copiedConatiner.tooltip = {};

      await nextTick();
      this.template.content.push(copiedConatiner);
    },
    /**
     * Fetches the template
     *
     * @since 3.2.13
     */
    async getTemplate() {
      //Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_get_ui_template");
      formData.append("security", uip_ajax.security);
      formData.append("templateID", this.templateID);
      this.layoutFetched = false;

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      let settings = response.settings[0];
      let content = response.content;
      let styles = response.styles;

      if (this.isObject(styles)) this.uipApp.data.themeStyles = { ...this.uipApp.data.themeStyles, ...styles };

      // Store user patterns
      this.template.patterns = response.patterns;

      // Push empty canvas block if empty template
      if (!content || !content.length) {
        this.addCanvas();
        this.layoutFetched = true;
        return;
      }

      // Set template content
      this.template.content = content;

      // Nos settings so set up basics
      if (!settings) {
        if ("type" in response) {
          this.template.globalSettings.type = response.type;
        }
        this.layoutFetched = true;
        return;
      }
      //Update global settings
      if (this.isObject(settings)) {
        const currentSettings = this.template.globalSettings;
        this.template.globalSettings = { ...currentSettings, ...settings };
      }

      this.getNotifications();

      await nextTick();
      this.layoutFetched = true;
    },

    /**
     * Returns whether a component exists or not
     *
     * @param {String} name
     * @since 3.2.13
     */
    componentExists(name) {
      return this.$root._.appContext.components[name] ? true : false;
    },
  },
  template: `
    
    
      <component is="style">
        .v-enter-active, .v-leave-active {transition: opacity 0.6s ease;}
        .v-enter-from, .v-leave-to {opacity: 0;}
      </component>
      
      <Transition>
        <div v-if="!layoutFetched" class="uip-background-default uip-body-font uip-h-viewport uip-max-h-viewport uip-flex uip-flex-center uip-flex-middle uip-position-fixed uip-z-index-9" 
        style="min-height: 100vh; max-height: 100vh; min-width: 100vw; max-width: 100vw">
          <loading-chart></loading-chart>
        </div>
      </Transition>
      
      
      <component is="style">
        #wpcontent{margin:0 !important;}
        #wpadminbar{display:none !important;}
        html.wp-toolbar{padding-top:0;}
        #adminmenumain{display:none}
      </component>
    
      <div v-if="layoutFetched" class="uip-background-default uip-body-font uip-h-viewport uip-max-h-viewport uip-flex uip-text-normal uip-app-frame uip-border-box uip-builder-frame uip-flex uip-flex-column uip-w-100p" >
          
          <!--Dynamic data watcher-->
          <DynamicData/>
          
        
          <!--Builder Toolbar-->
          <ToolBar/>
          
          
      
      
          <div class="uip-flex uip-h-100p uip-flex-grow uip-overflow-hidden uip-position-relative" style="max-width:100vw">
          

            <!--Left panel -->
            <div class="uip-overflow-auto uip-border-right uip-app-frame uip-flex-no-shrink uip-w-300 uip-max-h-100p uip-background-default uip-z-index-1" 
            :style="returnLeftPanelStyle">
              
              
              <div class="uip-flex uip-flex-column uip-h-100p uip-max-h-100p">
              
                  <div class="uip-padding-s uip-border-box ">
                    <toggle-switch :options="switchOptions" :activeValue="ui.sideBar.activeTab" :dontAccentActive="true" :returnValue="function(data){ ui.sideBar.activeTab = data}"></toggle-switch>
                  </div>
                  
                  <div class="uip-padding-left-s uip-padding-right-s uip-flex">
                    <div class="uip-border-bottom uip-w-100p"></div>
                  </div>
                  
                  <!-- OUTPUT SETTINGS OR BLOCKS -->
                  <div class="uip-flex-grow uip-overflow-auto uip-padding-s uip-scrollbar">
                  
                    <TemplateLibrary v-if="ui.sideBar.activeTab == 'library'"/>
                    
                    <BlockList v-if="ui.sideBar.activeTab == 'blocks'"/>
                   
                    
                    <!--LAYERS-->
                    <template v-if="ui.sideBar.activeTab == 'layers'" >
                      <div class="uip-flex uip-flex-column uip-row-gap-xs">
                      
                        <layersPanels :content="template.content" :returnData="function(data){template.content = data}" />
                      
                      </div>
                      
                      
                      <!-- End right click -->
                    
                    </template>
                    
                    <!--END LAYERS-->
                    
                  </div>
                  
              </div>
              
              
              
            </div>
            <!--End Layers panel -->
            
            <!-- Main canvas -->
            <div class="uip-flex-grow uip-canvas-background uip-overflow-hidden">
              <Canvas/>
            </div>
            <!--End canvas-->
            
            
            <!--Right bar -->
            <router-view :key="$route.path" v-show="!template.isPreview"></router-view>
            <!-- End right bar -->
            
          </div>
          
	      </div>
      
        
        <!--Import plugins -->
        <template v-for="plugin in uipApp.data.plugins" v-if="layoutFetched">
          <component v-if="componentExists(plugin.component) && plugin.loadInApp" :is="plugin.component"></component>
        </template>
        <!-- end plugin import -->
      
        
        
        <!--Block context menu-->
        <blockcontextmenu/>
        
        
        
        
        
        
        
        `,
};
