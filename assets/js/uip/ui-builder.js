/**
 * Imports vue, router and draggable
 *
 * @since 3.2.13
 */
const { __, _x, _n, _nx } = wp.i18n;
import { createApp, getCurrentInstance, defineComponent, ref, reactive } from './../libs/vue-esm-dev.js';
import { VueDraggableNext } from './../libs/VueDraggableNext.js';
import { createRouter, createWebHistory, createWebHashHistory } from './../libs/vue-router-esm.js';

/**
 * Sets plugin version
 *
 * @since 3.2.13
 */
const pluginVersion = import.meta.url.split('?ver=')[1];

/**
 * Imports uipress class and initiates
 *
 * @since 3.2.13
 */
import { uip } from './classes/uip.min.js?ver=3.2.12';
const uipress = new uip('builder');

/**
 * Imports block groups
 *
 * @since 3.2.13
 */
import blockGroups from './blocks/block-settings-groups.min.js?ver=3.2.12';
uipress.register_new_block_groups(blockGroups);

/**
 * Imports blocks and processes them into the app
 *
 * @since 3.2.13
 */
import elementBlocks from './blocks/elements/loader.min.js?ver=3.2.12';
import layoutBlocks from './blocks/layout/loader.min.js?ver=3.2.12';
import formBlockOptions from './blocks/inputs/loader.min.js?ver=3.2.12';
import dynamicBlocks from './blocks/dynamic/loader.min.js?ver=3.2.12';
import analyticsBlocks from './blocks/analytics/loader.min.js?ver=3.2.12';
import storeAnalyticsBlocks from './blocks/storeanalytics/loader.min.js?ver=3.2.12';

const allBlocks = [...elementBlocks, ...layoutBlocks, ...formBlockOptions, ...dynamicBlocks, ...analyticsBlocks, ...storeAnalyticsBlocks];
uipress.register_new_blocks(allBlocks);

/**
 * Import dynamic data into the app
 *
 * @since 3.2.13
 */
import * as UIPDynamicss from './options/dynamic-settings.min.js?ver=3.2.12';
uipress.register_new_dynamic_settings(UIPDynamicss.fetchSettings(uipress));
uipress.uipAppData.dynamicOptions = uipress.loadDynamics();

/**
 * Import block settings
 *
 * @since 3.2.13
 */
import * as UIPsettings from './options/settings-loader.min.js?ver=3.2.12';
let dynamicSettings = UIPsettings.getSettings(uipress.uipAppData.dynamicOptions, 'builder');
uipress.register_new_block_settings(dynamicSettings);

/**
 * Register theme styles
 *
 * @since 3.2.13
 */
import * as UIPthemeStyles from './options/theme-styles.min.js?ver=3.2.12';
uipress.register_new_theme_styles(UIPthemeStyles.fetchSettings(uipress));
uipress.uipAppData.themeStyles = uipress.loadThemeStyles();

/**
 * Import template group settings
 *
 * @since 3.2.13
 */
import * as UIPtemplateSettings from './settings/template-settings-groups.min.js?ver=3.2.12';
uipress.register_new_template_groups(UIPtemplateSettings.fetchGroups());
uipress.register_new_template_groups_options(UIPtemplateSettings.fetchSettings());
uipress.uipAppData.templateGroupOptions = uipress.loadTemplateGroups();

/**
 * Import global group settings
 *
 * @since 3.2.13
 */
import * as UIPGlobalSettingsGroups from './settings/global-settings-groups.min.js?ver=3.2.12';
uipress.register_new_global_groups(UIPGlobalSettingsGroups.fetchGroups());
uipress.register_new_global_groups_options(UIPGlobalSettingsGroups.fetchSettings());
uipress.uipAppData.globalGroupOptions = uipress.loadGlobalGroups();

/**
 * Register plugins, blocks, settings and groups
 *
 * @since 3.2.13
 */
uipress.uipAppData.plugins = uipress.loadPlugins();
uipress.uipAppData.blockGroups = uipress.loadBlockGroups();
uipress.uipAppData.blocks = uipress.loadBlocks();
uipress.uipAppData.settings = uipress.loadSettings();

