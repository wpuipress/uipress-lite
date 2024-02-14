const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from '../../../libs/vue-esm.js';

export default {
  components: {
    Confirm: defineAsyncComponent(() => import('../../v3.5/utility/confirm.min.js?ver=3.3.1')),
  },
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {};
  },
  
  watch: {},
  mounted: function () {},
  computed: {
    /**
     * Returns text for button if exists
     *
     * @since 3.2.13
     */
    returnText() {
      const item = this.get_block_option(this.block, 'block', 'buttonText', true);
      if (!item) return '';

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return '';
    },
    /**
     * Returns icon for button
     *
     * @since 3.2.13
     */
    returnIcon() {
      let icon = this.get_block_option(this.block, 'block', 'iconSelect');
      if (!icon) return '';
      if (!this.isObject(icon)) return icon;
      if (icon.value) return icon.value;
      return '';
    },

    /**
     * Returns the reverse class if icon position is right
     *
     * @since 3.2.13
     */
    returnClasses() {
      const position = this.get_block_option(this.block, 'block', 'iconPosition');
      if (!position) return;
      if (!this.isObject(position) && position == 'right') return 'uip-flex-reverse';
      if (position.value && position.value == 'right') return 'uip-flex-reverse';
    },
  },
  methods: {
    /**
     * Confirms if user wats to destroy the ui and return to default wp
     *
     * @since 3.2.13
     */
    async destroyUI() {
      const confirm = await this.$refs.confirm.show({
        title: __('Are you sure', 'uipress-lite'),
        message: __('This will remove the current UI and revert to the default admin page', 'uipress-lite'),
        okButton: __('Confirm', 'uipress-lite'),
      });

      // Response was go so destroy
      if (!confirm) return;

      document.documentElement.setAttribute('uip-core-app', 'false');
      let frame = document.querySelector('#uip-app-container');
      if (frame) frame.remove();
    },
  },
  template: `
          <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center"
         @click="destroyUI()" :returnClasses="returnClasses">
         
            <span class="uip-icon" v-if="returnIcon">{{returnIcon}}</span>
            <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
            <a ref="newTab" href="" target="_BLANK" style="display:hidden"></a>
            
            <Confirm ref="confirm"/>
            
          </button>
          `,
};
