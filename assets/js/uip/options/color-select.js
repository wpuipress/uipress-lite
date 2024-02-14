const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../libs/vue-esm.js";
export default {
  components: {
    colorBox: defineAsyncComponent(() => import("../v3.5/utility/color-box.min.js?ver=3.3.1")),
    screenControl: defineAsyncComponent(() => import("../v3.5/utility/screen-control.min.js?ver=3.3.1")),
    colorPicker: defineAsyncComponent(() => import("../v3.5/styles/color-picker.min.js?ver=3.3.1")),
    colourStyleEditor: defineAsyncComponent(() => import("../v3.5/styles/color-style-editor.min.js?ver=3.3.1")),
  },

  props: {
    returnData: Function,
    value: Object,
    args: Object,
  },
  data() {
    return {
      updating: false,
      colour: this.returnDefaultValue,
      strings: {
        colorPicker: __("Colour picker", "uipress-lite"),
      },
    };
  },
  watch: {
    colour: {
      handler() {
        if (this.updating) return;
        this.returnData(this.colour);
      },
      deep: true,
    },
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.formatValue();
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    /**
     * Returns default value
     *
     * @since 3.3.03
     */
    returnDefaultValue() {
      return { value: "", type: "solid" };
    },
    /**
     * Returns background fill for preview
     *
     * @since 3.2.13
     */
    returnFillStyle() {
      if (!("value" in this.colour)) return;
      if (!this.colour.value) return;

      const val = this.colour.value;
      // Variable style
      if (val.includes("--")) return `background:var(${val})`;
      return `background:${val}`;
    },

    /**
     * Returns the color screen
     *
     * @since 3.2.13
     */
    colourPickerScreen() {
      return {
        component: "colorPicker",
        value: this.colour.value,
        label: this.strings.colorPicker,
        args: this.args,
        returnData: (d) => {
          this.colour.value = d;
        },
      };
    },

    /**
     * Returns drop pos for dropdown
     *
     * @since 3.2.0
     */
    returnDropPos() {
      return this.hasNestedPath(this.args, "dropPosition") ? this.args.dropPosition : "left center";
    },
  },
  methods: {
    /**
     * Formats input colour
     *
     * @since 3.2.13
     */
    async formatValue() {
      this.updating = true;

      this.colour = this.returnDefaultValue;
      this.colour = this.isObject(this.value) ? { ...this.value } : this.returnDefaultValue;

      await this.$nextTick();
      this.updating = false;
    },
  },
  template: `
    
    
    <dropdown :pos="returnDropPos" 
    :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']" 
    ref="fillDrop" class="uip-w-100p">
    
      <template #trigger>
        <colorBox :backgroundStyle="returnFillStyle" :text="this.colour.value" :remove="()=>{this.colour.value = ''}"/>
      </template>
      
      <template #content>
      
        <div class="uip-padding-s uip-w-240">
        
          <screenControl :startScreen="colourPickerScreen" :homeScreen="colourPickerScreen.component" :closer="$refs.fillDrop.close" :showNavigation="true">
            
            <template #componenthandler="{ processScreen, currentScreen, goBack }">
              <KeepAlive>
                <component @request-screen="(d)=>{processScreen(d)}" @go-back="goBack()"
                :returnData="currentScreen.returnData"
                :value="currentScreen.value"
                :args="currentScreen.args"
                :is="currentScreen.component"/>
              </KeepAlive>
            </template>
            
          </screenControl>
        </div>
        
      </template>
      
    </dropdown>
      `,
};
