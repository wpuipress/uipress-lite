import { setupApp } from "@/setup/setupApp.js";
import { config } from "@/store/app/constants.js";

// Setup config
let templateID = new URL(import.meta.url).searchParams.get("template-id");
config.value.templateId = templateID;
config.value.templateType = "ui-admin-page";

const mountPoint = document.querySelector("#uip-admin-page");
setupApp(mountPoint);
