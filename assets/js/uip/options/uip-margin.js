const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        margin: {},
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
    watch: {
      margin: {
        handler(newValue, oldValue) {
          let self = this;
          if (self.margin.sync == true) {
            self.margin.right = self.margin.left;
            self.margin.top = self.margin.left;
            self.margin.bottom = self.margin.left;
          }

          self.returnData(self.margin);
        },
        deep: true,
      },
    },
    mounted: function () {
      this.formatValue(this.value);
    },
    methods: {
      formatValue(value) {
        if (typeof value === 'undefined') {
          this.margin.sync = true;
          this.margin.units = 'px';
          return;
        }
        if (this.uipress.isObject(value)) {
          this.margin = value;
          return;
        } else {
          this.margin.sync = true;
          this.margin.units = 'px';
          return;
        }
      },
    },
    template: `<div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
        <div class="uip-flex uip-flex-row uip-gap-xxxs uip-column-gap-xxxs uip-background-muted uip-border-round uip-padding-xxxs">
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : margin.preset == 'remove'}" @click="margin.preset = 'remove'">0</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : margin.preset == 'xs'}" @click="margin.preset = 'xs'">XS</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : margin.preset == 'small'}" @click="margin.preset = 'small'">S</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : margin.preset == 'medium'}" @click="margin.preset = 'medium'">M</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : margin.preset == 'large'}" @click="margin.preset = 'large'">L</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-s uip-text-bold"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : margin.preset == 'xl'}" @click="margin.preset = 'xl'">XL</div>
          <div class="uip-border-round uip-link-muted uip-padding-xs uip-padding-top-xxs uip-padding-bottom-xxs uip-text-bold uip-icon uip-icon-medium"
          :class="{'uip-background-default uip-text-emphasis uip-text-bold' : margin.preset == 'custom'}" @click="margin.preset = 'custom'"><span class="uip-icon uip-icon-medium uip-text-l">more_vert</span></div>
        </div>
        <div v-if="margin.preset == 'custom'">
          <div class="uip-text-s uip-text-muted uip-margin-bottom-xxs">{{strings.custom}}</div>
          <div class="uip-flex uip-flex-row uip-gap-xxxs">
            <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-round">
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-round" @click="margin.sync = true"
              :class="{'uip-background-default uip-text-emphasis' : margin.sync}">crop_square</div>
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-round" @click="margin.sync = false"
              :class="{'uip-background-default uip-text-emphasis' : !margin.sync}">crop_free</div>
            </div>
          
            <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center" v-if="margin.sync">
                <input class="uip-blank-input uip-text-center uip-w-60 uip-text-s" v-model="margin.left" >
            </div>
          
          <template v-if="!margin.sync">
        
           
          
            
            
            <uip-tooltip :message="strings.top" :delay="0" containerClass="uip-flex">
              <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                  <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="margin.top" >
              </div>
            </uip-tooltip>
            
            <uip-tooltip :message="strings.right" :delay="0" containerClass="uip-flex">
              <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                  <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="margin.right" >
              </div>
            </uip-tooltip>
            
            <uip-tooltip :message="strings.bottom" :delay="0" containerClass="uip-flex">
              <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center" >
                  <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="margin.bottom" >
              </div>
            </uip-tooltip>
            
            <uip-tooltip :message="strings.left" :delay="0" containerClass="uip-flex">
              <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                  <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="margin.left" >
              </div>
            </uip-tooltip>
            
          </template>
        
        
            <div class="uip-background-muted uip-border-round">
             <units-select :value="margin.units" :returnData="function(e){margin.units = e}"></units-select>
            </div>
          
          
          </div>
        </div>
    </div>`,
  };
}
