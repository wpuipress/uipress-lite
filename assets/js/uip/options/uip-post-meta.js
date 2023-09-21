const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Array,
      placeHolder: String,
    },
    data: function () {
      return {
        option: this.value,
        strings: {
          placeHolder: __('Select columns', 'uipress-lite'),
          searchPlaceHolder: __('Add columns', 'uipress-lite'),
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
    <post-meta-select :selected="option" :placeHolder="strings.placeHolder" :searchPlaceHolder="strings.searchPlaceHolder" :single="false"
    :updateSelected="function(data){option = data}">
    </post-meta-select>
    `,
  };
}
