import { createApp } from "vue";
import { createWebHashHistory, createRouter } from "vue-router";
import BaseApp from "./options/test/baseapp.vue";

const routes = [
  {
    path: "/",
    name: "List View",
    component: () => import("./options/test/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const customapp = createApp(BaseApp);
customapp.use(router);

customapp.mount("#uip-ui-builder");
