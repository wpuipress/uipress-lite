const { __, _x, _n, _nx } = wp.i18n;
import { nextTick } from "../../libs/vue-esm.js";
export default {
  emits: ["update"],
  props: {
    value: Object,
  },
  data() {
    return {
      spacing: this.returnDefaultOptions,
      strings: {
        right: __("Right", "uipress-lite"),
        left: __("Left", "uipress-lite"),
        top: __("Top", "uipress-lite"),
        bottom: __("Bottom", "uipress-lite"),
        custom: __("Custom", "uipress-lite"),
        padding: __("Paddding", "uipress-lite"),
        margin: __("Margin", "uipress-lite"),
      },
      syncOptions: {
        true: {
          value: true,
          icon: "crop_square",
          tip: __("Synced", "uipress-lite"),
        },
        false: {
          value: false,
          icon: "crop_free",
          tip: __("Per side", "uipress-lite"),
        },
      },
      spacingOptions: {
        0: {
          value: "0",
          label: "0",
          tip: __("Remove", "uipress-lite"),
        },
        XS: {
          value: "XS",
          label: "XS",
          tip: __("Extra small", "uipress-lite"),
        },
        S: {
          value: "S",
          label: "S",
          tip: __("Small", "uipress-lite"),
        },
        M: {
          value: "M",
          label: "M",
          tip: __("Medium", "uipress-lite"),
        },
        L: {
          value: "L",
          label: "L",
          tip: __("Large", "uipress-lite"),
        },
        XL: {
          value: "XL",
          label: "XL",
          tip: __("Extra large", "uipress-lite"),
        },
        custom: {
          value: "custom",
          icon: "more_vert",
          tip: __("Custom", "uipress-lite"),
        },
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
     * Watches options and returns to caller on change
     *
     * @since 3.2.13
     */
    spacing: {
      handler(newValue, oldValue) {
        this.maybeSyncSides();
        if (this.updating) return;
        this.$emit("update", this.spacing);
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
        padding: {
          preset: "0",
          sync: true,
          units: "px",
        },
        margin: {
          preset: "0",
          sync: true,
          units: "px",
        },
      };
    },
  },
  methods: {
    /**
     * Syncs sides of padding / margin when sync is on
     *
     * @since 3.2.13
     */
    maybeSyncSides() {
      if (this.spacing.padding.sync == true) {
        this.spacing.padding.right = this.spacing.padding.left;
        this.spacing.padding.top = this.spacing.padding.left;
        this.spacing.padding.bottom = this.spacing.padding.left;
      }

      if (this.spacing.margin.sync == true) {
        this.spacing.margin.right = this.spacing.margin.left;
        this.spacing.margin.top = this.spacing.margin.left;
        this.spacing.margin.bottom = this.spacing.margin.left;
      }
    },

    /**
     * Injects props value into component and handles older method of setting spacing
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      const defaultOptions = this.returnDefaultOptions;
      this.spacing = { ...defaultOptions };

      if (this.isObject(this.value)) {
        // Update padding
        if ("padding" in this.value) {
          this.spacing.padding = { ...defaultOptions.padding, ...this.value.padding };
        }

        // Update margin
        if ("margin" in this.value) {
          this.spacing.margin = { ...defaultOptions.margin, ...this.value.margin };
        }
      }

      switch (this.spacing.margin.preset) {
        case "remove":
          this.spacing.margin.preset = "0";
          break;

        case "small":
          this.spacing.margin.preset = "S";
          break;

        case "medium":
          this.spacing.margin.preset = "M";
          break;

        case "large":
          this.spacing.margin.preset = "L";
          break;
      }

      switch (this.spacing.padding.preset) {
        case "remove":
          this.spacing.padding.preset = "0";
          break;

        case "small":
          this.spacing.padding.preset = "S";
          break;

        case "medium":
          this.spacing.padding.preset = "M";
          break;

        case "large":
          this.spacing.padding.preset = "L";
          break;
      }

      await nextTick();
      this.updating = false;
    },
    /**
     * Handles units / value change for padding and margin
     */
    handleUnitChange(option, data) {
      option.left = data.value;
      option.units = data.units;
    },
  },
  template: `
    
    
    <div class="uip-flex uip-flex-column uip-row-gap-xs">
    
    
      <!--Padding -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-flex-start uip-padding-top-xxs"><span>{{strings.padding}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs">
        
          <toggle-switch :options="spacingOptions" :activeValue="spacing.padding.preset" :returnValue="function(data){ spacing.padding.preset = data}"></toggle-switch>
          
          <div class="uip-flex uip-gap-xs uip-flex-center" v-if="spacing.padding.preset == 'custom'">
          
            <value-units :value="{value: spacing.padding.left, units:spacing.padding.units}" :returnData="(data)=>{handleUnitChange(spacing.padding, data)}" class="uip-flex-grow"/>
            <toggle-switch :options="syncOptions" :activeValue="spacing.padding.sync" :returnValue="(data)=>{ spacing.padding.sync = data}" style="width:50%"></toggle-switch>
            
          </div>
          
          <div v-if="!spacing.padding.sync" class="uip-flex uip-flex-row uip-gap-xxxs">
                  
              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-flex-grow">
                <input class="uip-input-small uip-text-center uip-text-s uip-w-100p uip-flex-grow uip-remove-steps" type="number" v-model="spacing.padding.top" >
                <div class="uip-text-muted uip-text-xxs uip-text-center">T</div>
              </div>
              
              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-flex-grow">
                <input class="uip-input-small uip-text-center uip-text-s uip-w-100p uip-flex-grow uip-remove-steps" type="number" v-model="spacing.padding.right" >
                <div class="uip-text-muted uip-text-xxs uip-text-center">R</div>
              </div>
              
              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-flex-grow">
                <input class="uip-input-small uip-text-center uip-text-s uip-w-100p uip-flex-grow uip-remove-steps" type="number" v-model="spacing.padding.bottom" >
                <div class="uip-text-muted uip-text-xxs uip-text-center">B</div>
              </div>
              
              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-flex-grow">
                <input class="uip-input-small uip-text-center uip-text-s uip-w-100p uip-flex-grow uip-remove-steps" type="number" v-model="spacing.padding.left" >
                <div class="uip-text-muted uip-text-xxs uip-text-center">L</div>
              </div>
            
          </div>
      
        </div>
        
        
        
        
        <!-- Margin -->
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-flex-start uip-padding-top-xxs"><span>{{strings.margin}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs">
        
          <toggle-switch :options="spacingOptions" :activeValue="spacing.margin.preset" :returnValue="function(data){ spacing.margin.preset = data}"></toggle-switch>
          
          <div class="uip-flex uip-gap-xs uip-flex-center" v-if="spacing.margin.preset == 'custom'">
          
            <value-units :value="{value: spacing.margin.left, units:spacing.margin.units}" :returnData="(data)=>{handleUnitChange(spacing.margin, data)}" class="uip-flex-grow"/>
            <toggle-switch :options="syncOptions" :activeValue="spacing.margin.sync" :returnValue="(data)=>{ spacing.margin.sync = data}" style="width:50%"></toggle-switch>
            
          </div>
          
          <div v-if="!spacing.margin.sync" class="uip-flex uip-flex-row uip-gap-xxxs">
                  
              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-flex-grow">
                <input class="uip-input-small uip-text-center uip-text-s uip-w-100p uip-flex-grow uip-remove-steps" type="number" v-model="spacing.margin.top" >
                <div class="uip-text-muted uip-text-xxs uip-text-center">T</div>
              </div>
              
              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-flex-grow">
                <input class="uip-input-small uip-text-center uip-text-s uip-w-100p uip-flex-grow uip-remove-steps" type="number" v-model="spacing.margin.right" >
                <div class="uip-text-muted uip-text-xxs uip-text-center">R</div>
              </div>
              
              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-flex-grow">
                <input class="uip-input-small uip-text-center uip-text-s uip-w-100p uip-flex-grow uip-remove-steps" type="number" v-model="spacing.margin.bottom" >
                <div class="uip-text-muted uip-text-xxs uip-text-center">B</div>
              </div>
              
              <div class="uip-flex uip-flex-column uip-row-gap-xxs uip-flex-grow">
                <input class="uip-input-small uip-text-center uip-text-s uip-w-100p uip-flex-grow uip-remove-steps" type="number" v-model="spacing.margin.left" >
                <div class="uip-text-muted uip-text-xxs uip-text-center">L</div>
              </div>
            
          </div>
        
        </div>
        
      </div>  
    
    </div>
    
    `,
};
