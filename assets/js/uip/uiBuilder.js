/**
 * Imports vue, router and draggable
 *
 * @since 3.2.13
 */
const { __, _x, _n, _nx } = wp.i18n;
import { createApp, getCurrentInstance, defineComponent, defineAsyncComponent, reactive } from "./../libs/vue-esm.js";
import { VueDraggableNext } from "./../libs/VueDraggableNext.js";
import { createRouter, createWebHistory, createWebHashHistory } from "./../libs/vue-router-esm.js";
const pluginVersion = import.meta.url.split("?ver=")[1];

/**
 * Process lite blocks and call filter to allow pro blocks to be registered.
 *
 * Filters out blocks to ensure unique list
 *
 * @since 3.2.13
 */

import "./blocks/layout/loader.min.js?ver=3.3.1";
import "./blocks/elements/loader.min.js?ver=3.3.1";
import "./blocks/inputs/loader.min.js?ver=3.3.1";
import "./blocks/dynamic/loader.min.js?ver=3.3.1";
import "./blocks/analytics/loader.min.js?ver=3.3.1";
import "./blocks/storeanalytics/loader.min.js?ver=3.3.1";

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
import blockGroups from "./blocks/block-settings-groups.min.js?ver=3.3.1";
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
import { processSettings } from "./options/dynamic-settings.min.js?ver=3.3.1";
const dynamic_settings = processSettings(uip_ajax.uipAppData.options.dynamicData);
wp.hooks.addFilter("uipress.uibuilder.dynamicdata.register", "uipress", (current) => ({ ...current, ...dynamic_settings }));
const AllDynamics = wp.hooks.applyFilters("uipress.uibuilder.dynamicdata.register", {});

/**
 * Register theme styles
 *
 * @since 3.2.13
 */
import themeStyles from "./options/theme-styles.min.js?ver=3.3.1";
wp.hooks.addFilter("uipress.app.variables.register", "uipress", (current) => ({ ...current, ...themeStyles }));
const AllThemeStyles = wp.hooks.applyFilters("uipress.app.variables.register");

/**
 * Import template group settings
 *
 * @since 3.2.13
 */
import { templategroups, templateSettings } from "./settings/template-settings-groups.min.js?ver=3.3.1";

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

import { globalSettingsGroups, globalSettings, processGlobalGroups } from "./settings/global-settings-groups.min.js?ver=3.3.1";

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

/**
 * Builds main args for ui builder
 * @since 3.0.0
 */
const appArgs = defineComponent({
  components: {
    Notify: defineAsyncComponent(() => import(`./v3.5/utility/notify.min.js?ver=${pluginVersion}`)),
    Tips: defineAsyncComponent(() => import(`./uibuilder/tips.min.js?ver=${pluginVersion}`)),
  },
  data() {
    return {};
  },
  watch: {
    /**
     * Watch changes to route and emit a hash change event event
     *
     * This allows the top level uiTemplate / app to apply hashchanges to the url
     *
     * @since 3.2.13
     */
    $route(to, from) {
      // Create and dispatch the event.
      const event = new Event("uip-frame-hash-change");
      window.dispatchEvent(event);
    },
  },
  template: `
    <router-view/>
    <Notify/>
    <Tips/>`,
});

/**
 * Defines and create ui builder routes
 * @since 3.0.0
 */

const BuilderSettings = () => import(`./uibuilder/builder-settings.min.js?ver=${pluginVersion}`);
const TemplateTable = () => import(`./uibuilder/template-table.min.js?ver=${pluginVersion}`);
const SetupWizard = () => import(`./uibuilder/setup-wizard.min.js?ver=${pluginVersion}`);
const GlobalExport = () => import(`./uibuilder/global-export.min.js?ver=${pluginVersion}`);
const GlobalImport = () => import(`./uibuilder/global-import.min.js?ver=${pluginVersion}`);
const SiteSync = () => import(`./uibuilder/site-sync.min.js?ver=${pluginVersion}`);
const SiteSettings = () => import(`./uibuilder/site-settings.min.js?ver=${pluginVersion}`).catch((error) => console.error("Failed to load BuilderSettings", error));
const Framework = () => import(`./uibuilder/framework.min.js?ver=${pluginVersion}`);
const Errorlog = () => import(`./tools/error-log.min.js?ver=${pluginVersion}`);

