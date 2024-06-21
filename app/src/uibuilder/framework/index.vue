<script>
/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __ } = wp.i18n;
import { nextTick } from "vue";

import layersPanels from "@/uibuilder/layers/index.vue";
import blockcontextmenu from "@/uibuilder/block-contextmenu/index.vue";
import ToolBar from "@/uibuilder/toolbar/index.vue";
import Canvas from "@/uibuilder/canvas/index.vue";
import BlockList from "@/uibuilder/block-list/index.vue";
import TemplateLibrary from "@/uibuilder/template-library/index.vue";
import DynamicData from "@/uibuilder/dynamic-data-watcher/index.vue";

export default {
  components: {
    layersPanels,
    blockcontextmenu,
    ToolBar,
    Canvas,
    BlockList,
    TemplateLibrary,
    DynamicData,
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
      const containerBlock = this.uipApp.data.blocks.find((obj) => obj.metadata.moduleName == "uip-container");

      if (!containerBlock) return;

      let copiedConatiner = JSON.parse(JSON.stringify(containerBlock.metadata));

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
};
</script>

<template>
  <component is="style"> .v-enter-active, .v-leave-active {transition: opacity 0.6s ease;} .v-enter-from, .v-leave-to {opacity: 0;} </component>

  <Transition>
    <!-- Loading placeholder -->
    <div v-if="!layoutFetched" class="bg-white h-screen max-h-screen w-screen flex items-center place-content-center fixed z-[9]">
      <loading-chart />
    </div>

    <div v-else class="bg-white h-screen max-h-screen w-screen flex uip-builder-frame flex-col">
      <!--Dynamic data watcher-->
      <DynamicData />

      <!--Builder Toolbar-->
      <ToolBar />

      <div class="flex h-full grow overflow-hidden relative max-w-screen">
        <!--Left panel -->
        <div class="overflow-auto border-r border-zinc-200 shrink-0 w-[300px] max-h-full z-[1] flex flex-col gap-6 p-4 bg-white" v-if="!template.isPreview">
          <!-- Switch between tabs -->
          <toggle-switch
            :options="switchOptions"
            :activeValue="ui.sideBar.activeTab"
            :dontAccentActive="true"
            :returnValue="
              (data) => {
                ui.sideBar.activeTab = data;
              }
            "
          />

          <!-- OUTPUT SETTINGS OR BLOCKS -->
          <div class="grow overflow-auto">
            <TemplateLibrary v-if="ui.sideBar.activeTab == 'library'" />

            <BlockList v-if="ui.sideBar.activeTab == 'blocks'" />

            <!--LAYERS-->
            <layersPanels
              v-if="ui.sideBar.activeTab == 'layers'"
              :content="template.content"
              :returnData="
                (data) => {
                  template.content = data;
                }
              "
            />

            <!--END LAYERS-->
          </div>
        </div>
        <!--End Layers panel -->

        <!-- Main canvas -->
        <Canvas />
        <!--End canvas-->

        <!--Right bar -->
        <RouterView :key="$route.path" v-show="!template.isPreview" />
        <!-- End right bar -->
      </div>
    </div>
  </Transition>

  <!--Import plugins -->
  <template v-for="plugin in uipGlobalPlugins" v-if="layoutFetched">
    <component :is="plugin" />
  </template>
  <!-- end plugin import -->

  <!--Block context menu-->
  <blockcontextmenu />
</template>
