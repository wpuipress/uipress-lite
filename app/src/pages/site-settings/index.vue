<script>
/**
 * Builds the main ui builder shell
 * @since 3.0.0
 */
import { __ } from "@wordpress/i18n";
import { nextTick, defineAsyncComponent } from "vue";

// Comps
import globalVariables from "@/uibuilder/variables/index.vue";
import LicenceManager from "@/uibuilder/licence-manager/index.vue";
import Tabs from "@/components/tabs/index.vue";

const CodeEditor = defineAsyncComponent(() => import("@/options/code-editor/index.vue"));

export default {
  components: { globalVariables, LicenceManager, Tabs, CodeEditor },
  data() {
    return {
      loading: false,
      globalSettings: {},
      search: "",
      render: true,
      activeTab: "general",
      ui: {
        strings: {
          siteSettings: __("Site settings", "uipress-lite"),
          saveSettings: __("Save settings", "uipress-lite"),
          settingsSaved: __("Settings saved", "uipress-lite"),
          proOption: __("This is a pro option. Upgrade to unlock", "uipress-lite"),
          searchSettings: __("Search settings", "uipress-lite"),
          licence: __("Licence", "uipress-lite"),
        },
      },
    };
  },

  created() {
    this.getSettings();
  },
  watch: {
    "uiTemplate.globalSettings": {
      handler(newValue, oldValue) {
        return;
        this.checkTemplateApplies();
      },
      deep: true,
    },
    "uiTemplate.globalSettings": {
      handler(newValue, oldValue) {
        return;
        this.checkTemplateApplies();
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Checks if pro plugin is activated
     *
     * @since 3.3.095
     */
    proPluginActivated() {
      let activePlugins = this.uipApp.data.options.activePlugins;
      activePlugins = this.isObject(activePlugins) ? Object.values(activePlugins) : activePlugins;
      return activePlugins.includes("uipress-pro/uipress-pro.php");
    },

    /**
     * Returns tabs from settings
     *
     * @since 3.3.095
     */
    returnTabs() {
      let options = {};

      for (let key in this.uipApp.data.globalGroupOptions) {
        options[key] = {
          label: this.uipApp.data.globalGroupOptions[key].label,
          value: key,
        };
      }

      console.log(options);

      return options;
    },
  },
  methods: {
    /**
     * Get's settings object
     *
     * @since 3.2.13
     */
    async getSettings() {
      this.loading = true;

      let formData = new FormData();
      formData.append("action", "uip_get_global_settings");
      formData.append("security", uip_ajax.security);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      this.loading = false;

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      //Get theme options
      await this.getUserStyles();

      if (!response.options) return;
      if (this.isObject(response.options)) {
        if (Object.keys(response.options).length > 0) {
          this.globalSettings = response.options;
        }
      }
    },

    /**
     * Get's user styles
     *
     * @since 3.2.13
     */
    async getUserStyles() {
      //Build form data for fetch request
      let formData = new FormData();
      formData.append("action", "uip_get_ui_styles");
      formData.append("security", uip_ajax.security);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      if (response.error) return;
      if (response.styles) this.uipApp.data.themeStyles = { ...this.uipApp.data.themeStyles, ...response.styles };
    },

    /**
     * Returns template option or it's required default value
     *
     * @param {String} group
     * @param {Object} option
     * @since 3.2.1.3
     */
    returnTemplateOption(group, option) {
      let key = option.uniqueKey;
      let options = this.globalSettings;
      if (!(group in options)) {
        options[group] = {};
      }
      if (key in options[group]) return options[group][key];

      // Set default values
      switch (option.accepts) {
        case String:
          options[group][key] = "";
          break;
        case Array:
          options[group][key] = [];
          break;
        case Object:
          options[group][key] = {};
          break;
        case Boolean:
          options[group][key] = false;
          break;
      }

      return options[group][key];
    },

    /**
     * Saves a template option
     *
     * @param {String} group
     * @param {String} key
     * @param {*} value
     * @since 3.2.13
     */
    saveTemplateOption(group, key, value) {
      let options = this.globalSettings;
      options[group][key] = value;
    },

    /**
     * Saves template settings
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async saveSettings() {
      let sendData = this.prepareJSON(this.globalSettings);

      let formData = new FormData();
      formData.append("action", "uip_save_global_settings");
      formData.append("security", uip_ajax.security);
      formData.append("settings", sendData);

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Handle error
      if (response.error) {
        this.uipApp.notifications.notify(response.message, "", "error", true);
        return;
      }

      this.uipApp.notifications.notify(this.ui.strings.settingsSaved, "", "success", true);
    },

    /**
     * Returns options condition if it has one
     *
     * @param {Object} group
     * @since 3.2.13
     */
    conditionalShowGroup(group) {
      if (!("condition" in group)) {
        return true;
      }

      return group.condition(this.globalSettings);
    },

    /**
     * Returns whether an item is in a given search
     *
     * @param {Object} option
     * @since 3.2.13
     */
    inSearch(option) {
      const sq = this.search.toLowerCase();
      const lqN = option.label.toLowerCase();
      const lqDes = option.help.toLowerCase();

      if (lqN.includes(sq) || lqDes.includes(sq)) return true;

      return false;
    },

    /**
     * Exports global settings into a JSON file.
     *
     * @since 3.2.13
     */
    exportSettings() {
      // Prepare the settings data.
      const layout = JSON.stringify({ uipSettings: this.globalSettings });

      // Get today's date in the format: mm-dd-yyyy.
      const today = new Date();
      const formattedDate = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}-${today.getFullYear()}`;

      // Construct the filename for the exported settings.
      const filename = `uip-site-settings-${formattedDate}.json`;

      // Create a data URI for the JSON content.
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(layout)}`;

      // Set the attributes for the download link and trigger the download.
      const dlAnchorElem = this.$refs.exporter;
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", filename);
      dlAnchorElem.click();

      // Notify the user about the successful export.
      const message = __("Settings exported", "uipress-lite");
      this.uipApp.notifications.notify(message, "", "success", true);
    },

    /**
     * Imports settings from json file
     *
     * @param {Object} event - the file change event
     * @since 3.2.13
     */
    importSettings(event) {
      const notiID = this.uipApp.notifications.notify(__("Importing settings", "uipress-lite"), "", "default", false, true);
      const fileInput = event.target;
      const thefile = fileInput.files[0];

      const handleError = (message) => {
        this.uipApp.notifications.notify(message, "", "error", true, false);
        this.uipApp.notifications.remove(notiID);
      };

      if (thefile.type !== "application/json") {
        return handleError(__("Settings must be in valid JSON format", "uipress-lite"));
      }

      if (thefile.size > 1000000) {
        return handleError(__("Uploaded file is too big", "uipress-lite"));
      }

      const reader = new FileReader();
      reader.readAsText(thefile, "UTF-8");

      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);

          if (!parsed || !parsed.uipSettings || !this.isObject(parsed.uipSettings)) {
            return handleError(__("Settings mismatch", "uipress-lite"));
          }

          this.globalSettings = parsed.uipSettings;

          this.uipApp.notifications.notify(__("Settings imported", "uipress-lite"), "", "success", true, false);
          this.uipApp.notifications.remove(notiID);

          this.render = false;
          this.$nextTick(() => {
            this.render = true;
          });
        } catch (error) {
          handleError(__("JSON parse failed", "uipress-lite"));
        }
      };
    },
  },
};
</script>

