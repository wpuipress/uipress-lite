/**
 * registerDynamicComponents.js
 * uipress-lite
 *
 * @since 0.0.1
 */
export const registerDynamicComponents = (app) => {
  const DynamicComponents = wp.hooks.applyFilters("uipress.components.register");
  if (Array.isArray(DynamicComponents)) {
    /* Loops new blocks */
    for (let component of DynamicComponents) {
      /* Delete the render function to remove any vue instance context */
      delete component.component.render;
      app.component(component.name, component.component);
    }
  }
};
