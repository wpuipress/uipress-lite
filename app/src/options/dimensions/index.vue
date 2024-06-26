<script>
const { __ } = wp.i18n;
import { nextTick } from "vue";
export default {
  emits: ["update"],
  props: {
    value: Object,
  },
  data() {
    return {
      option: this.returnDefaultOptions,
      updating: false,
      growOptions: {
        grow: {
          value: "grow",
          label: __("Yes", "uipress-lite"),
        },
        none: {
          value: "none",
          label: __("No", "uipress-lite"),
        },
      },
      shrinkOptions: {
        none: {
          value: "none",
          label: __("No", "uipress-lite"),
        },
        shrink: {
          value: "shrink",
          label: __("Yes", "uipress-lite"),
        },
      },
      strings: {
        height: __("Height", "uipress-lite"),
        width: __("Width", "uipress-lite"),
        maxHeight: __("Max height", "uipress-lite"),
        maxWidth: __("Max width", "uipress-lite"),
        minHeight: __("Min height", "uipress-lite"),
        minWidth: __("Min width", "uipress-lite"),
        grow: __("Grow", "uipress-lite"),
        flexShrink: __("Shrink", "uipress-lite"),
      },
    };
  },
  watch: {
    /**
     * Watches changes to value prop and injects
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectProp();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches changes to options and returns data back to caller
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.$emit("update", this.option);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns option object
     *
     * @since 3.2.13
     */
    returnOption() {
      return this.option;
    },

    /**
     * Returns default options
     *
     * @since 3.2.13
     */
    returnDefaultOptions() {
      return {
        grow: "none",
        flexShrink: "none",
        updating: false,
        enabled: {
          maxHeight: false,
          minHeight: false,
          maxWidth: false,
          minWidth: false,
          flexShrink: false,
        },
        width: {
          value: "",
          units: "%",
        },
        height: {
          value: "",
          units: "%",
        },
        maxWidth: {
          value: "",
          units: "%",
        },
        maxHeight: {
          value: "",
          units: "%",
        },
        minWidth: {
          value: "",
          units: "%",
        },
        minHeight: {
          value: "",
          units: "%",
        },
      };
    },
  },
  methods: {
    /**
     * Injects value into component
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      const defaultOptions = this.returnDefaultOptions;
      const newOptions = this.isObject(this.value) ? this.value : {};
      this.option = { ...defaultOptions, ...newOptions };

      await nextTick();
      this.updating = false;
    },
  },
};
</script>

<template>
  <div class="uip-flex uip-flex-column uip-row-gap-xs">
    <!--Stretch -->
    <div class="uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.grow }}</span>
      </div>

      <div class="uip-position-relative">
        <toggle-switch
          :options="growOptions"
          :activeValue="option.grow"
          :returnValue="
            function (data) {
              option.grow = data;
            }
          "
        ></toggle-switch>
      </div>
    </div>

    <!--Height-->
    <div class="uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.height }}</span>
      </div>

      <div class="uip-position-relative">
        <value-units
          :value="returnOption.height"
          :returnData="
            function (data) {
              option.height = data;
            }
          "
        ></value-units>
      </div>
    </div>

    <!--Min Height-->
    <div v-if="option.enabled.minHeight" class="uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.minHeight }}</span>
      </div>

      <div class="uip-position-relative uip-flex">
        <value-units
          :value="returnOption.minHeight"
          :returnData="
            function (data) {
              option.minHeight = data;
            }
          "
          class="uip-flex-grow"
        />

        <button
          @click="
            option.enabled.minHeight = false;
            option.minHeight.value = '';
          "
          class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs"
        >
          close
        </button>
      </div>
    </div>

    <!--Max Height-->
    <div v-if="option.enabled.maxHeight" class="uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.maxHeight }}</span>
      </div>

      <div class="uip-position-relative uip-flex">
        <value-units
          :value="returnOption.maxHeight"
          :returnData="
            function (data) {
              option.maxHeight = data;
            }
          "
          class="uip-flex-grow"
        />

        <button
          @click="
            option.enabled.maxHeight = false;
            option.maxHeight.value = '';
          "
          class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs"
        >
          close
        </button>
      </div>
    </div>

    <!--Width-->
    <div class="uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.width }}</span>
      </div>

      <div class="uip-position-relative">
        <value-units
          :value="returnOption.width"
          :returnData="
            function (data) {
              option.width = data;
            }
          "
        ></value-units>
      </div>
    </div>

    <!--Min Width-->
    <div v-if="option.enabled.minWidth" class="uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.minWidth }}</span>
      </div>

      <div class="uip-position-relative uip-flex">
        <value-units
          :value="returnOption.minWidth"
          :returnData="
            function (data) {
              option.minWidth = data;
            }
          "
          class="uip-flex-grow"
        />

        <button
          @click="
            option.enabled.minWidth = false;
            option.minWidth.value = '';
          "
          class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs"
        >
          close
        </button>
      </div>
    </div>

    <!--Max Width-->
    <div v-if="option.enabled.maxWidth" class="uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.maxWidth }}</span>
      </div>

      <div class="uip-position-relative uip-flex">
        <value-units
          :value="returnOption.maxWidth"
          :returnData="
            function (data) {
              option.maxWidth = data;
            }
          "
          class="uip-flex-grow"
        />

        <button
          @click="
            option.enabled.maxWidth = false;
            option.maxWidth.value = '';
          "
          class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs"
        >
          close
        </button>
      </div>
    </div>

    <!--Flex shrink-->
    <div v-if="option.enabled.flexShrink" class="uip-grid-col-1-3">
      <div class="uip-text-muted uip-flex uip-flex-center uip-text-s">
        <span>{{ strings.flexShrink }}</span>
      </div>

      <div class="uip-position-relative uip-flex">
        <toggle-switch
          :options="shrinkOptions"
          :activeValue="option.flexShrink"
          :returnValue="
            function (data) {
              option.flexShrink = data;
            }
          "
        ></toggle-switch>

        <button
          @click="
            option.enabled.flexShrink = false;
            option.flexShrink = false;
          "
          class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs"
        >
          close
        </button>
      </div>
    </div>

    <div class="uip-grid-col-1-3">
      <div></div>

      <dropdown pos="bottom left" width="uip-flex uip-w-100p">
        <template v-slot:trigger>
          <button class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p"><AppIcon icon="add" /></button>
        </template>
        <template v-slot:content>
          <div class="uip-padding-xs uip-flex uip-flex-column">
            <div @click="option.enabled.minHeight = true" class="uip-link-muted hover:uip-background-muted uip-border-round uip-padding-xxs">{{ strings.minHeight }}</div>
            <div @click="option.enabled.maxHeight = true" class="uip-link-muted hover:uip-background-muted uip-border-round uip-padding-xxs">{{ strings.maxHeight }}</div>
            <div @click="option.enabled.minWidth = true" class="uip-link-muted hover:uip-background-muted uip-border-round uip-padding-xxs">{{ strings.minWidth }}</div>
            <div @click="option.enabled.maxWidth = true" class="uip-link-muted hover:uip-background-muted uip-border-round uip-padding-xxs">{{ strings.maxWidth }}</div>
            <div @click="option.enabled.flexShrink = true" class="uip-link-muted hover:uip-background-muted uip-border-round uip-padding-xxs">{{ strings.flexShrink }}</div>
          </div>
        </template>
      </dropdown>
    </div>
  </div>
</template>
