/**
 * Imports vue, router and draggable
 *
 * @since 3.2.13
 */
import { __ } from "@wordpress/i18n";
import { createApp, getCurrentInstance, defineComponent, defineAsyncComponent, reactive } from "vue";
import { router } from "./router/index.js";
import { createHooks } from "@wordpress/hooks";

// Create hook object
const uipfilters = {
  hooks: createHooks(),
};

// Import functions
import { registerGlobalComponents } from "./setup/registerGlobalComponents.js";
import { registerBuilderComponents } from "./setup/registerBuilderComponents.js";

/**
 * Process lite blocks and call filter to allow pro blocks to be registered.
 *
 * Filters out blocks to ensure unique list
 *
 * @since 3.2.13
 */

//import "./blocks/layout/loader.js";
//import "./blocks/elements/loader.js";
//import "./blocks/inputs/loader.js";
//import "./blocks/dynamic/loader.js";
//import "./blocks/analytics/loader.js";
//import "./blocks/storeanalytics/loader.js";

import { registerCoreBlocks } from "@/js/uip/setup/registerCoreBlocks.js";
const AllBlocks = registerCoreBlocks();

/**
 * Imports block groupings and applies filters
 *
 * @since 3.2.13
 */
import { blockGroups } from "./setup/blockGroups.js";
uipfilters.hooks.addFilter("uipress.blocks.groups.register", "uipress", (current) => ({ ...current, ...blockGroups }));
const AllBlockGroups = uipfilters.hooks.applyFilters("uipress.blocks.groups.register", {});

/**
 * Applies app plugin filters
 *
 * @since 3.2.13
 */
uipfilters.hooks.addFilter("uipress.app.plugins.register", "uipress", (current) => [...current, []]);
const AllPlugins = uipfilters.hooks.applyFilters("uipress.app.plugins.register", []);

/**
 * Import dynamic data into the app
 *
 * @since 3.2.13
 */
import { processDynamicSettings } from "./setup/processDynamicSettings.js";
const dynamic_settings = processDynamicSettings(uip_ajax.uipAppData.options.dynamicData);
uipfilters.hooks.addFilter("uipress.uibuilder.dynamicdata.register", "uipress", (current) => ({ ...current, ...dynamic_settings }));
const AllDynamics = uipfilters.hooks.applyFilters("uipress.uibuilder.dynamicdata.register", {});

/**
 * Register theme styles
 *
 * @since 3.2.13
 */
import themeStyles from "./setup/themeStyles.js";
uipfilters.hooks.addFilter("uipress.app.variables.register", "uipress", (current) => ({ ...current, ...themeStyles }));
const AllThemeStyles = uipfilters.hooks.applyFilters("uipress.app.variables.register");

/**
 * Import template group settings
 *
 * @since 3.2.13
 */
import { templategroups, templateSettings } from "./settings/template-settings-groups.js";

uipfilters.hooks.addFilter("uipress.uibuilder.templatesettings.groups.register", "uipress", (current) => ({ ...current, ...templategroups }));
uipfilters.hooks.addFilter("uipress.uibuilder.templatesettings.options.register", "uipress", (current) => [...current, ...templateSettings]);

let TemplateGroupOptions = uipfilters.hooks.applyFilters("uipress.uibuilder.templatesettings.groups.register", {});
let options = uipfilters.hooks.applyFilters("uipress.uibuilder.templatesettings.options.register", []);
for (let [key, value] of Object.entries(TemplateGroupOptions)) {
  const groupSettings = options.filter((option) => option.group === key);
  TemplateGroupOptions[key].settings = groupSettings;
}

/**
 * Import global group settings
 *
 * @since 3.2.13
 */

import { globalSettingsGroups, globalSettings, processGlobalGroups } from "./settings/global-settings-groups.js";

uipfilters.hooks.addFilter("uipress.app.sitesettings.groups.register", "uipress", (current) => ({ ...current, ...globalSettingsGroups }));
uipfilters.hooks.addFilter("uipress.app.sitesettings.options.register", "uipress", (current) => [...current, ...globalSettings]);

