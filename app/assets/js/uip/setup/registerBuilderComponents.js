import { defineAsyncComponent } from "vue";

//Option components
import { VueDraggableNext } from "vue-draggable-next";
import UIbuilderInlineImageSelect from "@/js/uip/options/inline-image-select/index.vue";
import UIbuilderBackgroundPosition from "@/js/uip/options/background-position/index.vue";
import UIbuilderSwitch from "@/js/uip/options/switch-select/index.vue";
import UIbuilderValueUnits from "@/js/uip/options/value-units/index.vue";
import UIbuilderUnits from "@/js/uip/options/units/index.vue";
import UIbuilderColorSelect from "@/js/uip/options/color-select/index.vue";
import UIbuilderInput from "@/js/uip/options/input/index.vue";
import UIbuilderTextarea from "@/js/uip/options/textarea/index.vue";
import UIbuilderNumber from "@/js/uip/options/number/index.vue";
import UIbuilderPostTypes from "@/js/uip/options/post-types/index.vue";
import UIbuilderParagraphInput from "@/js/uip/options/paragraph-input/index.vue";
import UIbuilderDynamicInput from "@/js/uip/options/dynamic-input/index.vue";
import UIbuilderIconSelect from "@/js/uip/options/icon-select/index.vue";
import UIbuilderInlineIconSelect from "@/js/uip/options/inline-icon-select/index.vue";
import UIbuilderChoiceSelect from "@/js/uip/options/choice-select/index.vue";
import UIbuilderDefaultSelect from "@/js/uip/options/default-select/index.vue";
import UIbuilderLinkSelect from "@/js/uip/options/link-select/index.vue";
import UIbuilderTabBuilder from "@/js/uip/options/tab-builder/index.vue";
import UIbuilderHiddenToolbarItems from "@/js/uip/options/hidden-toolbar-items-select/index.vue";
import UIbuilderEditToolbarItems from "@/js/uip/options/edit-toolbar-items/index.vue";
import MultiSelectOption from "@/js/uip/options/multi-select/index.vue";
import UIbuilderSubmitAction from "@/js/uip/options/submit-action/index.vue";
import UIbuilderSelectOptionBuilder from "@/js/uip/options/select-option-builder/index.vue";
import UIbuilderArrayList from "@/js/uip/options/array-list/index.vue";
import UIbuilderSelectPostTypes from "@/js/uip/options/select-post-types/index.vue";
import UIbuilderEffects from "@/js/uip/options/effects/index.vue";

// Async code editor as it's heavy
const UIbuilderCodeEditor = defineAsyncComponent(() => import(`@/js/uip/options/code-editor/index.vue`));

/**
 * Imports components globally
 *
 * @param {vueAppInstance} app
 */
export const registerBuilderComponents = (app) => {
  //OPTION MODS
  app.component("background-position", UIbuilderBackgroundPosition);
  app.component("switch-select", UIbuilderSwitch);
  app.component("value-units", UIbuilderValueUnits);
  app.component("units-select", UIbuilderUnits);
  app.component("color-select", UIbuilderColorSelect);
  app.component("uip-input", UIbuilderInput);
  app.component("uip-textarea", UIbuilderTextarea);
  app.component("post-types", UIbuilderPostTypes);
  app.component("uip-number", UIbuilderNumber);
  app.component("uip-paragraph-input", UIbuilderParagraphInput);
  app.component("uip-dynamic-input", UIbuilderDynamicInput);
  app.component("icon-select", UIbuilderIconSelect);
  app.component("inline-icon-select", UIbuilderInlineIconSelect);
  app.component("choice-select", UIbuilderChoiceSelect);
  app.component("default-select", UIbuilderDefaultSelect);
  app.component("hiden-toolbar-items-select", UIbuilderHiddenToolbarItems);
  app.component("edit-toolbar-items", UIbuilderEditToolbarItems);
  app.component("multi-select-option", MultiSelectOption);
  app.component("code-editor", UIbuilderCodeEditor);
  app.component("submit-actions", UIbuilderSubmitAction);
  app.component("link-select", UIbuilderLinkSelect);
  app.component("tab-builder", UIbuilderTabBuilder);
  app.component("select-option-builder", UIbuilderSelectOptionBuilder);
  app.component("array-list", UIbuilderArrayList);
  app.component("uip-select-post-types", UIbuilderSelectPostTypes);
  app.component("inline-image-select", UIbuilderInlineImageSelect);
  app.component("uip-effects", UIbuilderEffects);
  app.component("uip-draggable", VueDraggableNext);
};
