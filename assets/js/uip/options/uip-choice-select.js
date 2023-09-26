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
    };
  },
  watch: {
    /**
     * Watches changes to option and returns the data back
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        this.returnData(this.option);
      },
      deep: true,
    },
  },
  inject: ['uipress'],
  mounted() {
    this.formatInput(this.value);
    this.formatArgs(this.value);
  },
  computed: {
    /**
     * Returns enabled / disabled options
     */
    enabledDisabled() {
      return {
        true: { value: true, label: __('Disabled', 'uipress-lite') },
        false: { value: false, label: __('Enabled', 'uipress-lite') },
      };
    },

    /**
     * Returns yes / no options
     *
     * @since 3.2.13
     */
    yesNo() {
      return {
        false: { value: false, label: __('Disabled', 'uipress-lite') },
        true: { value: true, label: __('Enabled', 'uipress-lite') },
      };
    },

    /**
     * Returns hide show options
     *
     * @since 3.2.13
     */
    hideShow() {
      return {
        false: { value: false, label: __('Show', 'uipress-lite') },
        true: { value: true, label: __('Hide', 'uipress-lite') },
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
      if (!this.uipress.isObject(this.args)) return;

      // Update options
      if (this.args.options) {
        this.options = this.args.options;
      }

      // No type set so exit
      if (!this.args.type) return;

      // Update defaults
      switch (this.args.type) {
        case 'enabledDisabled':
          this.options = this.enabledDisabled;

        case 'hideShow':
          this.options = this.hideShow;
      }
    },

    /**
     * Formats value input
     *
     * @since 3.2.13
     */
    formatInput() {
      if (typeof this.value === 'undefined') return;

      if (this.uipress.isObject(this.value)) {
        this.option = { ...this.option, ...this.value };
        return;
      }

      this.option.value = this.value == true ? true : false;
    },
  },
  template: `
    
      <toggle-switch class="uip-w-100p" :options="returnOptions" :activeValue="option.value" :returnValue="function(data){ option.value = data}"/>
      
    `,
};