// Import Core components
import DropZone from './uibuilder/block-drop-zone.min.js?ver=3.2.12';
import DropDown from './components/dropdown.min.js?ver=3.2.12';
import MultiSelect from './components/multiselect.min.js?ver=3.2.12';
import UserMultiSelect from './components/user-role-multiselect.min.js?ver=3.2.12';
import UserSearch from './components/user-role-search.min.js?ver=3.2.12';
import PostTypeMultiselect from './components/post-type-select.min.js?ver=3.2.12';
import Accordion from './components/accordion.min.js?ver=3.2.12';
import SwitchToggle from './components/switch-toggle.min.js?ver=3.2.12';
import Tooltip from './components/tooltip.min.js?ver=3.2.12';
import LoadingChart from './components/loading-chart.min.js?ver=3.2.12';
import Offcanvas from './components/offcanvas.min.js?ver=3.2.12';
import SaveButton from './components/save-button.min.js?ver=3.2.12';
import ChartComp from './components/chart.min.js?ver=3.2.12';
import Modal from './components/modal.min.js?ver=3.2.12';
import FloatingPanel from './components/floating-panel.min.js?ver=3.1.12';

//Option components
import UIbuilderInlineImageSelect from './options/inline-image-select.min.js?ver=3.2.12';
import UIbuilderBackgroundPosition from './options/background-position.min.js?ver=3.2.12';
import UIbuilderSwitch from './options/switch-select.min.js?ver=3.2.12';
import UIbuilderValueUnits from './options/value-units.min.js?ver=3.2.12';
import UIbuilderUnits from './options/units.min.js?ver=3.2.12';
import UIbuilderColorSelect from './options/color-select.min.js?ver=3.2.12';
import UIbuilderInput from './options/input.min.js?ver=3.2.12';
import UIbuilderTextarea from './options/textarea.min.js?ver=3.2.12';
import UIbuilderClasses from './options/classes.min.js?ver=3.2.12';
import UIbuilderNumber from './options/number.min.js?ver=3.2.12';
import UIbuilderPostTypes from './options/post-types.min.js?ver=3.2.12';
import UIbuilderParagraphInput from './options/paragraph-input.min.js?ver=3.2.12';
import UIbuilderDynamicInput from './options/dynamic-input.min.js?ver=3.2.12';
import UIbuilderIconSelect from './options/icon-select.min.js?ver=3.2.12';
import UIbuilderInlineIconSelect from './options/inline-icon-select.min.js?ver=3.2.12';
import UIbuilderChoiceSelect from './options/choice-select.min.js?ver=3.2.12';
import UIbuilderDefaultSelect from './options/default-select.min.js?ver=3.2.12';
import UIbuilderLinkSelect from './options/link-select.min.js?ver=3.2.12';
import UIbuilderTabBuilder from './options/tab-builder.min.js?ver=3.2.12';
import UIbuilderHiddenToolbarItems from './options/hidden-toolbar-items-select.min.js?ver=3.2.12';
import UIbuilderEditToolbarItems from './options/edit-toolbar-items.min.js?ver=3.2.12';
import MultiSelectOption from './options/multi-select.min.js?ver=3.2.12';
import UIbuilderCodeEditor from './options/code-editor.min.js?ver=3.2.12';
import UIbuilderSubmitAction from './options/submit-action.min.js?ver=3.2.12';
import UIbuilderSelectOptionBuilder from './options/select-option-builder.min.js?ver=3.2.12';
import UIbuilderArrayList from './options/array-list.min.js?ver=3.2.12';
import UIbuilderSelectPostTypes from './options/select-post-types.min.js?ver=3.2.12';
import UIbuilderEffects from './options/effects.min.js?ver=3.2.12';

/**
 * Builds main args for ui builder
 * @since 3.0.0
 */
