<script setup>
import Notify from "@/components/notify/index.vue";
import { nextTick, ref, computed, onMounted, onBeforeUnmount, provide } from "vue";
import { lmnFetch } from "@/assets/js/functions/lmnFetch.js";
import { get_block_option, isObject, hasNestedPath, uipParseJson } from "@/utility/functions.js";
import { ShadowRoot } from "vue-shadow-dom";
import { uipApp } from "@/store/app/constants.js";
import { useAppStore } from "@/store/app/app.js";

// Component registration
const components = { Notify, ShadowRoot };

// State
const template = ref({
  display: "prod",
  notifications: [],
  settings: null,
  content: null,
  globalSettings: null,
  updated: null,
  id: null,
});
const appStore = useAppStore();
const adoptedStyleSheets = ref(new CSSStyleSheet());
const isLoading = ref(false);
const updateAvailable = ref(false);
const windowWidth = ref(window.innerWidth);
const shadowMount = ref(null);
const teleportPoint = ref(null);

// Provide template to child components
provide("uiTemplate", template.value);

// Computed properties
const returnThemeStyles = computed(() => {
  return isObject(uipApp.data.themeStyles) ? uipApp.data.themeStyles : {};
});

const returnTemplateJS = computed(() => {
  if (typeof template.value?.globalSettings?.options === "undefined") return;
  return hasNestedPath(template.value, "globalSettings", "options", "advanced", "js");
});

const returnTemplateCSS = computed(() => {
  if (typeof template.value?.globalSettings?.options === "undefined") return;
  return hasNestedPath(template.value, "globalSettings", "options", "advanced", "css");
});

const returnResponsiveClass = computed(() => {
  if (windowWidth.value >= 990) return "uip-desktop-view";
  if (windowWidth.value >= 699) return "uip-tablet-view";
  return "uip-phone-view";
});

/**
 * Injects styles into shadow root
 */
const setStyles = () => {
  let appStyleNode = document.querySelector("#uip-app-css");
  if (!appStyleNode) {
    appStyleNode = manuallyAddStyleSheet();
    // Wait for stylesheet to load
    appStyleNode.onload = () => {
      const appStyles = appStyleNode.sheet;
      for (const rule of appStyles.cssRules) {
        adoptedStyleSheets.value.insertRule(rule.cssText);
      }
    };
  } else {
    const appStyles = appStyleNode.sheet;
    for (const rule of appStyles.cssRules) {
      adoptedStyleSheets.value.insertRule(rule.cssText);
    }
  }
};

// Methods
const setStylesOld = async () => {
  let appStyleNode = document.querySelector("#uip-app-css");
  const appStyles = appStyleNode.sheet;

  for (const rule of appStyles.cssRules) {
    adoptedStyleSheets.value.insertRule(rule.cssText);
  }
};

const manuallyAddStyleSheet = () => {
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `${appStore.state.siteURL}/wp-content/plugins/uipress-lite/assets/css/uip-app.css`;
  document.head.appendChild(link);

  return link;
};
const initiateApp = async () => {
  isLoading.value = true;
  await setStyles();
  await fetchTemplate();

  nextTick(() => {
    isLoading.value = false;
  });
};

const fetchTemplate = async () => {
  const templateType = appStore.state.templateType;
  const templateID = appStore.state.templateID;

  if (templateType === "ui-template") {
    const cachedTemplate = getCachedTemplate();

    if (cachedTemplate === "no_templates") return destroyApp();
    if (cachedTemplate) return updateActiveTemplate(cachedTemplate);

    await fetchUserInterface();
  }

  if (templateType === "ui-front-template") {
    await fetchUserInterface();
  }

  if (templateType === "ui-admin-page" && templateID) {
    await fetchAdminPage();
  }
};

const fetchAdminPage = async () => {
  const templateID = appStore.state.templateID;
  const args = {
    endpoint: `wp/v2/uip-ui-template/${templateID}`,
    params: { per_page: 1, status: "publish", context: "edit" },
  };

  const response = await lmnFetch(args);
  const templateData = response.data;

  if (!templateData) return;
  updateActiveTemplate(templateData);
};

const fetchUserInterface = async () => {
  const args = {
    endpoint: "wp/v2/uip-ui-template",
    params: { per_page: 100, status: "publish", context: "edit" },
  };

  const response = await lmnFetch(args);
  const templates = response.data;

  if (!templates.length) {
    cacheNoActiveTemplate();
  } else {
    checkForActiveTemplate(templates);
  }
};

const checkForActiveTemplate = (templates) => {
  const templateType = appStore.state.templateType;
  const userRoles = appStore.state.userRoles;

  for (let template of templates) {
    // Bail if incorrect type
    if (template.uipress.type !== templateType) continue;

    // Ensures ui templates have a page content available
    if (templateType == "ui-template") {
      const templateString = JSON.stringify(template.uipress.template);
      if (!templateString.includes("uip-content") || !templateString.includes("uip-admin-menu-new")) continue;
    }

    // Set up roles and users
    const includesRoles = template.uipress.forRoles || [];
    const includesUsers = template.uipress.forUsers || [];
    const excludedRoles = template.uipress.excludesRoles || [];
    const excludedUsers = template.uipress.excludesUsers || [];

    // Apply to everyone
    const applyToEveryone = template.uipress?.settings?.applyToEveryone;

    // Check if user is matched
    const matchedUser = includesUsers.find((item) => item == appStore.state.userID);
    // Check if user role matches
    let matchedRole = false;
    for (let role of userRoles) {
      const match = includesRoles.find((item) => item == role);
      if (match) {
        matchedRole = true;
        break;
      }
    }

    // Check if user is excluded
    const matchedExcludedUser = excludedUsers.find((item) => item == appStore.state.userID);
    // Check if user role matches
    let matchedExcludedRole = false;
    for (let role of userRoles) {
      const match = excludedRoles.find((item) => item == role);
      if (match) {
        matchedExcludedRole = true;
        break;
      }
    }

    if (applyToEveryone === "uiptrue") {
      // Matched template
      updateActiveTemplate(template);
      cacheActiveTemplate(template);
      return;
    }

    // User is either matched by role or user id and not excluded by role or user id
    else if ((matchedUser || matchedRole) && !matchedExcludedUser && !matchedExcludedRole) {
      // Matched template
      updateActiveTemplate(template);
      cacheActiveTemplate(template);
      return;
    }
  }

  cacheNoActiveTemplate();
  destroyApp();
};

