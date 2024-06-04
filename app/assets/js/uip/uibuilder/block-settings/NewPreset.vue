<script>
const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "vue";

const NewPreset = {
  emits: ["update", "go-back"],
  props: {
    preset: [String, Boolean],
    block: Object,
    activePart: String,
  },
  data() {
    return {
      newName: "",
      strings: {
        createPreset: __("Create preset", "uipress-lite"),
        presetName: __("Preset name", "uipress-lite"),
        explanation: __(
          "Create a new style preset from the current block style. Style presets can be used on any block and updating in one place will update across all your templates.",
          "uipress-lite"
        ),
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    /**
     * Creates a new preset from the current block style
     *
     * @since 3.2.13
     */
    newPreset() {
      const maybePresets = this.uipApp.data.options.block_preset_styles;
      let presets = this.isObject(maybePresets) ? maybePresets : {};

      const part = this.activePart == "root" ? "style" : this.activePart;
      this.ensureNestedObject(this.block, "settings", part);
      const presetStyle = this.deepClone(this.block.settings[part]);

      const uid = this.createUID();
      presets[uid] = {
        preset: presetStyle,
        name: this.newName,
      };

      this.uipApp.data.options.block_preset_styles = { ...presets };
      this.newName = "";
      this.$emit("go-back");
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-padding-left-xs uip-gap-s">
    <div class="uip-text-s">{{ strings.explanation }}</div>

    <input class="uip-input" type="text" v-model="newName" :placeholder="strings.presetName" />

    <button @click="newPreset" class="uip-button-default" :disabled="!newName">
      {{ strings.createPreset }}
    </button>
  </div>
</template>
