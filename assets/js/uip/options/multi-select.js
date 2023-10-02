const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Array,
    args: Object,
  },
  data() {
    return {
      options: this.args.options,
      selected: [],
      strings: {
        selectItems: __('Selected items', 'uipress-lite'),
        searchItems: __('Search items', 'uipress-lite'),
      },
    };
  },

  watch: {
    value: {
      handler(newValue, oldValue) {
        this.formatInput();
      },
      deep: true,
      immediate: true,
    },
    selected: {
      handler(newValue, oldValue) {
        this.returnData(this.selected);
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Injects input value
     *
     * @since 3.2.13
     */
    formatInput() {
      if (!this.value) return;
      if (!Array.isArray(this.value)) return;
      this.selected = this.value;
    },
  },
  template: `
		<multi-select :selected="selected" :availableOptions="options" 
        :placeHolder="strings.selectItems" :searchPlaceHolder="strings.searchItems" :single="false" 
        :updateSelected="(data)=>{selected = data} "/>
      `,
};
