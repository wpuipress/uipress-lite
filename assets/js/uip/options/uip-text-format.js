const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../libs/vue-esm-dev.js';
export function moduleData() {
  return {
    components: {
      colorBox: defineAsyncComponent(() => import('../v3.5/utility/color-box.min.js?ver=3.2.12')),
      screenControl: defineAsyncComponent(() => import('../v3.5/utility/screen-control.min.js?ver=3.2.12')),
      ColorPicker: defineAsyncComponent(() => import('../v3.5/styles/color-picker.min.js?ver=3.2.12')),
      colourStyleEditor: defineAsyncComponent(() => import('../v3.5/styles/color-style-editor.min.js?ver=3.2.12')),
    },
    props: {
      returnData: Function,
      value: Object,
      args: Object,
    },
    data: function () {
      return {
        option: {
          align: 'left',
          weight: 'inherit',
          decoration: 'none',
          color: {
            value: '',
            type: 'solid',
          },
          font: 'inherit',
          size: {
            preset: 'M',
            units: 'px',
          },
          lineHeight: {
            units: 'em',
          },
          customURL: '',
          customName: '',
          transform: 'none',
        },
        strings: {
          fontSize: __('size', 'uipress-lite'),
          lineHeight: __('Line height', 'uipress-lite'),
          fontWeight: __('Weight', 'uipress-lite'),
          textTransform: __('Transform', 'uipress-lite'),
          fontFamily: __('Font', 'uipress-lite'),
          colour: __('Colour', 'uipress-lite'),
          align: __('Align', 'uipress-lite'),
          decoration: __('Decoration', 'uipress-lite'),
          fontURL: __('Font url', 'uipress-lite'),
          customFontName: __('Font family', 'uipress-lite'),
        },
        alignOptions: {
          left: {
            value: 'left',
            icon: 'format_align_left',
            tip: __('Left', 'uipress-lite'),
          },
          center: {
            value: 'center',
            icon: 'format_align_center',
            tip: __('Center', 'uipress-lite'),
          },
          right: {
            value: 'right',
            icon: 'format_align_right',
            tip: __('Right', 'uipress-lite'),
          },
          justify: {
            value: 'justify',
            icon: 'format_align_justify',
            tip: __('Justify', 'uipress-lite'),
          },
        },
        decorationOptions: {
          none: {
            value: 'none',
            icon: 'block',
            tip: __('None', 'uipress-lite'),
          },
          italic: {
            value: 'italic',
            icon: 'format_italic',
            tip: __('Italic', 'uipress-lite'),
          },
          underline: {
            value: 'underline',
            icon: 'format_underlined',
            tip: __('Underline', 'uipress-lite'),
          },
          strikethrough: {
            value: 'strikethrough',
            icon: 'format_strikethrough',
            tip: __('Strikethrough', 'uipress-lite'),
          },
        },
        fontSizeOptions: {
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
        fontWeights: [
          {
            value: '100',
            label: __('100', 'uipress-lite'),
          },
          {
            value: '200',
            label: __('200', 'uipress-lite'),
          },
          {
            value: '300',
            label: __('300', 'uipress-lite'),
          },
          {
            value: '400',
            label: __('400', 'uipress-lite'),
          },
          {
            value: '500',
            label: __('500', 'uipress-lite'),
          },
          {
            value: '600',
            label: __('600', 'uipress-lite'),
          },
          {
            value: '700',
            label: __('700', 'uipress-lite'),
          },
          {
            value: '800',
            label: __('800', 'uipress-lite'),
          },
          {
            value: '900',
            label: __('900', 'uipress-lite'),
          },
          {
            value: 'bold',
            label: __('Bold', 'uipress-lite'),
          },
          {
            value: 'bolder',
            label: __('Bolder', 'uipress-lite'),
          },
          {
            value: 'lighter',
            label: __('Lighter', 'uipress-lite'),
          },
          {
            value: 'normal',
            label: __('Normal', 'uipress-lite'),
          },
          {
            value: 'inherit',
            label: __('Inherit', 'uipress-lite'),
          },
        ],
        textTransform: [
          {
            value: 'none',
            label: __('None', 'uipress-lite'),
          },
          {
            value: 'capitalize',
            label: __('Capitalize', 'uipress-lite'),
          },
          {
            value: 'lowercase',
            label: __('Lowercase', 'uipress-lite'),
          },
          {
            value: 'uppercase',
            label: __('Uppercase', 'uipress-lite'),
          },
        ],
        fonts: [
          {
            value:
              "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif, emoji,'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
            label: __('System', 'uipress-lite'),
          },
          {
            value: 'Arial, Helvetica, sans-serif',
            label: __('Arial / Helvetica', 'uipress-lite'),
          },
          {
            value: 'Times New Roman, Times, serif',
            label: __('Times New Roman', 'uipress-lite'),
          },
          {
            value: 'Courier New / Courier, Monospace',
            label: __('Courier New', 'uipress-lite'),
          },
          {
            value: 'Tahoma, sans-serif',
            label: __('Tahoma', 'uipress-lite'),
          },
          {
            value: 'Trebuchet MS, sans-serif',
            label: __('Trebuchet MS', 'uipress-lite'),
          },
          {
            value: 'Verdana, sans-serif',
            label: __('Verdana', 'uipress-lite'),
          },
          {
            value: 'Georgia, serif',
            label: __('Georgia', 'uipress-lite'),
          },
          {
            value: 'Garamond, serif',
            label: __('Garamond', 'uipress-lite'),
          },
          {
            value: 'Arial Black, sans-serif',
            label: __('Arial Black', 'uipress-lite'),
          },
          {
            value: 'Impact, sans-serif',
            label: __('Impact', 'uipress-lite'),
          },
          {
            value: 'Brush Script MT, cursive',
            label: __('Brush Script MT', 'uipress-lite'),
          },
          {
            value: 'Material Symbols Rounded',
            label: __('UiPress icons'),
          },
          {
            value: 'inherit',
            label: __('Inherit', 'uipress-lite'),
          },
          {
            value: 'custom',
            label: __('Custom', 'uipress-lite'),
          },
        ],
      };
    },
    inject: ['uipress'],
    watch: {
      /**
       * Watches for changes to the option object and returns when changed
       *
       * @since 3.2.13
       */
      option: {
        handler(newValue, oldValue) {
          this.returnData(this.option);
        },
        deep: true,
      },
    },
    mounted() {
      this.formatInput(this.value);
    },
    computed: {
      /**
       * Returns the current option object
       *
       * @since 3.2.13
       */
      returnOption() {
        return this.option;
      },
      /**
       * Returns the colour fill screen
       *
       * @since 3.2.13
       */
      colorFillScreen() {
        return {
          component: 'ColorPicker',
          value: this.option.color.value,
          label: this.strings.colour,
          returnData: (d) => {
            if (d.startsWith('--')) {
              this.option.color.type = 'variable';
            } else {
              this.option.color.type = 'solid';
            }
            this.option.color.value = d;
          },
        };
      },
      /**
       * Returns the shadow color as a background css style
       *
       * @since 3.2.13
       */
      returnTextColor() {
        if (!this.option.color.value) return;
        if (this.option.color.value.startsWith('--')) {
          return `background-color:var(${this.option.color.value})`;
        }
        return `background-color:${this.option.color.value}`;
      },
    },
    methods: {
      /**
       * Formats the input value
       *
       * @param {Object} value - text object
       * @since 3.2.13
       */
      formatInput(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          this.option = { ...this.option, ...value };
          if ('color' in value) {
            this.option.color = { ...this.option.color, ...value.color };
          }
          if ('size' in value) {
            this.option.size = { ...this.option.size, ...value.size };
          }
          if ('lineHeight' in value) {
            this.option.lineHeight = { ...this.option.lineHeight, ...value.lineHeight };
          }
          if ('align' in value) {
            this.option.align = value.align;
          }
          if ('weight' in value) {
            this.option.weight = value.weight;
          }
          if ('font' in value) {
            this.option.font = value.font;
          }
          if ('customURL' in value) {
            this.option.customURL = value.customURL;
          }
          if ('customName' in value) {
            this.option.customName = value.customName;
          }

          return;
        }

        this.uipress.assignBlockValues(this.option, value);
      },
    },
    template: `
    
      <div class="uip-flex uip-flex-column uip-row-gap-s">
      
      
      
      <!--Font -->
      <div class="uip-grid-col-1-3">
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.fontFamily}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
        
          <default-select :value="returnOption.font" :args="{options: fonts}" :returnData="function(e) {option.font = e}"></default-select>
      
        </div>
        
        
        <template v-if="option.font == 'custom'">
        
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.fontURL}}</span></div>
          
          <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
          
            <input type="text" class="uip-input-small uip-w-100p" v-model="option.customURL">
          
          </div>
          
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.customFontName}}</span></div>
          
          <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
          
            <input type="text" class="uip-input-small uip-w-100p" v-model="option.customName">
          
          </div>
          
        </template>
        
      
        <!--Size -->
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.fontSize}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
        
          <toggle-switch :options="fontSizeOptions" :activeValue="option.size.preset" :returnValue="function(data){ option.size.preset = data}"></toggle-switch>
      
        </div>
        
        <template v-if="option.size.preset == 'custom'">
          
          <!--Spacer-->
          <div></div>
          <div>
            <value-units :value="option.size" :returnData="function(data){option.size = data}"></value-units>
          </div>
          
        </template>
        
        
        
        <!--Color -->
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.colour}}</span></div>
        
        <div class="uip-flex uip-gap-xs uip-flex-no-wrap uip-flex-center">
        
          
          <dropdown pos="left center" :snapX="['#uip-block-settings', '#uip-template-settings', '#uip-global-settings']"
          ref="colorDrop" class="uip-w-100p">
            <template #trigger>
              <colorBox :backgroundStyle="returnTextColor" :text="option.color.value" :remove="()=>{option.color = {}}"/>
            </template>
            <template #content>
            
              <div class="uip-padding-s uip-w-240">
              
                <screenControl :startScreen="colorFillScreen" :homeScreen="colorFillScreen.component" :closer="$refs.colorDrop.close" :showNavigation="true">
                  
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
      
      
      
      
        <!--Align -->
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.align}}</span></div>
        
        <div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-start">
        
          <toggle-switch :options="alignOptions" :activeValue="option.align" :returnValue="function(data){ option.align = data}"></toggle-switch>
      
        </div>
      
      
        <!--Line height -->
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.lineHeight}}</span></div>
        
        <div class="uip-flex uip-row-gap-xs">
        
          <value-units :value="option.lineHeight" :returnData="function(data){option.lineHeight = data}"></value-units>
      
        </div>
        
      
      
        <!--Weight -->
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.fontWeight}}</span></div>
        
        <div class="uip-flex uip-row-gap-xs">
        
          <default-select :value="returnOption.weight" :args="{options: fontWeights}" :returnData="function(e) {option.weight = e}"></default-select>
      
        </div>
      
      
        <!--Transform -->
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.textTransform}}</span></div>
        
        <div class="uip-flex uip-row-gap-xs">
        
          <default-select :value="returnOption.transform" :args="{options: textTransform}" :returnData="function(e) {option.transform = e}"></default-select>
      
        </div> 
      
      
        <!--Decoration -->
      
        <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.decoration}}</span></div>
        
        <div class="uip-flex uip-row-gap-xs">
        
          <toggle-switch :options="decorationOptions" :activeValue="option.decoration" :returnValue="function(data){ option.decoration = data}"></toggle-switch>
      
        </div>
        
      </div>  
    
    </div>`,
  };
}
