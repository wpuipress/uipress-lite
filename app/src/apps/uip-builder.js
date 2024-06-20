const { __ } = wp.i18n;
import { createApp, defineAsyncComponent, reactive, defineComponent, h } from "vue";
import { router } from "@/router/index.js";
import { registerGlobalComponents } from "@/setup/registerGlobalComponents.js";
import { registerBuilderComponents } from "@/setup/registerBuilderComponents.js";
import { buildDataStore } from "@/setup/buildDataStore.js";
import { registerGlobalProperties } from "@/setup/registerGlobalProperties.js";
import { registerDynamicBlocks } from "@/setup/registerDynamicBlocks.js";
import { registerDynamicPlugins } from "@/setup/registerDynamicPlugins.js";
import { registerDynamicComponents } from "@/setup/registerDynamicComponents.js";
/* Import comps */
import BaseApp from "@/pages/wrapper/index.vue";

// Import css
import "../index.css";

// Only build app if we are not running inside main app
if (!document.querySelector("#uip-ui-interface")) {
  /* Build app */
  const app = createApp(BaseApp);
  app.use(router);

  /* Import Core components */
  registerGlobalComponents(app);
  registerBuilderComponents(app);
  registerGlobalProperties(app);
  buildDataStore(app, "builder");
  registerDynamicBlocks(app);
  registerDynamicPlugins(app);
  registerDynamicComponents(app);

  app.mount("#uip-ui-builder");
}
