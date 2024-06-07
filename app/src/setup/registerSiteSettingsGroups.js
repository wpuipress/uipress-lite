import { globalSettingsGroups, globalSettings, processGlobalGroups } from "@/settings/global-settings-groups.js";

/**
 * registerSiteSettingsGroups
 */
export const registerSiteSettingsGroups = () => {
  wp.hooks.addFilter("uipress.app.sitesettings.groups.register", "uipress", (current) => ({ ...current, ...globalSettingsGroups }));
  wp.hooks.addFilter("uipress.app.sitesettings.options.register", "uipress", (current) => [...current, ...globalSettings]);

  let SiteSettingsGroups = wp.hooks.applyFilters("uipress.app.sitesettings.groups.register", {});
  let SiteSettingsOptions = wp.hooks.applyFilters("uipress.app.sitesettings.options.register", []);
  return processGlobalGroups(SiteSettingsGroups, SiteSettingsOptions);
};
