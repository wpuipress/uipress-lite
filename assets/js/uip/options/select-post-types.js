export default {
  props: {
    returnData: Function,
    value: Array,
  },
  data() {
    return {
      strings: {
        selectPostTypes: __('Select post types', 'uipress-lite'),
        searchPostTypes: __('Search post types', 'uipress-lite'),
      },
    };
  },
  template: `
      <post-type-select :selected="value" :placeHolder="strings.selectPostTypes" :single="false" 
      :searchPlaceHolder="strings.searchPostTypes"
      :updateSelected="returnData"/>
    `,
};