const appArgs = defineComponent({
  data() {
    return {
      uipGlobalData: uipress.uipAppData,
    };
  },
  provide() {
    return {
      uipData: this.returnGlobalData,
      uipress: uipress,
    };
  },
  computed: {
    returnGlobalData() {
      return this.uipGlobalData;
    },
  },
  template: '<router-view></router-view>',
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
const SiteSettings = () => import(`./uibuilder/site-settings.min.js?ver=${pluginVersion}`).catch((error) => console.error('Failed to load BuilderSettings', error));
const Framework = () => import(`./uibuilder/framework.min.js?ver=${pluginVersion}`);
const Errorlog = () => import(`./tools/error-log.min.js?ver=${pluginVersion}`);

const routes = [
  {
    path: '/',
    name: __('List View', 'uipress-lite'),
    component: TemplateTable,
    query: { page: '1', search: '' },
    children: [
      {
        name: __('Setup wizard', 'uipress-lite'),
        path: '/setupwizard/',
        component: SetupWizard,
      },
      {
        name: __('Global export', 'uipress-lite'),
        path: '/globalexport/',
        component: GlobalExport,
      },
      {
        name: __('Global import', 'uipress-lite'),
        path: '/globalimport/',
        component: GlobalImport,
      },
      {
        name: __('Site sync', 'uipress-lite'),
        path: '/sitesync/',
        component: SiteSync,
      },
      {
        name: __('Site settings', 'uipress-lite'),
        path: '/site-settings/',
        component: SiteSettings,
      },
      {
        name: __('Error log', 'uipress-lite'),
        path: '/errorlog/',
        component: Errorlog,
      },
    ],
  },
  {
    path: '/uibuilder/:templateID/',
    name: 'Builder',
    component: Framework,
    children: [
      {
        name: __('Block Settings', 'uipress-lite'),
        path: 'settings/blocks/:uid',
        redirect: (to) => {
          // Use the params from the current route to form the redirect path
          return `/uibuilder/${to.params.templateID}/`;
        },
      },
      {
        name: __('Template Settings', 'uipress-lite'),
        path: 'settings/template',
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

app.component('multi-select', MultiSelect);
app.component('user-role-select', UserMultiSelect);
app.component('user-role-search', UserSearch);
app.component('post-type-select', PostTypeMultiselect);
app.component('accordion', Accordion);
app.component('uip-tooltip', Tooltip);
app.component('uip-content-area', DropZone);
app.component('loading-chart', LoadingChart);
app.component('uip-offcanvas', Offcanvas);
app.component('uip-save-button', SaveButton);
app.component('dropdown', DropDown);
app.component('uip-chart', ChartComp);
app.component('uip-modal', Modal);
app.component('uip-floating-panel', FloatingPanel);

//Import libs
app.component('uip-draggable', VueDraggableNext);

//OPTION MODS
app.component('background-position', UIbuilderBackgroundPosition);
app.component('switch-select', UIbuilderSwitch);
app.component('value-units', UIbuilderValueUnits);
app.component('units-select', UIbuilderUnits);
app.component('color-select', UIbuilderColorSelect);
app.component('toggle-switch', SwitchToggle);
app.component('uip-input', UIbuilderInput);
app.component('uip-textarea', UIbuilderTextarea);
app.component('uip-classes', UIbuilderClasses);
app.component('post-types', UIbuilderPostTypes);
app.component('uip-number', UIbuilderNumber);
app.component('uip-paragraph-input', UIbuilderParagraphInput);
app.component('uip-dynamic-input', UIbuilderDynamicInput);
app.component('icon-select', UIbuilderIconSelect);
app.component('inline-icon-select', UIbuilderInlineIconSelect);
app.component('choice-select', UIbuilderChoiceSelect);
app.component('default-select', UIbuilderDefaultSelect);
app.component('hiden-toolbar-items-select', UIbuilderHiddenToolbarItems);
app.component('edit-toolbar-items', UIbuilderEditToolbarItems);
app.component('multi-select-option', MultiSelectOption);
app.component('code-editor', UIbuilderCodeEditor);
app.component('submit-actions', UIbuilderSubmitAction);
app.component('link-select', UIbuilderLinkSelect);
app.component('tab-builder', UIbuilderTabBuilder);
app.component('select-option-builder', UIbuilderSelectOptionBuilder);
app.component('array-list', UIbuilderArrayList);
app.component('uip-select-post-types', UIbuilderSelectPostTypes);
app.component('inline-image-select', UIbuilderInlineImageSelect);
app.component('uip-effects', UIbuilderEffects);

/**
 * Import helper functions
 *
 * @since 3.2.13
 */

import { ensureNestedObject, hasNestedPath, prepareJSON, deepClone, copyToClipboard } from './v3.5/utility/functions.min.js?ver=3.2.12';
app.config.globalProperties.ensureNestedObject = ensureNestedObject;
app.config.globalProperties.hasNestedPath = hasNestedPath;
app.config.globalProperties.prepareJSON = prepareJSON;
app.config.globalProperties.deepClone = deepClone;
app.config.globalProperties.copyToClipboard = copyToClipboard;
app.config.globalProperties.uipApp = reactive({
  scrolling: false,
});

const mountApp = async () => {
  // Import blocks
  await uipress.dynamicImport(uipress.uipAppData.blocks, app);
  // Import plugins
  await uipress.importPlugins(uipress.uipAppData.plugins, app);
  // Mount app
  app.mount('#uip-ui-builder');
};

mountApp();
