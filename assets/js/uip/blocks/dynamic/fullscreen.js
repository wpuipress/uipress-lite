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
    inject: ['uipData', 'uipress'],
    computed: {
      /**
       * Returns text for button if exists
       *
       * @since 3.2.13
       */
      returnText() {
        let item = this.uipress.get_block_option(this.block, 'block', 'buttonText', true);
        if (!item) return '';

        if (!this.uipress.isObject(item)) return item;
        if (item.string) return item.string;
        return '';
      },
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

      /**
       * Returns the reverse class if icon position is right
       *
       * @since 3.2.13
       */
      returnClasses() {
        const position = this.uipress.get_block_option(this.block, 'block', 'iconPosition');
        if (!position) return;
        if (!this.uipress.isObject(position) && position == 'right') return 'uip-flex-reverse';
        if (position.value && position.value == 'right') return 'uip-flex-reverse';
      },
    },
    methods: {
      /**
       * Sets fullscreen mode
       *
       * @since 3.2.13
       */
      openFullScreen() {
        const frame = document.querySelector('.uip-content-frame');
        if (!frame) return;

        frame.classList.add('uip-fullscreen-mode');
        frame.classList.add('uip-scale-in-bottom-right');
      },
    },
    template: `
    
          <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center"
          :class="returnClasses" @click="openFullScreen()">
          
            <span class="uip-icon" v-if="returnIcon">{{returnIcon}}</span>
            <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
            
          </button>
          `,
  };
}
