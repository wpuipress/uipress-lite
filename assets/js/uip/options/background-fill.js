const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
export default {
  components: {
    ColorPicker: defineAsyncComponent(() => import("../v3.5/styles/color-picker.min.js")),
    GradientPicker: defineAsyncComponent(() => import("../v3.5/styles/gradient-picker.min.js")),
  },

  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      tab: "color",
      fill: {},
    };
  },
  watch: {
    value: {
      handler() {
        //this.formatValue();
      },
      deep: true,
    },
    fill: {
      handler() {
        this.returnData(this.fill);
      },
      deep: true,
    },
  },
  created() {
    this.formatValue();
  },
  computed: {
    /**
     * Returns the active component
     *
     * @since 3.2.12
     */
    returnActiveComp() {
      let activeTab = this.tab;
      return this.returnTabs[activeTab];
    },
    /**
     * Returns all tabs
     *
     * @since 0.0.1
     */
    returnTabs() {
      return {
        color: {
          value: "color",
          icon: "palette",
          tip: __("Colour", "uipress-lite"),
          component: "ColorPicker",
          setValue: this.fill.value,
          returnData: (d) => {
            this.fill.value = d;
            if (this.fill.value.includes("--")) {
              this.fill.type = "variable";
            } else {
              this.fill.type = "color";
            }
          },
        },
        gradient: {
          value: "gradient",
          icon: "gradient",
          tip: __("Gradient", "uipress-lite"),
          component: "GradientPicker",
          setValue: this.fill.value,
          returnData: (d) => {
            this.fill.value = d;
            this.fill.type = "gradient";
          },
        },
      };
    },
  },
  methods: {
    /**
     * Formats input
     *
     * @since 3.2.13
     */
    formatValue() {
      if (this.value) {
        this.fill = { ...this.fill, ...this.value };
      }
    },
    /**
     * Catches nested new screen requests and emits them back up the chain
     *
     * @param {Object} d - the new screen object
     * @since 0.0.1
     */
    processScreen(d) {
      this.$emit("request-screen", d);
    },
  },
  template: `
	
	<div class="uip-flex uip-flex-column uip-row-gap-s">
		
		
		  <toggle-switch :activeValue="tab" :options="returnTabs" :returnValue="(d) => {tab = d}" class="uip-text-s" :disableOptional="true"/>
		  
		  <Transition name="fade" mode="out-in">
		  
			<KeepAlive>
			
			  <component 
			  @request-screen="(d)=>{processScreen(d)}"
			  @go-back="$emit('go-back')"
			  :is="returnActiveComp.component"
			  :value="returnActiveComp.setValue" 
			  :returnData="returnActiveComp.returnData"/>
			
			</KeepAlive>
		  
		  </Transition>
		  
		  
	  
	  </div>
	
	`,
};
