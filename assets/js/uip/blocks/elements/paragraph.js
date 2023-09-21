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
    inject: ['uipress'],
    watch: {},
    mounted: function () {},
    computed: {
      returnText() {
        let item = this.uipress.get_block_option(this.block, 'block', 'paragraph');
        if (!item) {
          return '';
        }
        return item;
      },
    },
    methods: {},
    template: `
          <div class="uip-paragraph-block" v-html="returnText">
          </div>
          `,
  };
}
