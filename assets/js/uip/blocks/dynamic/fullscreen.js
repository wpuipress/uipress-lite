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
        return classes;
      },
      followLink() {
        let frames = document.getElementsByClassName('uip-content-frame');
        if (frames[0]) {
          frames[0].classList.add('uip-fullscreen-mode');
          frames[0].classList.add('uip-scale-in-bottom-right');
        }
      },
    },
    template: `
          <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center"
          :class="returnClasses()" @click="followLink()">
            <span class="uip-icon" v-if="getIcon">{{getIcon}}</span>
            <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
            <a ref="newTab" target="_BLANK" class="uip-hidden"></a>
          </button>
          `,
  };
}
