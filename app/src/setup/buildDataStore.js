import { reactive, provide } from "vue";
import { isObject, uipParseJson } from "@/utility/functions.js";
import { registerCoreBlocks } from "@/setup/registerCoreBlocks.js";
import { registerDynamicData } from "@/setup/registerDynamicData.js";
import { registerVariables } from "@/setup/registerVariables.js";
import { registerTemplateGroupOptions } from "@/setup/registerTemplateGroupOptions.js";
import { registerSiteSettingsGroups } from "@/setup/registerSiteSettingsGroups.js";
import { registerBlockGroups } from "@/setup/registerBlockGroups.js";
import { uipApp } from "@/store/app/constants.js";

/**
 * Builds a data store for the app
 */
export const buildDataStore = (app, mode) => {
  const AllBlocks = registerCoreBlocks();
  const AllDynamics = registerDynamicData();
  const AllThemeStyles = registerVariables();
  const TemplateGroupOptions = registerTemplateGroupOptions();
  const SiteSettingsGroups = registerSiteSettingsGroups();
  const blockGroups = registerBlockGroups();

  // Get menu
  const menuScript = document.querySelector("#uip-admin-menu");
  const uipMasterMenu = menuScript ? uipParseJson(menuScript.getAttribute("data-menu")) : { menu: [] };

  // Get Toolbar
  const toolbarScript = document.querySelector("#uip-admin-toolbar");
  const uipMasterToolbar = toolbarScript ? uipParseJson(toolbarScript.getAttribute("data-toolbar")) : [];

  //Check for RTL
  let RTL = document.documentElement.getAttribute("dir") == "rtl" ? true : false;

  uipApp.scrolling = false;
  uipApp.litePath = uip_ajax.uipAppData.options.pluginURL;
  uipApp.isRTL = RTL;
  uipApp.data = {
    plugins: [],
    blocks: AllBlocks,
    blockGroups: blockGroups,

    // Import from global
    options: uip_ajax.uipAppData.options,
    userPrefs: isObject(uip_ajax.uipAppData.userPrefs) ? uip_ajax.uipAppData.userPrefs : {},
    adminMenu: uipMasterMenu,
    toolbar: toolbarScript,

    // Import local
    globalGroupOptions: SiteSettingsGroups,
    dynamicOptions: AllDynamics,
    themeStyles: AllThemeStyles,
    templateGroupOptions: TemplateGroupOptions,

    // General
    templateDarkMode: false,
    darkMode: false,
    enviroment: mode,
  };

  app.config.globalProperties.uipApp = uipApp;
};
