export default {
  props: {
    returnData: Function,
    value: [String, Number],
    placeHolder: String,
    customStep: [String, Number],
  },
  data() {
    return {
      option: '',
      step: 1,
    };
  },
  watch: {
    /**
     * Watches changes to option and returns to caller
     *
     * @since 3.2.14
     */
    option: {
      handler(newValue, oldValue) {
        this.returnData(this.option);
      },
      deep: true,
    },
  },
  mounted() {
    this.initialiseNumber();
  },
  methods: {
    /**
     * Injects input value and If custom step exists then update settings
     *
     * @since 3.2.13
     */
    initialiseNumber() {
      if (typeof this.value !== 'undefined') {
        this.option = this.value;
      }

      if (!this.customStep) return;
      this.step = this.customStep;
    },

    /**
     * Increments the `option` property by the `step` value and updates it.
     * If `option` is an empty string, it initializes it to 0.
     *
     * @since 3.2.13
     */
    stepUpNumber() {
      const currentValue = parseFloat(this.option || 0);
      const increment = parseFloat(this.step);
      const updatedValue = currentValue + increment;

      this.option = updatedValue;

      if (!Number.isInteger(this.option)) {
        this.option = this.option.toFixed(2);
      }
    },

    /**
     * Increments the `option` property by the `-step` value and updates it.
     * If `option` is an empty string, it initializes it to 0.
     *
     * @since 3.2.13
     */
    stepDownNumber() {
      const currentValue = parseFloat(this.option || 0);
      const increment = parseFloat(this.step);
      const updatedValue = currentValue - increment;

      this.option = updatedValue;

      if (!Number.isInteger(this.option)) {
        this.option = this.option.toFixed(2);
      }
    },
  },
  template: `
      
      
      <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center uip-w-100p">
      
        <input type="number" class="uip-input-small uip-w-100p uip-flex-grow" v-model="option" :placeholder="placeHolder">
        
        <div class="uip-padding-xxxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
          <div class="uip-link-muted uip-icon uip-text-l" @click="stepDownNumber()">remove</div>
          <div class="uip-border-right"></div>
          <div class="uip-link-muted uip-icon uip-text-l" @click="stepUpNumber()">add</div>
        </div>
        
      </div>
      
      `,
};
