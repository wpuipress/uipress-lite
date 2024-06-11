/**
 * registerDynamicPlugins.js
 * uipress-lite
 *
 * @since 0.0.1
 */
export const registerDynamicPlugins = (app) => {
  const DynamicPlugins = wp.hooks.applyFilters("uipress.plugins.register");
  if (Array.isArray(DynamicPlugins)) {
    app.config.globalProperties.uipGlobalPlugins = DynamicPlugins;
  }
};
