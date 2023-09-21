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
      returnQuote() {
        let item = this.uipress.get_block_option(this.block, 'block', 'quote', true);
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
      returnAuthor() {
        let item = this.uipress.get_block_option(this.block, 'block', 'quoteAuthor', true);
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
    },
    methods: {},
    template: `
            <div >
              <div class="uip-text-xxl uip-text-bold uip-block-quote uip-margin-bottom-m uip-text-italic uip-text-emphasis">{{returnQuote}}</div>
              <div class="uip-quote-meta uip-text-muted">— {{returnAuthor}}</div>
            </div>
            `,
  };
}
