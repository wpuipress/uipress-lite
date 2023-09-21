const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Array,
    },
    data: function () {
      return {
        menu: this.uipData.adminMenu.menu,
        selected: this.formatInput(),
        strings: {
          selectItems: __('Hidden menu items', 'uipress-lite'),
          searchItems: __('Search menu items', 'uipress-lite'),
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
      returnFormatedMenu() {
        self = this;
        let returndata = [];

        for (const item of self.menu) {
          let temp = {};
          temp.name = item.uid;

          if (item.type == 'sep') {
            continue;
          }

          temp.label = item.name.replace(/<[^>]*>?/gm, '');
          temp.url = item.url;
          returndata.push(temp);

          if (item.submenu && item.submenu.length > 0) {
            for (const sub of item.submenu) {
              let subtemp = {};
              subtemp.name = sub.uid;
              subtemp.label = sub.name.replace(/<[^>]*>?/gm, '');
              subtemp.url = sub.url;
              returndata.push(subtemp);
            }
          }
        }
        return returndata;
      },
    },
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
    template:
      '<div class="">\
		  <multi-select metaKey="url" :selected="selected" :availableOptions="returnFormatedMenu" :placeHolder="strings.selectItems" :searchPlaceHolder="strings.searchItems" :single="false" :updateSelected="function(data){selected = data} "></multi-select>\
	  </div>',
  };
}
