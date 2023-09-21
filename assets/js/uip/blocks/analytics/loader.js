const { __, _x, _n, _nx } = wp.i18n;
export function fetchBlocks() {
  return [
    /**
     * Text input block
     * @since 3.0.0
     */
    {
      name: __('GA charts', 'uipress-pro'),
      moduleName: 'uip-google-analytics',
      description: __('Outputs your choice of charts and options on what data to display', 'uipress-pro'),
      category: __('Analytics', 'uipress-pro'),
      group: 'analytics',
      icon: 'bar_chart',
    },
    /**
     * Text input block
     * @since 3.0.0
     */
    {
      name: __('GA tables', 'uipress-pro'),
      moduleName: 'uip-google-analytics-tables',
      description: __('Outputs your choice of tables and options on what data to display', 'uipress-pro'),
      category: __('Analytics', 'uipress-pro'),
      group: 'analytics',
      icon: 'table_chart',
    },

    /**
     * Text input block
     * @since 3.0.0
     */
    {
      name: __('GA realtime', 'uipress-pro'),
      moduleName: 'uip-google-realtime',
      description: __('Displays live visitor data about your site', 'uipress-pro'),
      category: __('Analytics', 'uipress-pro'),
      group: 'analytics',
      icon: 'schedule',
    },
    {
      name: __('GA map', 'uipress-pro'),
      moduleName: 'uip-google-analytics-map',
      description: __('Outputs your visitor data to a interactive map', 'uipress-pro'),
      category: __('Analytics', 'uipress-pro'),
      group: 'analytics',
      icon: 'map',
    },
  ];
}
