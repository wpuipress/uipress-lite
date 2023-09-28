export default {
  props: {
    returnData: Function,
    value: String,
    placeHolder: String,
  },
  data() {
    return {
      option: null,
    };
  },

  watch: {
    /**
     * Watches option and returns data to caller on change
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
  mounted() {
    this.injectProp();
  },
  methods: {
    /**
     * Injects value from props
     *
     * @since 3.2.13
     */
    injectProp() {
      if (!this.value) return;
      this.option = this.value;
    },
  },
  template: `
      <textarea class="uip-input uip-w-100p" v-model="option" :placeholder="placeHolder"></textarea>`,
};
