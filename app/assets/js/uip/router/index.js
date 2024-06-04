import { defineComponent } from "vue";
import { createWebHashHistory, createRouter } from "vue-router";
const { __, _x, _n, _nx } = wp.i18n;

/**
 * Defines and create ui builder routes
 * @since 3.0.0
 */

import BuilderSettings from "@/js/uip/uibuilder/builder-settings/index.vue";
import TemplateTable from "@/js/uip/uibuilder/template-table/index.vue";
import SetupWizard from "@/js/uip/uibuilder/setup-wizard/index.vue";
import GlobalExport from "@/js/uip/uibuilder/global-export/index.vue";
import GlobalImport from "@/js/uip/uibuilder/global-import/index.vue";
import SiteSync from "@/js/uip/uibuilder/site-sync/index.vue";
import SiteSettings from "@/js/uip/uibuilder/site-settings/index.vue";
import Framework from "@/js/uip/uibuilder/framework/index.vue";
import Errorlog from "@/js/uip/tools/error-log/index.vue";

const routes = [
  {
    path: "/",
    name: "List View",
    component: defineComponent(TemplateTable),
    children: [
      {
        name: "Setup wizard",
        path: "/setupwizard/",
        component: SetupWizard,
      },
      {
        name: "Global export",
        path: "/globalexport/",
        component: GlobalExport,
      },
      {
        name: "Global import",
        path: "/globalimport/",
        component: GlobalImport,
      },
      {
        name: "Site sync",
        path: "/sitesync/",
        component: SiteSync,
      },
      {
        name: "Site settings",
        path: "/site-settings/",
        component: SiteSettings,
      },
      {
        name: "Error log",
        path: "/errorlog/",
        component: Errorlog,
      },
    ],
  },
  {
    path: "/uibuilder/:templateID/",
    name: "Builder",
    component: Framework,
    children: [
      {
        name: "templateSettings",
        path: "settings/template",
        component: BuilderSettings,
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
