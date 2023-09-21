export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: [Object, String],
      args: Object,
    },
    data: function () {
      return {
        option: {},
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
    inject: ['uipress'],
    mounted: function () {
      this.formatInput(this.value);
    },
    methods: {
      formatInput(value) {
        if (typeof value === 'undefined') {
          this.option.value = 'left';
          return this.option;
        }
        if (this.uipress.isObject(value)) {
          if (!('value' in value)) {
            this.option.value = 'left';
            return;
          } else {
            this.option = value;
            return;
          }
        } else if (Array.isArray(value)) {
          this.option.value = '';
          return;
        } else {
          this.option.value = value;
          return;
        }
      },
      activateOption(value) {
        let self = this;
        if (value == self.option.value) {
          self.option.value = false;
        } else {
          self.option.value = value;
        }
      },
      returnStyle(item) {
        if ('iconRotate' in item) {
          return 'rotate:' + item.iconRotate + 'deg';
        }
      },
    },
    template: `
    <div class="uip-flex uip-flex-row uip-gap-xxs">
      <template v-for="item in args.options">
        <uip-tooltip :message="item.label" :delay="100">
          <div class="uip-padding-xxs uip-link-muted uip-border-round uip-flex uip-flex-center uip-flex-middle uip-w-22 uip-ratio-1-1" 
          :class="option.value == item.value ? 'uip-background-primary-wash uip-text-emphasis' : 'uip-background-muted hover:uip-background-grey'" @click="activateOption( item.value )">
            <div v-if="!Array.isArray(item.icon)" class="uip-icon uip-text-l" :style="returnStyle(item)">{{item.icon}}</div>
            <template v-else v-for="icon in item.icon">
              <div class="uip-icon uip-text-l" :style="returnStyle(item)">{{icon}}</div>
            </template>
          </div>
        </uip-tooltip>
      </template>
    </div>`,
  };
}
