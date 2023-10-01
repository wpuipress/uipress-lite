const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../../libs/vue-esm-dev.js';
export default {
  components: {
    mediaLibrary: defineAsyncComponent(() => import('../utility/media-library.min.js?ver=3.2.12')),
  },
  props: {
    returnData: Function,
    value: Object,
    args: Object,
  },
  data() {
    return {
      open: false,
      loading: true,
      hasPositioning: true,
      img: {
        url: '',
        dynamic: false,
        dynamicKey: '',
        loading: false,
        sizing: {},
      },
      dynamics: this.uipApp.data.dynamicOptions,
      maxUpload: this.uipApp.data.options.maxUpload,
      fileTypes: this.uipApp.data.options.uploadTypes,
      fileType: '',
      manualURL: '',
      uploading: false,
      strings: {
        dynamicData: __('Dynamic data', 'uipress-lite'),
        currentValue: __('Current value', 'uipress-lite'),
        select: __('select', 'uipress-lite'),
        dataPos: __('Dynamic data position', 'uipress-lite'),
        replace: __('Replace', 'uipress-lite'),
        edit: __('Edit', 'uipress-lite'),
        upload: __('Upload', 'uipress-lite'),
        uploading: __('Uploading', 'uipress-lite'),
        library: __('Library', 'uipress-lite'),
        dynamic: __('Dynamic', 'uipress-lite'),
        chooseImage: __('Add image', 'uipress-lite'),
        backgroundImage: __('Image', 'uipress-lite'),
        addImage: __('Add image', 'uipress-lite'),
        url: __('URL', 'uipress-lite'),
      },
    };
  },
  inject: [ 'uipress'],
  watch: {
    img: {
      handler(newValue, oldValue) {
        this.returnData(this.img);
      },
      deep: true,
    },
    manualURL: {
      handler(newValue, oldValue) {
        if (newValue != '') {
          this.removeDynamicItem();
          this.img.url = newValue;
        }
      },
    },
  },
  mounted() {
    console.log('mounted');
    this.formatInput(this.value);

    if (this.args) {
      if (this.isObject(this.args)) {
        if ('hasPositioning' in this.args) {
          this.hasPositioning = this.args.hasPositioning;
        }
      }
    }
  },
  computed: {
    returnValue() {
      return this.value;
    },
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
    formatInput(value) {
      if (typeof value === 'undefined') {
        return;
      }
      if (this.isObject(value)) {
        this.img = { ...this.img, ...this.returnValue };
        return;
      }
    },
    /**
     * Opens the media library and waits for user selection
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async chooseImage() {
      const media = await this.$refs.mediaLibrary.show();
      if (media) {
        this.img.url = media.source_url;
      }
    },
    chooseItem(item) {
      this.img.dynamic = true;
      this.img.dynamicType = 'img';
      this.img.dynamicKey = item.key;
      this.img.url = item.value;

      this.returnData({ url: this.img.value, dynamic: this.img.dynamic, dynamicKey: this.img.dynamicKey, dynamicPos: this.img.dynamicPos });
    },
    removeDynamicItem() {
      this.img.dynamic = false;
      this.img.dynamicKey = '';
      this.img.url = '';

      this.returnData({ url: this.img.value, dynamic: this.img.dynamic, dynamicKey: this.img.dynamicKey, dynamicPos: this.img.dynamicPos });
    },
    returnBackgroundImage() {
      let img = this.img.url;
      if (img) {
        return `background-image: url(${img})`;
      }
      return '';
    },
  },
  template: `
            
            <div class="uip-flex uip-flex-column uip-row-gap-s">
              
              <div class="uip-background-muted uip-border-rounder uip-flex uip-flex-center uip-flex-middle uip-position-relative uip-scale-in-center uip-h-120 uip-w-240 uip-background-contain uip-background-no-repeat  uip-background-center" :style="returnBackgroundImage()">
                
                  
                <button @click="chooseImage()" class="uip-button-primary uip-text-s">
                  <div v-if="img.url" class="uip-text-bold">{{strings.replace}}</div>
                  <div v-if="!img.url" class="uip-flex uip-gap-xxs uip-flex-center">
                    <div class="uip-icon uip-icon-medium">add</div>
                    <div class="uip-text-bold">{{strings.chooseImage}}</div>
                  </div>
                </button>  
                
              </div>
              
              
              <div class="uip-padding-left-xs uip-flex uip-flex-column uip-row-gap-xs">
              
                <div class="uip-grid-col-1-3">
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.url}}</span></div>
                    
                  <input class="uip-input uip-input-small" type="text" v-model="img.url">
                  
                </div>
                
                <background-position v-if="hasPositioning" :value="img.sizing" :returnData="function(d){img.sizing = d}"></background-position>
              </div>
              
              <mediaLibrary ref="mediaLibrary"/>
              
            </div>
        
        
        `,
};
