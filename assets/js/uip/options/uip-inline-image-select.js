const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    imageSelect: defineAsyncComponent(() => import('./uip-image-select.min.js?ver=3.2.12')),
    colorBox: defineAsyncComponent(() => import('../v3.5/utility/color-box.min.js?ver=3.2.12')),
  },
  props: {
    returnData: Function,
    value: Object,
    args: Object,
  },
  data: function () {
    return {
      img: {
        url: '',
        dynamic: false,
        dynamicKey: '',
        loading: false,
        sizing: {},
      },
      strings: {
        imageSelect: __('Image select', 'seql'),
      },
    };
  },
  inject: ['uipress'],
  watch: {
    img: {
      handler(newValue, oldValue) {
        this.returnData(this.img);
      },
      deep: true,
    },
  },
  mounted: function () {
    this.formatInput(this.value);
  },
  computed: {
    /**
     * Returns a formatted background-image CSS rule if an image URL exists.
     *
     * @returns {string} - The background-image CSS rule or an empty string.
     *
     * @since x.x.x
     */
    returnBackgroundImage() {
      if (this.img.url) return `background-image: url(${this.img.url})`;
    },
    /**
     * Returns the curent value
     *
     * @since 3.2.13
     */
    returnValue() {
      return this.value;
    },
    /**
     * Resets the image object
     *
     * @since 3.2.13
     */
    imgReset() {
      return {
        url: '',
        dynamic: false,
        dynamicKey: '',
        loading: false,
        sizing: {},
      };
    },
  },
  methods: {
    /**
     * Formats the given input value. If the input is an object,
     * it merges the object with the `img` property of the instance.
     *
     * @param {any} value - The input value to format.
     * @returns {void}
     *
     * @since x.x.x
     */
    formatInput(value) {
      // Check for undefined values
      if (typeof value === 'undefined') return;

      // Check if the input is an object and merge it with the `img` property
      if (this.uipress.isObject(value)) {
        this.img = { ...this.img, ...this.returnValue };
        return;
      }
    },
  },
  template: `
        <dropdown pos="left center"  class="uip-w-100p" ref="imageDropdown">
        
          <template v-slot:trigger>
          
            <colorBox :backgroundStyle="returnBackgroundImage" :text="img.url" :remove="()=>{img = imgReset}"/>
            
          </template>
          
          <template v-slot:content>
          
            <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
            
              <div class="uip-flex uip-flex-between uip-flex-center">
                <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.imageSelect}}</div>
                <div @click="$refs.imageDropdown.close()"
                class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                  <span class="uip-icon">close</span>
                </div>
              </div> 
              
              <imageSelect :value="img" :returnData="(d)=>{img = d}" :args="args"/>
            
            </div>
            
          </template>
        </dropdown>`,
};
