const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        menu: this.uipData.adminMenu.menu,
        selected: this.formatInput(),
        strings: {
          renameItem: __('Rename item', 'uipress-lite'),
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
          return this.value;
        } else {
          return {};
        }
      },
      returnIcon(id) {
        if (!this.uipress.isObject(this.selected)) {
          this.selected[id] = {};
          this.selected[id].icon = {};
          this.selected[id].title = '';
          return '';
        }
        if (Object.hasOwn(this.selected, id)) {
          return this.selected[id].icon;
        } else {
          this.selected[id] = {};
          this.selected[id].icon = {};
          this.selected[id].title = '';
          return '';
        }
      },
      returnTitle(id) {
        if (!this.uipress.isObject(this.selected)) {
          this.selected[id] = {};
          this.selected[id].icon = {};
          this.selected[id].title = '';
          return '';
        }
        if (Object.hasOwn(this.selected, id)) {
          return this.selected[id].title;
        } else {
          this.selected[id] = {};
          this.selected[id].icon = {};
          this.selected[id].title = '';
          return '';
        }
      },
    },
    template: `<div class="uip-flex uip-flex-column uip-row-gap-xs uip-max-h-200 uip-overflow-auto uip-scrollbar">
        <template v-for="item in menu">
          <div v-if="item.type != 'sep'" class="uip-padding-right-xs">
            <div class="uip-text-muted uip-text-s" v-html="item[0]"></div>
            <div class="uip-flex uip-flex-row uip-gap-xs">
            
              <inline-icon-select :value="{value:returnIcon(item.uid)}" :returnData="function (data) {selected[item.uid].icon = data.value}">
                <template v-slot:trigger>
                  <div class="uip-icon uip-text-l uip-padding-xxxs uip-border-round uip-border uip-w-16 uip-ratio-1-1">{{returnIcon(item.uid)}}</div>\
                </template>
              </inline-icon-select>
              
              <uip-input :value="returnTitle(item.uid)" :returnData="function (data) {selected[item.uid].title = data}" :placeHolder="strings.renameItem"></uip-input>
            </div>
          </div>
        </template>
	  </div>`,
  };
}
