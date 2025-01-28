import { setupApp } from "@/setup/setupApp.js";

// Create new div with all classes
const newDiv = document.createElement("div");
newDiv.className = "uip-position-absolute uip-w-100vw uip-h-100p uip-background-default uip-top-0 uip-user-frame uip-body-font uip-teleport uip-flex";
newDiv.setAttribute("id", "uip-ui-interface");

// Append to html tag after the body
document.body.appendChild(newDiv);

setupApp(newDiv);
