import themeStyles from "./themeStyles.js";
import { isObject } from "@/utility/functions.js";

/**
 * Registers and processes dynamic data
 */
export const registerVariables = () => {
  wp.hooks.addFilter("uipress.app.variables.register", "uipress", (current) => ({ ...current, ...themeStyles }));
  const filtered = wp.hooks.applyFilters("uipress.app.variables.register");

  let UserThemeStyles = uip_ajax.uipAppData.themeStyles;
  return isObject(UserThemeStyles) ? { ...filtered, ...UserThemeStyles } : filtered;
};