const getCachedTemplate = () => {
  try {
    const cachedData = localStorage.getItem("uipress_templates");
    if (!cachedData) return null;

    const { template, cacheKey } = JSON.parse(cachedData);

    if (appStore.state.cacheKey == cacheKey) {
      return template;
    }

    localStorage.removeItem("uipress_templates");
    return null;
  } catch (error) {
    console.error("Failed to retrieve cached template:", error);
    return null;
  }
};

const cacheActiveTemplate = (templateData) => {
  // Don't cache front templates
  const templateType = appStore.state.templateType;
  if (templateType === "ui-front-template") {
    return;
  }

  const cacheData = {
    template: templateData,
    cacheKey: appStore.state.cacheKey,
  };

  try {
    localStorage.setItem("uipress_templates", JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error("Failed to cache template:", error);
    return false;
  }
};

const cacheNoActiveTemplate = () => {
  // Don't cache front templates
  const templateType = appStore.state.templateType;
  if (templateType === "ui-front-template") {
    return;
  }

  const cacheData = {
    template: "no_templates",
    no_templates: true,
    cacheKey: appStore.state.cacheKey,
  };

  try {
    localStorage.setItem("uipress_templates", JSON.stringify(cacheData));
    return true;
  } catch (error) {
    console.error("Failed to cache template:", error);
    return false;
  }
};

const updateActiveTemplate = (templateData) => {
  const templateType = appStore.state.templateType;

  if (templateType === "ui-template") {
    document.body.style.opacity = 1;
    document.documentElement.style.overflow = "hidden";
  }

  appStore.updateState("teleportPoint", teleportPoint.value);

  template.value.settings = uipParseJson(JSON.stringify(templateData.uipress.settings));
  template.value.content = uipParseJson(JSON.stringify(templateData.uipress.template));
  template.value.globalSettings = uipParseJson(JSON.stringify(templateData.uipress.settings));
  template.value.id = templateData.id;

  nextTick(() => {
    isLoading.value = false;
  });
};

const destroyApp = () => {
  document.body.style.opacity = 1;
  document.documentElement.style.overflow = "auto";
  document.documentElement.removeAttribute("uip-core-app");
  document.documentElement.removeAttribute("uip-admin-theme");
  const appInterface = document.querySelector("#uip-ui-interface");
  if (appInterface) appInterface.remove();
};

const handleWindowResize = () => {
  windowWidth.value = window.innerWidth;
};

const toggleDarkMode = () => {
  const state = uipApp.data.userPrefs.darkTheme;
  uipApp.data.userPrefs.darkTheme = !state;

  const theme = state ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);

  const frames = document.querySelectorAll("iframe");
  if (!frames) return;

  for (const iframe of frames) {
    const head = iframe.contentWindow.document.documentElement;
    if (!head) continue;
    head.setAttribute("data-theme", theme);
  }

  saveUserPreference("darkTheme", !state, false);
};

const getNotifications = () => {
  const notifications = document.querySelectorAll(".notice:not(#message):not(.inline):not(.update-message),.wp-analytify-notification");

  if (!notifications) return;

  template.value.notifications = [];

  let notiActive = false;
  const stringTemplate = JSON.stringify(template.value.content);
  if (stringTemplate.includes("site-notifications")) notiActive = true;

  for (const noti of notifications) {
    template.value.notifications.push(noti.outerHTML.replace("uip-framed-page=1", ""));
    if (notiActive) {
      noti.setAttribute("style", "display:none !important; visibility: hidden !important; opacity: 0 !important;");
    }
  }

  uipApp.data.dynamicOptions.notificationCount.value = template.value.notifications.length;
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("resize", handleWindowResize);
  getNotifications();
  initiateApp();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleWindowResize);
  document.removeEventListener("uipress/app/darkmode/toggle", toggleDarkMode);
});
</script>

<template>
  <component is="style" v-if="!isLoading">#wpadminbar{opacity:1 !important}</component>

  <component
    :is="['ui-front-template', 'ui-template'].includes(appStore.state.templateType) ? ShadowRoot : 'div'"
    tag="div"
    :adopted-style-sheets="[adoptedStyleSheets]"
    ref="shadowMount"
    id="uipress-shadow-root"
  >
    <div
      class="uip-h-100p uip-background-default uip-user-frame uip-body-font uip-teleport uip-flex overflow-hidden"
      :class="appStore.state.templateType === 'ui-template' ? 'uip-w-vw' : 'uip-w-100p'"
    >
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

      <!-- isLoading -->
      <div v-if="isLoading" class="" style="text-align: center; padding: 60px; position: absolute; top: 0; bottom: 0; left: 0; right: 0">Loading...</div>

      <!-- Not isLoading-->
      <uip-content-area :content="template.content" :class="returnResponsiveClass" v-else-if="!isLoading" />

      <!--Import plugins -->
      <template v-for="plugin in uipGlobalPlugins">
        <component :is="plugin" />
      </template>
      <!-- end plugin import -->

      <div ref="teleportPoint"></div>
    </div>
  </component>
</template>
