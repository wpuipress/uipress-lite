/**
 * Imports vue, router and draggable
 *
 * @since 3.2.13
 */
const { __, _x, _n, _nx } = wp.i18n;
import { createApp, getCurrentInstance, defineComponent, defineAsyncComponent, reactive } from "./../libs/vue-esm.js";
import { VueDraggableNext } from "./../libs/VueDraggableNext.js";
const pluginVersion = import.meta.url.split("?ver=")[1];

/**
 * Process lite blocks and call filter to allow pro blocks to be registered.
 *
 * Filters out blocks to ensure unique list
 *
 * @since 3.2.13
 */
import "./blocks/layout/loader.min.js?ver=3.3.00";
import "./blocks/elements/loader.min.js?ver=3.3.00";
import "./blocks/inputs/loader.min.js?ver=3.3.00";
import "./blocks/dynamic/loader.min.js?ver=3.3.00";
import "./blocks/analytics/loader.min.js?ver=3.3.00";
import "./blocks/storeanalytics/loader.min.js?ver=3.3.00";

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
import { processSettings } from "./options/dynamic-settings.min.js?ver=3.3.00";
const dynamic_settings = processSettings(uip_ajax.uipAppData.options.dynamicData);
wp.hooks.addFilter("uipress.uibuilder.dynamicdata.register", "uipress", (current) => ({ ...current, ...dynamic_settings }));
const AllDynamics = wp.hooks.applyFilters("uipress.uibuilder.dynamicdata.register", {});

/**
 * Register theme styles
 *
 * @since 3.2.13
 */
import themeStyles from "./options/theme-styles.min.js?ver=3.3.00";
wp.hooks.addFilter("uipress.app.variables.register", "uipress", (current) => ({ ...current, ...themeStyles }));
const AllThemeStyles = wp.hooks.applyFilters("uipress.app.variables.register");

/**
 * Builds main args for uip app
 *
 * @since 3.0.0
 */
const args = {
  components: {
    MainApp: defineAsyncComponent(() => import(`./components/app-view.min.js?ver=${pluginVersion}`)),
    Notify: defineAsyncComponent(() => import(`./v3.5/utility/notify.min.js?ver=${pluginVersion}`)),
  },
  methods: {},
  template: `
    <MainApp/>
    <Notify/>
  `,
};
const app = createApp(args);

/**
 * Imports core components into app
 *
 * @since 3.2.13
 */
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
import { MediaLibrary } from "./v3.5/utility/media-library.min.js?ver=3.2.0";

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
app.component("uip-draggable", VueDraggableNext);
app.component("uipMediaLibrary", MediaLibrary);
app.component("uipModal", Modal);

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
} from "./v3.5/utility/functions.min.js?ver=3.3.00";

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

app.config.globalProperties.uipApp = reactive({
  scrolling: false,
  litePath: uip_ajax.uipAppData.options.pluginURL,
  data: {
    plugins: AllPlugins,
    blocks: AllBlocks,

    // Import from global
    options: uip_ajax.uipAppData.options,
    userPrefs: uip_ajax.uipAppData.userPrefs,
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
  app.mount("#uip-ui-app");
};

mountApp();
