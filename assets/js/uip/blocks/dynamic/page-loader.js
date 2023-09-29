const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data() {
      return {
        loading: false,
      };
    },
    inject: ['uipress', 'uiTemplate'],
    created() {
      this.mountEventListeners();
    },
    onUnmounted() {
      document.removeEventListener('uip_page_change_started', this.handlePageLoadStart, { once: false });
      document.removeEventListener('uip_page_change_loaded', this.handlePageLoadEnd, { once: false });
    },
    computed: {
      /**
       * Returns whether the frame is loading. If in builder and not preview will always return true
       *
       * @returns {boolean}  - whether to show loader
       * @since 3.2.13
       */
      isLoading() {
        if (this.uiTemplate.isPreview || this.uiTemplate.display == 'prod') {
          return this.loading;
        }
        return true;
      },
      /**
       * Get's optional custom image to be used for loader
       *
       * @since 3.2.13
       */
      getImage() {
        let temp = this.uipress.get_block_option(this.block, 'block', 'loaderImage');
        if (!this.isObject(temp)) return false;
        if (temp.url) return temp.url;
        return false;
      },
    },
    methods: {
      /**
       * Mounts loading and end loading event listeners
       *
       * @since 3.2.13
       */
      mountEventListeners() {
        document.addEventListener('uip_page_change_started', this.handlePageLoadStart, { once: false });
        document.addEventListener('uip_page_change_loaded', this.handlePageLoadEnd, { once: false });
      },

      /**
       * Handles page load start
       *
       * @since 3.2.13
       */
      handlePageLoadStart() {
        this.loading = true;
      },

      /**
       * Handles page load event
       *
       * @since 3.2.13
       */
      handlePageLoadEnd() {
        this.loading = false;
      },
    },
    template: `
    
              <img v-if="getImage && isLoading" :src="getImage">
              
              <div ref="loader" class="uip-ajax-loader uip-position-relative uip-w-100p" v-else-if="isLoading">
                <div class="uip-loader-bar"></div>
              </div>
              
              `,
  };
}
