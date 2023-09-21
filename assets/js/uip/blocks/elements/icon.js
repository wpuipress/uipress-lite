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
    computed: {
      getIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'iconSelect');
        let val = 'favorite';
        if (icon) {
          if (this.uipress.isObject(icon)) {
            if ('value' in icon) {
              val = icon.value;
            }
          }

          if (val == '') {
            val = 'favorite';
          }
        }

        return val;
      },
    },
    methods: {
      returnClasses() {
        let classes = '';

        let advanced = this.uipress.get_block_option(this.block, 'advanced', 'classes');
        classes += advanced;
        return classes;
      },
    },
    template: `
        <div class="uip-icon uip-text-l">
          {{getIcon}}
        </div>
        `,
  };
}
