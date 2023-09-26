///IMPORT TRANSLATIONS
const { __, _x, _n, _nx } = wp.i18n;

//Dynamic import Import scripts
//Get plugin version
import { createApp } from './../libs/vue-esm-dev.js';

//Import required classes and modules
//Import UiPress class
import { uip } from './classes/uip.min.js?ver=3.2.12';
import { uipMediaLibrary } from './classes/uip-media-library.min.js?ver=3.2.12';
const uipress = new uip('production');

//Import blocks
import * as elementBlocks from './blocks/elements/loader.min.js?ver=3.2.12';
import * as layoutBlocks from './blocks/layout/loader.min.js?ver=3.2.12';
import * as formBlockOptions from './blocks/inputs/loader.min.js?ver=3.2.12';
import * as dynamicBlocks from './blocks/dynamic/loader.min.js?ver=3.2.12';
import * as analyticsBlocks from './blocks/analytics/loader.min.js?ver=3.2.12';
import * as storeAnalyticsBlocks from './blocks/storeanalytics/loader.min.js?ver=3.2.12';

let allBlocks = [].concat(
  elementBlocks.fetchBlocks(),
  layoutBlocks.fetchBlocks(),
  formBlockOptions.fetchBlocks(),
  dynamicBlocks.fetchBlocks(),
  analyticsBlocks.fetchBlocks(),
  storeAnalyticsBlocks.fetchBlocks()
);
uipress.register_new_blocks(allBlocks);

//Dynamic settings
import * as UIPDynamicss from './options/dynamic-settings.min.js?ver=3.2.12';
uipress.register_new_dynamic_settings(UIPDynamicss.fetchSettings(uipress));
uipress.uipAppData.dynamicOptions = uipress.loadDynamics();

///Block settings
import * as UIPsettings from './options/settings-loader.min.js?ver=3.2.12';
let dynamicSettings = UIPsettings.getSettings(uipress.uipAppData.dynamicOptions);
uipress.register_new_block_settings(dynamicSettings);

//Register theme styles
import * as UIPthemeStyles from './options/theme-styles.min.js?ver=3.2.12';
uipress.register_new_theme_styles(UIPthemeStyles.fetchSettings(uipress));
uipress.uipAppData.themeStyles = uipress.loadThemeStyles();

//Import Vue modules
import * as uipAppDropdown from './modules/uip-dropdown.min.js?ver=3.2.12';
import * as uipAppMultiSelect from './modules/uip-multiselect.min.js?ver=3.2.12';
import * as uipAppUserMultiSelect from './modules/uip-user-role-multiselect.min.js?ver=3.2.12';
import * as uipAppAccordion from './modules/uip-accordion.min.js?ver=3.2.12';
import * as uipAppSwitchToggle from './modules/uip-switch-toggle.min.js?ver=3.2.12';
import * as uipAppTooltip from './modules/uip-tooltip.min.js?ver=3.2.12';
import * as uipAppChartLoading from './modules/uip-loading-chart.min.js?ver=3.2.12';
import * as uipAppOffcanvas from './modules/uip-offcanvas.min.js?ver=3.2.12';
import * as uipAppContentArea from './modules/uip-content-area.min.js?ver=3.2.12';
import * as uipAppChart from './modules/uip-chart.min.js?ver=3.2.12';
import * as uipAppModal from './modules/uip-modal.min.js?ver=3.2.12';
import * as uipAppSaveButton from './modules/uip-save-button.min.js?ver=3.2.12';
import * as uipAppColorPicker from './options/uip-color-picker.min.js?ver=3.2.12';
import * as uIbuilderColorSelect from './options/uip-color-select.min.js?ver=3.2.12';

//Import main ui view
import * as uipMainView from './modules/uip-app-view.min.js?ver=3.2.12';

//Fire hooks to register settings and blocks
const allUIPBlocks = uipress.loadBlocks();
const allUIPSettings = uipress.loadSettings();
//Load Builder plugins
uipress.uipAppData.plugins = uipress.loadPlugins();

