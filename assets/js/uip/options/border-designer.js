const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
import BorderPositions from "../v3.5/lists/border_positions.min.js";
import BorderTypes from "../v3.5/lists/border_types.min.js";

export default {
  components: {
    colorBox: defineAsyncComponent(() => import("../v3.5/utility/color-box.min.js?ver=3.3.1")),
  },
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      borderOptions: this.returnDefault,
      strings: {
        radius: __("Radius", "uipress-lite"),
        topleft: __("Top left", "uipress-lite"),
        topright: __("Top right", "uipress-lite"),
        bottomleft: __("Bottom left", "uipress-lite"),
        bottomright: __("Bottom right", "uipress-lite"),
        colour: __("Colour", "uipress-lite"),
        style: __("Style", "uipress-lite"),
        width: __("Width", "uipress-lite"),
        position: __("Position", "uipress-lite"),
        borderColor: __("Border colour", "uipress-lite"),
      },
      borderPositions: BorderPositions,
      borderTypes: BorderTypes,
      updating: false,
    };
  },

  watch: {
    /**
     * Watches for changes to border options and sends the data back
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectProp(newValue);
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches for changes to border options and sends the data back
     *
     * @since 3.2.13
     */
    borderOptions: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.returnData(newValue);
      },
      deep: true,
    },
    /**
     * Watches for changes to border left and syncs with other border sides
     *
     * @since 3.2.13
     */
    "borderOptions.radius.value.topleft": {
      handler(newValue, oldValue) {
        if (!this.borderOptions.radius.value.sync) return;
        this.borderOptions.radius.value.topright = this.borderOptions.radius.value.topleft;
        this.borderOptions.radius.value.bottomleft = this.borderOptions.radius.value.topleft;
        this.borderOptions.radius.value.bottomright = this.borderOptions.radius.value.topleft;
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns default option value
     *
     * @since 3.2.0
     */
    returnDefault() {
      return {
        width: {
          value: "",
          units: "px",
        },
        style: "solid",
        color: {
          type: "solid",
          value: "",
        },
        position: "solid",
        radius: {
          value: {
            sync: true,
            topleft: "",
            topright: "",
            bottomleft: "",
            bottomright: "",
            units: "px",
          },
        },
      };
    },

    /**
     * Returns the border color as a background css style
     *
     * @since 3.2.13
     */
    returnBorderColor() {
      if (!this.borderOptions.color.value) return;
      if (this.borderOptions.color.value.startsWith("--")) {
        return `background-color:var(${this.borderOptions.color.value})`;
      }
      return `background-color:${this.borderOptions.color.value}`;
    },

    /**
     * Returns a new fill screen for border colour
     *
     * @since 3.2.13
     */
    returnFillScreen() {
      return {
        component: "ColorPicker",
        label: this.strings.borderColor,
        value: this.borderOptions.color.value,
        returnData: (d) => {
          if (d.startsWith("--")) {
            this.borderOptions.color.type = "variable";
          } else {
            this.borderOptions.color.type = "solid";
          }
          this.borderOptions.color.value = d;
        },
      };
    },
  },
  methods: {
    /**
     * Formats imput value
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      this.borderOptions = this.isObject(this.value) ? { ...this.returnDefault, ...this.value } : this.returnDefault;

      await this.$nextTick();
      this.updating = false;
    },
  },
  template: `
    
    
    <div class="uip-flex uip-flex-column uip-row-gap-xs uip-padding-left-xs">
    
    
      <!--Color -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.colour}}</span></div>
        
        <colorBox @click="$emit('request-screen', returnFillScreen)"
        :backgroundStyle="returnBorderColor" :text="borderOptions.color.value" :remove="()=>{borderOptions.color.value = ''}"/>
        
      </div>
    
    
      <!--Position -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.position}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <toggle-switch :options="borderPositions" :activeValue="borderOptions.position" :returnValue="function(data){ borderOptions.position = data}"></toggle-switch>
      
        </div>
        
      </div>
      
      
      <!--Style -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.style}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="borderOptions.style">
            <template v-for="item in borderTypes">
              <option :value="item.value">{{item.label}}</option>
            </template>
          </select>
      
        </div>
        
      </div>
      
      
      <!--Width -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.width}}</span></div>
        <value-units :value="borderOptions.width" :returnData="function(data){borderOptions.width = data}" class="uip-w-100p"></value-units>
        
      </div>
      
      
      <!--Radius -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.radius}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-right uip-flex-column uip-row-gap-xs">
        
          <div class="uip-flex uip-flex-row uip-gap-xxxs uip-flex-right">
          
            <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-round">
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-round" @click="borderOptions.radius.value.sync = true"
              :class="{'uip-background-default uip-text-emphasis' : borderOptions.radius.value.sync}">crop_square</div>
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-round" @click="borderOptions.radius.value.sync = false"
              :class="{'uip-background-default uip-text-emphasis' : !borderOptions.radius.value.sync}">crop_free</div>
            </div>
            
            <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center uip-flex-grow" v-if="borderOptions.radius.value.sync">
                <input class="uip-blank-input uip-text-center uip-w-60 uip-text-s" v-model="borderOptions.radius.value.topleft" >
            </div>
            
            <div class="uip-background-muted uip-border-round">
             <units-select :value="borderOptions.radius.value.units" :returnData="function(e){borderOptions.radius.value.units = e}"></units-select>
            </div>
          
          </div>
        
        </div>  
        
        <!--Spacer-->
        <div v-if="!borderOptions.radius.value.sync"></div>
        
        
        <div class="uip-flex uip-flex-row uip-gap-xxxs uip-flex-right" v-if="!borderOptions.radius.value.sync">
        
          <div class="uip-flex uip-flex-row uip-gap-xxxs uip-flex-right">
            
              <uip-tooltip :message="strings.topleft" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="borderOptions.radius.value.topleft" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.topright" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="borderOptions.radius.value.topright" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.bottomleft" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="borderOptions.radius.value.bottomleft" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.bottomright" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center" >
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="borderOptions.radius.value.bottomright" >
                </div>
              </uip-tooltip>
            
            </div>
          
          </div>
        
        </div>
        
          
    </div>`,
};
