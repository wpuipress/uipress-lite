import { defineAsyncComponent } from "vue";

import DropZone from "@/js/uip/uibuilder/block-drop-zone/index.vue";
import DropDown from "@/js/uip/components/dropdown/index.vue";
import MultiSelect from "@/js/uip/components/multiselect/index.vue";
import UserMultiSelect from "@/js/uip/components/user-role-multiselect/index.vue";
import UserSearch from "@/js/uip/components/user-role-search/index.vue";
import PostTypeMultiselect from "@/js/uip/components/post-type-select/index.vue";
import Accordion from "@/js/uip/components/accordion/index.vue";
import SwitchToggle from "@/js/uip/components/switch-toggle/index.vue";
import Tooltip from "@/js/uip/components/tooltip/index.vue";
import LoadingChart from "@/js/uip/components/loading-chart/index.vue";
import Offcanvas from "@/js/uip/components/offcanvas/index.vue";
import SaveButton from "@/js/uip/components/save-button/index.vue";
import FloatingPanel from "@/js/uip/components/floating-panel/index.vue";
import Modal from "@/js/uip/components/basic-modal/index.vue";
import AppIcon from "@/js/uip/components/icons/index.vue";
import ContextMenu from "@/js/uip/components/contextmenu/index.vue";

// Async charts as it's heavy
const ChartComp = defineAsyncComponent(() => import("@/js/uip/components/chart/index.vue"));

/**
 * Imports components globally
 *
 * @param {vueAppInstance} app
 */
export const registerGlobalComponents = (app) => {
  app.component("multi-select", MultiSelect);
  app.component("user-role-select", UserMultiSelect);
  app.component("user-role-search", UserSearch);
  app.component("post-type-select", PostTypeMultiselect);
  app.component("accordion", Accordion);
  app.component("uip-tooltip", Tooltip);
  app.component("uip-content-area", DropZone);
  app.component("loading-chart", LoadingChart);
  app.component("uip-offcanvas", Offcanvas);
  app.component("uip-save-button", SaveButton);
  app.component("toggle-switch", SwitchToggle);
  app.component("dropdown", DropDown);
  app.component("uip-chart", ChartComp);
  app.component("uip-floating-panel", FloatingPanel);
  app.component("uipModal", Modal);
  app.component("Modal", Modal);
  app.component("AppIcon", AppIcon);
  app.component("contextmenu", ContextMenu);
};
