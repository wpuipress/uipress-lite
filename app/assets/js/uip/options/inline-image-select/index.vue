<script>
import { __ } from "@wordpress/i18n";
import { nextTick } from "vue";

import imageSelect from "@/js/uip/components/image-select/index.vue";
import colorBox from "@/js/uip/components/color-box/index.vue";

export default {
  components: { imageSelect, colorBox },
  props: {
    returnData: Function,
    value: Object,
    args: Object,
  },
  data() {
    return {
      img: {
        url: "",
        dynamic: false,
        dynamicKey: "",
        loading: false,
        sizing: {},
      },
      strings: {
        imageSelect: __("Image select", "seql"),
      },
    };
  },

  watch: {
    /**
     * Watches for changes to the input and returns the value
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.formatInput();
      },
      deep: true,
      immediate: true,
    },

    /**
     * Watches image input
     *
     * @type {Object}
     */
    img: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData(this.img);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns a formatted background-image CSS rule if an image URL exists.
     *
     * @returns {string} - The background-image CSS rule or an empty string.
     *
     * @since 3.2.13
     */
    returnBackgroundImage() {
      if (this.img.url) return `background-size:contain;background-image: url(${this.img.url})`;
    },

    /**
     * Resets the image object
     *
     * @since 3.2.13
     */
    imgReset() {
      return {
        url: "",
        dynamic: false,
        dynamicKey: "",
        loading: false,
        sizing: {},
      };
    },

    /**
     * Returns default value
     *
     * @since 3.2.0
     */
    returnDefault() {
      return {
        url: "",
        dynamic: false,
        dynamicKey: "",
        loading: false,
        sizing: {},
      };
    },
  },
  methods: {
    /**
     * Injects value to component
     *
     * @returns {void}
     *
     * @since 3.2.13
     */
    formatInput() {
      this.img = this.isObject(this.value) ? this.value : this.returnDefault;
    },
  },
};
</script>

<template>
  <dropdown pos="left center" class="uip-w-100p" ref="imageDropdown" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
    <template v-slot:trigger>
      <colorBox
        :backgroundStyle="returnBackgroundImage"
        :text="img.url"
        :remove="
          () => {
            img = imgReset;
          }
        "
      />
    </template>

    <template v-slot:content>
      <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
        <div class="uip-flex uip-flex-between uip-flex-center">
          <div class="uip-text-emphasis uip-text-bold uip-text-s">{{ strings.imageSelect }}</div>
          <div @click="$refs.imageDropdown.close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
            <AppIcon icon="close" class="uip-icon" />
          </div>
        </div>

        <imageSelect
          :value="img"
          :returnData="
            (d) => {
              img = d;
            }
          "
          :args="args"
        />
      </div>
    </template>
  </dropdown>
</template>
