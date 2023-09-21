const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Array,
      args: Object,
    },
    data: function () {
      return {
        options: this.args.options,
        selected: this.formatInput(),
        strings: {
          selectItems: __('Selected items', 'uipress-lite'),
          searchItems: __('Search items', 'uipress-lite'),
        },
      };
    },
    inject: ['uipData', 'uipress'],
    watch: {
      selected: {
        handler(newValue, oldValue) {
          this.returnData(this.selected);
        },
        deep: true,
      },
    },
    computed: {},
    mounted: function () {},
    methods: {
      formatInput() {
        if (this.uipress.isObject(this.value)) {
          return [];
        } else {
          return this.value;
        }
      },
    },
    template: `
		  <multi-select metaKey="url" :selected="selected" :availableOptions="options" :placeHolder="strings.selectItems" :searchPlaceHolder="strings.searchItems" :single="false" :updateSelected="function(data){selected = data} "></multi-select>
      `,
  };
}
