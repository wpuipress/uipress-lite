<script>
const { __ } = wp.i18n;
import { nextTick, defineAsyncComponent } from "vue";

import StylePresets from "./StylePresets.vue";
import BlockParts from "./BlockParts.vue";
import ToggleSection from "@/components/toggle-section/index.vue";
import BlockStyleHandler from "./BlockStyleHandler.vue";

import QueryBuilder from "@/options/query-builder/index.vue";
import Interactions from "@/options/interactions/index.vue";
import responsiveControls from "@/options/responsive/index.vue";
import Classes from "@/options/classes/index.vue";
import Conditions from "@/options/conditions/index.vue";
import AppButton from "@/components/app-button/index.vue";
import AppInput from "@/components/text-input/index.vue";

export default {
  inject: ["uiTemplate"],
  components: {
    QueryBuilder,
    Interactions,
    responsiveControls,
    Classes,
    Conditions,
    BlockStyleHandler: BlockStyleHandler,
    BlockParts: BlockParts,
    StylePresets: StylePresets,
    ToggleSection: ToggleSection,
    AppButton,
    AppInput,
    CodeEditor: defineAsyncComponent(() => import("@/options/code-editor/index.vue")),
    "code-editor": defineAsyncComponent(() => import("@/options/code-editor/index.vue")),
  },
  data() {
    return {
      block: {},
      uid: this.$route.params.uid,
      section: "settings",
      loading: true,
      activeTab: false,
      showSettings: false,
      activePart: "root",
      strings: {
        blockID: __("ID", "uipress-lite"),
        proOption: __("This is a pro option. Upgrade to unlock", "uipress-lite"),
        options: __("Options", "uipress-lite"),
        hiddenOnDevice: __("Hidden on device", "uipress-lite"),
        tooltip: __("Tooltip", "uipress-lite"),
        tooltipMessage: __("Message", "uipress-lite"),
        styles: __("Styles", "uipress-lite"),
        queryLoop: __("Query loop", "uipress-lite"),
        query: __("Query", "uipress-lite"),
        none: __("None", "uipress-lite"),
        name: __("Name", "uipress-lite"),
        link: __("Link", "uipress-lite"),
        general: __("General", "uipress-lite"),
        layout: __("Layout", "uipress-lite"),
        size: __("Size", "uipress-lite"),
        style: __("Style", "uipress-lite"),
        spacing: __("Spacing", "uipress-lite"),
        text: __("Text", "uipress-lite"),
        position: __("Position", "uipress-lite"),
        effects: __("Effects", "uipress-lite"),
        general: __("General", "uipress-lite"),
        code: __("Code", "uipress-lite"),
        classes: __("Classes", "uipress-lite"),
        conditions: __("Conditions", "uipress-lite"),
        content: __("Content", "uipress-lite"),
        interactions: __("Interactions", "uipress-lite"),
      },
      optionsSections: {
        settings: {
          value: "settings",
          label: __("Settings", "uipress-lite"),
        },

        style: {
          value: "style",
          label: __("Style", "uipress-lite"),
        },

        advanced: {
          value: "advanced",
          label: __("Advanced", "uipress-lite"),
        },
      },
    };
  },
  created() {
    this.uipApp.blockSettings = this;
  },
  computed: {
    /**
     * Shows interaction panel on open if interactions applied
     *
     * @since 3.3.095
     */
    maybeShowInteractionPanel() {
      if (this.block.interactions) return this.block.interactions.length;
      return false;
    },

    /**
     * Returns the current blocks component name
     *
     * @since 3.2.13
     */
    returnBlockRealName() {
      const modName = this.block.moduleName;
      const allBlocks = this.uipApp.data.blocks;
      const masterBlock = allBlocks.find((block) => block.moduleName === modName);
      if (!masterBlock) return this.block.name;
      return masterBlock.name;
    },
    /**
     * Returns block query settings
     *
     * @since 3.2.13
     */
    returnBlockQuerySettings() {
      if (!this.block.query) this.block.query = { settings: {} };
      return this.block.query.settings;
    },
    /**
     * Returns options for current block
     *
     * @since 3.2.13
     */
    returnBlockOptions() {
      const blockModule = this.block.moduleName;
      const allBlocks = this.uipApp.data.blocks;

      // Find the originally registered block's enabled settings
      const masterBlock = allBlocks.find((block) => block.metadata.moduleName === blockModule);

      // No block settings so bail
      if (!masterBlock) return [];

      const allBlockSettings = masterBlock.metadata.optionsEnabled;
      const blockOptionsIndex = allBlockSettings.findIndex((option) => option.name === "block");

      // No block specific settings so bail
      if (blockOptionsIndex < 0) return [];
      return allBlockSettings[blockOptionsIndex].options;
    },
  },
  methods: {
    /**
     * Opens block settings
     *
     * @param {Object} block - the current block
     * @since 3.2.13
     */
    async show(block, tab) {
      this.block = block;
      this.activePart = "root";

      await nextTick();
      this.showSettings = true;
      this.loading = false;

      // Set active tab
      if (tab) this.section = tab;
    },
    /**
     * Closes block settings
     *
     * @since 3.2.13
     */
    close() {
      this.showSettings = false;
      this.block = null;
    },

    /**
     * Checks whether a component exists
     *
     * @param {String} name - the name of the component
     */
    componentExists(name) {
      if (this.$root._.appContext.components[name] || name == "code-editor") {
        return true;
      } else {
        return false;
      }
    },

    /**
     * Checks if the given option is full width option
     *
     * @param {Object} option - the option object
     * @since 3.2.13
     */
    optionFullWidth(option) {
      return this.hasNestedPath(option, "args", "fullWidth");
    },

    /**
     * Handles tab changes and pushes to query params
     *
     * @param {String} tab - new tab to switch to
     * @since 3.2.13
     */
    handleActiveTabChange(tab) {
      this.section = tab;
      const newparams = { query: { ...this.$route.query, section: this.section } };
      this.$router.push(newparams);
    },

    /**
     * Returns current style for block
     *
     * @param {String} styleName - the name of the current style
     * @param {Object} newValue - the new style value
     * @since 3.2.13
     */
    returnBlockStylePart(styleName) {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const presetID = this.hasNestedPath(this.block, "settings", part, "preset");
      const presets = this.uipApp.data.options.block_preset_styles;

      // Return preset style if set and exists
      if (presetID && this.isObject(presets)) {
        if (presetID in presets) {
          const preset = presets[presetID];
          this.ensureNestedObject(preset, "preset", "options", styleName);
          return preset.preset.options[styleName];
        }
      }

      this.ensureNestedObject(this.block, "settings", part, "options", styleName);
      return this.block.settings[part].options[styleName];
    },

    /**
     * Returns whether the setting is available to the current plugin
     *
     * @param {Object} option - the object to check
     * @returns {boolean}
     * @since 3.2.13
     */
    isAvailable(option) {
      if (!option.requiresUpgrade) return true;
      if (this.uiTemplate.proActivated) return true;
      return false;
    },

    /**
     * Returns the block setting value for specific option if it exists
     *
     * @param {Object} option - the requested option
     * @since 3.2.13
     */
    returnBlockSettingValue(option) {
      const blockOptions = this.hasNestedPath(this.block, "settings", "block", "options");
      if (!blockOptions) return;

      // Get the option key
      const key = option.uniqueKey ? option.uniqueKey : option.option;

      // Key doesn't exist
      if (!(key in blockOptions)) return;

      return blockOptions[key].value;
    },

    /**
     * Handles block option updates
     *
     * @param {Object} option - the requested option
     * @param {Mixed} data - the new option value
     * @since 3.2.13
     */
    handleBlockSettingUpdate(option, data) {
      // Get the option key
      const key = option.uniqueKey ? option.uniqueKey : option.option;

      this.ensureNestedObject(this.block, "settings", "block", "options", key);
      this.block.settings.block.options[key].value = data;
    },

    /**
     * Returns specific value for advanced settings
     *
     * @param {String} option - the name of the required option
     * @since 3.2.13
     */
    returnAdvancedValue(option) {
      const blockOptions = this.hasNestedPath(this.block, "settings", "advanced", "options");
      if (!blockOptions) return;

      // Key doesn't exist
      if (!(option in blockOptions)) return;

      return blockOptions[option].value;
    },

    /**
     * Handles block option updates
     *
     * @param {Object} option - the requested option
     * @param {Mixed} data - the new option value
     * @since 3.2.13
     */
    handleBlockAdavancedUpdate(option, data) {
      this.ensureNestedObject(this.block, "settings", "advanced", "options", option);
      this.block.settings.advanced.options[option].value = data;
    },

    /**
     * Returns the current value of the pseudo content
     *
     * @param {type} pseudo - type of pseudo (beforeContent | afterContent)
     * @since 3.2.13
     */
    returnBlockPseudo(pseudo) {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const value = this.hasNestedPath(this.block, "settings", part, pseudo);
      if (!value) return "";
      return value;
    },

    /**
     * Handles pseudo change and updates the requested content setting
     *
     * @param {type} pseudo - type of pseudo (::before | ::after)
     * @since 3.2.13
     */
    handleBlockPseudoChange(data, pseudo) {
      const part = this.activePart == "root" ? "style" : this.activePart;
      this.ensureNestedObject(this.block, "settings", part, pseudo);
      this.block.settings[part][pseudo] = data;
    },
  },
};
</script>

