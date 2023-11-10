export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      option: {
        value: "",
        units: "px",
      },
      focus: false,
      rendered: false,
      updating: false,
    };
  },

  watch: {
    /**
     * Watches changes to option and return back to caller
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.setReturnUnits();
      },
      deep: true,
    },

    /**
     * Watches changes to value prop and injects
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        // Only update if value is different
        if (this.updating) return;
        this.formatValue();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns default units
     *
     * @since 3.3.09
     */
    returnDefault() {
      return {
        value: "",
        units: "px",
      };
    },
    /**
     * Returns units value
     *
     * @since 3.2.13
     */
    returnUnits() {
      return this.option.units;
    },
  },
  methods: {
    /**
     * Injects input prop value
     *
     * @since 3.2.13
     */
    async formatValue() {
      this.updating = true;
      this.option = this.isObject(this.value) ? { ...this.returnDefault, ...this.value } : { ...this.returnDefault };

      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Returns units value to caller
     *
     * @since 3.2.13
     */
    setReturnUnits() {
      let data = this.option;

      // If auto set custom return data
      if (data.units == "auto") {
        data = { value: " ", units: "auto" };
      }

      this.returnData(data);
    },
  },
  template: `
    <div class="uip-flex uip-background-muted uip-border-rounder uip-padding-left-xs uip-padding-right-xxs" :class="{'uip-active-outline' : focus}">
    
      <input v-if="option.units != 'auto'" @focus="focus = true" @blur="focus = false" style="width:30px" type="text" class="uip-input-small uip-blank-input uip-remove-steps uip-background-remove uip-flex-grow" v-model="option.value">
      
      <units-select :value="returnUnits" :returnData="(e)=>{option.units = e}" :class=" option.units == 'auto' ? 'uip-flex-grow' : '' "/>
      
    </div>`,
};