const routes = [
  {
    path: "/",
    name: __("List View", "uipress-lite"),
    component: TemplateTable,
    query: { page: "1", search: "" },
    children: [
      {
        name: __("Setup wizard", "uipress-lite"),
        path: "/setupwizard/",
        component: SetupWizard,
      },
      {
        name: __("Global export", "uipress-lite"),
        path: "/globalexport/",
        component: GlobalExport,
      },
      {
        name: __("Global import", "uipress-lite"),
        path: "/globalimport/",
        component: GlobalImport,
      },
      {
        name: __("Site sync", "uipress-lite"),
        path: "/sitesync/",
        component: SiteSync,
      },
      {
        name: __("Site settings", "uipress-lite"),
        path: "/site-settings/",
        component: SiteSettings,
      },
      {
        name: __("Error log", "uipress-lite"),
        path: "/errorlog/",
        component: Errorlog,
      },
    ],
  },
  {
    path: "/uibuilder/:templateID/",
    name: "Builder",
    component: Framework,
    children: [
      {
        name: __("Block Settings", "uipress-lite"),
        path: "settings/blocks/:uid",
        redirect: (to) => {
          // Use the params from the current route to form the redirect path
          return `/uibuilder/${to.params.templateID}/`;
        },
      },
      {
        name: "templateSettings",
        path: "settings/template",
        component: BuilderSettings,
      },
    ],
  },
];

const Router = createRouter({
  history: createWebHashHistory(),
  routes, // short for `routes: routes`
});
/**
 * Builds main app for ui builder
 * @since 3.0.0
 */

const app = createApp(appArgs);
app.use(Router);

// Import Core components
const DropZone = defineAsyncComponent(() => import(`./uibuilder/block-drop-zone.min.js?ver=${pluginVersion}`));
const DropDown = defineAsyncComponent(() => import(`./components/dropdown.min.js?ver=${pluginVersion}`));
const MultiSelect = defineAsyncComponent(() => import(`./components/multiselect.min.js?ver=${pluginVersion}`));
const UserMultiSelect = defineAsyncComponent(() => import(`./components/user-role-multiselect.min.js?ver=${pluginVersion}`));
const UserSearch = defineAsyncComponent(() => import(`./components/user-role-search.min.js?ver=${pluginVersion}`));
const PostTypeMultiselect = defineAsyncComponent(() => import(`./components/post-type-select.min.js?ver=${pluginVersion}`));
const Accordion = defineAsyncComponent(() => import(`./components/accordion.min.js?ver=${pluginVersion}`));
const SwitchToggle = defineAsyncComponent(() => import(`./components/switch-toggle.min.js?ver=${pluginVersion}`));
const Tooltip = defineAsyncComponent(() => import(`./components/tooltip.min.js?ver=${pluginVersion}`));
const LoadingChart = defineAsyncComponent(() => import(`./components/loading-chart.min.js?ver=${pluginVersion}`));
const Offcanvas = defineAsyncComponent(() => import(`./components/offcanvas.min.js?ver=${pluginVersion}`));
const SaveButton = defineAsyncComponent(() => import(`./components/save-button.min.js?ver=${pluginVersion}`));
const ChartComp = defineAsyncComponent(() => import(`./components/chart.min.js?ver=${pluginVersion}`));
const FloatingPanel = defineAsyncComponent(() => import(`./components/floating-panel.min.js?ver=${pluginVersion}`));
const Modal = defineAsyncComponent(() => import(`./v3.5/utility/modal.min.js?ver=${pluginVersion}`));
const MediaLibrary = defineAsyncComponent(() => import(`./v3.5/utility/media-library.min.js?ver=${pluginVersion}`));

app.component("multi-select", MultiSelect);
app.component("user-role-select", UserMultiSelect);
app.component("user-role-search", UserSearch);
app.component("post-type-select", PostTypeMultiselect);
app.component("accordion", Accordion);
app.component("uip-tooltip", Tooltip);
app.component("uip-content-area", DropZone);
app.component("loading-chart", LoadingChart);
app.component("uip-offcanvas", Offcanvas);
app.component("uip-save-button", SaveButton);
app.component("dropdown", DropDown);
app.component("uip-chart", ChartComp);
app.component("uip-floating-panel", FloatingPanel);
app.component("uipMediaLibrary", MediaLibrary);
app.component("uipModal", Modal);

