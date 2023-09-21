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
      returnText() {
        let item = this.uipress.get_block_option(this.block, 'block', 'headingText', true);
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
      getHeadingType() {
        let type = this.uipress.get_block_option(this.block, 'block', 'headingType');
        if (!type) {
          return 'h2';
        }
        return type;
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
    template: `
          <component :is="getHeadingType()"  
          class="uip-flex uip-gap-xxs uip-flex-center"
          :class="returnClasses()" >
            <span class="uip-icon" v-if="getIcon()">
              {{getIcon()}}
            </span>
            <span v-if="returnText != ''">{{returnText}}</span>
          </component>
          `,
  };
}
