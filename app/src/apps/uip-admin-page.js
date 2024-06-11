import { setupApp } from "@/setup/setupApp.js";

// Only build app if we are not running inside main app
if (!document.querySelector("#uip-ui-interface")) {
  setupApp("#uip-admin-page");
}
