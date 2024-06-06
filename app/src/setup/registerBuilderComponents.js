import { defineAsyncComponent } from "vue";

//Option components
import InlineImageSelect from "@/options/inline-image-select/index.vue";
import BackgroundPosition from "@/options/background-position/index.vue";
import Switch from "@/options/switch-select/index.vue";
import ValueUnits from "@/options/value-units/index.vue";
import Units from "@/options/units/index.vue";
import ColorSelect from "@/options/color-select/index.vue";
import Input from "@/options/input/index.vue";
import Textarea from "@/options/textarea/index.vue";
import Number from "@/options/number/index.vue";
import PostTypes from "@/options/post-types/index.vue";
import ParagraphInput from "@/options/paragraph-input/index.vue";
import DynamicInput from "@/options/dynamic-input/index.vue";
import IconSelect from "@/options/icon-select/index.vue";
import InlineIconSelect from "@/options/inline-icon-select/index.vue";
import ChoiceSelect from "@/options/choice-select/index.vue";
import DefaultSelect from "@/options/default-select/index.vue";
import LinkSelect from "@/options/link-select/index.vue";
import TabBuilder from "@/options/tab-builder/index.vue";
import HiddenToolbarItems from "@/options/hidden-toolbar-items-select/index.vue";
import EditToolbarItems from "@/options/edit-toolbar-items/index.vue";
import MultiSelectOption from "@/options/multi-select/index.vue";
import SubmitAction from "@/options/submit-action/index.vue";
import SelectOptionBuilder from "@/options/select-option-builder/index.vue";
import ArrayList from "@/options/array-list/index.vue";
import SelectPostTypes from "@/options/select-post-types/index.vue";
import Effects from "@/options/effects/index.vue";
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
