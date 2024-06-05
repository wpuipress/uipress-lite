<script>
import { __ } from "@wordpress/i18n";
import { nextTick } from "vue";

import flexLayout from "@/js/uip/options/flex-layout/index.vue";
import Dimensions from "@/js/uip/options/dimensions/index.vue";
import Styles from "@/js/uip/options/styles/index.vue";
import Spacing from "@/js/uip/options/spacing/index.vue";
import TextFormat from "@/js/uip/options/text-format/index.vue";
import PositionDesigner from "@/js/uip/options/position-designer/index.vue";
import EffectsDesigner from "@/js/uip/options/effects/index.vue";

/**
 * Builds the block styles list and handles style changes
 *
 * @since 3.2.13
 */
export default {
  emits: ["update"],

  components: {
    flexLayout,
    Dimensions,
    Styles,
    Spacing,
    TextFormat,
    PositionDesigner,
    EffectsDesigner,
  },
  props: {
    styleSettings: Object,
    component: String,
    title: String,
    startOpen: Boolean,
    styleName: String,
  },
  data() {
    return {
      blockStyle: {},
      open: false,
      activeState: "default",
      colorTheme: "light",
      loading: false,
      strings: {
        toggleColour: __("Toggle dark / light mode", "uipress-lite"),
        resetSection: __("Reset section", "uipress-lite"),
      },
      pseudoSelectors: [
        { value: "default", label: __("Default", "uipress-lite") },
        { value: ":active", label: __(":active", "uipress-lite") },
        { value: ":focus", label: __(":focus", "uipress-lite") },
        { value: ":hover", label: __(":hover", "uipress-lite") },
        { value: ":visited", label: __(":visited", "uipress-lite") },
        { value: "::before", label: __("::before", "uipress-lite") },
        { value: "::after", label: __("::after", "uipress-lite") },
        { value: ":menu-collapsed", label: __("Menu collapsed", "uipress-lite") },
        { value: "tablet", label: __("Tablet", "uipress-lite") },
        { value: "mobile", label: __("Mobile", "uipress-lite") },
      ],
    };
  },
  watch: {
    /**
     * Watch for changes to incoming style settings
     *
     * @since 3.2.13
     */
    styleSettings: {
      handler() {
        this.injectPropValue();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns the icon depending on open status
     *
     * @since 3.2.13
     */
    returnVisibilityIcon() {
      if (this.open) return "expand_more";
      if (!this.open) return "chevron_left";
    },

    /**
     * Returns the current style for block
     *
     * @since 3.2.13
     */
    returnCurrentBlockStyle() {
      let style;
      switch (this.activeState) {
        case "default":
          style = this.colorTheme == "light" ? this.blockStyle.value : this.blockStyle.darkValue;
          break;

        default:
          const state = this.activeState;
          const theme = this.colorTheme;
          // Create pseudo object
          this.ensureNestedObject(this.blockStyle, "pseudo", theme, state);
          style = this.blockStyle.pseudo[theme][state];
          break;
      }

      if (!style) style = {};

      return style;
    },

    /**
     * Returns the current active setting state
     *
     * @since 3.2.13
     */
    returnActiveState() {
      const index = this.pseudoSelectors.findIndex((item) => item.value == this.activeState);
      return this.pseudoSelectors[index].label;
    },

    /**
     * Returns the current theme
     *
     * @since 3.2.13
     */
    returnThemeIcon() {
      if (this.colorTheme == "light") return "light_mode";
      return "dark_mode";
    },
  },
  mounted() {
    if (this.startOpen) this.open = true;
  },
  methods: {
    /**
     * Injects prop value if exists
     *
     * @since 3.2.13
     */
    injectPropValue() {
      // Reset block style if value doesn't exist
      if (!this.isObject(this.styleSettings)) return (this.blockStyle = {});
      // Update block style
      this.blockStyle = this.styleSettings;
    },

    /**
     * Toggles section visibility
     *
     * @since 3.2.13
     */
    toggleVisibility() {
      this.open = !this.open;
    },

    /**
     * Handles style updates
     *
     * @since 3.2.13
     */
    handleStyleUpdate(newStyle) {
      if (!this.blockStyle.settingName) this.blockStyle.settingName = this.styleName;

      switch (this.activeState) {
        case "default":
          const key = this.colorTheme == "light" ? "value" : "darkValue";
          this.blockStyle[key] = newStyle;

          this.break;

        default:
          const state = this.activeState;
          const theme = this.colorTheme;
          // Create pseudo object
          this.ensureNestedObject(this.blockStyle, "pseudo", theme, state);
          this.blockStyle.pseudo[theme][state] = newStyle;
          break;
      }
    },

    /**
     * Returns whether an item has styles in pseudo
     *
     * @param {String} pseudo - name of pseudo
     * @since 3.2.13
     */
    itemHasPseudo(pseudo) {
      const theme = this.colorTheme;
      let exists = this.hasNestedPath(this.blockStyle, "pseudo", theme, pseudo);

      // Doesn't exist or is empty
      if (!exists) return false;
      if (Object.keys(exists).length === 0) return false;

      // Exists
      return true;
    },

    /**
     * Toggles colour mode
     *
     * @since 3.2.13
     */
    toggleColorMode() {
      const state = this.colorTheme == "light" ? "dark" : "light";
      this.colorTheme = state;
    },

    /**
     * Clears block pseudo settings
     *
     * @param {String} pseudo - pseudo name
     * @since 3.2.13
     */
    clearPseudo(pseudo) {
      let existsLight = this.hasNestedPath(this.blockStyle, "pseudo", "light", pseudo);
      if (existsLight) delete this.blockStyle.pseudo.light[pseudo];

      let existsDark = this.hasNestedPath(this.blockStyle, "pseudo", "dark", pseudo);
      if (existsDark) delete this.blockStyle.pseudo.dark[pseudo];
    },

    /**
     * Resets whole style section and removes all pseudos
     *
     * @since 3.2.13
     */
    resetStyleSection() {
      delete this.blockStyle.value;
      delete this.blockStyle.darkValue;
      delete this.blockStyle.pseudo;
      this.$refs.styleoptions.close();
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-row-gap-s">
    <!-- Title -->
    <div class="uip-flex uip-gap-s uip-flex-center uip-flex-between" @contextmenu.prevent.stop="$refs.styleoptions.show($event)">
      <div class="uip-flex uip-gap-xxs uip-flex-center uip-cursor-pointer uip-flex-between" :class="{ 'uip-flex-grow': !open }" @click="toggleVisibility()">
        <span class="uip-text-bold uip-text-emphasis">{{ title }}</span>

        <a class="uip-link-muted uip-icon">{{ returnVisibilityIcon }}</a>
      </div>

      <div @click.prevent.stop="$refs.blockstates.show($event)" class="uip-flex uip-gap-xs uip-fade-in" v-if="open">
        <span
          @click.prevent.stop="toggleColorMode"
          :title="strings.toggleColour"
          class="uip-link-default hover:uip-background-muted uip-border-rounder uip-icon uip-padding-xxs uip-padding-top-xxxs uip-padding-bottom-xxxs"
        >
          {{ returnThemeIcon }}
        </span>

        <div
          @click.prevent.stop="$refs.blockstates.show($event)"
          class="uip-text-xs uip-padding-xxxs uip-padding-left-xs uip-padding-right-xxs uip-border-rounder uip-background-muted uip-link-default uip-flex uip-gap-xxs uip-flex-center"
        >
          <span>{{ returnActiveState }}</span>
          <a class="uip-link-muted uip-icon">expand_more</a>
        </div>
      </div>
    </div>

    <div v-if="open" class="uip-padding-left-s">
      <component :is="component" :value="returnCurrentBlockStyle" @update="handleStyleUpdate" />
    </div>

    <contextmenu ref="blockstates">
      <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
        <template v-for="item in pseudoSelectors">
          <a
            @click="
              activeState = item.value;
              $refs.blockstates.close();
            "
            :class="activeState == item.value ? 'uip-background-muted uip-text-emphasis' : 'hover:uip-background-muted'"
            class="uip-link-default uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s"
          >
            <span>{{ item.label }}</span>

            <a v-if="itemHasPseudo(item.value)" @click.prevent.stop="clearPseudo(item.value)" class="uip-link-muted uip-icon uip-link-muted">close</a>
          </a>
        </template>
      </div>
    </contextmenu>

    <contextmenu ref="styleoptions">
      <div class="uip-padding-xs uip-flex uip-flex-column uip-text-weight-normal uip-text-s">
        <a @click="resetStyleSection" class="hover:uip-background-muted uip-link-danger uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s">
          <span>{{ strings.resetSection }}</span>

          <span class="uip-icon">restart_alt</span>
        </a>
      </div>
    </contextmenu>
  </div>
</template>
