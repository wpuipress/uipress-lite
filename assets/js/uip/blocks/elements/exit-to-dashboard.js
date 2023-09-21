const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {
        loading: true,
        dynamics: this.uipData.dynamicOptions,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    mounted: function () {},
    computed: {
      returnText() {
        let item = this.uipress.get_block_option(this.block, 'block', 'buttonText', true);
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
      getIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'iconSelect');
        if (!icon) {
          return '';
        }
        if ('value' in icon) {
          return icon.value;
        }
        return icon;
      },
    },
    methods: {
      returnClasses() {
        let classes = '';

        let posis = this.uipress.get_block_option(this.block, 'block', 'iconPosition');
        if (posis) {
          if (posis.value == 'right') {
            classes += 'uip-flex-reverse';
          }
        }
        let advanced = this.uipress.get_block_option(this.block, 'advanced', 'classes');
        classes += advanced;
        return classes;
      },
      destroyUI() {
        let url = false;

        this.uipress.confirm(__('Are you sure?', 'uipress-lite'), __('This will remove the current UI and revert to the default admin page', 'uipress-lite')).then((response) => {
          if (response) {
            document.documentElement.setAttribute('uip-core-app', 'false');

            let frame = document.getElementById('uip-app-container');

            if (frame) {
              frame.remove();
            }
          } else {
            return false;
          }
        });
      },
    },
    template: `
          <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center"
         @click="destroyUI()">
            <span class="uip-icon" v-if="getIcon">{{getIcon}}</span>
            <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
            <a ref="newTab" href="" target="_BLANK" style="display:hidden"></a>
          </button>
          `,
  };
}
