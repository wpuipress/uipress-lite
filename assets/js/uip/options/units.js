const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: String,
  },
  data() {
    return {
      option: 'px',
      strings: {
        pixels: __('Pixels', 'uipress-lite'),
        percentage: __('Percent', 'uipress-lite'),
        points: __('Points', 'uipress-lite'),
        fontSize: __('Font size', 'uipress-lite'),
        rootFontSize: __('Root font size', 'uipress-lite'),
        viewportHeight: __('Viewport height', 'uipress-lite'),
        dviewportHeight: __('Dynamic Viewport height', 'uipress-lite'),
        viewportWidth: __('Viewport width', 'uipress-lite'),
        auto: __('auto', 'uipress-lite'),
      },
      options: [
        {
          value: 'auto',
          label: __('Auto'),
        },
        {
          value: 'px',
          label: __('Pixels'),
        },
        {
          value: 'pt',
          label: __('Points'),
        },
        {
          value: '%',
          label: __('Percent'),
        },
        {
          value: 'em',
          label: __('Element size'),
        },
        {
          value: 'rem',
          label: __('Root size'),
        },
        {
          value: 'vh',
          label: __('Viewport height'),
        },
        {
          value: 'dvh',
          label: __('Dynamic Viewport height'),
        },
        {
          value: 'vw',
          label: __('Viewport width'),
        },
      ],
    };
  },
  watch: {
    option: {
      handler(newValue, oldValue) {
        this.returnData(this.option);
      },
    },
    value: {
      handler(newValue, oldValue) {
        this.injectProp();
      },
    },
  },
  mounted() {
    this.injectProp();
  },
  methods: {
    /**
     * Inject prop value
     *
     * @since 3.2.13
     */
    injectProp() {
      if (!this.value) return;
      this.option = this.value;
    },
    /**
     * Selects an item and closes the dropdown
     *
     * @param {Object} item - the selected unit
     * @since 3.2.13
     */
    selectItem(item) {
      this.option = item.value;
      this.$refs.unitdrop.close();
    },
  },
  template: `
  
  
  
        <dropdown pos="left top" ref="unitdrop">
        
          <template v-slot:trigger>
            <div class="uip-padding-xxs uip-text-s uip-text-muted uip-min-w-18 uip-text-center uip-link-muted">{{option}}</div>
          </template>
          
          <template v-slot:content>
            <div class="uip-flex uip-flex-column uip-flex-left uip-text-s uip-padding-s">
            
              <template v-for="item in options">
              
                <div :title="item.label" class="uip-link-muted uip-flex uip-flex-center uip-gap-xxs uip-padding-xxxs uip-padding-left-xxs hover:uip-background-muted uip-border-rounder" 
                @click="selectItem(item)" 
                :class="{'uip-text-emphasis uip-background-muted' : option == item.value}">
                  <span class="uip-w-40">{{item.value}}</span>
                  <span class="uip-text-muted uip-w-100 uip-overflow-hidden uip-no-wrap uip-text-ellipsis"
                  :class="option == item.value ? 'uip-text-emphasis' :'uip-text-muted'">{{item.label}}</span>
                </div>
              
              </template>
              
            </div>
          </template>
          
        </dropdown>
      
      `,
};
