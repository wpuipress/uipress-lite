import { defineAsyncComponent } from "../../../libs/vue-esm.js";

export default {
  components: {
    colorPicker: defineAsyncComponent(() => import("./color-picker.min.js?ver=0.0.1")),
  },

  props: {
    value: Object,
    returnData: [Function, Boolean],
  },
  data() {
    return {
      mode: "value",
      strings: {
        styleName: __("Style name", "uipress-lite"),
        create: __("Create", "uipress-lite"),
      },
      color: {},
      updating: false,
      colorModes: {
        value: {
          value: "value",
          icon: "light_mode",
          tip: __("Light mode", "uipress-lite"),
        },
        darkValue: {
          value: "darkValue",
          icon: "dark_mode",
          tip: __("Dark mode", "uipress-lite"),
        },
      },
    };
  },
  watch: {
    /**
     * Watches changes to value and updates
     *
     * @since 3.2.13
     */
    value: {
      handler() {
        if (this.updating) return;
        this.injectProp();
      },
      immediate: true,
      deep: true,
    },
    /**
     * Watches changes to color name and sanitizes
     *
     * @since 3.2.13
     */
    "color.name": {
      handler() {
        this.color.name = this.cleanKeyName(this.color.name);
      },
    },
    /**
     * Watches dark mode and adjust default start point
     *
     * @since 3.2.13
     */
    "uipApp.data.userPrefs.darkTheme": {
      handler() {
        this.updateDefaultColorState();
      },
      deep: true,
    },
  },
  mounted() {
    this.updateDefaultColorState();
  },
  computed: {
    /**
     * Returns current color
     *
     * @since 0.0.1
     */
    returnColor() {
      // No value set so get calculated value
      if (!this.color.value && !this.color.darkValue) {
        const rootStyle = getComputedStyle(document.documentElement);
        const variableValue = rootStyle.getPropertyValue(this.color.name).trim();
        if (!variableValue) return "#b500ff";
        return variableValue;
      }

      // No value set for this mode
      if (!this.color[this.mode]) {
        return "#b500ff";
      }

      // Returns custom color
      return this.color[this.mode];
    },
  },
  methods: {
    /**
     * Updates default start point
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      this.color = this.isObject(this.value) ? this.value : {};
      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Updates default start point
     *
     * @since 3.2.13
     */
    updateDefaultColorState() {
      if (!this.uipApp.data.userPrefs.darkTheme) this.mode = "value";
      if (this.uipApp.data.userPrefs.darkTheme) this.mode = "darkValue";
    },
    /**
     * Cleans variable name
     *
     * @param {String} value - the name to clean
     */
    cleanKeyName(value) {
      value = value.replace(" ", "-");
      value = value.replace(",", "");
      value = value.replace(".", "");
      value = value.replace(/[`~!@#$%^&*()|+\=?;:'",.<>\{\}\[\]\\\/]/gi, "");
      value = value.toLowerCase();
      value = this.ensureDoubleDashPrefix(value);
      return value;
    },
    /**
     * Enforces double dash at start of string
     *
     * @param {String} str - the string to add dashed too@since 3.2.13
     */
    ensureDoubleDashPrefix(str) {
      // If string is null or undefined, return '--'
      if (!str) return "--";

      // If string starts with '--', return it as is
      if (str.startsWith("--")) return str;

      // If string starts with '-', but not followed by another '-'
      if (str.startsWith("-")) return "--" + str.slice(1);

      // If string doesn't start with '-', prefix it with '--'
      return "--" + str;
    },

    /**
     * send color back to style manager
     *
     * @since 3.2.13
     */
    setColorStyle() {
      this.returnData(this.color);
    },
  },

  template: `
  
	  <div class="uip-flex uip-flex-column uip-row-gap-s" ref="colorpicker">
    
		<input :disabled="!color.user" class="uip-input uip-flex-grow" type="text" v-model="color.name" :placeholder="strings.styleName" autofocus>
		
		<toggle-switch :activeValue="mode" :options="colorModes" :returnValue="(d)=>{mode = d}"/>
		
		<colorPicker :value="returnColor" :returnData="(d) => { color[mode] = d }" :args="{hasStyleManager:false}"/>
		
		<button v-if="returnData" @click="setColorStyle" class="uip-button-primary" :disabled="!color.name">{{strings.create}}</button>
		
	  </div>
		`,
};
