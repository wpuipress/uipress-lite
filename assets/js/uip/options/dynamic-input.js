const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      open: false,
      input: {
        string: '',
        dynamicPos: 'left',
      },
      dynamics: this.uipData.dynamicOptions,
      strings: {
        dynamicData: __('Dynamic data', 'uipress-lite'),
        currentValue: __('Current value', 'uipress-lite'),
        select: __('select', 'uipress-lite'),
        dataPos: __('Dynamic data position', 'uipress-lite'),
      },
      positionOptions: {
        left: {
          label: __('Left', 'uipress-lite'),
          value: 'left',
          placeHolder: '',
        },
        right: {
          label: __('Right', 'uipress-lite'),
          value: 'right',
          placeHolder: '',
        },
      },
    };
  },
  inject: ['uipData', 'uipress'],
  watch: {
    input: {
      handler(newValue, oldValue) {
        const data = { string: this.input.string, dynamic: this.input.dynamic, dynamicKey: this.input.dynamicKey, dynamicPos: this.input.dynamicPos, dynamicType: 'text' };
        this.returnData(data);
      },
      deep: true,
    },
  },
  mounted() {
    this.formatValue(this.value);
  },
  methods: {
    /**
     * Injects input value
     *
     * @since 3.2.13
     */
    formatValue() {
      if (!this.uipress.isObject(this.value)) return;
      this.input = { ...this.input, ...this.value };
    },

    /**
     * Chooses an item
     *
     * @param {Object} item - the selected option
     * @since 3.2.13
     */
    chooseItem(item) {
      // Already selected
      if (item.key == this.input.dynamicKey) return;

      this.input.dynamic = true;
      this.input.dynamicKey = item.key;

      this.returnData({ string: this.input.string, dynamic: this.input.dynamic, dynamicKey: this.input.dynamicKey, dynamicPos: this.input.dynamicPos });
    },

    /**
     * Removes a dynamic item and returns data
     *
     * @since 3.2.13
     */
    removeDynamicItem() {
      this.input.dynamic = false;
      this.input.dynamicKey = '';

      this.returnData({ string: this.input.string, dynamic: this.input.dynamic, dynamicKey: this.input.dynamicKey, dynamicPos: this.input.dynamicPos });
    },
  },
  template: `
    
    <div class="uip-flex uip-gap-xxs uip-w-100p uip-flex-wrap">
    
        <!--Old dynamic data only show if data has been set-->
        <dropdown pos="left center" v-if="input.dynamic"
        :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
        
            <template #trigger>
                <span class="uip-border-rounder uip-text-l uip-flex uip-icon uip-padding-xxxs uip-text-center uip-link-default uip-background-muted"
                :class="{'uip-background-primary uip-text-inverse' : this.input.dynamic}">
                  database
                </span>
            </template>
            
            <template #content>
              <div class="uip-padding-xs uip-max-w-260">
                <div class="uip-flex uip-flex-wrap uip-flex-start uip-gap-xs uip-row-gap-xs uip-w-250 uip-max-h-200 uip-scrollbar uip-overflow-auto">
                  <template v-for="dynamic in dynamics">
                   <div v-if="dynamic.type == 'text'" class="uip-border-round hover:uip-background-muted uip-border-round uip-padding-xxs uip-flex uip-flex-between uip-flex-center uip-flex-middle uip-cursor-pointer uip-w-100p"  :class="{'uip-background-primary-wash' : this.input.dynamicKey == dynamic.key}">
                     <div class="">
                      <div class="uip-text-s uip-text-bold">{{dynamic.label}}</div>
                      <div class="uip-text-xs uip-text-muted">{{strings.currentValue + ': ' + dynamic.value}}</div>
                     </div>
                     <span v-if="this.input.dynamicKey == dynamic.key" @click="removeDynamicItem()"
                     class="uip-padding-xxs uip-border-round uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center">
                      <span class="uip-icon">delete</span>
                     </span>
                     <span v-else @click="chooseItem(dynamic)"
                      class="uip-padding-xxs uip-border-round uip-background-muted hover:uip-background-grey uip-cursor-pointer uip-flex uip-flex-middle uip-flex-center">
                       {{strings.select}}
                      </span>
                   </div>
                  </template>
                </div>
              </div>
            </template>
            
        </dropdown>
                
        
        <input type="text" class="uip-input-small uip-border-left-remove uip-flex-grow"  v-model="input.string">
        
        
        <div v-if="input.dynamic" class="uip-w-100p">
          <div class="uip-text-s uip-text-muted uip-margin-bottom-xxs uip-margin-top-xs">
            {{strings.dataPos}}
          </div>
          <div>
            <toggle-switch :options="positionOptions" :activeValue="input.dynamicPos" :returnValue="function(data){ input.dynamicPos = data}"></toggle-switch>
          </div>
        </div>
        
    </div>
        `,
};
