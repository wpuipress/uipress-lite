const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Array,
    },
    data: function () {
      return {
        toolbar: this.uipData.toolbar,
        selected: this.formatInput(),
        strings: {
          selectItems: __('Hidden toolbar items', 'uipress-lite'),
          searchItems: __('Search toolbar items', 'uipress-lite'),
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
    computed: {
      returnFormatedToolbar() {
        self = this;
        let returndata = [];

        console.log(this.toolbar);

        for (const key in self.toolbar) {
          let temp = {};
          let item = self.toolbar[key];
          temp.name = item.id;

          temp.label = item.id.replace(/<[^>]*>?/gm, '');
          returndata.push(temp);

          if (item.submenu && item.submenu.length > 0) {
            for (const subKey in item.submenu) {
              let subtemp = {};
              let sub = item.submenu[subKey];
              subtemp.name = sub.id;
              subtemp.label = sub.id.replace(/<[^>]*>?/gm, '');
              returndata.push(subtemp);
            }
          }
        }
        return returndata;
      },
    },
    mounted: function () {
      console.log(this.returnFormatedToolbar);
    },
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
		  <multi-select metaKey="url" :selected="selected" :availableOptions="returnFormatedToolbar" :placeHolder="strings.selectItems" :searchPlaceHolder="strings.searchItems" :single="false" :updateSelected="function(data){selected = data} "></multi-select>
	  `,
  };
}
