export default {
  props: {
    returnData: Function,
    value: String,
    placeHolder: String,
    args: Object,
    size: String,
  },
  data() {
    return {
      option: this.value,
      password: false,
    };
  },

  watch: {
    /**
     * Watches for changes to option and returns to caller
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        this.returnData(this.option);
        this.maybeFormatForMeta();
      },
    },
  },
  mounted() {
    this.initialiseInput();
  },
  computed: {
    /**
     * Returns type of input
     *
     * @since 3.2.13
     */
    returnType() {
      if (this.password) return 'password';
      return 'text';
    },
  },
  methods: {
    /**
     * If meta key arg is set then formats input for meta key type
     *
     * @since 3.2.13
     */
    maybeFormatForMeta() {
      if (!this.args) return;
      if (!this.args.metaKey) return;
      if (!this.option) return;

      // Strip characters from input if type is meta key
      let ammended = this.option;
      ammended = ammended.replace(' ', '_');
      ammended = ammended.replace(/[&/#,+()$~%.'":*?<>{}]/g, '');
      ammended = ammended.toLowerCase();
      this.option = ammended;
    },

    /**
     * Initialises input args
     *
     * @since 3.2.13
     */
    initialiseInput() {
      if (!this.args) return;
      if (!this.args.password) return;
      this.password = true;
    },
  },
  template: `
      <input :type="returnType" class="uip-input-small uip-w-100p" v-model="option" :placeholder="placeHolder" :class="{'uip-w-100' : size == 'xsmall'}">`,
};