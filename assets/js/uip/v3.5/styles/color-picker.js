import { defineAsyncComponent } from '../../../libs/vue-esm.js';

export default {
  components: {
    colorSelect: defineAsyncComponent(() => import('../libs/colorpicker.js')),
    styleManager: defineAsyncComponent(() => import('./style-manager.min.js')),
  },

  props: {
    value: String,
    returnData: Function,
    args: Object,
  },
  data() {
    return {
      color: this.value,
      opacity: 100,
      dragging: false,
      dontProcessVars: false,
    };
  },
  watch: {
    opacity: {
      handler(newValue, oldValue) {
        if (!newValue) this.opacity = 0;
        if (newValue > 100) {
          this.opacity = 100;
        }
        if (newValue < 0) {
          this.opacity = 0;
        }
        this.updateOpacity();
      },
      deep: true,
    },
    value: {
      handler() {
        this.color = this.value;
      },
    },
  },
  computed: {
    /**
     * Checks if style manage was disabled from args
     *
     * @returns {Boolean}
     * @since 0.0.1
     */
    hasStyleManager() {
      if (!this.args) return true;
      if (!this.isObject(this.args)) return true;
      if (!('hasStyleManager' in this.args)) return true;
      return this.args.hasStyleManager;
    },
    /**
     * Returns current color
     *
     * @since 0.0.1
     */
    returnColor() {
      if (!this.color) return '#b500ff';
      if (this.color.includes('gradient')) return '#b500ff';
      // Check for vars
      if (this.color.includes('--')) return this.colorFromVar;
      return this.color;
    },
    /**
     * Gets color from var
     *
     * @since 3.2.13
     */
    colorFromVar() {
      // Don't return color if still focused / typing
      if (this.dontProcessVars) return this.color;

      const allColours = this.uipApp.data.themeStyles;
      const varName = this.color.trim();

      // If var is built in
      if (varName in allColours) {
        // Ensure the variable has the value
        const mode = this.returnActiveMode;
        const col = allColours[varName][mode];
        if (col) return col;
      }

      // Unknown variable
      const rootStyle = getComputedStyle(document.documentElement);
      const variableValue = rootStyle.getPropertyValue(varName).trim();
      if (!variableValue) return '#b500ff';
      return variableValue;
    },

    /**
     * Returns the value for the given colour mode (light / dark)
     *
     * @since 3.2.13
     */
    returnActiveMode() {
      if (!this.uipApp.data.userPrefs.darkTheme) return 'value';
      if (this.uipApp.data.userPrefs.darkTheme) return 'darkValue';
    },
    /**
     * Checks if browser supports eyedropper
     *
     * @returns {boolean}
     * @since 0.0.1
     */
    hasEyeDropper() {
      if (!window.EyeDropper) return false;
      return true;
    },
  },
  methods: {
    /**
     * Prevents over dragging
     *
     * @param {Object} evt - drag event
     * @since 0.0.1
     */
    preventOverDrag(evt) {
      this.dragging = true;
    },

    /**
     * Blocks colour from updating while dragging (stops history overload)
     *
     * @param {Object} evt - drag event
     * @since.0.0.1
     */
    allowColorReturn(evt) {
      this.dragging = false;
      this.returnData(this.color);
    },

    /**
     * Sets background colour from colour object
     *
     * @param {Object} d - colour object from picker
     * @since 0.0.1
     */
    setBackgroundColor(d) {
      this.color = d.cssColor;
      this.setOpacity();
    },

    /**
     * Gets current opacity from alpha slider
     *
     * @since 0.0.1
     */
    setOpacity() {
      if (!this.$refs.colorpicker) return '100';

      let picker = this.$refs.colorpicker.querySelector('#color-picker-alpha-slider');
      if (picker) {
        let val = picker.value;
        this.opacity = val;
      }
    },
    /**
     * Gets current opacity from alpha slider
     *
     * @since 0.0.1
     */
    updateOpacity() {
      if (!this.$refs.colorpicker) return;
      if (!this.opacity) return;
      let picker = this.$refs.colorpicker.querySelector('#color-picker-alpha-slider');
      if (picker) {
        picker.value = this.opacity;
        picker.dispatchEvent(new Event('input', { bubbles: true }));
      }
    },
    /**
     * Starts color picker
     *
     * @since 0.0.1
     */
    startColorPicker() {
      const eyeDropper = new EyeDropper();

      eyeDropper.open().then((result) => {
        this.color = result.sRGBHex;
      });
    },

    /**
     * Catches nested new screen requests and emits them back up the chain
     *
     * @param {Object} d - the new screen object
     * @since 0.0.1
     */
    processScreen(d) {
      this.$emit('request-screen', d);
    },
    /**
     * Sets color from variable and returns variable css name
     *
     * @param {Object} color - the color object
     * @since 0.0.1
     */
    setColorFromVar(color) {
      this.color = color.value;
      this.returnData(color.name);
    },
  },

  template: `
  
	  <div class="" ref="colorpicker">
	
		<!--Catches overdrag and prevents dropdowns from closing-->
		<div v-if="dragging" @click.stop.prevent="dragging = false" @mouseup.stop.prevent="dragging = false" style="position:fixed;left:0;right:0;top:0;bottom:0"></div>
		
		<colorSelect
		:color="returnColor"
		default-format="hex" 
		@mouseup="allowColorReturn"
		@mousedown="preventOverDrag"
		@click="dragging=false"
		@color-change="setBackgroundColor"/>
		
		<div class="uip-flex uip-gap-xs">
		  <input @input="returnData(color)" class="uip-input uip-flex-grow" type="text" @focus="dontProcessVars = true" @blur="dontProcessVars = false" v-model="color" placeholder="#4776cd">
	  
		  <div class="uip-flex uip-flex-center uip-background-muted uip-border-rounder uip-padding-xxs">
			  <input class="uip-text-s uip-blank-input uip-w-30 uip-remove-steps" 
			  type="number" min="0" max="100" step="1" v-model="opacity">
			  <span class="uip-text-s">%</span>
		  </div>
		  
		  
		  <button v-if="hasEyeDropper" @click="startColorPicker" class="uip-button-default uip-flex uip-flex-center uip-padding-xxs">
			<span class="uip-icon">colorize</span>
		  </button>
		  
		</div>
		
		<!--Styles-->
		<div v-if="hasStyleManager" class="uip-border-top uip-margin-top-s uip-margin-bottom-s"></div>
		
		<styleManager v-if="hasStyleManager" :currentColor="color" :actualValue="value" @request-screen="(d) => {processScreen(d)}" @go-back="$emit('go-back')" :returnData="setColorFromVar"/>
	
		
	  </div>
		`,
};
