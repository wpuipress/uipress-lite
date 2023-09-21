const { __, _x, _n, _nx } = wp.i18n;
export function fetchBlocks() {
  return [
    /**
     * Text input block
     * @since 3.0.0
     */
    {
      name: __('WC charts', 'uipress-pro'),
      moduleName: 'uip-woocommerce-analytics-charts',
      description: __('Outputs your choice of order data from woocommerce as a chart', 'uipress-lite'),
      group: 'storeanalytics',
      icon: 'bar_chart',
    },
    {
      name: __('WC tables', 'uipress-pro'),
      moduleName: 'uip-woocommerce-analytics-tables',
      description: __('Outputs your choice of order data from woocommerce as a table', 'uipress-lite'),
      group: 'storeanalytics',
      icon: 'table_chart',
    },
    {
      name: __('WC map', 'uipress-pro'),
      moduleName: 'uip-woocommerce-analytics-map',
      description: __('Outputs order data from woocommerce as a interactive map', 'uipress-lite'),
      group: 'storeanalytics',
      icon: 'map',
    },
  ];
}
