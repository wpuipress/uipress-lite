import { defineAsyncComponent } from "vue";

import DropZone from "@/uibuilder/block-drop-zone/index.vue";
import DropDown from "@/components/dropdown/index.vue";
import MultiSelect from "@/components/multiselect/index.vue";
import UserMultiSelect from "@/components/user-role-multiselect/index.vue";
import UserSearch from "@/components/user-role-search/index.vue";
import PostTypeMultiselect from "@/components/post-type-select/index.vue";
import Accordion from "@/components/accordion/index.vue";
import SwitchToggle from "@/components/switch-toggle/index.vue";
import Tooltip from "@/components/tooltip/index.vue";
import LoadingChart from "@/components/loading-chart/index.vue";
import Offcanvas from "@/components/offcanvas/index.vue";
import SaveButton from "@/components/save-button/index.vue";
import FloatingPanel from "@/components/floating-panel/index.vue";
import Modal from "@/components/basic-modal/index.vue";
import AppIcon from "@/components/icons/index.vue";
import ContextMenu from "@/components/contextmenu/index.vue";
import MediaLibrary from "@/components/media-library/MediaLibrary.vue";
import { VueDraggableNext } from "vue-draggable-next";

// Async charts as it's heavy
const ChartComp = defineAsyncComponent(() => import("@/components/chart/index.vue"));

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
  app.component("uipMediaLibrary", MediaLibrary);
  app.component("VueDraggableNext", VueDraggableNext);

  // Make some components available to pro components
  app.config.globalProperties.globalComponents = { AppIcon, VueDraggableNext };
};
