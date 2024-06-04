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
     * Returns text for button if exists
     *
     * @since 3.2.13
     */
    returnText() {
      let item = this.get_block_option(this.block, 'block', 'buttonText', true);
      if (!item) return '';

      if (!this.isObject(item)) return item;
      if (item.string) return item.string;
      return '';
    },
    /**
     * Whether to open in new tab
     *
     * @since 3.2.13
     */
    newTab() {
      let tab = this.get_block_option(this.block, 'block', 'openInNewTab');
      return tab;
    },

    /**
     * Whether to open widthout uipress
     *
     * @since 3.2.13
     */
    withoutUiPress() {
      let tab = this.get_block_option(this.block, 'block', 'openWithoutUiPress');
      return tab;
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
     * Opens the current page outside the frame
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async openFramedContent() {
      const uid = this.createUID();
      const openInNewTab = this.newTab;
      const frame = document.querySelector('.uip-page-content-frame');

      // No iframe to open from so bail
      if (!frame) return;

      const currentURL = frame.contentWindow.location.href;
      const url = new URL(currentURL);

      const newTabOpen = (newurl) => {
        this.$refs.newTab.href = newurl.href;
        this.$refs.newTab.click();
        this.$refs.newTab.href = '';
        this.$refs.newTab.blur();
      };

      // If its not a request to open without uiPress then we can perform a link click
      if (!this.withoutUiPress) {
        // Set new tab attributes and click
        if (openInNewTab) newTabOpen(url);
        // no new tab so just refresh the page
        if (!openInNewTab) window.location = url.href;
        return;
      }

      url.searchParams.set('uipwf', uid);
      url.searchParams.set('uip-framed-page', '0');

      let formData = new FormData();
      formData.append('action', 'uip_create_frame_switch');
      formData.append('security', uip_ajax.security);
      formData.append('uid', uid);

      // Await the server to mark the link as requiring no frame
      await this.sendServerRequest(uip_ajax.ajax_url, formData);

      // Set new tab attributes and click
      if (openInNewTab) newTabOpen(url);
      // no new tab so just refresh the page
      if (!openInNewTab) window.location = url.href;
    },
  },
  template: `
    
            <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center"
            :class="returnClasses" @click="openFramedContent()">
            
              <span class="uip-icon" v-if="returnIcon">{{returnIcon}}</span>
              <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
              <a ref="newTab" target="_BLANK" class="uip-hidden"></a>
              
            </button>
            
            `,
};
