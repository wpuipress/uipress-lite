const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent } from '../../libs/vue-esm-dev.js';
export default {
  components: {
    IconPicker: defineAsyncComponent(() => import('../v3.5/styles/icon-picker.min.js')),
  },
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      icon: {
        value: '',
      },
      strings: {
        add: __('Add', 'uipress-lite'),
        iconSelect: __('Icon select', 'uipress-lite'),
      },
    };
  },
  inject: ['uipress'],
  watch: {
    icon: {
      handler(newValue, oldValue) {
        this.returnData(newValue);
      },
      deep: true,
    },
  },
  mounted: function () {
    this.formatIcon(this.value);
  },
  computed: {
    /**
     * Returns icon if set, otherwise returns 'category'
     *
     * @since 3.2.13
     */
    returnIcon() {
      if (this.icon.value) return this.icon.value;
      return 'category';
    },
  },
  methods: {
    /**
     * Formats icon input
     *
     * @param {mixed} value - Usualy object of the icon value
     * @since 3.2.13
     */
    formatIcon(value) {
      if (this.uipress.isObject(value)) {
        this.icon = { ...this.icon, ...value };
      }
    },
  },
  template: `
    
        <dropdown pos="left center" class="uip-w-100p" ref="iconselect" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
        
            <template #trigger>
                
                <div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-flex uip-flex-center uip-gap-xs uip-cursor-pointer">
                
                  <div class="uip-background-primary uip-text-inverse uip-border-round uip-padding-xxxs">
                    <span class="uip-icon">{{ returnIcon }}</span>
                  </div>
                  
                  <div v-if="!icon.value" class="uip-text-muted uip-flex-grow">{{strings.add}}...</div>
                  
                  <div v-else class="uip-no-wrap uip-text-ellipsis uip-overflow-hidden uip-w-80 uip-flex-grow">{{ icon.value }}</div>
                  
                  <a @click.stop.prevent="icon.value = ''"
                  class="uip-no-underline uip-border-rounder uip-padding-xxxs uip-link-muted uip-text-s">
                  <span class="uip-icon">close</span>
                  </a>
                  
                </div>
                
            </template>
            
            <template #content>
            
              <div class="uip-w-240 uip-padding-s uip-flex uip-row-gap-s uip-flex-column">
              
                <div class="uip-flex uip-flex-between uip-flex-center">
                  <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.iconSelect}}</div>
                  
                  <div @click="$refs.iconselect.close()" 
                  class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                    <span class="uip-icon">close</span>
                  </div>
                </div>
                
                <IconPicker :value="icon.value" :returnData="(d)=>{icon.value=d}"/>
                
              </div>
            </template>
            
        </dropdown>
        
      
      `,
};
