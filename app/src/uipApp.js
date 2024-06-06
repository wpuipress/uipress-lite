/**
 * Imports vue, router and draggable
 *
 * @since 3.2.13
 */
import { __ } from "@wordpress/i18n";
import { createApp, getCurrentInstance, defineComponent, defineAsyncComponent, reactive } from "vue";
const pluginVersion = import.meta.url.split("?ver=")[1];

// Import functions
import { registerGlobalComponents } from "./setup/registerGlobalComponents.js";

/**
 * Registers blocks.
 *
 * @since 3.2.13
 */

import { registerCoreBlocks } from "@/setup/registerCoreBlocks.js";
const AllBlocks = registerCoreBlocks();

/**
 * Applies app plugin filters
 *
 * @since 3.2.13
 */
wp.hooks.addFilter("uipress.app.plugins.register", "uipress", (current) => [...current, []]);
const AllPlugins = wp.hooks.applyFilters("uipress.app.plugins.register", []);

/**
 * Import dynamic data into the app
 *
 * @since 3.2.13
 */
import { processDynamicSettings } from "./setup/processDynamicSettings.js";
const dynamic_settings = processDynamicSettings(uip_ajax.uipAppData.options.dynamicData);
wp.hooks.addFilter("uipress.uibuilder.dynamicdata.register", "uipress", (current) => ({ ...current, ...dynamic_settings }));
const AllDynamics = wp.hooks.applyFilters("uipress.uibuilder.dynamicdata.register", {});

/**
 * Register theme styles
 *
 * @since 3.2.13
 */
import themeStyles from "./setup/themeStyles.js";
wp.hooks.addFilter("uipress.app.variables.register", "uipress", (current) => ({ ...current, ...themeStyles }));
let AllThemeStyles = wp.hooks.applyFilters("uipress.app.variables.register");

/**
 * Builds main args for uip app
 *
 * @since 3.0.0
 */

import MainApp from "@/components/app-view/index.vue";
const app = createApp(MainApp);

// Import Core components
registerGlobalComponents(app);

/**
 * Sets up global properties and functions
 *
 * @since 3.2.13
 */
import {
  ensureNestedObject,
  hasNestedPath,
  prepareJSON,
  deepClone,
  copyToClipboard,
  isObject,
  isUnDefined,
  get_block_option,
  createUID,
  sendServerRequest,
  updateAppPage,
  saveUserPreference,
  updateActiveLink,
  uipParseJson,
} from "@/utility/functions.js";

app.config.globalProperties.ensureNestedObject = ensureNestedObject;
app.config.globalProperties.hasNestedPath = hasNestedPath;
app.config.globalProperties.prepareJSON = prepareJSON;
app.config.globalProperties.deepClone = deepClone;
app.config.globalProperties.copyToClipboard = copyToClipboard;
app.config.globalProperties.isObject = isObject;
app.config.globalProperties.isUnDefined = isUnDefined;
app.config.globalProperties.get_block_option = get_block_option;
app.config.globalProperties.createUID = createUID;
app.config.globalProperties.sendServerRequest = sendServerRequest;
app.config.globalProperties.updateAppPage = updateAppPage.bind({ adminURL: uip_ajax.uipAppData.options.adminURL, isBuilder: false });
app.config.globalProperties.updateActiveLink = updateActiveLink.bind({ adminURL: uip_ajax.uipAppData.options.adminURL, isBuilder: false });
app.config.globalProperties.saveUserPreference = saveUserPreference;
app.config.globalProperties.uipParseJson = uipParseJson;

let UserThemeStyles = uip_ajax.uipAppData.themeStyles;
AllThemeStyles = isObject(UserThemeStyles) ? { ...AllThemeStyles, ...UserThemeStyles } : AllThemeStyles;

const plugindata = {
  defineAsyncComponent: defineAsyncComponent,
  liteVersion: pluginVersion,
  reactive: reactive,
};
window.uipress = isObject(window.uipress) ? { ...window.uipress, ...plugindata } : plugindata;

// Get menu
const menuScript = document.querySelector("#uip-admin-menu");
const uipMasterMenu = menuScript ? uipParseJson(menuScript.getAttribute("data-menu")) : { menu: [] };

// Get Toolbar
const toolbarScript = document.querySelector("#uip-admin-toolbar");
const uipMasterToolbar = toolbarScript ? uipParseJson(toolbarScript.getAttribute("data-toolbar")) : [];

//Check for RTL
let RTL = document.documentElement.getAttribute("dir");
RTL = RTL === "rtl" ? true : false;

app.config.globalProperties.uipApp = reactive({
  scrolling: false,
  litePath: uip_ajax.uipAppData.options.pluginURL,
  isRTL: RTL,
  data: {
    plugins: AllPlugins,
    blocks: AllBlocks,

    // Import from global
    options: uip_ajax.uipAppData.options,
    userPrefs: isObject(uip_ajax.uipAppData.userPrefs) ? uip_ajax.uipAppData.userPrefs : {},
    adminMenu: uipMasterMenu,
    toolbar: toolbarScript,

    dynamicOptions: AllDynamics,
    themeStyles: AllThemeStyles,

    // General
    templateDarkMode: false,
    darkMode: false,
    enviroment: "prod",
  },
});

app.mount("#uip-ui-app");
