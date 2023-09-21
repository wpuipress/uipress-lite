const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export function moduleData() {
  return {
    components: {
      colorBox: defineAsyncComponent(() => import('../v3.5/utility/color-box.min.js?ver=3.2.12')),
      backgroundFill: defineAsyncComponent(() => import('./uip-background-fill.min.js?ver=3.2.12')),
      screenControl: defineAsyncComponent(() => import('../v3.5/utility/screen-control.min.js?ver=3.2.12')),
      ColorPicker: defineAsyncComponent(() => import('../v3.5/styles/color-picker.min.js?ver=3.2.12')),
      colourStyleEditor: defineAsyncComponent(() => import('../v3.5/styles/color-style-editor.min.js?ver=3.2.12')),
      imageBGSelect: defineAsyncComponent(() => import('./uip-image-select.min.js?ver=3.2.12')),
      borderDesigner: defineAsyncComponent(() => import('./uip-border-designer.min.js?ver=3.2.12')),
      shadowDesigner: defineAsyncComponent(() => import('./uip-shadow-designer.min.js?ver=3.2.12')),
      outlineDesigner: defineAsyncComponent(() => import('./uip-outline-designer.min.js?ver=3.2.12')),
    },
    props: {
      returnData: Function,
      value: Object,
    },
    data: function () {
      return {
        styles: {
          opacity: 1,
          overflow: 'visible',
          fill: {},
          backgroundImage: {},
          outline: {},
          borders: [],
          shadows: [],
          radius: {
            sync: true,
            topleft: '',
            topright: '',
            bottomleft: '',
            bottomright: '',
            units: 'px',
          },
        },
        fillTab: __('Colour', 'uipress-lite'),
        strings: {
          opacity: __('Opacity', 'uipress-lite'),
          overflow: __('Overflow', 'uipress-lite'),
          fill: __('Fill', 'uipress-lite'),
          background: __('Background', 'uipress-lite'),
          backgroundImage: __('Background image', 'uipress-lite'),
          border: __('Border', 'uipress-lite'),
          addImage: __('Add image', 'uipress-lite'),
          shadow: __('Shadow', 'uipress-lite'),
          radius: __('Radius', 'uipress-lite'),
          topleft: __('Top left', 'uipress-lite'),
          topright: __('Top right', 'uipress-lite'),
          bottomleft: __('Bottom left', 'uipress-lite'),
          bottomright: __('Bottom right', 'uipress-lite'),
          outline: __('Outline', 'uipress-lite'),
        },
        overflowOptions: [
          {
            value: 'visible',
            label: __('Visible', 'uipress-lite'),
          },
          {
            value: 'auto',
            label: __('Auto', 'uipress-lite'),
          },
          {
            value: 'hidden',
            label: __('Hidden', 'uipress-lite'),
          },
          {
            value: 'scroll',
            label: __('Scroll', 'uipress-lite'),
          },
        ],
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
    created: function () {
      this.formatValue(this.value);
    },
    watch: {
      /**
       * Watches changes to the styles object and returns the result
       *
       * @since 3.2.13
       */
      styles: {
        handler(newValue, oldValue) {
          let self = this;
          self.returnData(self.styles);
        },
        deep: true,
      },
    },
    computed: {
      /**
       * Returns value for background fill
       *
       * @since 3.2.12
       */
      returnFillStyle() {
        if (!('value' in this.styles.fill)) return;
        if (!this.styles.fill.value) return;

        let val = this.styles.fill.value;
        // Variable style
        if (val.includes('--')) return `background:var(${val})`;
        return `background:${val}`;
      },

      /**
       * Returns value for outline fill
       *
       * @since 3.2.12
       */
      returnOutlineStyle() {
        if (!this.styles.outline.color) return;
        if (!('value' in this.styles.outline.color)) return;
        if (!this.styles.outline.color.value) return;

        let val = this.styles.outline.color.value;
        // Variable style
        if (val.includes('--')) return `background:var(${val})`;
        return `background:${val}`;
      },

      /**
       * Returns text value for background fill
       *
       * @since 3.2.12
       */
      returnFillValue() {
        if (!('value' in this.styles.fill)) return '';
        if (!this.styles.fill.value) return '';

        return this.styles.fill.value;
      },
      returnStyles() {
        return this.styles;
      },
      /**
       * Returns the block fill screen
       *
       * @since 3.2.13
       */
      blockFillScreen() {
        return {
          component: 'backgroundFill',
          value: this.returnStyles.fill,
          label: this.fillTab,
          returnData: (d) => {
            this.styles.fill = d;
          },
        };
      },
      /**
       * Returns the block fill screen
       *
       * @since 3.2.13
       */
      outlineScreen() {
        return {
          component: 'outlineDesigner',
          value: this.returnStyles.outline,
          label: this.strings.outline,
          returnData: (d) => {
            this.styles.outline = d;
          },
        };
      },

      /**
       * Returns background image style
       *
       * @since 3.2.13
       */
      returnBackgroundImage() {
        let img = this.styles.backgroundImage.url;
        if (img) {
          return `background-size:cover;background-image: url(${img})`;
        }
        return '';
      },
    },
    methods: {
      /**
       * Returns the border screen
       *
       * @since 3.2.13
       */
      borderScreen(border, index) {
        return {
          component: 'borderDesigner',
          value: border,
          label: this.strings.border,
          returnData: (d) => {
            this.styles.borders[index] = d;
          },
        };
      },
      /**
       * Returns the shadow screen
       *
       * @since 3.2.13
       */
      shadowScreen(shadow, index) {
        return {
          component: 'shadowDesigner',
          value: shadow,
          label: this.strings.shadow,
          returnData: (d) => {
            this.styles.shadows[index] = d;
          },
        };
      },
      /**
       * Formats input value
       *
       * @param {Object} value - the current value for the setting
       * @since 3.2.13
       */
      formatValue(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          if ('opacity' in value) {
            this.styles.opacity = value.opacity;
          }
          if ('overflow' in value) {
            this.styles.overflow = value.overflow;
          }
          if ('borders' in value) {
            this.styles.borders = value.borders;
          }
          if ('outline' in value) {
            this.styles.outline = value.outline;
          }
          if ('fill' in value) {
            this.styles.fill = { ...this.styles.fill, ...value.fill };
          }
          if ('backgroundImage' in value) {
            this.styles.backgroundImage = { ...this.styles.backgroundImage, ...value.backgroundImage };
          }
          if ('radius' in value) {
            this.styles.radius = { ...this.styles.radius, ...value.radius };
          }
          if ('shadows' in value) {
            this.styles.shadows = value.shadows;
          }
          return;
        }
      },

      /**
       * Return the border colour and a css style string
       *
       * @param {Object} border - border object
       * @since 3.213
       */
      returnBorderColor(border) {
        let color = border.color;
        let style = '';
        if (color) {
          if (color.value) {
            if (color.value.includes('--')) {
              style = 'background-color:var(' + color.value + ');';
            } else {
              style = 'background-color:' + color.value;
            }
          }
        }
        return style;
      },
      /**
       * Return the shadow colour and a css style string
       *
       * @param {Object} shadow - shadow object
       * @since 3.213
       */
      returnShadowColor(shadow) {
        let color = shadow.color;
        let style = '';
        if (color) {
          if (color.value) {
            if (color.value.includes('--')) {
              style = 'background-color:var(' + color.value + ');';
            } else {
              style = 'background-color:' + color.value;
            }
          }
        }
        return style;
      },
    },
    template: `
    
    
    <div class="uip-flex uip-flex-column uip-row-gap-xs">
    
    
      <!--Opacity -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.opacity}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <input type="number" class="uip-input uip-padding-xxxs uip-w-50p uip-border-rounder" style="border-radius:var(--uip-border-radius-large)" v-model="styles.opacity">
          
          <input type="range" min="0" max="1" v-model="styles.opacity" step="0.1" class="uip-range uip-w-50p">
      
        </div>
        
      </div>
      
      
      <!--Fill -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.fill}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          
          <dropdown pos="left center" :offsetX="130" ref="fillDrop" class="uip-w-100p">
            <template #trigger>
              <colorBox :backgroundStyle="returnFillStyle" :text="returnFillValue" :remove="()=>{styles.fill = {}}"/>
            </template>
            <template #content>
            
              <div class="uip-padding-s uip-w-240">
              
                <screenControl :startScreen="blockFillScreen" :homeScreen="blockFillScreen.component" :closer="$refs.fillDrop.close" :showNavigation="true">
                  
                  <template #componenthandler="{ processScreen, currentScreen, goBack }">
                    <KeepAlive>
                      <component @tab-change="(d)=>{fillTab = d}" @request-screen="(d)=>{processScreen(d)}" @go-back="goBack()"
                      :returnData="currentScreen.returnData"
                      :value="currentScreen.value"
                      :args="currentScreen.args"
                      :is="currentScreen.component"/>
                    </KeepAlive>
                  </template>
                  
                </screenControl>
              </div>
              
            </template>
          </dropdown>
        
      
        </div>
        
      </div>
      
      
      <!--BackgroundImage -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.background}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <dropdown pos="left center" :offsetX="130" ref="backgroundDrop" class="uip-w-100p">
            <template #trigger>
              <colorBox :backgroundStyle="returnBackgroundImage" :text="styles.backgroundImage.url" :remove="()=>{styles.backgroundImage = {}}"/>
            </template>
            <template #content>
            
              <div class="uip-padding-s uip-w-240 uip-flex uip-flex-column uip-row-gap-s">
              
                <div class="uip-flex uip-flex-between uip-flex-center">
                  <div class="uip-text-emphasis uip-text-bold uip-text-s">{{strings.backgroundImage}}</div>
                  
                  <div @click="$refs.backgroundDrop.close()" class="uip-flex uip-flex-center uip-flex-middle uip-padding-xxs uip-link-muted hover:uip-background-muted uip-border-rounder">
                    <span class="uip-icon">close</span>
                  </div>
                </div>
                
                <imageBGSelect :value="styles.backgroundImage" :returnData="function(d){styles.backgroundImage = d}"/>
                
              </div>
              
            </template>
            
          </dropdown>  
          
        
        </div>
        
      </div>
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      <!--Radius -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.radius}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-right uip-flex-column uip-row-gap-xs">
        
          <div class="uip-flex uip-flex-row uip-gap-xxxs uip-flex-right">
          
            <div class="uip-flex uip-flex-row uip-padding-xxxs uip-background-muted uip-border-rounder">
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted uip-border-rounder" @click="styles.radius.sync = true"
              :class="{'uip-background-default uip-text-emphasis' : styles.radius.sync}">crop_square</div>
              <div class="uip-icon uip-icon-m uip-text-xl uip-link-muted uip-border-rounder" @click="styles.radius.sync = false"
              :class="{'uip-background-default uip-text-emphasis' : !styles.radius.sync}">crop_free</div>
            </div>
            
            <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-round uip-text-center uip-flex-grow" v-if="styles.radius.sync">
                <input class="uip-blank-input uip-text-center uip-w-100p uip-text-s" v-model="styles.radius.topleft" >
            </div>
            
            <div class="uip-background-muted uip-border-round">
             <units-select :value="styles.radius.units" :returnData="function(e){styles.radius.units = e}"></units-select>
            </div>
          
          </div>
        
        </div>  
        
        <!--Spacer-->
        <div v-if="!styles.radius.sync"></div>
        
        
        <div class="uip-flex uip-flex-row uip-gap-xxxs uip-flex-right" v-if="!styles.radius.sync">
        
          <div class="uip-flex uip-flex-row uip-gap-xxxs uip-flex-right">
            
              <uip-tooltip :message="strings.topleft" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="styles.radius.topleft" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.topright" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="styles.radius.topright" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.bottomleft" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center">
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="styles.radius.bottomleft" >
                </div>
              </uip-tooltip>
              
              <uip-tooltip :message="strings.bottomright" :delay="0" containerClass="uip-flex">
                <div class="uip-flex uip-flex-row uip-padding-xxs uip-background-muted uip-border-rounder uip-text-center" >
                    <input class="uip-blank-input uip-text-center uip-w-28 uip-text-s" v-model="styles.radius.bottomright" >
                </div>
              </uip-tooltip>
            
          </div>
          
        </div>
        
      </div>
      
      
      <!--Overflow -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.overflow}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="styles.overflow">
            <template v-for="item in overflowOptions">
              <option :value="item.value">{{item.label}}</option>
            </template>
          </select>
      
        </div>
        
      </div>
      
      
      
      <!--Border -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-flex-start uip-padding-top-xxs"><span>{{strings.border}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs">
        
          <template v-for="(border, index) in styles.borders">
          
            <div class="uip-flex uip-gap-xs uip-row-gap-xs uip-flex-center">
            
                <dropdown pos="left center" class="uip-w-100p" :ref="'borderDrop-'+index" :offsetX="130">
                  <template v-slot:trigger>
                  
                    <colorBox :backgroundStyle="returnBorderColor(border, index)" :text="border.style" :remove="()=>{styles.borders.splice(index, 1)}"/>
                    
                  </template>
                  <template v-slot:content>
                  
                    <div class="uip-padding-s uip-w-240">
                      <screenControl :startScreen="borderScreen(border, index)" :homeScreen="borderScreen(border, index).component"
                      :closer="$refs['borderDrop-'+index][0].close" :showNavigation="true">
                        
                        <template #componenthandler="{ processScreen, currentScreen, goBack }">
                          <KeepAlive>
                            <component @tab-change="(d)=>{fillTab = d}" @request-screen="(d)=>{processScreen(d)}" @go-back="goBack()"
                            :returnData="currentScreen.returnData"
                            :value="currentScreen.value"
                            :args="currentScreen.args"
                            :is="currentScreen.component"/>
                          </KeepAlive>
                        </template>
                        
                      </screenControl>
                    </div>  
                    
                  </template>
                </dropdown>
                
              
              </div>
          
          </template>
          
          <button 
          class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-line-height-1" 
          @click="styles.borders.push({})">add</button>
          
        </div>
        
      
      </div>
      
      
      <!--Shadows -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s uip-flex-start uip-padding-top-xxs"><span>{{strings.shadow}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs">
        
          <template v-for="(shadow, index) in styles.shadows">
          
            <div class="uip-flex uip-gap-xs uip-row-gap-xs uip-flex-center">
            
                <dropdown pos="left center" class="uip-w-100p" :ref="'shadowDrop-'+index" :offsetX="130">
                  <template v-slot:trigger>
                  
                    <colorBox :backgroundStyle="returnShadowColor(shadow)" :text="shadow.position" :remove="()=>{styles.shadows.splice(index, 1)}"/>
                    
                  </template>
                  <template v-slot:content>
                  
                    <div class="uip-padding-s uip-w-240">
                      <screenControl :startScreen="shadowScreen(shadow, index)" :homeScreen="shadowScreen(shadow, index).component"
                      :closer="$refs['shadowDrop-'+index][0].close" :showNavigation="true">
                        
                        <template #componenthandler="{ processScreen, currentScreen, goBack }">
                          <KeepAlive>
                            <component @tab-change="(d)=>{fillTab = d}" @request-screen="(d)=>{processScreen(d)}" @go-back="goBack()"
                            :returnData="currentScreen.returnData"
                            :value="currentScreen.value"
                            :args="currentScreen.args"
                            :is="currentScreen.component"/>
                          </KeepAlive>
                        </template>
                        
                      </screenControl>
                    </div>  
                    
                  </template>
                </dropdown>
                
              
              </div>
          
          </template>
          
          <button 
          class="uip-button-default uip-icon uip-border-rounder uip-padding-xxs uip-link-muted uip-line-height-1" 
          @click="styles.shadows.push({})">add</button>
          
        </div>
        
      
      </div>
      
      
      
      
      <!--Fill -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.outline}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          
          <dropdown pos="left center" :offsetX="130" ref="outlineDrop" class="uip-w-100p">
            <template #trigger>
              <colorBox :backgroundStyle="returnOutlineStyle" :text="styles.outline.style" :remove="()=>{styles.outline = {}}"/>
            </template>
            <template #content>
            
              <div class="uip-padding-s uip-w-240">
              
                <screenControl :startScreen="outlineScreen" :homeScreen="outlineScreen.component" :closer="$refs.outlineDrop.close" :showNavigation="true">
                  
                  <template #componenthandler="{ processScreen, currentScreen, goBack }">
                    <KeepAlive>
                      <component @tab-change="(d)=>{fillTab = d}" @request-screen="(d)=>{processScreen(d)}" @go-back="goBack()"
                      :returnData="currentScreen.returnData"
                      :value="currentScreen.value"
                      :args="currentScreen.args"
                      :is="currentScreen.component"/>
                    </KeepAlive>
                  </template>
                  
                </screenControl>
              </div>
              
            </template>
          </dropdown>
        
      
        </div>
        
      </div>
      
      
      
      
      
    
    </div>
    
    `,
  };
}
