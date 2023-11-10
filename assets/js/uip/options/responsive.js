const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      option: {
        mobile: false,
        tablet: false,
        desktop: false,
      },
      updating: false,
      strings: {
        mobile: __("Mobile", "uipress-lite"),
        tablet: __("Tablet", "uipress-lite"),
        desktop: __("Desktop", "uipress-lite"),
      },
      options: {
        false: {
          value: false,
          label: __("Show", "uipress-lite"),
        },
        true: {
          value: true,
          label: __("Hide", "uipress-lite"),
        },
      },
    };
  },
  watch: {
    /**
     * Watches changes to the responsive object and returns
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.formatValue();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches changes to the responsive object and returns
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.updateOptions();
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns default value
     *
     * @since 3.3.09
     */
    returnDefault() {
      return {
        mobile: false,
        tablet: false,
        desktop: false,
      };
    },
  },
  methods: {
    /**
     * Injects prop value if valid
     *
     * @since 3.2.13
     */
    async formatValue() {
      this.updating = true;
      this.option = this.isObject(this.value) ? { ...this.returnDefault, ...this.value } : { ...this.returnDefault };
      await this.$nextTick();
      this.updating = false;
    },

    /**
     * Returns data to caller
     *
     * @since 3.2.13
     */
    updateOptions() {
      let responsiveSet = { ...this.option };
      this.returnData(responsiveSet);
    },
  },
  template: `
      <div class="uip-flex uip-flex-column uip-row-gap-xs">
      
        <!--Mobile-->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center">
            <div class="uip-flex uip-gap-xs uip-flex-center uip-text-s">
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
            <div class="uip-flex uip-gap-xs uip-flex-center uip-text-s">
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
            <div class="uip-flex uip-gap-xs uip-flex-center uip-text-s">
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
