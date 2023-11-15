const { __, _x, _n, _nx } = wp.i18n;
import { nextTick } from "../../libs/vue-esm.js";
export default {
  // Define component properties
  props: {
    options: Object,
    activeValue: [String, Boolean],
    default: String,
    returnValue: Function,
    small: Boolean,
    allowOptional: Boolean,
  },
  data() {
    return {
      optionValue: null,
      open: false,
      showBack: true,
      enabledOptions: {
        false: {
          label: __("No", "uipress-lite"),
          value: false,
        },
        true: {
          label: __("Yes", "uipress-lite"),
          value: true,
        },
      },
      bgStyle: {
        width: null,
        left: null,
        right: null,
      },
    };
  },
  watch: {
    /**
     * Watches enabled options and updates
     *
     * @since 3.2.13
     */
    enabledOptions: {
      handler() {
        this.returnBGstyle();
      },
      deep: true,
    },
    /**
     * Watches active value and updates
     *
     * @since 3.2.13
     */
    activeValue: {
      async handler() {
        this.injectProp();
        await nextTick();
        this.returnBGstyle();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches options and updates
     *
     * @since 3.2.13
     */
    options: {
      handler() {
        this.enabledOptions = this.options;
      },
      deep: true,
    },
  },
  created() {},
  mounted() {
    this.returnBGstyle();
  },
  computed: {
    /**
     * Compute the item style based on the number of enabled options
     *
     * @since 3.2.13
     */
    returnItemStyle() {
      let width = 100 / Object.keys(this.enabledOptions).length;
      return `width:calc(${width}%);`;
    },

    /**
     * Return computed background style
     *
     * @since 3.2.13
     */
    returnbgStyle() {
      return this.bgStyle;
    },
  },
  methods: {
    /**
     * Injects prop value if it exists
     *
     * @since 3.2.13
     */
    injectProp() {
      this.optionValue = typeof this.activeValue === "undefined" ? "" : this.activeValue;
      if (this.optionValue === "true") this.optionValue = true;
      if (this.optionValue === "false") this.optionValue = false;

      // Inject options
      if (!this.options) return;
      this.enabledOptions = this.options;
    },
    /**
     * Compute background style for the item
     *
     * @since 3.2.13
     */
    returnBGstyle() {
      let val = String(this.optionValue); // Convert boolean values to strings

      let index = Object.keys(this.enabledOptions).indexOf(val);

      let key = this.uipApp.isRTL ? "right" : "left";

      if (index < 0) {
        this.showBack = false;
        return;
      }
      this.showBack = true;

      let width = 100 / Object.keys(this.enabledOptions).length;
      let left = width * index;
      this.bgStyle.width = `calc(${width}% - 6px)`;
      this.bgStyle[key] = `calc(${left}% + 2px)`;
    },

    /**
     * Return selected data
     *
     * @param {Object} data - the data to return
     * @since 3.2.13
     */
    async returnData(data) {
      if (this.optionValue === data && this.allowOptional) {
        this.optionValue = null;
      } else {
        this.optionValue = data;
      }
      this.returnValue(this.optionValue);

      await nextTick();
      this.returnBGstyle();
    },

    /**
     * Check if the current item is the last one
     *
     * @param {Number} index - index of item to check
     * @since 3.2.13
     */
    isLastItem(index) {
      return index === this.enabledOptions[Object.keys(this.enabledOptions).length - 1].value;
    },

    /**
     * Return a tip or label for the item, if available
     *
     * @param {Object} item - the item to check for tooltip
     * @since 3.2.13
     */
    returnTip(item) {
      return item.tip || item.label;
    },

    /**
     * Return a class if the current item is active
     *
     * @param {Object} item - item to check classes for
     * @since 3.2.13
     */
    returnActiveClass(item) {
      return item.value === this.optionValue ? "uip-link-default uip-text-emphasis" : "uip-link-muted uip-opacity-70";
    },
  },
  template: `
    
      <div class="uip-position-relative uip-background-muted uip-border-rounder uip-flex uip-flex-wrap uip-w-100p uip-h-27" 
        style="border-radius: calc(var(--uip-border-radius-large) + 2px)">
      
        <div v-if="showBack" class="uip-position-absolute uip-top-2 uip-bottom-2 uip-transition-all uip-background-highlight uip-border uip-border-rounder" 
        :style="bgStyle"></div>
      
        <template v-for="(item, index) in enabledOptions">
            <a type="button" :title="returnTip(item)"
              class="uip-no-wrap uip-z-index-1 uip-padding-xxs uip-padding-left-xs uip-padding-right-xs uip-text-center uip-cursor-pointer uip-border-box uip-flex uip-gap-xs uip-flex-center uip-flex-middle"
              :style="returnItemStyle"
              :class="returnActiveClass(item)"
              @click="returnData(item.value)">
               
              <span class="uip-icon" v-if="item.icon" :class="{'uip-text-l' : !small}">{{item.icon}}</span>
              <span class="" v-if="item.label">{{item.label}}</span>
            </a>
        </template>
        
      </div>
      `,
};
