const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent } from '../../libs/vue-esm-dev.js';
export function moduleData() {
  return {
    components: {
      //colorpicker: defineAsyncComponent(() => import('./v3.5/styles/color-picker.min.js?ver=0.0.1')),
      //gradientpicker: defineAsyncComponent(() => import('../v3.5/styles/gradient-picker.min.js?ver=0.0.1')),
    },
    props: {
      returnData: Function,
      value: Object,
      args: Object,
    },
    data: function () {
      return {
        open: false,
        placeHolder: this.value,
        colour: {
          value: '',
          type: 'solid',
        },
        manualColorInput: '',
        variables: this.uipData.themeStyles,
        strings: {
          colorValue: __('Colour value', 'uipress-lite'),
          themeVariables: __('Theme variables', 'uipress-lite'),
          type: __('Type', 'uipress-lite'),
          angle: __('Angle', 'uipress-lite'),
          positionX: __('Position X', 'uipress-lite'),
          positionY: __('Position Y', 'uipress-lite'),
          colour: __('Colour', 'uipress-lite'),
          location: __('Location', 'uipress-lite'),
          manageVariables: __('Manage variables', 'uipress-lite'),
          colourCode: __('Colour code', 'uipress-lite'),
          applyGradient: __('Apply gradient', 'uipress-lite'),
        },
        gradient: {
          type: 'linear',
          angle: 0,
          positionX: 50,
          positionY: 50,
          colours: [
            {
              value: '#18208d',
              location: 0,
              type: 'solid',
              supports: ['solid'],
            },
            {
              value: 'rgb(108, 76, 203)',
              location: 100,
              type: 'solid',
              supports: ['solid'],
            },
          ],
        },
        pickerObject: '',
        mode: 'solid',
        gradientTypes: {
          linear: {
            value: 'linear',
            label: __('Linear', 'uipress-lite'),
          },
          radial: {
            value: 'radial',
            label: __('Radial', 'uipress-lite'),
          },
        },
        modes: {
          solid: {
            value: 'solid',
            label: __('Solid', 'uipress-lite'),
          },
          gradient: {
            value: 'gradient',
            label: __('Gradient', 'uipress-lite'),
          },
        },
      };
    },
    inject: ['uipData', 'uipress', 'openModal'],
    watch: {
      value: {
        handler(newValue, oldValue) {
          this.uipress.assignBlockValues(this.colour, newValue);
        },
        deep: true,
      },
      manualColorInput: {
        handler(newValue, Oldvalue) {
          let self = this;
          self.colour.value = newValue;
          let iroColor = self.colour.value;

          //Check for theme variables
          if (self.colour.value.includes('--')) {
            let bodstyles = getComputedStyle(document.body);
            iroColor = bodstyles.getPropertyValue(self.colour.value).trim();
            self.colour.type = 'variable';
          } else {
            self.colour.type = 'solid';
          }

          if (typeof self.pickerObject.color === 'undefined') {
            self.returnData(this.colour);
            return;
          }

          self.pickerObject.color.set(iroColor);
          self.returnData(this.colour);
        },
      },
    },
    mounted: function () {
      this.formatValue(this.value);
      this.setMode();
    },
    computed: {
      returnTheme() {
        if (this.uipData.templateDarkMode) {
          return 'dark';
        }
        return 'light';
      },
      returnModes() {
        let filteredModes = this.modes;
        //Check if args have been passed
        if (!this.uipress.isObject(this.args)) {
          return filteredModes;
        }

        if ('modes' in this.args) {
          if (!this.args.modes.includes('solid')) {
            delete filteredModes['solid'];
          } else if (!this.args.modes.includes('gradient')) {
            delete filteredModes['gradient'];
          }
        }

        return filteredModes;
      },
      returnColorValue() {
        let self = this;
        let color = self.returnColor;
        if (color) {
          if (color.value.includes('--')) {
            return 'var(' + color.value + ');';
          } else {
            return color.value;
          }
        } else {
          return '';
        }
      },
      returnColor() {
        return this.colour;
      },
      returnGradientObj() {
        return this.gradient;
      },
    },
    methods: {
      resetColor() {
        this.colour.value = '';
        this.colour.type = 'solid';
        this.manualColorInput = '';
        this.returnData(this.colour);
      },
      formatValue(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          this.colour = { ...this.colour, ...value };
          this.manualColorInput = this.colour.value;
          return;
        }
      },
      setMode() {
        if (this.colour.type == 'linear' || this.colour.type == 'radial') {
          this.mode = 'gradient';
        } else {
          this.mode = 'solid';
        }
      },
      mountPicker() {
        let self = this;
        let startColor = this.colour.value;
        let picker = this.$refs.uippicker;

        if (typeof this.value !== 'undefined') {
          if ('gradObject' in this.value) {
            //console.log(this.colour);
            //this.gradient = this.value.gradObject;
          }
        }

        let colorPicker = new iro.ColorPicker(picker, {
          // Set the size of the color picker
          width: 240,
          margin: 5,
          color: startColor,
          padding: 0,
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
          if (!self.colour.value.includes('--')) {
            self.colour.value = color.rgbaString;
            self.colour.type = 'solid';
            self.manualColorInput = self.colour.value;
          }
          self.returnData(self.colour);
        });
        colorPicker.on('input:start', function (color) {
          self.colour.value = color.rgbaString;
          self.colour.type = 'solid';
          self.manualColorInput = self.colour.value;
          self.returnData(self.colour);
        });
      },

      returnGradient() {
        if (this.gradient.type == 'linear') {
          let orderedColours = JSON.parse(JSON.stringify(this.gradient.colours)).sort((a, b) => parseFloat(a.location) - parseFloat(b.location));
          let grad = 'linear-gradient(' + this.gradient.angle + 'deg,';

          for (let [index, value] of orderedColours.entries()) {
            grad += value.value + ' ' + value.location + '%';
            if (index < this.gradient.colours.length - 1) {
              grad += ',';
            }
          }
          grad += ')';
          return grad;
        } else if (this.gradient.type == 'radial') {
          let orderedColours = JSON.parse(JSON.stringify(this.gradient.colours)).sort((a, b) => parseFloat(a.location) - parseFloat(b.location));
          let grad = 'radial-gradient(circle at ' + this.gradient.positionX + '% ' + this.gradient.positionY + '%,';

          for (let [index, value] of orderedColours.entries()) {
            grad += value.value + ' ' + value.location + '%';
            if (index < this.gradient.colours.length - 1) {
              grad += ',';
            }
          }
          grad += ')';
          return grad;
        }
      },
      ifEnabled(feature) {
        let filteredModes = this.modes;
        //Check if args have been passed
        if (!this.uipress.isObject(this.args)) {
          if (feature == 'solid') {
            delete filteredModes['gradient'];
            return true;
          } else {
            return false;
          }
        }

        if (!('modes' in this.args)) {
          return true;
        }

        if (this.args.modes.includes(feature)) {
          return true;
        } else {
          return false;
        }
      },
      returnVariable(variable) {
        let self = this;
        self.colour.value = variable.name;
        self.colour.type = 'variable';
        self.colour.gradObject = '';
        self.manualColorInput = self.colour.value;
      },
      getPreviewBG() {
        let formattedColor = this.returnColorValue;
        return 'background:' + formattedColor + ';';
      },
      applyGradient() {
        let self = this;
        self.colour.value = self.returnGradient();
        self.colour.type = self.gradient.type;
        self.colour.gradObject = self.gradient;
        self.returnData(self.colour);
      },
      addNewGradCol() {
        let temp = JSON.parse(JSON.stringify(this.gradient.colours[1]));
        this.gradient.colours.push(temp);
      },
    },
    template: `
    
    
    <dropdown pos="left center" :onOpen="mountPicker" triggerClass="uip-flex uip-flex-grow uip-w-100p" containerClass="uip-flex uip-flex-grow uip-w-100p">
            <template v-slot:trigger>
                <div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-flex uip-gap-xxs uip-w-100p">
                  <div class="uip-border uip-border-round  uip-w-18 uip-ratio-1-1 uip-flex uip-user-frame" :style="getPreviewBG()">
                  </div>
                  <input type="text" class="uip-flex-grow uip-input-small uip-blank-input uip-w-100 " style="line-height:1.2em!important;" v-model="manualColorInput">
                </div>
            </template>
            <template v-slot:post-trigger>
                <button class="uip-button-default uip-border-rounder uip-icon uip-padding-xxs uip-link-muted uip-margin-left-xs" @click="resetColor()">close</button>
            </template>
          
            <template v-slot:content>
              <div class="uip-padding-s uip-flex uip-flex-column uip-row-gap-s">
            
                <div class="" v-if="args && args.modes.includes('solid') && args.modes.includes('gradient')">
                  <toggle-switch :options="returnModes" :activeValue="mode" :returnValue="function(data){ mode = data}"></toggle-switch>
                </div>
              
                <div v-if="ifEnabled('solid')" v-show="mode == 'solid'" class="uip-flex uip-flex-column uip-row-gap-s">
                  <div class="">
                    <div class="uip-color-picker" ref="uippicker"></div>
                    <svg style="display:none">
                      <defs>
                        <g id="uip-color-handle">
                          <circle cx="8" cy="8" r="8" fill="rgba(0,0,0,0)" stroke-width="2" stroke="#fff"></circle>
                        </g>
                      </defs>
                    </svg>
                  </div>
                
                  <div class="uip-flex uip-flex-row uip-gap-xs  uip-padding-bottom-remove uip-flex-start">
                    <input type="text" class="uip-input uip-flex-grow uip-input-small uip-text-bold uip-w-100p uip-text-muted" :placeholder="strings.colorValue" v-model="manualColorInput">
                    <div class="uip-border-rounder uip-border uip-w-26 uip-ratio-1-1" :style="getPreviewBG()"></div>
                  </div>
                
                  <div class="uip-flex uip-flex-column uip-row-gap-s" v-if="ifEnabled('variables')">
                    <div class=" uip-text-bold">{{strings.themeVariables}}</div>
                    
                    <div class=" uip-flex uip-flex-row uip-flex-wrap uip-gap-xs uip-row-gap-xs uip-w-240 uip-border-box">
                        <uip-tooltip :message="strings.manageVariables" :delay="500">
                          <div>
                            <div @click="openModal('list-variables', strings.manageVariables)" class="uip-border-rounder uip-background-muted uip-w-18 uip-ratio-1-1 uip-border uip-cursor-pointer uip-flex uip-flex-center uip-flex-middle"><span class=" uip-icon">tune</span></div>
                          </div>
                        </uip-tooltip>
                      <template v-for="item in variables">
                        <component is="style" scoped v-if="item.value">
                        .{{item.name}} { {{item.name}}:{{item.value}} };
                        </component>
                        <component is="style" scoped v-if="item.darkValue">
                        .{{item.name}} [data-theme="dark"] { {{item.name}}:{{item.darkValue}} };
                        </component>
                        <uip-tooltip v-if="item.type == 'color'"  :message="item.name" :delay="00">
                          <div :class="item.name">
                            <div @click="returnVariable(item)" :data-theme="returnTheme" v-if="item.type = 'color'" class="uip-border-rounder uip-w-18 uip-ratio-1-1 uip-border uip-cursor-pointer" :style="'background-color:var(' + item.name + ')'"></div>
                          </div>
                        </uip-tooltip>
                      </template>
                    </div>
                  </div >
                </div>
              
                <!--Gradient -->
                <div v-if="ifEnabled('gradient')" v-show="mode == 'gradient'" class="uip-w-250 uip-padding-xs">
                  
                  <!--preview-->
                  <div class="uip-w-100p uip-ratio-16-10 uip-border-round uip-margin-bottom-xs" :style="'background:' + returnGradient()">
                  </div>
                  
                  <!--options-->
                  <div class="uip-flex uip-flex-column uip-row-gap-s">
                    <div>
                      <div class="uip-margin-bottom-xxs uip-text-s">
                        {{strings.type}}
                      </div>
                      <toggle-switch :options="gradientTypes" :activeValue="gradient.type" :returnValue="function(data){ gradient.type = data}"></toggle-switch>
                    </div>
                    
                    <div>
                      <div class="uip-margin-bottom-xxs uip-text-s">
                        {{strings.angle}}
                      </div>
                      <input class="uip-range uip-w-100p" v-model="gradient.angle" type="range" min="0" max="360">
                    </div>
                    
                    <!--RADIAL Y AND X-->
                    <div v-if="gradient.type == 'radial'" class="uip-grid-small uip-flex uip-flex-wrap uip-row-gap-xxs">
                      <div class="uip-width-medium uip-text-s">
                        {{strings.positionX}}
                      </div>
                      <div class="uip-width-medium uip-text-s">
                        {{strings.positionY}}
                      </div>
                      <div class="uip-width-medium">
                        <input class="uip-input-small" v-model="gradient.positionX" type="number" min="0" max="100">
                      </div>
                      <div class="uip-width-medium">
                        <input class="uip-input-small" v-model="gradient.positionY" type="number" min="0" max="100">
                      </div>
                    </div>
                    
                    <div>
                        <div class="uip-grid-small uip-flex uip-flex-wrap uip-row-gap-xxs">
                          <div class="uip-width-medium uip-text-s">
                            {{strings.colour}}
                          </div>
                          <div class="uip-width-medium uip-text-s">
                            {{strings.location}}
                          </div>
                          <template v-for="(colorStop, index) in gradient.colours" :key="index">
                            <div class="uip-width-medium uip-flex uip-flex-row uip-gap-xxs uip-flex-center" >
                              <div class="uip-flex uip-flex-row uip-gap-xxs uip-flex-center uip-background-muted uip-border-round uip-overflow-hidden uip-colour-select uip-padding-xxs">
                                <color-picker :value="colorStop.value" :returnData="function(data){ colorStop.value = data}">
                                  <template v-slot:trigger>
                                       <div class="uip-border-round uip-w-18 uip-ratio-1-1 uip-border" :style="'background-color:' + colorStop.value"></div>
                                  </template>
                                </color-picker>
                                <input v-model="colorStop.value" type="text" class="uip-blank-input uip-text-s" style="line-height: 1.2em !important">
                              </div>
                              <div v-if="gradient.colours.length > 2" class="uip-icon uip-text-l uip-link-muted" @click="gradient.colours.splice(index, 1);">delete</div>
                            </div>
                            <div class="uip-width-medium">
                              <input class="uip-range" v-model="colorStop.location" type="range" min="0" max="100" style="min-width:100%">
                            </div>
                          </template>
                          <div class="uip-width-medium uip-text-s">
                           <button class="uip-button-default" @click="addNewGradCol()"><span class="uip-icon">add</span></button>
                          </div>
                        </div>
                      </div>
                    <button class="uip-button-default" @click="applyGradient()">{{strings.applyGradient}}</button>
                  </div>
                  <!--End grad options-->
                </div>
                <!--End Gradient -->
              
              </div>
            </template>
          
        </dropdown>
      `,
  };
}
