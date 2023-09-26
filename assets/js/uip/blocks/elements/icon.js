const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data() {
      return {};
    },
    inject: ['uipress'],
    computed: {
      /**
       * Returns icon for button
       *
       * @since 3.2.13
       */
      returnIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'iconSelect');
        if (!icon) return '';
        if (!this.uipress.isObject(icon)) return icon;
        if (icon.value) return icon.value;
        return '';
      },
    },
    template: `
        <div class="uip-icon uip-text-l">
          {{returnIcon}}
        </div>
        `,
  };
}
