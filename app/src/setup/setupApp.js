const { __ } = wp.i18n;
import { createApp } from "vue";
import { registerGlobalComponents } from "@/setup/registerGlobalComponents.js";
import { buildDataStore } from "@/setup/buildDataStore.js";
import { registerGlobalProperties } from "@/setup/registerGlobalProperties.js";
import { registerDynamicBlocks } from "@/setup/registerDynamicBlocks.js";
import { registerDynamicPlugins } from "@/setup/registerDynamicPlugins.js";
import { registerDynamicComponents } from "@/setup/registerDynamicComponents.js";
import { setGlobalProperties } from "@/setup/setGlobalProperties.js";
import { createPinia } from "pinia";
import { useAppStore } from "@/store/app/app.js";

// Import comps
import MainApp from "@/components/app-view/index.vue";

/**
 * builds a uip app
 *
 * @param {string} selectorID
 */
export const setupApp = (mountPoint) => {
  /* Create vue app */
  const app = createApp(MainApp);

  // Use pinia
  const pinia = createPinia();
  app.use(pinia);

  const appStore = useAppStore();
  setGlobalProperties(appStore);

  /* Import Core components */
  registerGlobalComponents(app);
  registerGlobalProperties(app);
  buildDataStore(app, "prod");
  registerDynamicBlocks(app);
  registerDynamicPlugins(app);
  registerDynamicComponents(app);

  if (mountPoint.classList.contains("uip-teleport")) {
    document.body.appendChild(mountPoint);
  }

  app.mount(mountPoint);
};
