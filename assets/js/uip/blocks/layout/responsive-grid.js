const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
      contextualData: Object,
    },
    data: function () {
      return {};
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    computed: {},
    methods: {
      returnContentAreaStyles() {
        let styles = this.uipress.explodeBlockSettings(this.block.settings.block.options, 'style', this.uipData.templateDarkMode);

        let columnCount = this.block.settings.block.options.columnsNum.value;

        if (columnCount == '') {
          columnCount = 3;
        }

        let columnMinWidthValue = this.block.settings.block.options.minWidth.value.value;
        let columnMinWidthUnits = this.block.settings.block.options.minWidth.value.units;

        let rowGapValue = this.block.settings.block.options.gridGap.value.value;
        let rowGapUnits = this.block.settings.block.options.gridGap.value.units;

        //Set defaults if values haven't been set
        if (rowGapValue == '' || columnMinWidthValue == '') {
          rowGapValue = 1;
          rowGapUnits = 'rem';
          columnMinWidthValue = 25;
          columnMinWidthUnits = '%';
        }

        let gridStyles = '';

        gridStyles += '--grid-layout-gap: ' + rowGapValue + rowGapUnits + ';';
        gridStyles += '--grid-column-count: ' + columnCount + ';';
        gridStyles += '--grid-item--min-width: ' + columnMinWidthValue + columnMinWidthUnits + ';';

        gridStyles += '--gap-count: calc(var(--grid-column-count) - 1);';
        gridStyles += '--total-gap-width: calc(var(--gap-count) * var(--grid-layout-gap));';
        gridStyles += '--grid-item--max-width: calc((100% - var(--total-gap-width)) / var(--grid-column-count));';

        gridStyles += 'align-items: flex-start;display: grid;';
        gridStyles += 'grid-template-columns: repeat(auto-fill, minmax(max(var(--grid-item--min-width), var(--grid-item--max-width)), 1fr));';
        gridStyles += 'grid-gap: var(--grid-layout-gap);grid-auto-rows: min-content;';

        return styles + gridStyles;
      },
    },
    template: `
        <uip-content-area :contextualData="contextualData" :style="returnContentAreaStyles()"
        :content="block.content" :returnData="function(data) {block.content = data} " ></uip-content-area>`,
  };
}
