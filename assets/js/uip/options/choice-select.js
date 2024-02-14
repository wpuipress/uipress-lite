export default {
  props: {
    returnData: Function,
    value: [Object, String, Boolean],
    args: Object,
  },
  data: function () {
    return {
      option: {
        value: false,
      },
      options: {},
      updating: false,
    };
  },
  watch: {
    /**
     * Watches changes to option and returns the data back
     *
     * @since 3.2.13
     */
    args: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.formatArgs();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches changes to option and returns the data back
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
     * Watches changes to option and returns the data back
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData(this.option);
      },
      deep: true,
    },
  },

  computed: {
    /**
     * Returns enabled / disabled options
     *
     * @since 3.2.0
     */
    enabledDisabled() {
      return {
        true: { value: true, label: __("Disabled", "uipress-lite") },
        false: { value: false, label: __("Enabled", "uipress-lite") },
      };
    },

    /**
     * Returns yes / no options
     *
     * @since 3.2.13
     */
    yesNo() {
      return {
        false: { value: false, label: __("Disabled", "uipress-lite") },
        true: { value: true, label: __("Enabled", "uipress-lite") },
      };
    },

    /**
     * Returns hide show options
     *
     * @since 3.2.13
     */
    hideShow() {
      return {
        false: { value: false, label: __("Show", "uipress-lite") },
        true: { value: true, label: __("Hide", "uipress-lite") },
      };
    },

    /**
     * Returns current options
     *
     * @since 3.2.13
     */
    returnOptions() {
      return this.options;
    },
  },
  methods: {
    /**
     * Formats arguments passed as prop
     *
     * @since 3.2.13
     */
    formatArgs() {
      // Set basic options
      this.options = this.yesNo;
      if (!this.isObject(this.args)) return;

      // Update options
      if (this.args.options) {
        this.options = this.args.options;
      }

      // No type set so exit
      if (!this.args.type) return;

      // Update defaults
      switch (this.args.type) {
        case "enabledDisabled":
          this.options = this.enabledDisabled;
          break;

        case "hideShow":
          this.options = this.hideShow;
          break;
      }
    },

    /**
     * Formats value input
     *
     * @since 3.2.13
     */
    async formatInput() {
      this.updating = true;
      let tempValue = this.value == true ? true : false;
      this.option = this.isObject(this.value) ? { ...this.value } : { value: tempValue };

      await this.$nextTick();
      this.updating = false;
    },
  },
  template: `
    
      <toggle-switch class="uip-w-100p" :options="returnOptions" :activeValue="option.value" :returnValue="function(data){ option.value = data}"/>
      
    `,
};
