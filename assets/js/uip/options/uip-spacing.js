const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    returnData: Function,
    value: Object,
  },
  data() {
    return {
      spacing: {
        padding: {
          preset: '0',
          sync: true,
          units: 'px',
        },
        margin: {
          preset: '0',
          sync: true,
          units: 'px',
        },
      },
      padding: {
        preset: '0',
      },
      strings: {
        right: __('Right', 'uipress-lite'),
        left: __('Left', 'uipress-lite'),
        top: __('Top', 'uipress-lite'),
        bottom: __('Bottom', 'uipress-lite'),
        custom: __('Custom', 'uipress-lite'),
        padding: __('Paddding', 'uipress-lite'),
        margin: __('Margin', 'uipress-lite'),
      },
      spacingOptions: {
        0: {
          value: '0',
          label: '0',
          tip: __('Remove', 'uipress-lite'),
        },
        XS: {
          value: 'XS',
          label: 'XS',
          tip: __('Extra small', 'uipress-lite'),
        },
        S: {
          value: 'S',
          label: 'S',
          tip: __('Small', 'uipress-lite'),
        },
        M: {
          value: 'M',
          label: 'M',
          tip: __('Medium', 'uipress-lite'),
        },
        L: {
          value: 'L',
          label: 'L',
          tip: __('Large', 'uipress-lite'),
        },
        XL: {
          value: 'XL',
          label: 'XL',
          tip: __('Extra large', 'uipress-lite'),
        },
        custom: {
          value: 'custom',
          icon: 'more_vert',
          tip: __('Custom', 'uipress-lite'),
        },
      },
    };
  },
  inject: ['uipress'],
  mounted() {
    this.formatValue();
  },
  watch: {
    /**
     * Watches options and returns to caller on change
     *
     * @since 3.2.13
     */
    spacing: {
      handler(newValue, oldValue) {
        this.maybeSyncSides();
      },
      deep: true,
    },
  },
  methods: {
    /**
     * Syncs sides of padding / margin when sync is on
     *
     * @since 3.2.13
     */
    maybeSyncSides() {
      if (this.spacing.padding.sync == true) {
        this.spacing.padding.right = this.spacing.padding.left;
        this.spacing.padding.top = this.spacing.padding.left;
        this.spacing.padding.bottom = this.spacing.padding.left;
      }

      if (this.spacing.margin.sync == true) {
        this.spacing.margin.right = this.spacing.margin.left;
        this.spacing.margin.top = this.spacing.margin.left;
        this.spacing.margin.bottom = this.spacing.margin.left;
      }

      this.returnData(this.spacing);
    },

    /**
     * Injects props value into component
     *
     * @since 3.2.13
     */
    formatValue(value) {
      if (!this.uipress.isObject(this.value)) return;

      // Update padding
      if ('padding' in this.value) {
        this.spacing.padding = { ...this.spacing.padding, ...this.value.padding };
      }

      // Update margin
      if ('margin' in this.value) {
        this.spacing.margin = { ...this.spacing.margin, ...this.value.margin };
      }

      switch (this.spacing.margin.preset) {
        case 'remove':
          this.spacing.margin.preset = '0';

        case 'small':
          this.spacing.margin.preset = 'S';

        case 'medium':
          this.spacing.margin.preset = 'M';

        case 'large':
          this.spacing.margin.preset = 'L';
      }

      switch (this.spacing.padding.preset) {
        case 'remove':
          this.spacing.padding.preset = '0';

        case 'small':
          this.spacing.padding.preset = 'S';

        case 'medium':
          this.spacing.padding.preset = 'M';

        case 'large':
          this.spacing.padding.preset = 'L';
      }
    },
  },
  template: `
    
    
    <div class="uip-flex uip-flex-column uip-row-gap-xs">
    
    
      <!--Padding -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.padding}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
        
          <toggle-switch :options="spacingOptions" :activeValue="spacing.padding.preset" :returnValue="function(data){ spacing.padding.preset = data}"></toggle-switch>
      
        </div>
        
        <!--Spacer -->
        <div></div>
        
        <div v-if="spacing.padding.preset == 'custom'">
          <div class="uip-flex uip-flex-row uip-gap-xxxs uip-row-gap-xs uip-flex-wrap uip-flex-right uip-w-100p">
          
            <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-rounder">
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-rounder" @click="spacing.padding.sync = true"
              :class="{'uip-background-default uip-text-emphasis' : spacing.padding.sync}">crop_square</div>
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-rounder" @click="spacing.padding.sync = false"
              :class="{'uip-background-default uip-text-emphasis' : !spacing.padding.sync}">crop_free</div>
            </div>
          
            <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center uip-flex-grow" v-if="spacing.padding.sync">
                <input class="uip-blank-input uip-text-center uip-w-60 uip-text-s" v-model="spacing.padding.left" >
            </div>
            
            <div class="uip-background-muted uip-border-rounder">
             <units-select :value="spacing.padding.units" :returnData="function(e){spacing.padding.units = e}"></units-select>
            </div>
          
            <div v-if="!spacing.padding.sync" class="uip-flex uip-flex-row uip-gap-xxxs">
          
              
              <uip-tooltip :message="strings.top" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="spacing.padding.top" >
                </div>
              </uip-tooltip>
            
              <uip-tooltip :message="strings.right" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="spacing.padding.right" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.bottom" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center" >
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="spacing.padding.bottom" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.left" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="spacing.padding.left" >
                </div>
              </uip-tooltip>
              
            </div>
        
          
          </div>
        </div>
        
      </div>
      
      
      
      
      
      
      <!--Margin section-->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.margin}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
        
          <toggle-switch :options="spacingOptions" :activeValue="spacing.margin.preset" :returnValue="function(data){ spacing.margin.preset = data}"></toggle-switch>
      
        </div>
        
        <!--Spacer -->
        <div></div>
        
        <div v-if="spacing.margin.preset == 'custom'">
          <div class="uip-flex uip-flex-row uip-gap-xxxs uip-row-gap-xs uip-flex-wrap uip-flex-right uip-w-100p">
          
            <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-rounder">
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-rounder" @click="spacing.margin.sync = true"
              :class="{'uip-background-default uip-text-emphasis' : spacing.margin.sync}">crop_square</div>
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted  uip-border-rounder" @click="spacing.margin.sync = false"
              :class="{'uip-background-default uip-text-emphasis' : !spacing.margin.sync}">crop_free</div>
            </div>
          
            <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center uip-flex-grow" v-if="spacing.margin.sync">
                <input class="uip-blank-input uip-text-center uip-w-60 uip-text-s" v-model="spacing.margin.left" >
            </div>
            
            <div class="uip-background-muted uip-border-rounder">
             <units-select :value="spacing.margin.units" :returnData="function(e){spacing.margin.units = e}"></units-select>
            </div>
          
            <div v-if="!spacing.margin.sync" class="uip-flex uip-flex-row uip-gap-xxxs">
          
              
              <uip-tooltip :message="strings.top" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="spacing.margin.top" >
                </div>
              </uip-tooltip>
            
              <uip-tooltip :message="strings.right" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="spacing.margin.right" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.bottom" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center" >
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="spacing.margin.bottom" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.left" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="spacing.margin.left" >
                </div>
              </uip-tooltip>
              
            </div>
        
          
          </div>
        </div>
        
      </div>
    
    </div>
    
    `,
};
