const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    colorBox: defineAsyncComponent(() => import('../v3.5/utility/color-box.min.js?ver=3.2.12')),
  },
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      outlineOptions: {
        width: {
          value: '',
          units: 'px',
        },
        offset: {
          value: '',
          units: 'px',
        },
        style: 'solid',
        color: {
          type: 'solid',
          value: '',
        },
      },
      strings: {
        topleft: __('Top left', 'uipress-lite'),
        topright: __('Top right', 'uipress-lite'),
        bottomleft: __('Bottom left', 'uipress-lite'),
        bottomright: __('Bottom right', 'uipress-lite'),
        colour: __('Colour', 'uipress-lite'),
        style: __('Style', 'uipress-lite'),
        width: __('Width', 'uipress-lite'),
        offset: __('Offset', 'uipress-lite'),
        outlineColour: __('Outline colour', 'seql'),
      },
      borderTypes: [
        {
          label: __('Solid', 'uipress-lite'),
          value: 'solid',
        },
        {
          label: __('Dashed', 'uipress-lite'),
          value: 'dashed',
        },
        {
          label: __('Dotted', 'uipress-lite'),
          value: 'dotted',
        },
        {
          label: __('Double', 'uipress-lite'),
          value: 'double',
        },
        {
          label: __('Groove', 'uipress-lite'),
          value: 'groove',
        },
        {
          label: __('Ridge', 'uipress-lite'),
          value: 'ridge',
        },
        {
          label: __('Inset', 'uipress-lite'),
          value: 'inset',
        },
      ],
    };
  },
  inject: ['uipress'],
  watch: {
    outlineOptions: {
      handler(newValue, oldValue) {
        this.returnData(newValue);
      },
      deep: true,
    },
  },
  mounted() {
    this.formatValue();
  },
  computed: {
    /**
     * Returns the shadow color as a background css style
     *
     * @since 3.2.13
     */
    returnOutlineColor() {
      if (!this.outlineOptions.color.value) return;
      if (this.outlineOptions.color.value.startsWith('--')) {
        return `background-color:var(${this.outlineOptions.color.value})`;
      }
      return `background-color:${this.outlineOptions.color.value}`;
    },

    /**
     * Returns a new fill screen for border colour
     *
     * @since 3.2.13
     */
    returnFillScreen() {
      return {
        component: 'ColorPicker',
        label: this.strings.outlineColour,
        value: this.outlineOptions.color.value,
        returnData: (d) => {
          if (d.startsWith('--')) {
            this.outlineOptions.color.type = 'variable';
          } else {
            this.outlineOptions.color.type = 'solid';
          }
          this.outlineOptions.color.value = d;
        },
      };
    },
  },
  methods: {
    /**
     * Injects value to component
     *
     * @since 3.2.13
     */
    formatValue() {
      if (!this.isObject(this.value)) return;
      this.outlineOptions = { ...this.outlineOptions, ...this.value };
    },
  },
  template: `
    
    
    <div class="uip-grid-col-1-3">
    
    
      <!--Color -->
      
      <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.colour}}</span></div>
      
      <colorBox @click="$emit('request-screen', returnFillScreen)"
      :backgroundStyle="returnOutlineColor" :text="outlineOptions.color.value" :remove="()=>{outlineOptions.color = {}}"/>
        
      
      
      <!--Style -->
      
      <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.style}}</span></div>
      <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="outlineOptions.style">
        <template v-for="item in borderTypes">
          <option :value="item.value">{{item.label}}</option>
        </template>
      </select>
    
      
      <!--Width -->
      
      <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.width}}</span></div>
      
      <value-units :value="outlineOptions.width" :returnData="function(data){outlineOptions.width = data}" class="uip-w-100p"></value-units>
      
        
      
      
      <!--offset -->
      <div class="uip-text-muted uip-flex uip-flex-center"><span>{{strings.offset}}</span></div>
      
      <value-units :value="outlineOptions.offset" :returnData="function(data){outlineOptions.offset = data}" class="uip-w-100p"></value-units>
      
      
        
          
    </div>`,
};
