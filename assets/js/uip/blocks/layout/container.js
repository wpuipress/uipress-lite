const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
      contextualData: Object,
      ogBlock: Object,
    },
    data: function () {
      return {
        icon: 'view_week',
        forceFlex: false,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      'block.settings.block.options': {
        handler(newValue, oldValue) {},
        deep: true,
      },
    },
    computed: {
      returnDropStyles() {
        let options = this.uipress.checkNestedValue(this.block, ['settings', 'style', 'options']);

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
      returnStyles() {
        if (this.forceFlex) {
          return 'display: flex !important;';
        }
      },
    },
    methods: {},
    template: `
          <uip-content-area :contextualData="contextualData" class="uip-min-w-20 uip-min-h-20"
          :content="block.content" :returnData="function(data) {block.content = data} " ></uip-content-area>
          `,
  };
}
