const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        padding: {},
        strings: {
          right: __('Right', 'uipress-lite'),
          left: __('Left', 'uipress-lite'),
          top: __('Top', 'uipress-lite'),
          bottom: __('Bottom', 'uipress-lite'),
          custom: __('Custom', 'uipress-lite'),
        },
      };
    },
    inject: ['uipress'],
    mounted: function () {
      this.formatValue(this.value);
    },
    watch: {
      padding: {
        handler(newValue, oldValue) {
          let self = this;
          if (self.padding.sync == true) {
            self.padding.right = self.padding.left;
            self.padding.top = self.padding.left;
            self.padding.bottom = self.padding.left;
          }

          self.returnData(self.padding);
        },
        deep: true,
      },
    },
    methods: {
      formatValue(value) {
        if (typeof value === 'undefined') {
          this.padding.sync = true;
          this.padding.units = 'px';
          return;
        }
        if (this.uipress.isObject(value)) {
          this.padding = value;
          return;
        } else {
          this.padding.sync = true;
          this.padding.units = 'px';
          return;
        }
      },
    },
    template: `<div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
        <div class="uip-flex uip-flex-row uip-gap-xxxs uip-column-gap-xxxs uip-background-muted uip-border-round uip-padding-xxxs">
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : padding.preset == 'remove'}" @click="padding.preset = 'remove'">0</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : padding.preset == 'xs'}" @click="padding.preset = 'xs'">XS</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : padding.preset == 'small'}" @click="padding.preset = 'small'">S</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : padding.preset == 'medium'}" @click="padding.preset = 'medium'">M</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : padding.preset == 'large'}" @click="padding.preset = 'large'">L</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : padding.preset == 'xl'}" @click="padding.preset = 'xl'">XL</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-bold uip-flex uip-flex-center"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : padding.preset == 'custom'}" @click="padding.preset = 'custom'"><span class="uip-icon uip-icon-medium uip-text-l">more_vert</span></div>
        </div>
        <div v-if="padding.preset == 'custom'">
          <div class="uip-text-s uip-text-muted uip-margin-bottom-xxs">{{strings.custom}}</div>
          <div class="uip-flex uip-flex-row uip-gap-xxxs">
            <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-round">
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-round" @click="padding.sync = true"
              :class="{'uip-background-default uip-text-emphasis' : padding.sync}">crop_square</div>
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-round" @click="padding.sync = false"
              :class="{'uip-background-default uip-text-emphasis' : !padding.sync}">crop_free</div>
            </div>
          
            <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center" v-if="padding.sync">
                <input class="uip-blank-input uip-text-center uip-w-60 uip-text-s" v-model="padding.left" >
            </div>
          
          <template v-if="!padding.sync">
        
            
            <uip-tooltip :message="strings.top" :delay="0" containerClass="uip-flex">
              <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                  <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="padding.top" >
              </div>
            </uip-tooltip>
          
            <uip-tooltip :message="strings.right" :delay="0" containerClass="uip-flex">
              <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                  <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="padding.right" >
              </div>
            </uip-tooltip>
            
            <uip-tooltip :message="strings.bottom" :delay="0" containerClass="uip-flex">
              <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center" >
                  <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="padding.bottom" >
              </div>
            </uip-tooltip>
            
            <uip-tooltip :message="strings.left" :delay="0" containerClass="uip-flex">
              <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                  <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="padding.left" >
              </div>
            </uip-tooltip>
            
          </template>
        
        
            <div class="uip-background-muted uip-border-round">
             <units-select :value="padding.units" :returnData="function(e){padding.units = e}"></units-select>
            </div>
          
          
          </div>
        </div>
    </div>`,
  };
}
