const { __, _x, _n, _nx } = wp.i18n;
import FlexDistribution from '../v3.5/lists/flex_distribution.min.js';
import FlexAlignContent from '../v3.5/lists/flex_align_content.min.js';
import FlexVerticalAlign from '../v3.5/lists/flex_vertical_align.min.js';
import FlexAlign from '../v3.5/lists/flex_align.min.js';
import { nextTick } from '../../libs/vue-esm.js';
export default {
  emits: ['update'],
  props: {
    value: Object,
    blockSettings: Object,
  },
  data() {
    return {
      open: false,
      updating: false,
      options: {},
      strings: {
        direction: __('Direction', 'uipress-lite'),
        distribute: __('Distribute', 'uipress-lite'),
        align: __('Align', 'uipress-lite'),
        wrap: __('Wrap', 'uipress-lite'),
        gap: __('Gap', 'uipress-lite'),
        type: __('Type', 'uipress-lite'),
        columns: __('Columns', 'uipress-lite'),
        rows: __('Rows', 'uipress-lite'),
        columnWidth: __('Column width', 'uipress-lite'),
        place: __('Place', 'uipress-lite'),
        minimumColumnWidth: __('Min width', 'uipress-lite'),
        responsive: __('Responsive', 'uipress-lite'),
      },
      layoutType: {
        stack: {
          value: 'stack',
          label: __('Stack', 'uipress-lite'),
        },
        grid: {
          value: 'grid',
          label: __('Grid', 'uipress-lite'),
        },
      },
      directions: {
        row: {
          value: 'row',
          icon: 'arrow_right_alt',
          tip: __('Horizontal', 'uipress-lite'),
        },
        column: {
          value: 'column',
          icon: 'height',
          tip: __('Vertical', 'uipress-lite'),
        },
      },
      distribution: FlexDistribution,
      alignments: FlexAlign,
      verticalAlignments: FlexVerticalAlign,
      flexWrap: {
        wrap: {
          value: 'wrap',
          label: __('Yes', 'uipress-lite'),
        },
        nowrap: {
          value: 'nowrap',
          label: __('No', 'uipress-lite'),
        },
      },
      alignContent: FlexAlignContent,
      responsiveOptions: {
        false: {
          value: false,
          label: __('No', 'uipress-lite'),
        },
        true: {
          value: true,
          label: __('Yes', 'uipress-lite'),
        },
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
     * Returns align options based on flex direction
     *
     * @since 3.2.13
     */
    returnAlignOptions() {
      if (this.options.direction == 'row') {
        return this.alignments;
      }
      return this.verticalAlignments;
    },

    /**
     * Returns default options
     *
     * @since 3.2.13
     */
    returnDefaultOptions() {
      return {
        direction: 'row',
        distribute: 'start',
        align: 'flex-start',
        wrap: null,
        type: null,
        placeContent: 'normal',
        gap: {
          value: 0,
          units: 'px',
        },
        columns: 2,
        rows: 2,
        columnWidth: {
          value: 200,
          units: 'px',
        },
        minColumnWidth: {
          value: 200,
          units: 'px',
        },
        responsive: false,
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
      <div class="uip-flex uip-flex-column uip-row-gap-xs">
        
        
        <!--Type -->
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.type}}</span></div>
            
          <div class="uip-position-relative">
            <toggle-switch :options="layoutType" :activeValue="options.type" :returnValue="function(data){ options.type = data}"></toggle-switch>
          </div>
          
        </div>
        
        
      
        <template v-if="options.type == 'stack'">
        
          
          <!--Direction -->
          <div class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.direction}}</span></div>
              
            <div class="uip-position-relative">
              <toggle-switch :options="directions" :activeValue="options.direction" :returnValue="function(data){ options.direction = data}"></toggle-switch>
            </div>
            
          </div>
          
          
          <!--Distribute-->
          <div class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.distribute}}</span></div>
              
            <div class="uip-position-relative">
              <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="options.distribute">
                <template v-for="item in distribution">
                  <option :value="item.value">{{item.label}}</option>
                </template>
              </select>
              
              
            </div>
            
          </div>
          
          <!--Align-->
          <div class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.align}}</span></div>
              
            <toggle-switch :options="returnAlignOptions" :activeValue="options.align" :returnValue="function(data){ options.align = data}"></toggle-switch>
            
            
          </div>
          
          
          <!--Place-->
          <div class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.place}}</span></div>
              
            <div class="uip-position-relative">
              <select class="uip-input-small uip-padding-top-xxxs uip-padding-bottom-xxxs uip-max-w-100p  uip-w-100p uip-border-rounder" style="padding-top:2px;padding-bottom:2px;border-radius:var(--uip-border-radius-large)" v-model="options.placeContent">
                <template v-for="item in alignContent">
                  <option :value="item.value">{{item.label}}</option>
                </template>
              </select>
            </div>
            
          </div>
          
          
          
          <!--Wrap-->
          <div class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.wrap}}</span></div>
              
            <div class="uip-position-relative">
              <toggle-switch :options="flexWrap" :activeValue="options.wrap" :returnValue="function(data){ options.wrap = data}"></toggle-switch>
            </div>
            
          </div>
          
        
        </template>
        
        
        <template v-if="options.type == 'grid'">
        
          <!--Responsive-->
          <div class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.responsive}}</span></div>
              
            <div class="uip-position-relative">
              <toggle-switch :options="responsiveOptions" :activeValue="options.responsive" :returnValue="function(data){ options.responsive = data}"></toggle-switch>
            </div>
            
          </div>
        
          <!--Columns -->
          <div class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.columns}}</span></div>
            
            <uip-number :value="options.columns" :returnData="(d)=>{options.columns=d}" :step="1"/>
            
          </div>
          
          
          <!--Rows -->
          <div v-if="!options.responsive"  class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.rows}}</span></div>
            
            <uip-number :value="options.rows" :returnData="(d)=>{options.rows=d}" :step="1"/>  
            
          </div>
          
          
          <!--Column width-->
          <div v-if="!options.responsive" class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.columnWidth}}</span></div>
              
            <div class="uip-position-relative">
              <value-units :value="options.columnWidth" :returnData="function(data){ options.columnWidth = data }"></value-units>
            </div>
            
          </div>
          
          
          
          <!--Minimum Column width-->
          <div v-if="options.responsive" class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.minimumColumnWidth}}</span></div>
              
            <div class="uip-position-relative">
              <value-units :value="options.minColumnWidth" :returnData="function(data){ options.minColumnWidth = data }"></value-units>
            </div>
            
          </div>
        
        </template>
        
        
        
        <!--Gap-->
        <div class="uip-grid-col-1-3"  v-if="options.type">
        
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.gap}}</span></div>
            
          <div class="uip-position-relative">
            <value-units :value="options.gap" :returnData="function(data){ options.gap = data }"></value-units>
          </div>
          
        </div>
        
        
      </div>`,
};
