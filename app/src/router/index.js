import { defineComponent } from "vue";
import { createWebHashHistory, createRouter } from "vue-router";
import { __ } from "@wordpress/i18n";

/**
 * Defines and create ui builder routes
 * @since 3.0.0
 */

const routes = [
  {
    path: "/",
    name: "List View",
    component: () => import("@/pages/home/index.vue"),
  },
  {
    name: "Site settings",
    path: "/site-settings/",
    component: () => import("@/pages/site-settings/index.vue"),
  },
  {
    name: "import-export",
    path: "/import-export/",
    //component: () => import("@/uibuilder/global-export/index.vue"),
    component: () => import("@/pages/import-export/index.vue"),
  },
  {
    name: "remote-sync",
    path: "/remote-sync/",
    //component: () => import("@/uibuilder/global-export/index.vue"),
    component: () => import("@/pages/site-sync/index.vue"),
  },
  {
    name: "Error log",
    path: "/error-log",
    component: () => import("@/pages/error-log/index.vue"),
  },
  {
    path: "/uibuilder/:templateID/",
    name: "uibuilder",
    component: () => import("@/uibuilder/framework/index.vue"),
    children: [
      {
        name: "templateSettings",
        path: "settings/template",
        component: () => import("@/uibuilder/builder-settings/index.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
