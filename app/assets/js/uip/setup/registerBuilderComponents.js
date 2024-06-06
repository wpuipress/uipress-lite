import { defineAsyncComponent } from "vue";

//Option components
import InlineImageSelect from "@/js/uip/options/inline-image-select/index.vue";
import BackgroundPosition from "@/js/uip/options/background-position/index.vue";
import Switch from "@/js/uip/options/switch-select/index.vue";
import ValueUnits from "@/js/uip/options/value-units/index.vue";
import Units from "@/js/uip/options/units/index.vue";
import ColorSelect from "@/js/uip/options/color-select/index.vue";
import Input from "@/js/uip/options/input/index.vue";
import Textarea from "@/js/uip/options/textarea/index.vue";
import Number from "@/js/uip/options/number/index.vue";
import PostTypes from "@/js/uip/options/post-types/index.vue";
import ParagraphInput from "@/js/uip/options/paragraph-input/index.vue";
import DynamicInput from "@/js/uip/options/dynamic-input/index.vue";
import IconSelect from "@/js/uip/options/icon-select/index.vue";
import InlineIconSelect from "@/js/uip/options/inline-icon-select/index.vue";
import ChoiceSelect from "@/js/uip/options/choice-select/index.vue";
import DefaultSelect from "@/js/uip/options/default-select/index.vue";
import LinkSelect from "@/js/uip/options/link-select/index.vue";
import TabBuilder from "@/js/uip/options/tab-builder/index.vue";
import HiddenToolbarItems from "@/js/uip/options/hidden-toolbar-items-select/index.vue";
import EditToolbarItems from "@/js/uip/options/edit-toolbar-items/index.vue";
import MultiSelectOption from "@/js/uip/options/multi-select/index.vue";
import SubmitAction from "@/js/uip/options/submit-action/index.vue";
import SelectOptionBuilder from "@/js/uip/options/select-option-builder/index.vue";
import ArrayList from "@/js/uip/options/array-list/index.vue";
import SelectPostTypes from "@/js/uip/options/select-post-types/index.vue";
import Effects from "@/js/uip/options/effects/index.vue";
import { VueDraggableNext } from "vue-draggable-next";

/**
 * Imports components globally
 *
 * @param {vueAppInstance} app
 */
export const registerBuilderComponents = (app) => {
  //OPTION MODS
  app.component("background-position", BackgroundPosition);
  app.component("switch-select", Switch);
  app.component("value-units", ValueUnits);
  app.component("units-select", Units);
  app.component("color-select", ColorSelect);
  app.component("uip-input", Input);
  app.component("uip-textarea", Textarea);
  app.component("post-types", PostTypes);
  app.component("uip-number", Number);
  app.component("uip-paragraph-input", ParagraphInput);
  app.component("uip-dynamic-input", DynamicInput);
  app.component("icon-select", IconSelect);
  app.component("inline-icon-select", InlineIconSelect);
  app.component("choice-select", ChoiceSelect);
  app.component("default-select", DefaultSelect);
  app.component("hiden-toolbar-items-select", HiddenToolbarItems);
  app.component("edit-toolbar-items", EditToolbarItems);
  app.component("multi-select-option", MultiSelectOption);
  app.component("submit-actions", SubmitAction);
  app.component("link-select", LinkSelect);
  app.component("tab-builder", TabBuilder);
  app.component("select-option-builder", SelectOptionBuilder);
  app.component("array-list", ArrayList);
  app.component("uip-select-post-types", SelectPostTypes);
  app.component("inline-image-select", InlineImageSelect);
  app.component("uip-effects", Effects);
  app.component("VueDraggableNext", VueDraggableNext);
};
