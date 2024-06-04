const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {};
  },
  
  computed: {
    /**
     * Returns quote if exists
     *
     * @since 3.2.13
     */
    returnQuote() {
      const item = this.get_block_option(this.block, 'block', 'quote', true);
      if (!item) return '';

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return '';
    },

    /**
     * Returns quote author if exists
     *
     * @since 3.2.13
     */
    returnAuthor() {
      const item = this.get_block_option(this.block, 'block', 'quoteAuthor', true);
      if (!item) return '';

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return '';
    },
  },
  template: `
            <div >
            
              <div class="uip-text-xxl uip-text-bold uip-block-quote uip-margin-bottom-m uip-text-italic uip-text-emphasis">{{returnQuote}}</div>
              <div class="uip-quote-meta uip-text-muted">— {{returnAuthor}}</div>
              
            </div>
            `,
};
