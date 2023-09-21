const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      returnData: Function,
      value: Object,
      blockSettings: Object,
    },
    data: function () {
      return {
        open: false,
        options: {
          direction: 'row',
          distribute: 'start',
          align: 'flex-start',
          wrap: 'wrap',
          type: 'stack',
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
        },
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
          minimumColumnWidth: __('Min col width', 'uipress-lite'),
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
        distribution: [
          {
            value: 'start',
            label: __('Start', 'uipress-lite'),
          },
          {
            value: 'center',
            label: __('Center', 'uipress-lite'),
          },
          {
            value: 'end',
            label: __('End', 'uipress-lite'),
          },
          {
            value: 'space-around',
            label: __('Space around', 'uipress-lite'),
          },
          {
            value: 'space-between',
            label: __('Space between', 'uipress-lite'),
          },
          {
            value: 'space-evenly',
            label: __('Space evenly', 'uipress-lite'),
          },
        ],
        alignments: {
          'flex-start': {
            value: 'flex-start',
            tip: __('Start', 'uipress-lite'),
            icon: 'align_vertical_top',
          },
          center: {
            value: 'center',
            tip: __('Center', 'uipress-lite'),
            icon: 'align_vertical_center',
          },
          end: {
            value: 'end',
            tip: __('End', 'uipress-lite'),
            icon: 'align_vertical_bottom',
          },
          stretch: {
            value: 'stretch',
            tip: __('Stretch', 'uipress-lite'),
            icon: 'expand',
          },
        },
        verticalAlignments: {
          'flex-start': {
            value: 'flex-start',
            tip: __('Start', 'uipress-lite'),
            icon: 'align_horizontal_left',
          },
          center: {
            value: 'center',
            tip: __('Center', 'uipress-lite'),
            icon: 'align_horizontal_center',
          },
          end: {
            value: 'end',
            tip: __('End', 'uipress-lite'),
            icon: 'align_horizontal_right',
          },
          stretch: {
            value: 'stretch',
            tip: __('Stretch', 'uipress-lite'),
            icon: 'expand',
          },
        },
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
        alignContent: {
          normal: {
            value: 'normal',
            label: __('Normal', 'uipress-lite'),
          },
          baseline: {
            value: 'baseline',
            label: __('Baseline', 'uipress-lite'),
          },
          center: {
            value: 'center',
            label: __('Center', 'uipress-lite'),
          },
          end: {
            value: 'end',
            label: __('End', 'uipress-lite'),
          },
          'space-around': {
            value: 'space-around',
            label: __('Space around', 'uipress-lite'),
          },
          'space-between': {
            value: 'space-between',
            label: __('Space between', 'uipress-lite'),
          },
          'space-evenly': {
            value: 'space-evenly',
            label: __('Space evenly', 'uipress-lite'),
          },
        },
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
    inject: ['uipress'],
    watch: {
      options: {
        handler(newValue, oldValue) {
          this.returnData(newValue);
        },
        deep: true,
      },
    },
    mounted: function () {
      this.formatValue(this.value);
    },
    computed: {
      returnAlignOptions() {
        if (this.options.direction == 'row') {
          return this.alignments;
        }
        return this.verticalAlignments;
      },
    },
    methods: {
      formatValue(value) {
        if (typeof value === 'undefined') {
          return;
        }
        if (this.uipress.isObject(value)) {
          this.options = { ...this.options, ...value };
          return;
        }
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
              
            <div class="uip-position-relative">
              <toggle-switch :options="returnAlignOptions" :activeValue="options.align" :returnValue="function(data){ options.align = data}"></toggle-switch>
            </div>
            
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
              
            <div class="uip-position-relative uip-flex uip-gap-xs">
              
              <input type="number" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.columns">
              
              <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
                <div class="uip-link-muted uip-icon uip-text-l" @click="options.columns = parseInt(options.columns) - 1">remove</div>
                <div class="uip-border-right"></div>
                <div class="uip-link-muted uip-icon uip-text-l" @click="options.columns = parseInt(options.columns) + 1">add</div>
              </div>
              
            </div>
            
          </div>
          
          
          <!--Rows -->
          <div v-if="!options.responsive"  class="uip-grid-col-1-3">
          
            <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.rows}}</span></div>
              
            <div class="uip-position-relative uip-flex uip-gap-xs">
              
              <input type="number" min="0" class="uip-input uip-remove-steps uip-background-remove uip-padding-xxxs uip-flex-grow" style="width: 30px;" v-model="options.rows">
              
              <div class="uip-padding-xxs uip-border-rounder uip-background-muted uip-flex uip-gap-xxs uip-no-text-select">
                <div class="uip-link-muted uip-icon uip-text-l" @click="options.rows = parseInt(options.rows) - 1">remove</div>
                <div class="uip-border-right"></div>
                <div class="uip-link-muted uip-icon uip-text-l" @click="options.rows = parseInt(options.rows) + 1">add</div>
              </div>
              
            </div>
            
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
        <div class="uip-grid-col-1-3">
        
          <div class="uip-text-muted uip-flex uip-flex-center uip-text-s"><span>{{strings.gap}}</span></div>
            
          <div class="uip-position-relative">
            <value-units :value="options.gap" :returnData="function(data){ options.gap = data }"></value-units>
          </div>
          
        </div>
        
        
      </div>`,
  };
}
