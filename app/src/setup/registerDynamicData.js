import { processDynamicSettings } from "./processDynamicSettings.js";

/**
 * Registers and processes dynamic data
 */
export const registerDynamicData = () => {
  const dynamic_settings = processDynamicSettings(uip_ajax.uipAppData?.options?.dynamicData);
  wp.hooks.addFilter("uipress.uibuilder.dynamicdata.register", "uipress", (current) => ({ ...current, ...dynamic_settings }));
  return wp.hooks.applyFilters("uipress.uibuilder.dynamicdata.register", {});
};
