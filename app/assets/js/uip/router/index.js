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
    component: () => import("@/js/uip/pages/home/index.vue"),
    children: [
      {
        name: "Setup wizard",
        path: "/setupwizard/",
        component: () => import("@/js/uip/uibuilder/setup-wizard/index.vue"),
      },
      {
        name: "Global export",
        path: "/globalexport/",
        component: () => import("@/js/uip/uibuilder/global-export/index.vue"),
      },
      {
        name: "Global import",
        path: "/globalimport/",
        component: () => import("@/js/uip/uibuilder/global-import/index.vue"),
      },
      {
        name: "Site sync",
        path: "/sitesync/",
        component: () => import("@/js/uip/uibuilder/site-sync/index.vue"),
      },
    ],
  },
  {
    name: "Site settings",
    path: "/site-settings/",
    component: () => import("@/js/uip/pages/site-settings/index.vue"),
  },
  {
    name: "Error log",
    path: "/error-log",
    component: () => import("@/js/uip/pages/error-log/index.vue"),
  },
  {
    path: "/uibuilder/:templateID/",
    name: "uibuilder",
    component: () => import("@/js/uip/uibuilder/framework/index.vue"),
    children: [
      {
        name: "templateSettings",
        path: "settings/template",
        component: () => import("@/js/uip/uibuilder/builder-settings/index.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
