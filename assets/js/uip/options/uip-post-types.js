const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Array,
    placeHolder: String,
  },
  data() {
    return {
      strings: {
        placeHolder: __('Select post types', 'uipress-lite'),
        searchPlaceHolder: __('Seach post types', 'uipress-lite'),
      },
    };
  },
  template: `
    <post-type-select :selected="value" :placeHolder="strings.placeHolder" :searchPlaceHolder="strings.searchPlaceHolder" :single="false"
    :updateSelected="returnData"/>
    `,
};
