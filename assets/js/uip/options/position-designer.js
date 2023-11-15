const { __, _x, _n, _nx } = wp.i18n;
import { nextTick } from "../../libs/vue-esm.js";
export default {
  emits: ["update"],
  props: {
    value: Object,
  },
  data() {
    return {
      option: this.returnDefaultOptions,
      updating: false,
      verticalAlignOptions: {
        none: {
          value: "none",
          icon: "block",
          tip: __("None", "uipress-lite"),
        },
        top: {
          value: "top",
          icon: "align_vertical_top",
          tip: __("Top", "uipress-lite"),
        },
        center: {
          value: "center",
          icon: "align_vertical_center",
          tip: __("Center", "uipress-lite"),
        },
        bottom: {
          value: "bottom",
          icon: "align_vertical_bottom",
          tip: __("Bottom", "uipress-lite"),
        },
      },
      horizontalAlignOptions: {
        none: {
          value: "none",
          icon: "block",
          tip: __("None", "uipress-lite"),
        },
        left: {
          value: "left",
          icon: "align_horizontal_left",
          tip: __("Left", "uipress-lite"),
        },
        center: {
          value: "center",
          icon: "align_horizontal_center",
          tip: __("Center", "uipress-lite"),
        },
        right: {
          value: "right",
          icon: "align_horizontal_right",
          tip: __("Right", "uipress-lite"),
        },
      },
      positionOptions: [
        {
          label: __("Relative", "uipress-lite"),
          value: "relative",
        },
        {
          label: __("Absolute", "uipress-lite"),
          value: "absolute",
        },
        {
          label: __("Fixed", "uipress-lite"),
          value: "fixed",
        },
        {
          label: __("Sticky", "uipress-lite"),
          value: "sticky",
        },
        {
          label: __("Static", "uipress-lite"),
          value: "static",
        },
      ],
      displayOptions: [
        {
          label: __("Block", "uipress-lite"),
          value: "block",
        },
        {
          label: __("Inline", "uipress-lite"),
          value: "inline",
        },
        {
          label: __("Flex", "uipress-lite"),
          value: "flex",
        },
        {
          label: __("Grid", "uipress-lite"),
          value: "grid",
        },
        {
          label: __("Inherit", "uipress-lite"),
          value: "inherit",
        },
        {
          label: __("None", "uipress-lite"),
          value: "none",
        },
      ],
      strings: {
        position: __("Position", "uipress-lite"),
        left: __("Left", "uipress-lite"),
        top: __("Top", "uipress-lite"),
        right: __("Right", "uipress-lite"),
        bottom: __("Bottom", "uipress-lite"),
        inset: __("Inset", "uipress-lite"),
        verticalAlign: __("Vertical align", "uipress-lite"),
        horizontalAlign: __("Horizontal align", "uipress-lite"),
        zIndex: __("z-index", "uipress-lite"),
        display: __("Display", "uipress-lite"),
      },
    };
  },

  watch: {
    /**
     * Watches changes to value prop and injects
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectProp();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches changes to options and returns data back to caller
     *
     * @since 3.2.13
     */
    option: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.$emit("update", this.option);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns default options
     *
     * @since 3.2.13
     */
    returnDefaultOptions() {
      return {
        position: "",
        display: "",
        verticalAlign: "none",
        horizontalAlign: "none",
        zIndex: "",
        offset: {
          units: "px",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        },
      };
    },
  },
  methods: {
    /**
     * Injects value into component
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      const defaultOptions = this.returnDefaultOptions;
      const newOptions = this.isObject(this.value) ? this.value : {};
      this.option = { ...defaultOptions, ...newOptions };

      if (this.isObject(this.value)) {
        if ("offset" in this.value) {
          this.option.offset = { ...this.value.offset };
        }
      }

      await nextTick();
      this.updating = false;
    },
  },
  template: `
    
    <div class="uip-flex uip-flex-column uip-row-gap-xs">
    
      <!--Position -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.position}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <default-select :value="option.position" :returnData="function(e){option.position = e}" :args="{options: positionOptions}"></default-select>
        
        </div>
        
      </div>
      
      
      <!-- Display -->
      
      
      <!--Position -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.display}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <default-select :value="option.display" :returnData="function(e){option.display = e}" :args="{options: displayOptions}"></default-select>
        
        </div>
        
      </div>
      
      
      <!--Inset -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.inset}}</span></div>
        
        <div class="uip-flex uip-flex-row uip-gap-xxxs">
        
              <uip-tooltip :message="strings.left" :delay="0" class="uip-flex uip-flex-grow">
                <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-22 uip-text-s" v-model="option.offset.left" >
                </div>
              </uip-tooltip>
            
              <uip-tooltip :message="strings.right" :delay="0" class="uip-flex uip-flex-grow">
                <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-22 uip-text-s" v-model="option.offset.right" >
                </div>
              </uip-tooltip>
            
              <uip-tooltip :message="strings.top" :delay="0" class="uip-flex uip-flex-grow">
                <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-22 uip-text-s" v-model="option.offset.top" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.bottom" :delay="0" class="uip-flex uip-flex-grow">
                <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-rounder uip-text-center" >
                    <input class="uip-blank-input uip-text-center uip-w-22 uip-text-s" v-model="option.offset.bottom" >
                </div>
              </uip-tooltip>
          
          
              <div class="uip-background-muted uip-border-rounder uip-flex uip-flex-grow">
                <units-select :value="option.offset.units" :returnData="function(e){option.offset.units = e}"></units-select>
              </div>
        
        </div>
        
      </div>
      
      
      <!--Vertical align -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.verticalAlign}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <toggle-switch :options="verticalAlignOptions" :activeValue="option.verticalAlign" :returnValue="function(data){ option.verticalAlign = data}"></toggle-switch>
        
        </div>
        
      </div>
      
      <!--Horizontal align -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.horizontalAlign}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <toggle-switch :options="horizontalAlignOptions" :activeValue="option.horizontalAlign" :returnValue="function(data){ option.horizontalAlign = data}"></toggle-switch>
        
        </div>
        
      </div>
      
      
      <!--Zindex -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.zIndex}}</span></div>
        
        <uip-number :value="option.zIndex" :returnData="(d)=>{option.zIndex = d}" placeHolder="" :step="0.1"/>
        
      </div>
      
    </div>
    `,
};