//Option components
const UIbuilderInlineImageSelect = defineAsyncComponent(() => import(`./options/inline-image-select.min.js?ver=${pluginVersion}`));
const UIbuilderBackgroundPosition = defineAsyncComponent(() => import(`./options/background-position.min.js?ver=${pluginVersion}`));
const UIbuilderSwitch = defineAsyncComponent(() => import(`./options/switch-select.min.js?ver=${pluginVersion}`));
const UIbuilderValueUnits = defineAsyncComponent(() => import(`./options/value-units.min.js?ver=${pluginVersion}`));
const UIbuilderUnits = defineAsyncComponent(() => import(`./options/units.min.js?ver=${pluginVersion}`));
const UIbuilderColorSelect = defineAsyncComponent(() => import(`./options/color-select.min.js?ver=${pluginVersion}`));
const UIbuilderInput = defineAsyncComponent(() => import(`./options/input.min.js?ver=${pluginVersion}`));
const UIbuilderTextarea = defineAsyncComponent(() => import(`./options/textarea.min.js?ver=${pluginVersion}`));
const UIbuilderNumber = defineAsyncComponent(() => import(`./options/number.min.js?ver=${pluginVersion}`));
const UIbuilderPostTypes = defineAsyncComponent(() => import(`./options/post-types.min.js?ver=${pluginVersion}`));
const UIbuilderParagraphInput = defineAsyncComponent(() => import(`./options/paragraph-input.min.js?ver=${pluginVersion}`));
const UIbuilderDynamicInput = defineAsyncComponent(() => import(`./options/dynamic-input.min.js?ver=${pluginVersion}`));
const UIbuilderIconSelect = defineAsyncComponent(() => import(`./options/icon-select.min.js?ver=${pluginVersion}`));
const UIbuilderInlineIconSelect = defineAsyncComponent(() => import(`./options/inline-icon-select.min.js?ver=${pluginVersion}`));
const UIbuilderChoiceSelect = defineAsyncComponent(() => import(`./options/choice-select.min.js?ver=${pluginVersion}`));
const UIbuilderDefaultSelect = defineAsyncComponent(() => import(`./options/default-select.min.js?ver=${pluginVersion}`));
const UIbuilderLinkSelect = defineAsyncComponent(() => import(`./options/link-select.min.js?ver=${pluginVersion}`));
const UIbuilderTabBuilder = defineAsyncComponent(() => import(`./options/tab-builder.min.js?ver=${pluginVersion}`));
const UIbuilderHiddenToolbarItems = defineAsyncComponent(() => import(`./options/hidden-toolbar-items-select.min.js?ver=${pluginVersion}`));
const UIbuilderEditToolbarItems = defineAsyncComponent(() => import(`./options/edit-toolbar-items.min.js?ver=${pluginVersion}`));
const MultiSelectOption = defineAsyncComponent(() => import(`./options/multi-select.min.js?ver=${pluginVersion}`));
const UIbuilderCodeEditor = defineAsyncComponent(() => import(`./options/code-editor.min.js?ver=${pluginVersion}`));
const UIbuilderSubmitAction = defineAsyncComponent(() => import(`./options/submit-action.min.js?ver=${pluginVersion}`));
const UIbuilderSelectOptionBuilder = defineAsyncComponent(() => import(`./options/select-option-builder.min.js?ver=${pluginVersion}`));
const UIbuilderArrayList = defineAsyncComponent(() => import(`./options/array-list.min.js?ver=${pluginVersion}`));
const UIbuilderSelectPostTypes = defineAsyncComponent(() => import(`./options/select-post-types.min.js?ver=${pluginVersion}`));
const UIbuilderEffects = defineAsyncComponent(() => import(`./options/effects.min.js?ver=${pluginVersion}`));

//OPTION MODS
app.component("background-position", UIbuilderBackgroundPosition);
app.component("switch-select", UIbuilderSwitch);
app.component("value-units", UIbuilderValueUnits);
app.component("units-select", UIbuilderUnits);
app.component("color-select", UIbuilderColorSelect);
app.component("toggle-switch", SwitchToggle);
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
} from "./v3.5/utility/functions.min.js?ver=3.3.1";

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
        const imported = await import(`${block.path}?ver=${pluginVersion}`);
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
        const imported = await import(`${plugin.path}?ver=${pluginVersion}`);
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
