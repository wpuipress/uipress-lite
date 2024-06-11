<script>
const { __ } = wp.i18n;
import { nextTick } from "vue";

import EditPreset from "./EditPreset.vue";
import NewPreset from "./NewPreset.vue";
import PresetList from "./PresetList.vue";

import screenControl from "@/components/screen-control/index.vue";

/**
 * Handles style presets switch
 *
 * @since 3.2.13
 */
export default {
  emits: ["update"],

  components: {
    screenControl,
    PresetList,
    NewPreset,
    EditPreset,
  },
  props: {
    block: Object,
    activePart: String,
  },
  data() {
    return {
      open: false,
      preset: true,
      strings: {
        presets: __("Preset", "uipress-lite"),
        usePreset: __("Use preset", "uipress-lite"),
        add: __("Add", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches changes to style presets and saves
     *
     * @since 3.2.13
     */
    "uipApp.data.options.block_preset_styles": {
      handler() {
        this.saveStylePresets();
      },
      deep: true,
    },
  },
  mounted() {
    // Start open if block has preset
    if (this.returnCurrentPresetName) this.open = true;
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
     * Returns the preset list screen
     *
     * @since 3.2.13
     */
    returnPresetScreen() {
      return {
        component: "PresetList",
        preset: this.preset,
        label: this.strings.presets,
      };
    },

    /**
     * Returns the current preset name or returns false
     *
     * @since 3.2.13
     */
    returnCurrentPresetName() {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const presetID = this.hasNestedPath(this.block, "settings", part, "preset");
      const presets = this.uipApp.data.options.block_preset_styles;

      if (!presetID) return false;
      if (!this.isObject(presets)) return;
      if (!(presetID in presets)) return;
      return presets[presetID].name;
    },
  },
  methods: {
    /**
     * Toggles section visibility
     *
     * @since 3.2.13
     */
    toggleVisibility() {
      this.open = !this.open;
    },

    /**
     * Saves style presets
     *
     * @param {String} preset - the selected preset
     */
    async saveStylePresets() {
      const options = this.prepareJSON(this.uipApp.data.options.block_preset_styles);

      let formData = new FormData();
      formData.append("action", "uip_save_site_option");
      formData.append("security", uip_ajax.security);
      formData.append("option", options);
      formData.append("optionName", "block_preset_styles");

      const response = await this.sendServerRequest(uip_ajax.ajax_url, formData);
    },

    /**
     * Removes the current preset from the block
     *
     * @since 3.2.13
     */
    removePreset() {
      const part = this.activePart == "root" ? "style" : this.activePart;
      const presetID = this.hasNestedPath(this.block, "settings", part, "preset");
      if (!presetID) return;
      delete this.block.settings[part].preset;
    },
  },
  template: `
	  
		 
	  
	  
	  `,
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-row-gap-s">
    <!-- Title -->
    <div class="uip-flex uip-gap-s uip-flex-center uip-flex-between">
      <div class="uip-flex uip-gap-xs uip-flex-center uip-cursor-pointer uip-flex-between uip-flex-grow" @click="toggleVisibility()">
        <span class="uip-text-bold uip-text-emphasis">{{ strings.presets }}</span>

        <div v-if="returnCurrentPresetName" class="uip-flex-grow">
          <div class="uip-w-6 uip-ratio-1-1 uip-border-circle uip-background-secondary"></div>
        </div>

        <AppIcon class="uip-link-muted uip-icon" :icon="returnVisibilityIcon" />
      </div>
    </div>

    <div v-if="open" class="uip-padding-left-s uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.usePreset }}</span>
      </div>

      <!-- Select presets -->
      <dropdown pos="left top" :snapX="['#uip-block-settings']" ref="presetsSwitcher">
        <template #trigger>
          <div class="uip-background-muted uip-border-rounder uip-padding-xxxs uip-padding-right-xxs uip-flex uip-flex-between uip-flex-center uip-link-default">
            <div v-if="!returnCurrentPresetName" class="uip-flex-grow uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s">
              {{ strings.add }}...
            </div>

            <div
              v-else
              class="uip-padding-xs uip-padding-top-xxxs uip-padding-bottom-xxxs uip-background-highlight uip-border-rounder uip-border uip-flex uip-gap-xxs uip-flex-center uip-link-default uip-text-s"
            >
              {{ returnCurrentPresetName }}
            </div>

            <AppIcon v-if="returnCurrentPresetName" @click.prevent.stop="removePreset()" icon="close" class="uip-icon" />
          </div>
        </template>

        <template #content>
          <div class="uip-padding-s uip-w-240">
            <screenControl :startScreen="returnPresetScreen" :homeScreen="returnPresetScreen.component" :closer="$refs.presetsSwitcher.close" :showNavigation="true">
              <template #componenthandler="{ processScreen, currentScreen, goBack }">
                <KeepAlive>
                  <component
                    @request-screen="
                      (d) => {
                        processScreen(d);
                      }
                    "
                    @go-back="goBack()"
                    :block="block"
                    :preset="currentScreen.preset"
                    :presetID="currentScreen.presetID"
                    :activePart="activePart"
                    :is="currentScreen.component"
                  />
                </KeepAlive>
              </template>
            </screenControl>
          </div>
        </template>
      </dropdown>
    </div>
  </div>
</template>
