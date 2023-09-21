const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    inject: ['uipress'],
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        option: {
          mobile: false,
          tablet: false,
          desktop: false,
        },
        strings: {
          mobile: __('Mobile', 'uipress-lite'),
          tablet: __('Tablet', 'uipress-lite'),
          desktop: __('Desktop', 'uipress-lite'),
        },
        options: {
          false: {
            value: false,
            label: __('Show', 'uipress-lite'),
          },
          true: {
            value: true,
            label: __('Hide', 'uipress-lite'),
          },
        },
      };
    },
    watch: {
      option: {
        handler(newValue, oldValue) {
          let responsiveSet = {};
          if (newValue.mobile) {
            responsiveSet.mobile = true;
          }
          if (newValue.tablet) {
            responsiveSet.tablet = true;
          }
          if (newValue.desktop) {
            responsiveSet.desktop = true;
          }
          this.returnData(responsiveSet);
        },
        deep: true,
      },
    },
    created: function () {
      this.formatValue(this.value);
    },
    methods: {
      formatValue(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          this.option = { ...this.option, ...value };
        }
      },
    },
    template: `
      <div class="uip-flex uip-flex-column uip-row-gap-xs">
      
        <!--Mobile-->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center">
            <div class="uip-flex uip-gap-xs uip-flex-center">
              <div class="uip-icon uip-icon-medium">smartphone</div>
              <div class="">{{strings.mobile}}</div>
            </div>
          </div>
          
          <div class="uip-position-relative">
            <toggle-switch :options="options" :activeValue="option.mobile" :returnValue="function(data){ option.mobile = data }"></toggle-switch>
          </div>
          
        </div>
        
        
        <!--Tablet-->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center">
            <div class="uip-flex uip-gap-xs uip-flex-center">
              <div class="uip-icon uip-icon-medium">tablet</div>
              <div class="">{{strings.tablet}}</div>
            </div>
          </div>
            
          <div class="uip-position-relative">
            <toggle-switch :options="options" :activeValue="option.tablet" :returnValue="function(data){ option.tablet = data }"></toggle-switch>
          </div>
          
        </div>
        
        
        <!--Desktop-->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center">
            <div class="uip-flex uip-gap-xs uip-flex-center">
              <div class="uip-icon uip-icon-medium">desktop_windows</div>
              <div class="">{{strings.desktop}}</div>
            </div>
          </div>
            
          <div class="uip-position-relative">
            <toggle-switch :options="options" :activeValue="option.desktop" :returnValue="function(data){ option.desktop = data }"></toggle-switch>
          </div>
          
        </div>
        
    </div>`,
  };
}
