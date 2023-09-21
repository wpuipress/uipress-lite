const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      type: String,
      returnData: Function,
    },
    data: function () {
      return {
        dynamics: this.uipData.dynamicOptions,
        strings: {
          select: __('select', 'uipress-lite'),
          currentValue: __('Current value', 'uipress-lite'),
        },
      };
    },
    inject: ['uipData'],
    computed: {},
    mounted: function () {},
    methods: {},
    template:
      '\
      <div class="uip-padding-xs uip-max-w-260">\
          <div class="uip-flex uip-flex-wrap uip-flex-start uip-gap-xs uip-row-gap-xs uip-w-250 uip-max-h-200 uip-scrollbar uip-overflow-auto">\
            <template v-for="dynamic in dynamics">\
             <div v-if="dynamic.type == type" class="uip-border-round hover:uip-background-muted uip-border-round uip-padding-xxs uip-flex uip-flex-between uip-flex-center uip-flex-middle uip-cursor-pointer uip-w-100p">\
               <div class="">\
                <div class="uip-text-s uip-text-bold">{{dynamic.label}}</div>\
                <div class="uip-text-xs uip-text-muted uip-flex uip-flex-center uip-gap-s">\
                  <span>{{strings.currentValue}}</span>\
                  <img :src="dynamic.value" class="uip-w-18 uip-ratio-1-1 uip-border-round">\
                </div>\
               </div>\
               <span @click="returnData(dynamic)"\
                class="uip-padding-xxs uip-border-round uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center">\
                 {{strings.select}}\
                </span>\
             </div>\
            </template>\
          </div>\
        </div>',
  };
}