<template>
  <div v-if="showSettings" id="uip-block-settings" class="fixed top-[72px] right-6 bottom-6 bg-white w-[320px] flex flex-col gap-6 shadow-lg z-[2] overflow-auto rounded-xl border border-zinc-200 p-6">
    <!-- Block settings header -->
    <div class="flex place-content-between items-center">
      <div class="font-semibold text-lg text-zinc-900">{{ returnBlockRealName }}</div>

      <AppButton type="transparent" @click="close()">
        <AppIcon icon="close" />
      </AppButton>
    </div>
    <!-- End block settings header -->

    <!-- Toggle active tab -->
    <toggle-switch :options="optionsSections" :activeValue="section" :returnValue="handleActiveTabChange" class="uip-margin-bottom-xxs" />

    <!-- Settings Tab -->
    <div v-if="section == 'settings'" class="flex flex-col gap-6">
      <!-- General settings -->
      <ToggleSection :title="strings.general" :startOpen="true">
        <div class="grid grid-cols-3 pl-4 pt-4 gap-2">
          <div class="text-zinc-400 text-sm flex flex-col place-content-center">
            <span>{{ strings.name }}</span>
          </div>

          <AppInput v-model="block.name" type="text" class="col-span-2" />

          <div class="text-zinc-400 text-sm flex flex-col place-content-center">
            <span>{{ strings.blockID }}</span>
          </div>

          <AppInput v-model="block.uid" type="text" class="col-span-2" :disabled="true" :copy="true" />

          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-max-h-30">
            <span>{{ strings.link }}</span>
          </div>

          <link-select class="col-span-2" :value="block.linkTo" :returnData="(d) => (block.linkTo = d)" />

          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-max-h-30">
            <span>{{ strings.tooltip }}</span>
          </div>

          <AppInput v-model="block.tooltip.message" type="text" class="col-span-2" />
        </div>
      </ToggleSection>
      <!-- End general settings -->

      <div class="uip-border-top"></div>

      <!-- Query loop  -->
      <ToggleSection :title="strings.queryLoop">
        <QueryBuilder v-if="uiTemplate.proActivated" :block="block" :value="returnBlockQuerySettings" />

        <div class="uip-grid-col-1-3" v-else>
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
            <span>{{ strings.queryLoop }}</span>
          </div>
          <div class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">{{ strings.proOption }}</div>
        </div>
      </ToggleSection>
      <!-- End query -->

      <div class="uip-border-top"></div>

      <!-- Interactions  -->
      <ToggleSection :title="strings.interactions" :startOpen="maybeShowInteractionPanel">
        <Interactions v-if="uiTemplate.proActivated" :block="block" />

        <div class="uip-grid-col-1-3" v-else>
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
            <span>{{ strings.queryLoop }}</span>
          </div>
          <div class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">{{ strings.proOption }}</div>
        </div>
      </ToggleSection>
      <!-- End query -->

      <div class="uip-border-top"></div>

      <!-- Responsive  -->
      <ToggleSection :title="strings.hiddenOnDevice">
        <responsiveControls
          :value="block.responsive"
          :returnData="
            (e) => {
              block.responsive = e;
            }
          "
        />
      </ToggleSection>
      <!-- End Responsive -->

      <div class="uip-border-top" v-if="returnBlockOptions.length"></div>

      <!-- Block options  -->
      <ToggleSection :title="strings.options" :startOpen="true" v-if="returnBlockOptions.length">
        <div class="uip-flex uip-flex-column uip-row-gap-xs">
          <template v-for="option in returnBlockOptions">
            <div :class="optionFullWidth(option) ? 'uip-flex uip-flex-column uip-row-gap-xxs' : 'uip-grid-col-1-3'">
              <div v-if="!optionFullWidth(option)" class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-h-30 uip-gap-xs uip-position-relative">
                <dropdown pos="left center" :openOnHover="true" :snapX="['#uip-block-settings']" :hover="true">
                  <template class="uip-flex-no-shrink" v-slot:trigger>
                    <span :class="option.help ? 'uip-text-underline' : ''">{{ option.label }}</span>
                  </template>
                  <template v-if="option.help" v-slot:content>
                    <div class="uip-text-s uip-padding-xs uip-max-w-200">{{ option.help }}</div>
                  </template>
                </dropdown>
              </div>

              <div class="uip-flex uip-flex-center uip-w-100p">
                <component
                  v-if="componentExists(option.componentName) && isAvailable(option)"
                  :is="option.componentName"
                  v-bind="option"
                  :value="returnBlockSettingValue(option)"
                  :returnData="(data) => handleBlockSettingUpdate(option, data)"
                />

                <div v-else class="uip-padding-xxs uip-border-rounder uip-background-green-wash uip-text-s">{{ strings.proOption }}</div>
              </div>
            </div>
          </template>
        </div>
      </ToggleSection>
      <!-- End block options -->
    </div>
    <!-- End setting tab -->

    <!-- Advanced Tab -->
    <div v-if="section == 'advanced'" class="uip-flex uip-flex-column uip-gap-s">
      <!-- Classes  -->
      <ToggleSection :title="strings.classes" :startOpen="true">
        <div class="uip-grid-col-1-3">
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-padding-top-xxs uip-flex-start">
            <span>{{ strings.classes }}</span>
          </div>
          <Classes
            :value="returnAdvancedValue('classes')"
            :returnData="
              (d) => {
                handleBlockAdavancedUpdate('classes', d);
              }
            "
          />
        </div>
      </ToggleSection>

      <!-- Conditions  -->
      <ToggleSection :title="strings.conditions" :startOpen="true">
        <div class="uip-grid-col-1-3">
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-padding-top-xxs uip-flex-start">
            <span>{{ strings.conditions }}</span>
          </div>
          <Conditions
            :value="returnAdvancedValue('conditions')"
            :returnData="
              (d) => {
                handleBlockAdavancedUpdate('conditions', d);
              }
            "
          />
        </div>
      </ToggleSection>

      <!-- Code  -->
      <ToggleSection :title="strings.code" :startOpen="true">
        <div class="uip-grid-col-1-3">
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>css</span></div>
          <CodeEditor
            :args="{ language: 'css' }"
            :value="returnAdvancedValue('css')"
            :returnData="
              (d) => {
                handleBlockAdavancedUpdate('css', d);
              }
            "
          />

          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>Javscript</span></div>
          <CodeEditor
            :args="{ language: 'javascript' }"
            :value="returnAdvancedValue('js')"
            :returnData="
              (d) => {
                handleBlockAdavancedUpdate('js', d);
              }
            "
          />
        </div>
      </ToggleSection>
    </div>
    <!-- Advanced tab-->

    <!-- Styles tab -->
    <div v-if="section == 'style'" class="uip-flex uip-flex-column uip-gap-s">
      <BlockParts
        :block="block"
        :activePart="activePart"
        @update="
          (d) => {
            activePart = d;
          }
        "
      />

      <!-- Presets -->
      <StylePresets :activePart="activePart" :block="block" />

      <div class="uip-border-top"></div>

      <!-- Layout -->
      <BlockStyleHandler :startOpen="!!block.content" :styleSettings="returnBlockStylePart('flexLayout')" component="flexLayout" styleName="flexLayout" :title="strings.layout" />

      <div class="uip-border-top"></div>

      <!-- Dimensions -->
      <BlockStyleHandler :startOpen="true" styleName="dimensions" :styleSettings="returnBlockStylePart('dimensions')" component="Dimensions" :title="strings.size" />

      <div class="uip-border-top"></div>

      <!-- Styles -->
      <BlockStyleHandler :startOpen="true" styleName="styles" :styleSettings="returnBlockStylePart('styles')" component="Styles" :title="strings.style" />

      <div class="uip-border-top"></div>

      <!-- Spacing -->
      <BlockStyleHandler :startOpen="true" styleName="spacing" :styleSettings="returnBlockStylePart('spacing')" component="Spacing" :title="strings.spacing" />

      <div class="uip-border-top"></div>

      <!-- Text -->
      <BlockStyleHandler styleName="textFormat" :styleSettings="returnBlockStylePart('textFormat')" component="TextFormat" :title="strings.text" />

      <div class="uip-border-top"></div>

      <!-- Before / after  -->
      <ToggleSection :title="strings.content">
        <div class="uip-grid-col-1-3">
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>::before</span></div>
          <uip-input
            :value="returnBlockPseudo('beforeContent')"
            :returnData="
              (data) => {
                handleBlockPseudoChange(data, 'beforeContent');
              }
            "
          />

          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>::after</span></div>
          <uip-input :value="returnBlockPseudo('afterContent')" :returnData="(data) => handleBlockPseudoChange(data, 'afterContent')" />
        </div>
      </ToggleSection>

      <div class="uip-border-top"></div>

      <!-- Position -->
      <BlockStyleHandler styleName="positionDesigner" :styleSettings="returnBlockStylePart('positionDesigner')" component="PositionDesigner" :title="strings.position" />

      <div class="uip-border-top"></div>

      <!-- Effects -->
      <BlockStyleHandler styleName="effectsDesigner" :styleSettings="returnBlockStylePart('effectsDesigner')" component="EffectsDesigner" :title="strings.effects" />

      <div class="uip-border-top"></div>
    </div>
  </div>
</template>
