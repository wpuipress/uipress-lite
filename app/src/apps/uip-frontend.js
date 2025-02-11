import { setupApp } from "@/setup/setupApp.js";
import { config } from "@/store/app/constants.js";

const mountPoint = document.querySelector("#wpadminbar");
if (mountPoint) {
  // Create the div element
  const div = document.createElement("div");
  div.id = "uip-frontend-toolbar";
  mountPoint.appendChild(div);

  setupApp(div);
}
