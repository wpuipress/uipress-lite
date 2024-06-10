import { __ } from "@wordpress/i18n";
import { createApp, defineAsyncComponent, reactive, defineComponent, h } from "vue";
import { router } from "@/router/index.js";
import { registerGlobalComponents } from "@/setup/registerGlobalComponents.js";
import { registerBuilderComponents } from "@/setup/registerBuilderComponents.js";
import { buildDataStore } from "@/setup/buildDataStore.js";
import { registerGlobalProperties } from "@/setup/registerGlobalProperties.js";
import { registerDynamicBlocks } from "@/setup/registerDynamicBlocks.js";

/* Import comps */
import BaseApp from "@/pages/wrapper/index.vue";

/* Build app */
const app = createApp(BaseApp);
app.use(router);

/* Import Core components */
registerGlobalComponents(app);
registerBuilderComponents(app);
registerGlobalProperties(app);
buildDataStore(app, "builder");
registerDynamicBlocks(app);

const DynamicPlugins = wp.hooks.applyFilters("uipress.plugins.register");
if (Array.isArray(DynamicPlugins)) {
  app.config.globalProperties.uipGlobalPlugins = DynamicPlugins;
}

const DynamicComponents = wp.hooks.applyFilters("uipress.components.register");
if (Array.isArray(DynamicComponents)) {
  /* Loops new blocks */
  for (let component of DynamicComponents) {
    /* Delete the render function to remove any vue instance context */
    delete component.component.render;
    app.component(component.name, component.component);
  }
}

app.mount("#uip-ui-builder");
