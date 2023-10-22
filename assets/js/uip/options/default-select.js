export default {
  props: {
    returnData: Function,
    value: [String, Object],
    args: Object,
  },
  data() {
    return {
      option: null,
    };
  },
  watch: {
    /**
     * Returns data back to caller
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        this.returnData(newValue);
      },
      deep: true,
    },
    /**
     * Updates options when they change
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        this.option = this.value;
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns array of options
     *
     * @since 3.2.13
     */
    returnOptions() {
      if (!this.args) return [];
      if (!this.args.options || !Array.isArray(this.args.options)) return [];
      return this.args.options;
    },
  },
  template: `
        <select class="uip-input uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p" 
        style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large);" v-model="option">
        
          <template v-for="item in returnOptions">
            <option :value="item.value">{{item.label}}</option>
          </template>
          
        </select>
        `,
};