<template>
  <!-- Site settings -->
  <div class="uip-flex uip-flex-column uip-w-100p uip-max-h-100p uip-flex-no-wrap uip-row-gap-m uip-padding-top-s">
    <div class="uip-flex uip-flex-between uip-flex-center">
      <div class="uip-text-l uip-text-emphasis">{{ ui.strings.siteSettings }}</div>
      <div class="uip-flex uip-gap-xs">
        <button class="uip-button-default" @click="exportSettings()">
          <AppIcon class="uip-icon" icon="download" />
        </button>
        <a class="uip-hidden" ref="exporter"></a>

        <label class="uip-button-default">
          <AppIcon icon="upload" class="uip-icon" />
          <input hidden accept=".json" type="file" single="" id="uip-import-layout" @change="importSettings($event)" />
        </label>

        <button class="uip-button-primary" @click="saveSettings()">{{ ui.strings.saveSettings }}</button>
      </div>
    </div>

    <Tabs :options="returnTabs" v-model="activeTab" class="uip-margin-bottom-s" />

    <div class="uip-flex-grow uip-flex uip-flex-column uip-row-gap-s uip-padding-left-xs uip-padding-right-xs" style="overflow: auto">
      <!-- Dynamic settings -->

      <div class="uip-flex uip-flex-column uip-row-gap-m">
        <!--Loop through group settings -->

        <!-- Licence manager -->
        <template v-if="proPluginActivated && activeTab == 'general'">
          <LicenceManager />
          <div class="uip-border-top"></div>
        </template>

        <template v-for="option in uipApp.data.globalGroupOptions[activeTab].settings">
          <div v-if="conditionalShowGroup(option)" class="uip-grid-col-4-6" style="grid-gap: var(--uip-margin-m)">
            <div class="uip-flex uip-flex-column uip-gap-xxs">
              <span class="uip-text-emphasis">{{ option.label }}</span>
              <div class="uip-text-muted">{{ option.help }}</div>
            </div>

            <div class="uip-w-100p">
              <a
                href="https://uipress.co?utm_source=uipressupgrade&utm_medium=referral"
                target="_BLANK"
                v-if="option.proOption"
                class="uip-padding-xxs uip-border-round uip-background-green-wash uip-text-s uip-link-default uip-no-underline uip-w-100p uip-text-center uip-flex"
              >
                {{ ui.strings.proOption }}
              </a>
              <component
                v-else
                :is="option.component"
                :value="returnTemplateOption(uipApp.data.globalGroupOptions[activeTab].name, option)"
                :args="option.args"
                :returnData="
                  (data) => {
                    saveTemplateOption(uipApp.data.globalGroupOptions[activeTab].name, option.uniqueKey, data);
                  }
                "
              ></component>
            </div>
          </div>

          <div class="uip-border-top"></div>
        </template>

        <template v-if="activeTab == 'theme'">
          <globalVariables />
        </template>
        <!--End loop through group settings -->
      </div>
      <!-- End dynamic settings -->
    </div>
  </div>
</template>
