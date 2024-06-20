<script>
/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
const { __ } = wp.i18n;
import { nextTick } from "vue";
import { validDateTemplate } from "@/utility/functions.js";

import templateHistory from "@/uibuilder/history/index.vue";
import AppButton from "@/components/app-button/index.vue";
import StatusTag from "@/components/status-tag/index.vue";
import AppSelect from "@/components/select/index.vue";
import Menulist from "@/components/menu-list/index.vue";

export default {
  components: { templateHistory, AppButton, StatusTag, AppSelect, Menulist },
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
      templateTypes: [
        {
          value: "ui-template",
          label: __("User interface", "uipress-lite"),
        },
        {
          value: "ui-admin-page",
          label: __("Admin page", "uipress-lite"),
        },
        {
          value: "ui-front-template",
          label: __("Frontend toolbar", "uipress-lite"),
        },
      ],
      menuLinks: [
        {
          name: __("Back to templates", "uipress-lite"),
          url: "/",
          icon: "chevron_left",
        },
        {
          name: __("Site settings", "uipress-lite"),
          url: "/site-settings",
          icon: "tune",
        },
        {
          type: "divider",
        },
        {
          name: __("New template", "uipress-lite"),
          icon: "add",
          type: "action",
          action: () => {
            this.createNewUI();
            this.$refs.logomenu.close();
          },
        },
        {
          name: __("Template settings", "uipress-lite"),
          url: this.returnSettingsLink,
          icon: "settings",
        },
        {
          name: __("Import template", "uipress-lite"),
          icon: "file_upload",
          type: "action",
          action: () => {
            this.$refs.template_upload.click();
            this.$refs.logomenu.close();
          },
        },
        {
          name: __("Export template", "uipress-lite"),
          icon: "file_download",
          type: "action",
          action: () => {
            this.exportTemplate("template");
            this.$refs.logomenu.close();
          },
        },
        {
          type: "divider",
        },
        {
          name: __("Documentation", "uipress-lite"),
          url: "https://docs.uipress.co/",
          icon: "bookmarks",
          external: true,
        },
        {
          name: __("Tip's and updates", "uipress-lite"),
          icon: "tips_and_updates",
          type: "action",
          action: () => {
            this.uipApp.tipsAndTricks.show();
            this.$refs.logomenu.close();
          },
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
      this.saving = true;

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
      this.saving = false;

      if (response.error) {
        this.uipApp.notifications.notify(__("Unable to save template", "uipress-lite"), response.message, "", "error", true);

        return false;
      }

      if (response.success) {
        await this.saveStylePresets();

        this.uipApp.notifications.notify(__("Template saved", "uipress-lite"), "", "success", true);
        this.unsavedChanges = false;
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
};
</script>

<template>
  <!--PREVIEW TOOLBAR -->
  <div id="uip-ui-preview-toolbar" class="relative flex flex-row items-center p-3 border-b border-zinc-200 z-[2]">
    <!-- Left actions -->
    <div class="flex flex-row items-center gap-3 grow">
      <dropdown pos="bottom left" ref="logomenu">
        <template v-slot:trigger>
          <!-- Logo -->
          <div class="p-2 rounded-lg bg-white shadow-md self-start flex flex-row items-center gap-2 cursor-pointer hover:bg-zinc-50">
            <div class="uip-logo w-5 aspect-square"></div>
            <AppIcon icon="unfold" class="text-xl text-zinc-400" />
          </div>
        </template>
        <template v-slot:content>
          <div>
            <Menulist :links="menuLinks" class="py-3 px-2" />
            <input hidden accept=".json" type="file" single="" ref="template_upload" id="uip-import-layout" @change="importTemplate($event, 'template')" />
            <a ref="templateexport" href="" style="display: none"></a>
          </div>
        </template>
      </dropdown>

      <!-- History -->
      <templateHistory />
    </div>

    <!--Middle actions -->
    <div class="flex flex-row items-center gap-3 justify-center grow">
      <span
        class=""
        contenteditable
        @input="
          (event) => {
            uiTemplate.globalSettings.name = event.target.innerText;
          }
        "
      >
        {{ uiTemplate.globalSettings.name }}
      </span>

      <router-link :to="returnSettingsLink">
        <StatusTag :status="uiTemplate.globalSettings.status ? 'success' : 'warning'" :text="uiTemplate.globalSettings.status ? ui.strings.active : ui.strings.draft" />
      </router-link>

      <AppSelect :options="templateTypes" class="text-sm" v-model="uiTemplate.globalSettings.type" />
    </div>

    <div class="flex flex-row items-center gap-2 grow justify-end">
      <AppButton
        :type="uiTemplate.isPreview ? 'primary' : 'default'"
        @click="
          () => {
            uiTemplate.isPreview = !uiTemplate.isPreview;
            uipApp.blockSettings.close();
          }
        "
        :title="ui.strings.preview"
      >
        <AppIcon icon="play_arrow" class="text-xl" />
      </AppButton>

      <router-link :to="returnSettingsLink" class="">
        <AppButton type="default" class="text-sm">
          <AppIcon icon="settings" class="text-lg" />
          <div class="">{{ ui.strings.settings }}</div>
        </AppButton>
      </router-link>

      <AppButton type="primary" @click="saveTemplate()" class="text-sm" :loading="saving">{{ ui.strings.saveTemplate }} </AppButton>
    </div>
  </div>
</template>
