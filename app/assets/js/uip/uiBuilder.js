/**
 * Imports vue, router and draggable
 *
 * @since 3.2.13
 */
const { __, _x, _n, _nx } = wp.i18n;
import { createApp, getCurrentInstance, defineComponent, defineAsyncComponent, reactive } from "vue";
import { VueDraggableNext } from "@/js/libs/VueDraggableNext.js";
import { router } from "./router/index.js";

// Import functions
import { registerGlobalComponents } from "./setup/registerGlobalComponents.js";

/**
 * Process lite blocks and call filter to allow pro blocks to be registered.
 *
 * Filters out blocks to ensure unique list
 *
 * @since 3.2.13
 */

import "./blocks/layout/loader.js";
import "./blocks/elements/loader.js";
import "./blocks/inputs/loader.js";
import "./blocks/dynamic/loader.js";
import "./blocks/analytics/loader.js";
import "./blocks/storeanalytics/loader.js";

// Apply blocks filter
let AllBlocks = wp.hooks.applyFilters("uipress.blocks.register", []);

// Filter out duplicate blocks
const uniqueModuleNames = new Set();
AllBlocks = AllBlocks.filter((item) => {
  if (uniqueModuleNames.has(item.moduleName)) return false;
  uniqueModuleNames.add(item.moduleName);
  return true;
});

/**
 * Imports block groupings and applies filters
 *
 * @since 3.2.13
 */
import blockGroups from "./blocks/block-settings-groups.js";
wp.hooks.addFilter("uipress.blocks.groups.register", "uipress", (current) => ({ ...current, ...blockGroups }));
const AllBlockGroups = wp.hooks.applyFilters("uipress.blocks.groups.register", {});

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
const AllThemeStyles = wp.hooks.applyFilters("uipress.app.variables.register");

/**
 * Import template group settings
 *
 * @since 3.2.13
 */
import { templategroups, templateSettings } from "./settings/template-settings-groups.js";

wp.hooks.addFilter("uipress.uibuilder.templatesettings.groups.register", "uipress", (current) => ({ ...current, ...templategroups }));
wp.hooks.addFilter("uipress.uibuilder.templatesettings.options.register", "uipress", (current) => [...current, ...templateSettings]);

let TemplateGroupOptions = wp.hooks.applyFilters("uipress.uibuilder.templatesettings.groups.register", {});
let options = wp.hooks.applyFilters("uipress.uibuilder.templatesettings.options.register", []);
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

wp.hooks.addFilter("uipress.app.sitesettings.groups.register", "uipress", (current) => ({ ...current, ...globalSettingsGroups }));
wp.hooks.addFilter("uipress.app.sitesettings.options.register", "uipress", (current) => [...current, ...globalSettings]);

let SiteSettingsGroups = wp.hooks.applyFilters("uipress.app.sitesettings.groups.register", {});
let SiteSettingsOptions = wp.hooks.applyFilters("uipress.app.sitesettings.options.register", []);
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

//Option components
import UIbuilderInlineImageSelect from "@/js/uip/options/inline-image-select/index.vue";
import UIbuilderBackgroundPosition from "@/js/uip/options/background-position/index.vue";
import UIbuilderSwitch from "@/js/uip/options/switch-select/index.vue";
import UIbuilderValueUnits from "@/js/uip/options/value-units/index.vue";
import UIbuilderUnits from "@/js/uip/options/units/index.vue";
import UIbuilderColorSelect from "@/js/uip/options/color-select/index.vue";
import UIbuilderInput from "@/js/uip/options/input/index.vue";
import UIbuilderTextarea from "@/js/uip/options/textarea/index.vue";
import UIbuilderNumber from "@/js/uip/options/number/index.vue";
import UIbuilderPostTypes from "@/js/uip/options/post-types/index.vue";
import UIbuilderParagraphInput from "@/js/uip/options/paragraph-input/index.vue";
import UIbuilderDynamicInput from "@/js/uip/options/dynamic-input/index.vue";
import UIbuilderIconSelect from "@/js/uip/options/icon-select/index.vue";
import UIbuilderInlineIconSelect from "@/js/uip/options/inline-icon-select/index.vue";
import UIbuilderChoiceSelect from "@/js/uip/options/choice-select/index.vue";
import UIbuilderDefaultSelect from "@/js/uip/options/default-select/index.vue";
import UIbuilderLinkSelect from "@/js/uip/options/link-select/index.vue";
import UIbuilderTabBuilder from "@/js/uip/options/tab-builder/index.vue";
import UIbuilderHiddenToolbarItems from "@/js/uip/options/hidden-toolbar-items-select/index.vue";
import UIbuilderEditToolbarItems from "@/js/uip/options/edit-toolbar-items/index.vue";
import MultiSelectOption from "@/js/uip/options/multi-select/index.vue";
import UIbuilderSubmitAction from "@/js/uip/options/submit-action/index.vue";
import UIbuilderSelectOptionBuilder from "@/js/uip/options/select-option-builder/index.vue";
import UIbuilderArrayList from "@/js/uip/options/array-list/index.vue";
import UIbuilderSelectPostTypes from "@/js/uip/options/select-post-types/index.vue";
import UIbuilderEffects from "@/js/uip/options/effects/index.vue";

// Async code editor as it's heavy
const UIbuilderCodeEditor = defineAsyncComponent(() => import(`@/js/uip/options/code-editor/index.vue`));

//OPTION MODS
app.component("background-position", UIbuilderBackgroundPosition);
app.component("switch-select", UIbuilderSwitch);
app.component("value-units", UIbuilderValueUnits);
app.component("units-select", UIbuilderUnits);
app.component("color-select", UIbuilderColorSelect);
app.component("uip-input", UIbuilderInput);
app.component("uip-textarea", UIbuilderTextarea);
app.component("post-types", UIbuilderPostTypes);
app.component("uip-number", UIbuilderNumber);
app.component("uip-paragraph-input", UIbuilderParagraphInput);
app.component("uip-dynamic-input", UIbuilderDynamicInput);
app.component("icon-select", UIbuilderIconSelect);
app.component("inline-icon-select", UIbuilderInlineIconSelect);
app.component("choice-select", UIbuilderChoiceSelect);
app.component("default-select", UIbuilderDefaultSelect);
app.component("hiden-toolbar-items-select", UIbuilderHiddenToolbarItems);
app.component("edit-toolbar-items", UIbuilderEditToolbarItems);
app.component("multi-select-option", MultiSelectOption);
app.component("code-editor", UIbuilderCodeEditor);
app.component("submit-actions", UIbuilderSubmitAction);
app.component("link-select", UIbuilderLinkSelect);
app.component("tab-builder", UIbuilderTabBuilder);
app.component("select-option-builder", UIbuilderSelectOptionBuilder);
app.component("array-list", UIbuilderArrayList);
app.component("uip-select-post-types", UIbuilderSelectPostTypes);
app.component("inline-image-select", UIbuilderInlineImageSelect);
app.component("uip-effects", UIbuilderEffects);

//Import libs
app.component("uip-draggable", VueDraggableNext);
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
  await injectAppBlocks(AllBlocks);
  // Import plugins
  await injectAppPlugins(AllPlugins);
  // Mount app
  app.mount("#uip-ui-builder");
};

mountApp();
