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
    watch: {},
    computed: {
      /**
       * Returns text for button if exists
       *
       * @since 3.2.13
       */
      returnText() {
        const item = this.uipress.get_block_option(this.block, 'block', 'headingText', true);
        if (!item) return '';

        if (!this.uipress.isObject(item)) return item;
        if (item.string) return item.string;
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

      /**
       * Returns heading tag
       *
       * @since 3.2.13
       */
      getHeadingType() {
        const type = this.uipress.get_block_option(this.block, 'block', 'headingType');
        if (!type) return 'h2';
        return type;
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
    },
    template: `
    
          <component :is="getHeadingType"  
          class="uip-flex uip-gap-xxs uip-flex-center"
          :class="returnClasses" >
          
            <span class="uip-icon" v-if="returnIcon">
              {{returnIcon}}
            </span>
            
            <span v-if="returnText != ''">{{returnText}}</span>
            
          </component>
          
          `,
  };
}
