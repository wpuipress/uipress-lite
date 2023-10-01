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
  inject: ['uipress'],
  computed: {
    /**
     * Returns text for button if exists
     *
     * @since 3.2.13
     */
    returnText() {
      const item = this.get_block_option(this.block, 'block', 'paragraph', true);
      if (!item) return '';

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return '';
    },
  },
  template: `
          <div class="uip-paragraph-block" v-html="returnText">
          </div>
          `,
};
