import { __ } from "@wordpress/i18n";
import { createApp, getCurrentInstance, defineComponent, reactive } from "vue";
import { isObject, uipParseJson } from "@/utility/functions.js";
import { registerGlobalComponents } from "@/setup/registerGlobalComponents.js";
import { buildDataStore } from "@/setup/buildDataStore.js";
import { registerGlobalProperties } from "@/setup/registerGlobalProperties.js";

// Import comps
import MainApp from "@/components/app-view/index.vue";

/* Create vue app */
const app = createApp(MainApp);

/* Import Core components */
registerGlobalComponents(app);
registerGlobalProperties(app);
buildDataStore(app, "prod");

const mountPoint = document.querySelector("#uip-ui-app");

if (mountPoint.classList.contains("uip-teleport")) {
  document.body.appendChild(mountPoint);
}

app.mount("#uip-ui-app");
