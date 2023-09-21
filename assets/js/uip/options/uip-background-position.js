const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    inject: ['uipress'],
    data: function () {
      return {
        option: {
          position: '',
          repeat: 'no-repeat',
          size: 'cover',
        },
        options: {
          positions: [
            {
              value: 'none',
              label: __('None', 'uipress-lite'),
            },
            {
              value: 'top left',
              label: __('Top left', 'uipress-lite'),
            },
            {
              value: 'top center',
              label: __('Top center', 'uipress-lite'),
            },
            {
              value: 'top right',
              label: __('Top right', 'uipress-lite'),
            },
            ///
            {
              value: 'center left',
              label: __('Center left', 'uipress-lite'),
            },
            {
              value: 'center center',
              label: __('Center center', 'uipress-lite'),
            },
            {
              value: 'center right',
              label: __('Center right', 'uipress-lite'),
            },
            ///
            {
              value: 'bottom left',
              label: __('Bottom left', 'uipress-lite'),
            },
            {
              value: 'bottom center',
              label: __('Bottom center', 'uipress-lite'),
            },
            {
              value: 'bottom right',
              label: __('Bottom right', 'uipress-lite'),
            },
          ],
          repeat: [
            {
              value: 'no-repeat',
              label: __('No repeat', 'uipress-lite'),
            },
            {
              value: 'repeat-x',
              label: __('Repeat x', 'uipress-lite'),
            },
            {
              value: 'repeat-y',
              label: __('Repeat y', 'uipress-lite'),
            },
            {
              value: 'repeat',
              label: __('Repeat', 'uipress-lite'),
            },
          ],
          size: [
            {
              value: 'auto',
              label: __('Auto', 'uipress-lite'),
            },
            {
              value: 'cover',
              label: __('Cover', 'uipress-lite'),
            },
            {
              value: 'contain',
              label: __('Contain', 'uipress-lite'),
            },
          ],
        },
        strings: {
          position: __('Position', 'uipress-light'),
          repeat: __('Repeat', 'uipress-light'),
          size: __('Size', 'uipress-light'),
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
    mounted: function () {
      this.formatInput(this.value);
    },
    computed: {
      returnOption() {
        return this.option;
      },
    },
    methods: {
      formatInput(value) {
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
    
    
      <!--Position -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.position}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <default-select :value="returnOption.position" :args="{options: options.positions}" :returnData="function(e) {option.position = e}"></default-select>
        
        </div>
        
      </div>
      
      <!--Repeat -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.repeat}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <default-select :value="returnOption.repeat" :args="{options: options.repeat}" :returnData="function(e) {option.repeat = e}"></default-select>
        
        </div>
        
      </div>
      
      
      <!--Size -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.size}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <default-select :value="returnOption.size" :args="{options: options.size}" :returnData="function(e) {option.size = e}"></default-select>
        
        </div>
        
      </div>
    
    
    </div>`,
  };
}
