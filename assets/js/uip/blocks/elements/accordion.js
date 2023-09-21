const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {};
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    computed: {
      returnText() {
        let item = this.uipress.get_block_option(this.block, 'block', 'headingText', true);
        if (!item) {
          return '';
        }
        if (this.uipress.isObject(item)) {
          if ('string' in item) {
            return item.string;
          } else {
            return '';
          }
        }
        return item;
      },
      returnDropStyles() {
        let options = this.uipress.checkNestedValue(this.block, ['settings', 'contentStyle', 'options']);

        if (!options) {
          return;
        }
        let styles = this.uipress.explodeSpecificBlockSettings(options, 'style', this.uipData.templateDarkMode, null, 'flexLayout');

        if (typeof styles == 'undefined') {
          return '';
        }
        if (styles.includes('display:grid;')) {
          this.forceFlex = true;
        } else {
          this.forceFlex = false;
        }
        return styles;
      },
    },
    methods: {
      returnIconPos() {
        if (this.block.settings.block.options.iconPosition.value) {
          if (this.block.settings.block.options.iconPosition.value.value == 'right') {
            return 'uip-flex-reverse';
          }
        }
      },
    },
    template: `
          <accordion :openOnTick="false">
            <template v-slot:title>
              <div class="uip-flex-grow uip-flex uip-gap-xxs uip-flex-center">
                <div class="uip-icon" v-if="block.settings.block.options.iconSelect.value.value">{{block.settings.block.options.iconSelect.value.value}}</div>
                <div class="uip-">{{returnText}}</div>
              </div>
            </template>
            <template v-slot:content>
              <uip-content-area :dropAreaStyle="returnDropStyles" class="uip-accordion-body"
              :content="block.content" :returnData="function(data) {block.content = data} "></uip-content-area>
            </template>
          </accordion>
        `,
  };
}
