const { __, _x, _n, _nx } = wp.i18n;
export default {
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
  inject: ["uiTemplate"],
  created() {
    this.mountEventListeners();
  },
  onUnmounted() {
    document.removeEventListener("uipress/app/page/load/start", this.handlePageLoadStart);
    document.removeEventListener("uipress/app/page/load/finish", this.handlePageLoadEnd);
  },
  computed: {
    /**
     * Returns whether the frame is loading. If in builder and not preview will always return true
     *
     * @returns {boolean}  - whether to show loader
     * @since 3.2.13
     */
    isLoading() {
      if (this.uiTemplate.isPreview || this.uiTemplate.display == "prod") {
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
      let temp = this.get_block_option(this.block, "block", "loaderImage");
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
      document.addEventListener("uipress/app/page/load/start", this.handlePageLoadStart);
      document.addEventListener("uipress/app/page/load/finish", this.handlePageLoadEnd);
    },

    /**
     * Handles page load start
     *
     * @since 3.2.13
     */
    handlePageLoadStart() {
      this.loading = true;

      // Add a timeout to stop loading automatically
      setTimeout(() => {
        this.loading = false;
      }, 2000);
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
