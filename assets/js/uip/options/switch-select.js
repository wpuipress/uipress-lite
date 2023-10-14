const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: [Boolean, String],
    args: Object,
  },

  data() {
    return {
      option: this.value,
      yesNoOptions: {
        false: {
          value: false,
          label: __('No', 'uipress-lite'),
        },
        true: {
          value: true,
          label: __('Yes', 'uipress-lite'),
        },
      },
    };
  },
  created() {
    this.injectProp();
  },
  watch: {
    /**
     * Watches changes to option and returns to caller
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        this.returnData(this.option);
      },
    },
  },
  computed: {
    /**
     * Returns whether the switch should be shown as text
     *
     * @since 3.2.13
     */
    asText() {
      if (!this.isObject(this.args)) return false;
      if (!this.args.asText) return;
      return true;
    },
  },
  methods: {
    /**
     * Injects prop value
     *
     * @since 3.2.13
     */
    injectProp() {
      if (!this.isObject(this.args)) return;
      if (!this.args.options) return;
      this.yesNoOptions = this.args.options;
    },

    /**
     * Handles option changes from toggle-switch
     *
     * @param {Boolean} data - the return value
     */
    updateValue(data) {
      this.option = data;
    },
  },
  template: `
    <toggle-switch v-if="asText" :options="yesNoOptions" :activeValue="option" :returnValue="updateValue"/>
    
    <label v-else class="uip-switch">
      <input type="checkbox" v-model="option">
      <span class="uip-slider"></span>
    </label>`,
};
