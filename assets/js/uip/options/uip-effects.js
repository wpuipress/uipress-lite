const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        options: {
          transform: {
            translateX: { value: '', units: 'px' },
            translateY: { value: '', units: 'px' },
            scaleX: '',
            scaleY: '',
            rotateX: '',
            rotateY: '',
            rotateZ: '',
            skewX: '',
            skewY: '',
            cursor: 'auto',
          },
          filters: {
            //Filters
            mixBlendMode: '',
            grayscale: '',
            blur: '',
            saturate: '',
            contrast: '',
            backdropBlur: '',
          },
          transitionType: '',
          transitionTime: '',
          transitionDelay: '',
        },
        loading: true,
        verticalAlignOptions: {
          none: {
            value: 'none',
            icon: 'block',
            tip: __('None', 'uipress-lite'),
          },
          top: {
            value: 'top',
            icon: 'align_vertical_top',
            tip: __('Top', 'uipress-lite'),
          },
          center: {
            value: 'center',
            icon: 'align_vertical_center',
            tip: __('Center', 'uipress-lite'),
          },
          bottom: {
            value: 'bottom',
            icon: 'align_vertical_bottom',
            tip: __('Bottom', 'uipress-lite'),
          },
        },
        mixBlendModes: [
          {
            label: __('Normal', 'uipress-lite'),
            value: 'normal',
          },
          {
            label: __('Multiply', 'uipress-lite'),
            value: 'multiply',
          },
          {
            label: __('Screen', 'uipress-lite'),
            value: 'screen',
          },
          {
            label: __('Overlay', 'uipress-lite'),
            value: 'overlay',
          },
          {
            label: __('Darken', 'uipress-lite'),
            value: 'darken',
          },
          {
            label: __('Lighten', 'uipress-lite'),
            value: 'lighten',
          },
          {
            label: __('Color dodge', 'uipress-lite'),
            value: 'color-dodge',
          },
          {
            label: __('Color burn', 'uipress-lite'),
            value: 'color-burn',
          },
          {
            label: __('Hard light', 'uipress-lite'),
            value: 'hard-light',
          },
          {
            label: __('Soft light', 'uipress-lite'),
            value: 'soft-light',
          },
          {
            label: __('Difference', 'uipress-lite'),
            value: 'difference',
          },
          {
            label: __('Exclusion', 'uipress-lite'),
            value: 'exclusion',
          },
          {
            label: __('Hue', 'uipress-lite'),
            value: 'hue',
          },
          {
            label: __('Saturation', 'uipress-lite'),
            value: 'saturation',
          },
          {
            label: __('Color', 'uipress-lite'),
            value: 'color',
          },
          {
            label: __('Luminosity', 'uipress-lite'),
            value: 'luminosity',
          },
          {
            label: __('Initial', 'uipress-lite'),
            value: 'initial',
          },
          {
            label: __('Inherit', 'uipress-lite'),
            value: 'Inherit',
          },
          {
            label: __('Unset', 'uipress-lite'),
            value: 'Unset',
          },
        ],
        transitionTypes: [
          {
            label: __('Linear', 'uipress-lite'),
            value: 'linear',
          },
          {
            label: __('Ease', 'uipress-lite'),
            value: 'ease',
          },
          {
            label: __('Ease in', 'uipress-lite'),
            value: 'ease-in',
          },
          {
            label: __('Ease in out', 'uipress-lite'),
            value: 'ease-in-out',
          },
          {
            label: __('Ease out', 'uipress-lite'),
            value: 'ease-out',
          },
          {
            label: __('Out sine', 'uipress-lite'),
            value: 'cubic-bezier(0.39, 0.58, 0.57, 1)',
          },
          {
            label: __('Out quadratic', 'uipress-lite'),
            value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          },
          {
            label: __('Back out', 'uipress-lite'),
            value: 'cubic-bezier(0.18, 0.89, 0.32, 1.28)',
          },
        ],

        cursorTypes: [
          'auto',
          'default',
          'none',
          'context-menu',
          'help',
          'pointer',
          'progress',
          'wait',
          'cell',
          'crosshair',
          'text',
          'vertical-text',
          'alias',
          'copy',
          'move',
          'no-drop',
          'not-allowed',
          'all-scroll',
        ],
        resizeCursors: [
          'col-resize',
          'row-resize',
          'n-resize',
          'e-resize',
          's-resize',
          'w-resize',
          'ns-resize',
          'ew-resize',
          'ne-resize',
          'nw-resize',
          'se-resize',
          'sw-resize',
          'nesw-resize',
          'nwse-resize',
        ],

        strings: {
          transform: __('Transform', 'uipress-lite'),
          translate: __('Translate', 'uipress-lite'),
          scale: __('Scale', 'uipress-lite'),
          rotate: __('Rotate', 'uipress-lite'),
          skew: __('Skew', 'uipress-lite'),
          settings: __('Settings', 'uipress-lite'),
          filters: __('Filters', 'uipress-lite'),
          //Filters
          mixBlendMode: __('Mix blend mode', 'uipress-lite'),
          grayscale: __('Grayscale', 'uipress-lite'),
          blur: __('Blur', 'uipress-lite'),
          saturate: __('Saturate', 'uipress-lite'),
          contrast: __('Contrast', 'uipress-lite'),
          backdropBlur: __('Backdrop blur', 'uipress-lite'),
          transitionType: __('Ease', 'uipress-lite'),
          transitionTime: __('Time', 'uipress-lite'),
          transitionDelay: __('Delay', 'uipress-lite'),
          cursor: __('Cursor', 'uipress-lite'),
          general: __('General', 'uipress-lite'),
          resizing: __('Resizing', 'uipress-lite'),
        },
      };
    },
    inject: ['uipress'],
    watch: {
      options: {
        handler(newValue, oldValue) {
          this.returnData(this.options);
        },
        deep: true,
      },
    },
    mounted: function () {
      this.processInput(this.value);
    },
    methods: {
      processInput(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          this.options = { ...this.options, ...value };
          if ('transform' in value) {
            this.options.transform = { ...this.options.transform, ...value.transform };
          }
          if ('filters' in value) {
            this.options.filter = { ...this.options.filter, ...value.filters };
          }
          return;
        }
      },
      formatNumber(value) {
        if (value == '') {
          return 0;
        }

        return parseFloat(value);
      },
    },
    template: `
    
    <div class="uip-flex uip-flex-column uip-row-gap-s">
    
    
      
    
      <!--Transform -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.transform}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <dropdown pos="left center" triggerClass="uip-flex uip-flex-grow uip-w-100p" containerClass="uip-flex uip-flex-grow uip-w-100p" :dontAnimate="true">
            <template v-slot:trigger>
              <button class="uip-button-default uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p uip-flex uip-gap-xxs uip-flex-center uip-flex-middle">
              
                <span class="uip-icon">add</span>
                <span v-if="options.transform.translateX.value">{{options.transform.translateX.value}},</span>
                <span v-if="options.transform.translateY.value">{{options.transform.translateY.value}},</span>
                <span v-if="options.transform.scaleX">{{options.transform.scaleX}},</span>
                <span v-if="options.transform.scaleY">{{options.transform.scaleY}},</span>
                <span v-if="options.transform.rotateX">{{options.transform.rotateX}},</span>
                <span v-if="options.transform.rotateY">{{options.transform.rotateY}},</span>
                <span v-if="options.transform.rotateZ">{{options.transform.rotateZ}},</span>
                <span v-if="options.transform.skewX">{{options.transform.skewX}},</span>
                <span v-if="options.transform.skewY">{{options.transform.skewY}},</span>
                
              </button>
            </template>
            <template v-slot:content>
              <div class="uip-padding-s uip-border-bottom uip-text-bold">
                {{strings.transform}}
              </div>
              <div class="uip-padding-s uip-min-w-250 uip-flex uip-flex-column uip-gap-xs">
                
                
                <!--translateX -->
                <div class="uip-grid-col-1-3">
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.translate}} X</span></div>
                  
                  <div class="uip-flex uip-flex-center">
                  <value-units :value="options.transform.translateX" :returnData="function(data){options.transform.translateX = data}" />
                  </div>
                  
                
                <!--translateY -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.translate}} Y</span></div>
                  
                  <div class="uip-flex uip-flex-center">
                  <value-units :value="options.transform.translateY" :returnData="function(data){options.transform.translateY = data}"/>
                  </div>
                  
                <!--ScaleX -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.scale}} X</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" step="0.1" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.transform.scaleX">
                    
                    <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.transform.scaleX = (formatNumber(options.transform.scaleX) - 0.1).toFixed(2)">remove</div>
                      <div class="uip-border-right"></div>
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.transform.scaleX = (formatNumber(options.transform.scaleX) + 0.1).toFixed(2)">add</div>
                    </div>
                    
                  </div>
                  
                
                <!--ScaleY -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.scale}} Y</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" step="0.1" style="width: 30px;" v-model="options.transform.scaleY">
                    
                    <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.transform.scaleY = (formatNumber(options.transform.scaleY) - 0.1).toFixed(2)">remove</div>
                      <div class="uip-border-right"></div>
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.transform.scaleY = (formatNumber(options.transform.scaleY) + 0.1).toFixed(2)">add</div>
                    </div>
                    
                  </div>
                  
                
                
                <!--Rotate X -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.rotate}} X (°)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.rotateX">
                    <input type="range" min="-360" max="360" v-model="options.transform.rotateX" step="10" class="uip-range uip-w-100">
                  
                  </div>
                  
                
                <!--Rotate Y -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.rotate}} Y (°)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.rotateY">
                    <input type="range" min="-360" max="360" v-model="options.transform.rotateY" step="10" class="uip-range uip-w-100">
                  
                  </div>
                  
                
                <!--Rotate Z -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.rotate}} Z (°)</span></div>
                   
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.rotateZ">
                    <input type="range" min="-360" max="360" v-model="options.transform.rotateZ" step="10" class="uip-range uip-w-100">
                  
                  </div>
                  
                
                <!--Skew X -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.skew}} X (°)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.skewX">
                    <input type="range" min="-360" max="360" v-model="options.transform.skewX" step="10" class="uip-range uip-w-100">
                  
                  </div>
                  
                
                <!--Skew Y -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.skew}} Y (°)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.skewY">
                    <input type="range" min="-360" max="360" v-model="options.transform.skewY" step="10" class="uip-range uip-w-100">
                  
                  </div>
                  
                </div>
                
              </div>
            </template>
          </dropdown>
        
        </div>
        
      </div>
      
      
      
      
      
      
      <!--Filters -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.filters}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <dropdown pos="left center" triggerClass="uip-flex uip-flex-grow uip-w-100p" containerClass="uip-flex uip-flex-grow uip-w-100p" :dontAnimate="true">
            <template v-slot:trigger>
              <button class="uip-button-default uip-border-rounder uip-padding-xxs uip-link-muted uip-w-100p uip-flex uip-gap-xxs uip-flex-center uip-flex-middle">
              
                
                <span class="uip-icon">add</span>
                <span v-if="options.filters.mixBlendMode">{{options.filters.mixBlendMode}},</span>
                <span v-if="options.filters.grayscale">{{options.filters.grayscale}},</span>
                <span v-if="options.filters.blur">{{options.filters.blur}}px,</span>
                <span v-if="options.filters.saturate">{{options.filters.saturate}},</span>
                <span v-if="options.filters.contrast">{{options.filters.contrast}},</span>
                <span v-if="options.filters.backdropBlur">{{options.filters.backdropBlur}}px,</span>
              
              
              </button>
            </template>
            <template v-slot:content>
              <div class="uip-padding-s uip-border-bottom uip-text-bold">
                {{strings.filters}}
              </div>
              <div class="uip-padding-s uip-min-w-300 uip-flex uip-flex-column uip-gap-xs">
              
              
               
                <div class="uip-grid-col-1-3 uip-w-300">
                
                  <!--mixBlendMode-->
                  
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.mixBlendMode}}</span></div>
                    
                  <div class="uip-position-relative">
                    <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="options.filters.mixBlendMode">
                      <template v-for="item in mixBlendModes">
                        <option :value="item.value">{{item.label}}</option>
                      </template>
                    </select>
                    
                  </div>
                
                
                
                
                <!--grayscale -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.grayscale}}</span></div>
                  
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" step="0.1" style="width: 30px;" v-model="options.filters.grayscale">
                    
                    <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.filters.grayscale = (formatNumber(options.filters.grayscale) - 0.1).toFixed(2)">remove</div>
                      <div class="uip-border-right"></div>
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.filters.grayscale = (formatNumber(options.filters.grayscale) + 0.1).toFixed(2)">add</div>
                    </div>
                    
                  </div>
                  
                
                
                <!--blur -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.blur}} (px)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" max="100" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.filters.blur">
                    <input type="range" min="0" max="100" v-model="options.filters.blur" step="1" class="uip-range uip-w-100">
                  
                  </div>
                
                
                <!--backdropBlur -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.backdropBlur}} (px)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" max="100" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.filters.backdropBlur">
                    <input type="range" min="0" max="100" v-model="options.filters.backdropBlur" step="1" class="uip-range uip-w-100">
                  
                  </div>
                  
                
                
                <!--saturate -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.saturate}}</span></div>
                  
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" step="0.1" style="width: 30px;" v-model="options.filters.saturate">
                    
                    <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.filters.saturate = (formatNumber(options.filters.saturate) - 0.1).toFixed(2)">remove</div>
                      <div class="uip-border-right"></div>
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.filters.saturate = (formatNumber(options.filters.saturate) + 0.1).toFixed(2)">add</div>
                    </div>
                    
                  </div>
                
                
                <!--contrast -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.contrast}}</span></div>
                  
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" step="0.1" style="width: 30px;" v-model="options.filters.contrast">
                    
                    <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.filters.contrast = (formatNumber(options.filters.contrast) - 0.1).toFixed(2)">remove</div>
                      <div class="uip-border-right"></div>
                      <div class="uip-link-muted uip-icon uip-text-l" @click="options.filters.contrast = (formatNumber(options.filters.contrast) + 0.1).toFixed(2)">add</div>
                    </div>
                    
                  </div>
                  
                </div>
                
                
              </div>
            </template>
          </dropdown>
        
        </div>
        
      </div>
      
      
      
      
      
      <!--Transition type -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.transitionType}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
          
          <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="options.transitionType">
            <template v-for="item in transitionTypes">
              <option :value="item.value">{{item.label}}</option>
            </template>
          </select>
          
        </div>
      </div>
      
      
      
      <!--Transition time -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.transitionTime}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <input type="number" min="0" step="0.1" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.transitionTime">
          
          <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
            <div class="uip-link-muted uip-icon uip-text-l" @click="options.transitionTime = (formatNumber(options.transitionTime) - 0.1).toFixed(2)">remove</div>
            <div class="uip-border-right"></div>
            <div class="uip-link-muted uip-icon uip-text-l" @click="options.transitionTime = (formatNumber(options.transitionTime) + 0.1).toFixed(2)">add</div>
          </div>
          
        </div>
      </div>
      
      <!--Transition delay -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.transitionDelay}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <input type="number" min="0" step="0.1" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.transitionDelay">
          
          <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
            <div class="uip-link-muted uip-icon uip-text-l" @click="options.transitionDelay = (formatNumber(options.transitionDelay) - 0.1).toFixed(2)">remove</div>
            <div class="uip-border-right"></div>
            <div class="uip-link-muted uip-icon uip-text-l" @click="options.transitionDelay = (formatNumber(options.transitionDelay) + 0.1).toFixed(2)">add</div>
          </div>
          
        </div>
      </div>  
      
      
      <!--Cursor -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.cursor}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
          
          <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="options.cursor">
            <optgroup :label="strings.general">
              <template v-for="item in cursorTypes">
                <option :value="item">{{item}}</option>
              </template>
            </optgroup>
            <optgroup :label="strings.resizing">
              <template v-for="item in resizeCursors">
                <option :value="item">{{item}}</option>
              </template>
            </optgroup>
          </select>
          
        </div>
      </div>
      
    </div>
    `,
  };
}
