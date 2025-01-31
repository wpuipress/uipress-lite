<script>
import Notify from "@/components/notify/index.vue";
import { nextTick, ref } from "vue";
import { lmnFetch } from "@/assets/js/functions/lmnFetch.js";
import { ShadowRoot } from "vue-shadow-dom";

// Setup store
import { useAppStore } from "@/store/app/app.js";

export default {
  components: { Notify, ShadowRoot },
  props: {},
  data() {
    return {
      appStore: useAppStore(),
      template: {
        display: "prod",
        notifications: [],
        settings: null,
        content: null,
        globalSettings: null,
        updated: null,
        id: null,
      },
      adoptedStyleSheets: new CSSStyleSheet(),
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
  mounted() {
    this.mountEventListeners();
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    document.removeEventListener("uipress/app/page/load/finish", this.getNotifications, { once: false });
    document.removeEventListener("uipress/app/darkmode/toggle", this.toggleDarkMode, { once: false });
  },
  computed: {
    /**
     * Returns user theme styles
     *
     * @since 3.2.0
     */
    returnThemeStyles() {
      return this.isObject(this.uipApp.data.themeStyles) ? this.uipApp.data.themeStyles : {};
    },
    /**
     * Returns template javascript if it exists
     *
     * @since 3.2.13
     */
    returnTemplateJS() {
      if (typeof this.template?.globalSettings?.options === "undefined") return;
      return this.hasNestedPath(this.template, "globalSettings", "options", "advanced", "js");
    },

    /**
     * Returns template css if it exists
     *
     * @since 3.2.13
     */
    returnTemplateCSS() {
      if (typeof this.template?.globalSettings?.options === "undefined") return;
      return this.hasNestedPath(this.template, "globalSettings", "options", "advanced", "css");
    },

    /**
     * Returns the current responsive class for the app
     *
     * @since 3.2.13
     */
    returnResponsiveClass() {
      if (this.windowWidth >= 990) return "uip-desktop-view";
      if (this.windowWidth >= 699) return "uip-tablet-view";
      if (this.windowWidth < 699) return "uip-phone-view";
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
    async initiateApp() {
      //this.template.settings = this.uipParseJson(JSON.stringify(uipUserTemplate.settings));
      //this.template.content = this.uipParseJson(JSON.stringify(uipUserTemplate.content));
      //this.template.globalSettings = this.uipParseJson(JSON.stringify(uipUserTemplate.settings));
      //this.template.updated = this.uipParseJson(uipUserTemplate.updated);
      //this.template.id = uipUserTemplate.id;

      await this.setStyles();
      this.fetchTemplate();
      //this.loading = false;
    },
    /**
     * Injects styles into shadow root
     */
    async setStyles() {
      let appStyleNode = document.querySelector("#uip-app-css");

      const appStyles = appStyleNode.sheet;
      for (const rule of appStyles.cssRules) {
        this.adoptedStyleSheets.insertRule(rule.cssText);
      }

      //appStyleNode.remove();
    },

    async fetchTemplate() {
      const cachedTemplate = this.getCachedTemplate();
      if (cachedTemplate) return this.updateActiveTemplate(cachedTemplate);

      const args = { endpoint: "wp/v2/uip-ui-template", params: { per_page: 100, status: "publish", context: "edit" } };
      const response = await lmnFetch(args);

      const templates = response.data;

      if (!templates.length) {
        // abort
      } else {
        this.checkForActiveTemplate(templates);
      }
    },

    checkForActiveTemplate(templates) {
      for (let template of templates) {
        const appliesToRoles = template.uipress.forRoles;

        // Ensure role matches
        for (let role of this.appStore.state.userRoles) {
          if (appliesToRoles.includes(role)) {
            this.updateActiveTemplate(template);
            this.cacheActiveTemplate(template);
            return;
          }
        }

        this.destroyApp();
      }
    },

    /**
     * Retrieves and validates cached template
     * @returns {Object|null} The cached template if valid, null otherwise
     */
    getCachedTemplate() {
      try {
        const cachedData = localStorage.getItem("uipress_templates");

        if (!cachedData) {
          return null;
        }

        const { template, cacheKey } = JSON.parse(cachedData);

        // Check if cache is less than 3 hours old
        if (this.appStore.state.cacheKey == cacheKey) {
          return template;
        } else {
          // Cache is expired, remove it
          localStorage.removeItem("uipress_templates");
          return null;
        }
      } catch (error) {
        console.error("Failed to retrieve cached template:", error);
        return null;
      }
    },

    /**
     * Caches the active template with a timestamp
     * @param {Object} template - The template to cache
     */
    cacheActiveTemplate(template) {
      const cacheData = {
        template: template,
        cacheKey: this.appStore.state.cacheKey,
      };

      try {
        localStorage.setItem("uipress_templates", JSON.stringify(cacheData));
        return true;
      } catch (error) {
        console.error("Failed to cache template:", error);
        return false;
      }
    },

    updateActiveTemplate(template) {
      document.body.style.opacity = 1;
      document.documentElement.style.overflow = "hidden";

      this.appStore.updateState("teleportPoint", this.$refs.teleportPoint);

      this.template.settings = this.uipParseJson(JSON.stringify(template.uipress.settings));
      this.template.content = this.uipParseJson(JSON.stringify(template.uipress.template));
      this.template.globalSettings = this.uipParseJson(JSON.stringify(template.uipress.settings));
      //this.template.updated = this.uipParseJson(uipUserTemplate.updated);
      this.template.id = template.id;

      this.loading = false;
    },

    destroyApp() {
      document.body.style.opacity = 1;
      document.documentElement.style.overflow = "auto";
      const appInterface = document.querySelector("#uip-ui-interface");
      const styles = document.querySelector("#uip-app-css");

      if (appInterface) appInterface.remove();
      if (styles) styles.remove();
    },

    /**
     * mounts app events listeners
     *
     * @since 3.2.13
     */
    mountEventListeners() {
      window.addEventListener("resize", this.handleWindowResize);
      document.addEventListener("uipress/app/page/load/finish", this.getNotifications, { once: false });
      document.addEventListener("uipress/app/darkmode/toggle", this.toggleDarkMode, { once: false });

      // Check if it's a ui template and watch for updates
      if (this.template?.globalSettings?.type != "ui-template") return;
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
     * Checks for updates
     *
     * @since 3.2.13
     */
    async checkForUpdates() {
      // Exit if there is already an update
      if (this.updateAvailable) return;

      let formData = new FormData();
      formData.append("action", "uip_check_for_template_updates");
      formData.append("security", uip_ajax.security);
      formData.append("template_id", this.template.id);

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
      let string = __("Changes have been made to your current app. Refresh the page to update", "uipress-lite");
      this.uipApp.notifications.notify(__("Update available", "uipress-lite"), string, "", true);
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
};
</script>

<template>
  <ShadowRoot tag="div" :adopted-style-sheets="[adoptedStyleSheets]" ref="shadowMount" id="uipress-shadow-root">
    <div class="uip-w-100vw uip-h-100p uip-background-default uip-top-0 uip-user-frame uip-body-font uip-teleport uip-flex overflow-hidden">
      <Notify />

      <component is="style" scoped id="mycustomstyles">
        html, #uip-admin-page, #uip-ui-interface {
        <template v-for="(item, index) in returnThemeStyles">
          <template v-if="item.value && item.value != 'uipblank'">{{ index }}:{{ item.value }};</template>
        </template>
        } [data-theme="dark"], .uip-dark-mode, #uip-admin-page .uip-dark-mode, #uip-ui-interface .uip-dark-mode {
        <template v-for="(item, index) in returnThemeStyles">
          <template v-if="item.darkValue && item.darkValue != 'uipblank'"> {{ index }}:{{ item.darkValue }};</template>
        </template>
        }
        {{ returnTemplateCSS }}
      </component>

      <component is="script" scoped>
        {{ returnTemplateJS }}
      </component>

      <component is="style"> .v-enter-active, .v-leave-active {transition: opacity 0.6s ease;} .v-enter-from, .v-leave-to {opacity: 0;} </component>

      <uip-content-area :content="template.content" :class="returnResponsiveClass" v-if="!isLoading" />

      <div v-else class="" style="text-align: center; padding: 60px; position: absolute; top: 0; bottom: 0; left: 0; right: 0">Loading....</div>

      <!--Import plugins -->
      <template v-for="plugin in uipGlobalPlugins">
        <component :is="plugin" />
      </template>
      <!-- end plugin import -->
      <div ref="teleportPoint"></div>
    </div>
  </ShadowRoot>
</template>
