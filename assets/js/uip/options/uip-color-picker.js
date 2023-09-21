const { __, _x, _n, _nx } = wp.i18n;
import '../../libs/uip-color-picker.min.js';
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: String,
    },
    data: function () {
      return {
        open: false,
        colour: this.value,
        manualColorInput: this.value,
        customColor: this.value,
        pickerObject: '',
        strings: {
          colorValue: __('Colour value', 'uipress-lite'),
          colourCode: __('Colour code', 'uipress-lite'),
          custom: __('Custom', 'uipress-lite'),
        },
      };
    },
    watch: {
      manualColorInput: {
        handler(newValue, Oldvalue) {
          this.color = newValue;
          this.pickerObject.color.set(newValue);
        },
      },
      customColor: {
        handler(newValue, Oldvalue) {
          console.log(newValue);
          this.returnData(newValue);
        },
      },
    },
    mounted: function () {},
    computed: {
      returnSelectedColour() {
        let col = this.colour;
        if (this.customColor && this.customColor != '') {
          col = this.customColor;
        }
        return 'background-color:' + col;
      },
      returnCustomClass() {
        if (this.customColor && this.customColor != '') {
          if (this.customColor.includes('var(')) {
            let string = this.customColor.replace('var(', '');
            string = string.replace(')', '');
            if (string) {
              return string;
            }
          }
        }
      },
    },
    methods: {
      mountPicker() {
        let picker = this.$el.getElementsByClassName('uip-color-picker')[0];
        let self = this;

        let startColor = this.value;

        let colorPicker = new iro.ColorPicker(picker, {
          // Set the size of the color picker
          width: 240,
          margin: 5,
          padding: 0,
          color: startColor,
          handleSvg: '#uip-color-handle',
          layout: [
            {
              component: iro.ui.Box,
            },
            {
              component: iro.ui.Slider,
              options: {
                id: 'hue-slider',
                sliderType: 'hue',
                width: 240,
              },
            },
            {
              component: iro.ui.Slider,
              options: {
                sliderType: 'alpha',
                width: 240,
              },
            },
          ],
        });

        self.pickerObject = colorPicker;
        colorPicker.on('color:change', function (color) {
          self.colour = color.rgbaString;
          self.manualColorInput = self.colour;
          self.returnData(self.colour);
        });
      },
    },
    template: `
      <dropdown pos="left center" :onOpen="mountPicker">
          <template v-slot:trigger>
              <slot name="trigger"></slot>
          </template>
          <template v-slot:content>
            <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-xs">
            
              <div class="uip-color-picker"></div>
              
              
                <div class="uip-flex uip-flex-column uip-flex-grow uip-row-gap-xs">
                  <div class="uip-text-xs">{{strings.colourCode}}</div>
                  
                  <div class="uip-flex uip-flex-row uip-gap-xs uip-flex-center">
                    <div class="uip-border-rounder uip-border uip-w-22 uip-ratio-1-1" :class="returnCustomClass" :style="returnSelectedColour"></div>
                    <input type="text" class="uip-input uip-input-small uip-text-bold uip-w-100p uip-text-muted" :placeholder="strings.colorValue" v-model="manualColorInput">
                  </div>
                </div>
               
              
              
              <div class="uip-flex uip-flex-column uip-gap-xs uip-flex-start">
                  <div class="uip-text-xs">{{strings.custom}}</div>
                  <input type="text" class="uip-input uip-input-small uip-text-bold uip-w-100p uip-text-muted" placeholder="var(--custom-var)" v-model="customColor">
              </div>
              <svg style="display:none">
                <defs>
                  <g id="uip-color-handle">
                    <circle cx="8" cy="8" r="8" fill="rgba(0,0,0,0)" stroke-width="2" stroke="#fff"></circle>
                  </g>
                </defs>
              </svg>
            </div>
          </template>
      </dropdown>`,
  };
}
