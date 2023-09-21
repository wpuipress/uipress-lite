export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Array,
    },
    data: function () {
      return {
        option: this.value,
        strings: {
          selectPostTypes: __('Select post types', 'uipress-lite'),
          searchPostTypes: __('Search post types', 'uipress-lite'),
        },
      };
    },
    watch: {
      option: {
        handler(newValue, oldValue) {
          this.returnData(this.option);
        },
        deep: true,
      },
    },
    template: `
      <post-type-select :selected="option" :placeHolder="strings.selectPostTypes" :single="false" :searchPlaceHolder="strings.searchPostTypes"
      :updateSelected="function(d){option=d}"></post-type-select>
    `,
  };
}
