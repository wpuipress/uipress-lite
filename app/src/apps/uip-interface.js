import { setupApp } from "@/setup/setupApp.js";

import "../index.css";

// Create new div with all classes
const newDiv = document.createElement("div");
newDiv.className = "uip-position-absolute uip-w-100vw uip-h-100p uip-background-default uip-top-0 uip-user-frame uip-body-font uip-teleport uip-flex";
newDiv.setAttribute("id", "uip-ui-interface");

// Teleport mount point
const teleport = document.createElement("div");
teleport.style["z-index"] = 2;
teleport.style.position = "relative";
teleport.setAttribute("id", "uip-teleport-target");

// Append to html tag after the body
document.body.appendChild(teleport);
document.body.appendChild(newDiv);

setupApp(newDiv);
