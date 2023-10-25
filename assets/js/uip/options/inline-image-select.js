const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm.js';
export default {
  components: {
    imageSelect: defineAsyncComponent(() => import('../v3.5/styles/image-select.min.js?ver=3.3.00')),
    colorBox: defineAsyncComponent(() => import('../v3.5/utility/color-box.min.js?ver=3.3.00')),
  },
  props: {
    returnData: Function,
    value: Object,
    args: Object,
  },
  data() {
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
  
  watch: {
    img: {
      handler(newValue, oldValue) {
        this.returnData(this.img);
      },
      deep: true,
    },
  },
  mounted() {
    this.formatInput();
  },
  computed: {
    /**
     * Returns a formatted background-image CSS rule if an image URL exists.
     *
     * @returns {string} - The background-image CSS rule or an empty string.
     *
     * @since 3.2.13
     */
    returnBackgroundImage() {
      if (this.img.url) return `background-size:contain;background-image: url(${this.img.url})`;
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
     * Injects value to component
     *
     * @returns {void}
     *
     * @since 3.2.13
     */
    formatInput() {
      if (!this.isObject(this.value)) return;
      this.img = { ...this.img, ...this.value };
    },
  },
  template: `
        <dropdown pos="left center"  class="uip-w-100p" ref="imageDropdown" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
        
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
