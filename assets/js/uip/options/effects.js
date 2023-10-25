const { __, _x, _n, _nx } = wp.i18n;
import BlendModes from '../v3.5/lists/mix_blend_modes.min.js';
import TransitionTypes from '../v3.5/lists/css_transitions.min.js';
import CursorTypes from '../v3.5/lists/cursor_types.min.js';
import CursorTypesResize from '../v3.5/lists/cursor_resize_types.min.js';
import { nextTick } from '../../libs/vue-esm.js';

export default {
  emits: ['update'],
  props: {
    value: Object,
  },
  data() {
    return {
      updating: false,
      options: this.returnDefaultOptions,
      loading: true,
      mixBlendModes: BlendModes,
      transitionTypes: TransitionTypes,

      cursorTypes: CursorTypes,
      resizeCursors: CursorTypesResize,

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
  
  watch: {
    /**
     * Watches changes to value prop and injects
     *
     * @since 3.2.13
     */
    value: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.injectProp();
      },
      deep: true,
      immediate: true,
    },
    /**
     * Watches changes to options and returns data back to caller
     *
     * @since 3.2.13
     */
    options: {
      handler(newValue, oldValue) {
        if (this.updating) return;
        this.$emit('update', this.options);
      },
      deep: true,
    },
  },
  computed: {
    /**
     * Returns default options
     *
     * @since 3.2.13
     */
    returnDefaultOptions() {
      return {
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
      };
    },
  },
  methods: {
    /**
     * Injects value into component
     *
     * @since 3.2.13
     */
    async injectProp() {
      this.updating = true;
      const defaultOptions = this.returnDefaultOptions;
      const newOptions = this.isObject(this.value) ? this.value : {};
      this.options = { ...defaultOptions, ...newOptions };

      await nextTick();
      this.updating = false;
    },
  },
  template: `
    
    <div class="uip-flex uip-flex-column uip-row-gap-s">
    
    
      
    
      <!--Transform -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.transform}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <dropdown pos="left center" class="uip-flex uip-flex-grow uip-w-100p" 
          ref="transformDrop"
          :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
          
            <template #trigger>
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
            <template #content>
            
            
            
              <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
              
                <div class="uip-flex uip-flex-between uip-flex-center">
                  <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.transform}}</div>
                  <div @click.prevent.stop="$refs.transformDrop.close()"
                  class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                    <span class="uip-icon">close</span>
                  </div>
                </div>
              
                
                <!--translateX -->
                <div class="uip-grid-col-1-3 uip-padding-left-xs">
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.translate}} X</span></div>
                  
                  <value-units :value="options.transform.translateX" :returnData="function(data){options.transform.translateX = data}" />
                  
                
                <!--translateY -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.translate}} Y</span></div>
                  
                  <value-units :value="options.transform.translateY" :returnData="function(data){options.transform.translateY = data}"/>
                  
                <!--ScaleX -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.scale}} X</span></div>
                  <uip-number :value="options.transform.scaleX" :returnData="(d)=>{options.transform.scaleX = d}" placeHolder="" :step="0.1"/>
                  
                
                <!--ScaleY -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.scale}} Y</span></div>
                  <uip-number :value="options.transform.scaleY" :returnData="(d)=>{options.transform.scaleY = d}" placeHolder="" :step="0.1"/>
                 
                  
                
                
                <!--Rotate X -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.rotate}} X (°)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center uip-w-100p">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.rotateX">
                    <input type="range" min="-360" max="360" v-model="options.transform.rotateX" step="10" class="uip-range uip-w-30 uip-flex-grow">
                  
                  </div>
                  
                
                <!--Rotate Y -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.rotate}} Y (°)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center uip-w-100p">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.rotateY">
                    <input type="range" min="-360" max="360" v-model="options.transform.rotateY" step="10" class="uip-range uip-w-30 uip-flex-grow">
                  
                  </div>
                  
                
                <!--Rotate Z -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.rotate}} Z (°)</span></div>
                   
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center uip-w-100p">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.rotateZ">
                    <input type="range" min="-360" max="360" v-model="options.transform.rotateZ" step="10" class="uip-range uip-w-30 uip-flex-grow">
                  
                  </div>
                  
                
                <!--Skew X -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.skew}} X (°)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center uip-w-100p">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.skewX">
                    <input type="range" min="-360" max="360" v-model="options.transform.skewX" step="10" class="uip-range uip-w-30 uip-flex-grow">
                  
                  </div>
                  
                
                <!--Skew Y -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.skew}} Y (°)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center uip-w-100p">
                  
                    <input type="number" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.transform.skewY">
                    <input type="range" min="-360" max="360" v-model="options.transform.skewY" step="10" class="uip-range uip-w-30 uip-flex-grow">
                  
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
        
          <dropdown pos="left center" class="uip-flex uip-flex-grow uip-w-100p" 
          ref="filtersDrop"
          :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']">
          
          
            <template #trigger>
            
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
            
            <template #content>
            
              <div class="uip-flex uip-flex-column uip-row-gap-s uip-padding-s uip-w-240">
              
                <div class="uip-flex uip-flex-between uip-flex-center">
                  <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.filters}}</div>
                  <div @click.prevent.stop="$refs.filtersDrop.close()"
                  class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                    <span class="uip-icon">close</span>
                  </div>
                </div>
              
               
                <div class="uip-grid-col-1-3 uip-padding-left-xs">
                
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
                  <uip-number :value="options.filters.grayscale" :returnData="(d)=>{options.filters.grayscale = d}" placeHolder="" :step="0.1"/>
                  
                
                
                <!--blur -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.blur}} (px)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" max="100" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.filters.blur">
                    <input type="range" min="0" max="100" v-model="options.filters.blur" step="1" class="uip-range uip-w-30 uip-flex-grow">
                  
                  </div>
                
                
                <!--backdropBlur -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.backdropBlur}} (px)</span></div>
                  
                  <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
                  
                    <input type="number" min="0" max="100" class="uip-input uip-padding-xxxs uip-w-60 uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="options.filters.backdropBlur">
                    <input type="range" min="0" max="100" v-model="options.filters.backdropBlur" step="1" class="uip-range uip-w-30 uip-flex-grow">
                  
                  </div>
                  
                
                
                <!--saturate -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.saturate}}</span></div>
                  <uip-number :value="options.filters.saturate" :returnData="(d)=>{options.filters.saturate = d}" placeHolder="" :step="0.1"/>
                
                
                <!--contrast -->
                
                  <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.contrast}}</span></div>
                  <uip-number :value="options.filters.contrast" :returnData="(d)=>{options.filters.contrast = d}" placeHolder="" :step="0.1"/>
                  
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
        <uip-number :value="options.transitionTime" :returnData="(d)=>{options.transitionTime = d}" placeHolder="" :step="0.1"/>
      </div>
      
      <!--Transition delay -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.transitionDelay}}</span></div>
        <uip-number :value="options.transitionDelay" :returnData="(d)=>{options.transitionDelay = d}" placeHolder="" :step="0.1"/>
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
