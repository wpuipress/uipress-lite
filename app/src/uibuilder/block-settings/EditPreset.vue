<script>
import { __ } from "@wordpress/i18n";
import { nextTick } from "vue";

import Confirm from "@/components/confirm/index.vue";
/**
 * Presets list
 *
 * @since 3.2.13
 */
export default {
  emits: ["update", "go-back"],
  components: { Confirm },

  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
    presetID: String,
  },
  data() {
    return {
      presetName: "",
      strings: {
        presetName: __("Preset name", "uipress-lite"),
        update: __("Update", "uipress-lite"),
        delete: __("Delete", "uipress-lite"),
        explanation: __(
          "Create a new style preset from the current block style. Style presets can be used on any block and updating in one place will update across all your templates.",
          "uipress-lite"
        ),
      },
    };
  },
  mounted() {
    this.setName();
  },
  methods: {
    /**
     * Set's current preset name
     *
     * @since 3.2.13
     */
    setName() {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const presets = this.uipApp.data.options.block_preset_styles;

      if (!this.presetID) return false;
      if (!this.isObject(presets)) return;
      if (!(this.presetID in presets)) return;
      this.presetName = presets[this.presetID].name;
    },

    /**
     * Confirms deletion of preset
     *
     * @param {String} presetID - the preset id to delete
     * @since 3.2.13
     */
    async deletePreset() {
      const confirm = await this.$refs.confirm.show({
        title: __("Delete preset", "uipress-lite"),
        message: __("Are you sure you want to delete this custom preset?", "uipress-lite"),
        okButton: __("Delete preset", "uipress-lite"),
        disableTeleport: true,
      });

      if (confirm) {
        if (!this.uipApp.data.options.block_preset_styles) return;
        delete this.uipApp.data.options.block_preset_styles[this.presetID];
        this.$emit("go-back");
      }
    },

    /**
     * Updates preset name
     *
     * @since 3.2.13
     */
    updatePreset() {
      if (!this.uipApp.data.options.block_preset_styles) return;
      this.uipApp.data.options.block_preset_styles[this.presetID].name = this.presetName;
      this.$emit("go-back");
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-padding-left-xs uip-gap-s">
    <input class="uip-input" type="text" v-model="presetName" :placeholder="strings.presetName" />

    <div class="uip-flex uip-flex-between uip-gap-xs">
      <button @click="deletePreset()" class="uip-button-danger uip-flex-grow">
        {{ strings.delete }}
      </button>

      <button @click="updatePreset" class="uip-button-default uip-flex-grow" :disabled="!presetName">
        {{ strings.update }}
      </button>
    </div>

    <Confirm ref="confirm" />
  </div>
</template>