//Save blocks and settings to uipress class
uipress.uipAppData.blocks = allUIPBlocks;
uipress.uipAppData.settings = allUIPSettings;

/**
 * Builds main args for uip app
 * @since 3.0.0
 */
const uipAppArgs = {
  data() {
    return {
      loading: true,
      screenWidth: window.innerWidth,
      uipGlobalData: uipress.uipAppData,
    };
  },
  provide() {
    return {
      uipData: this.returnGlobalData,
      uipress: uipress,
      uipMediaLibrary: uipMediaLibrary,
    };
  },
  created: function () {
    window.addEventListener('resize', this.getScreenWidth);
  },
  computed: {
    returnGlobalData() {
      return this.uipGlobalData;
    },
  },
  methods: {},
  template: '<uip-main-app></uip-main-app>',
};

/**
 * Define app
 * @since 3.0.0
 */
const uipApp = createApp(uipAppArgs);
//Allow reactive data from inject
uipApp.config.unwrapInjectedRef = true;
//Import router
uipApp.provide('router', []);

/**
 * Handles app errors
 * @since 3.0.0
 */
uipApp.config.errorHandler = function (err, vm, info) {
  uipress.notify(err, info, 'error');
  console.log(err);
};

/**
 * Register vue components
 * @since 3.0.0
 */
uipApp.component('uip-main-app', uipMainView.moduleData());
uipApp.component('drop-down', uipAppDropdown.moduleData());
uipApp.component('multi-select', uipAppMultiSelect.moduleData());
uipApp.component('user-role-select', uipAppUserMultiSelect.moduleData());
uipApp.component('accordion', uipAppAccordion.moduleData());
uipApp.component('uip-tooltip', uipAppTooltip.moduleData());
uipApp.component('loading-chart', uipAppChartLoading.moduleData());
uipApp.component('uip-offcanvas', uipAppOffcanvas.moduleData());
uipApp.component('toggle-switch', uipAppSwitchToggle.moduleData());
uipApp.component('uip-content-area', uipAppContentArea.moduleData());
uipApp.component('uip-chart', uipAppChart.moduleData());
uipApp.component('uip-modal', uipAppModal.moduleData());
uipApp.component('uip-save-button', uipAppSaveButton.moduleData());
uipApp.component('color-picker', uipAppColorPicker.moduleData());
uipApp.component('color-select', uIbuilderColorSelect.moduleData());

/**
 * Async import blocks and mount app
 * @since 3.0.0
 */
uipress.dynamicImport(allUIPBlocks, uipApp).then((response) => {
  if (response == true) {
    uipress.importPlugins(uipress.uipAppData.plugins, uipApp).then((response) => {
      if (response == true) {
        //Success
        //check the app has not been placed inside wpcontent (caused by plugins missing closing tags)
        if (document.getElementById('wpcontent')) {
          if (document.getElementById('wpcontent').contains(document.getElementById('uip-app-container'))) {
            let mounter = document.getElementById('uip-app-container');
            document.body.appendChild(mounter);
          }
        }

        uipApp.mount('#uip-ui-app');
      } else {
        uipress.notify(__('Unable to load all plugins', 'uipress-lite'), __('Some functions may not work as expected.', 'uipress-lite'), 'error', true);
      }
    });
  } else {
    //check the app has not been placed inside wpcontent (caused by plugins missing closing tags)
    if (document.getElementById('wpcontent')) {
      if (document.getElementById('wpcontent').contains(document.getElementById('uip-app-container'))) {
        let mounter = document.getElementById('uip-app-container');
        document.body.appendChild(mounter);
      }
    }
    uipApp.mount('#uip-ui-app');
    uipress.notify(__('Unable to load all components', 'uipress-lite'), __('Some functions may not work as expected.', 'uipress-lite'), 'error', true);
  }
});
