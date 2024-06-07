import { __ } from "@wordpress/i18n";
import { createApp, defineAsyncComponent, reactive, defineComponent } from "vue";
import { router } from "@/router/index.js";
import { registerGlobalComponents } from "@/setup/registerGlobalComponents.js";
import { registerBuilderComponents } from "@/setup/registerBuilderComponents.js";
import { buildDataStore } from "@/setup/buildDataStore.js";
import { registerGlobalProperties } from "@/setup/registerGlobalProperties.js";

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

/* Import dynamic plugins */
const DynamicPlugins = wp.hooks.applyFilters("uipress.plugins.register");
if (Array.isArray(DynamicPlugins)) {
  for (let plugin of DynamicPlugins) {
    app.use(plugin);
  }
}

app.mount("#uip-ui-builder");
