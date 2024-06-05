<script>
import { __ } from "@wordpress/i18n";
import { nextTick } from "vue";
/**
 * Presets list
 *
 * @since 3.2.13
 */
export default {
  emits: ["update", "request-screen"],
  components: {},

  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
  },
  data() {
    return {
      open: true,
      strings: {
        searchPresets: __("Search presets", "uipress-lite"),
        newPreset: __("New preset", "uipress-lite"),
        noPresets: __("No presets yet", "uipress-lite"),
        editPreset: __("Edit preset", "uipress-lite"),
      },
      search: "",
    };
  },
  computed: {
    /**
     * Returns all presets
     *
     * @since 3.2.13
     */
    returnPresets() {
      const maybePresets = this.uipApp.data.options.block_preset_styles;
      const search = this.search.toLowerCase();

      let presets = this.isObject(maybePresets) ? maybePresets : {};
      let searched = {};

      for (let key in presets) {
        const name = presets[key].name.toLowerCase();
        if (!name.includes(search)) continue;
        searched[key] = presets[key];
      }

      return searched;
    },

    /**
     * Returns whether the block has a preset applied
     *
     * @since 3.2.13
     */
    returnCurrentPreset() {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const preset = this.hasNestedPath(this.block, "settings", part, "preset");
      return preset;
    },
  },
  methods: {
    /**
     * Requests new preset screen
     *
     * @since 3.2.13
     */
    requestNewPreset() {
      const newPresetScreen = {
        component: "NewPreset",
        label: this.strings.newPreset,
      };
      this.$emit("request-screen", newPresetScreen);
    },

    /**
     * Set's the selected preset
     *
     * @param {String} presetID - the preset id to delete
     * @since 3.2.13
     */
    choosePreset(presetID) {
      const part = this.activePart == "root" ? "style" : this.activePart;
      this.ensureNestedObject(this.block, "settings", part, "preset");
      this.block.settings[part].preset = presetID;
    },

    /**
     * Requests edit preset screen
     *
     * @param {String} presetID - preset id to edit
     * @since 3.2.13
     */
    editPreset(presetID) {
      const editPresetScreen = {
        component: "EditPreset",
        presetID: presetID,
        label: this.strings.editPreset,
      };
      this.$emit("request-screen", editPresetScreen);
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column">
    <div class="uip-flex uip-flex-center uip-gap-xs uip-margin-bottom-s">
      <div class="uip-flex uip-gap-xs uip-flex-center uip-padding-xxs uip-padding-left-xs uip-background-muted uip-border-rounder uip-flex-grow">
        <span class="uip-icon">search</span>
        <input class="uip-blank-input uip-text-s" type="text" v-model="search" :placeholder="strings.searchPresets" />
      </div>

      <a @click="requestNewPreset" class="uip-link-muted uip-background-muted uip-border-rounder uip-icon uip-padding-xxs">add</a>
    </div>

    <div class="uip-text-s" v-if="!Object.keys(returnPresets).length">{{ strings.noPresets }}</div>

    <div class="uip-flex uip-flex-column uip-row-gap-xxs">
      <template v-for="(preset, key) in returnPresets">
        <a
          @click="choosePreset(key)"
          :class="returnCurrentPreset == key ? 'uip-background-muted uip-link-emphasis' : 'hover:uip-background-muted uip-link-muted'"
          class="uip-padding-xxs uip-border-rounder uip-no-wrap uip-flex uip-flex-center uip-flex-between uip-gap-s uip-border-rounder"
        >
          <span class="">{{ preset.name }}</span>

          <span @click.prevent.stop="editPreset(key)" class="uip-icon">edit</span>
        </a>
      </template>
    </div>
  </div>
</template>