let SiteSettingsGroups = uipfilters.hooks.applyFilters("uipress.app.sitesettings.groups.register", {});
let SiteSettingsOptions = uipfilters.hooks.applyFilters("uipress.app.sitesettings.options.register", []);
SiteSettingsGroups = processGlobalGroups(SiteSettingsGroups, SiteSettingsOptions);

/**
 * Register plugins, blocks, settings and groups
 *
 * @since 3.2.13
 */

import BaseApp from "@/js/uip/router/builder.vue";
const app = createApp(BaseApp);
app.use(router);

// Import Core components
registerGlobalComponents(app);
registerBuilderComponents(app);

/**
 * Import helper functions
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
} from "@/js/uip/utility/functions.js";

app.config.globalProperties.ensureNestedObject = ensureNestedObject;
app.config.globalProperties.hasNestedPath = hasNestedPath;
app.config.globalProperties.prepareJSON = prepareJSON;
app.config.globalProperties.deepClone = deepClone;
app.config.globalProperties.copyToClipboard = copyToClipboard;
app.config.globalProperties.isObject = isObject;
app.config.globalProperties.isUnDefined = isUnDefined;
app.config.globalProperties.get_block_option = get_block_option;
app.config.globalProperties.createUID = createUID;
app.config.globalProperties.uipParseJson = uipParseJson;
app.config.globalProperties.sendServerRequest = sendServerRequest;
app.config.globalProperties.updateAppPage = updateAppPage.bind({ adminURL: uip_ajax.uipAppData.options.adminURL, isBuilder: true });
app.config.globalProperties.updateActiveLink = updateActiveLink.bind({ adminURL: uip_ajax.uipAppData.options.adminURL, isBuilder: true });
app.config.globalProperties.saveUserPreference = saveUserPreference;

const plugindata = {
  defineAsyncComponent: defineAsyncComponent,
  liteVersion: import.meta.env.VITE_APP_VERSION,
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
    blockGroups: AllBlockGroups,
    blocks: AllBlocks,

    // Import from global
    options: uip_ajax.uipAppData.options,
    userPrefs: isObject(uip_ajax.uipAppData.userPrefs) ? uip_ajax.uipAppData.userPrefs : {},
    adminMenu: uipMasterMenu,
    toolbar: uipMasterToolbar,

    // Import local
    globalGroupOptions: SiteSettingsGroups,
    dynamicOptions: AllDynamics,
    themeStyles: AllThemeStyles,
    templateGroupOptions: TemplateGroupOptions,

    // General
    templateDarkMode: false,
    darkMode: false,
    enviroment: "builder",
  },
});

/**
 * Registers blocks as component for the main app
 *
 * @since 3.2.13
 */
const injectAppBlocks = (blocks) => {
  for (const block of blocks) {
    // If no path it's likely a pro placeholder block so exit
    if (!("path" in block)) continue;

    const componentName = block.moduleName;
    const path = defineAsyncComponent(() => {
      return new Promise(async (resolve, reject) => {
        const imported = await import(`${block.path}`);
        // Fill to handle the older way of registering blocks
        const component = "moduleData" in imported ? imported.moduleData() : imported;
        resolve(component);
      });
    });
    // Register component
    app.component(componentName, path);
  }
};

/**
 * Registers app plugins as component for the main app
 *
 * @since 3.2.13
 */
const injectAppPlugins = (plugins) => {
  for (const plugin of plugins) {
    // If no path it'sthen nothing to import
    if (!("path" in plugin)) continue;

    const componentName = plugin.component;
    const path = defineAsyncComponent(() => {
      return new Promise(async (resolve, reject) => {
        const imported = await import(`${plugin.path}`);
        // Fill to handle the older way of registering blocks
        const component = "moduleData" in imported ? imported.moduleData() : imported;
        resolve(component);
      });
    });
    // Register component
    app.component(componentName, path);
  }
};

const mountApp = async () => {
  // Import blocks
  //await injectAppBlocks(AllBlocks);
  // Import plugins
  //await injectAppPlugins(AllPlugins);
  // Mount app
  app.mount("#uip-ui-builder");
};

mountApp();
