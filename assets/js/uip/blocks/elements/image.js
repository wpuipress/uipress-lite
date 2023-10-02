const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      error: false,
      currentImg: null,
    };
  },
  
  watch: {
    /**
     * Resets error state when image changes
     *
     * @since 3.2.13
     */
    'block.settings.block.options.userImage.url': {
      handler(newValue, oldValue) {
        this.error = false;
        this.setImage();
      },
      deep: true,
    },
  },
  created() {
    this.setImage();
  },
  computed: {
    /**
     * Returns the block image. Sets error state to true if no image
     *
     * @since 3.2.13
     */
    returnImg() {
      // If we are in an error state return
      if (this.error) return;

      this.error = false;
      let item = this.get_block_option(this.block, 'block', 'userImage', true);

      if (!this.isObject(item)) return (this.error = true);

      // Image has url attribute so return it
      if (!item.url) return (this.error = true);
      const img = item.url;

      // Stops server requests for dynamic image urls
      const pattern = /\{\{.*?\}\}/; // This regex matches strings of format {{anythingHere}}
      if (!pattern.test(img)) return img;
      this.error = true;
    },
  },
  methods: {
    /**
     * Sets an image from the current settings
     */
    setImage() {
      this.currentImg = this.returnImg;
    },

    /**
     * Sets the main error state when image fails to load
     *
     * @since 3.2.13
     */
    replaceWithDefault() {
      this.error = true;
    },
  },
  template: `
         <img v-if="!error" ref="imageblock" :src="returnImg" @error="replaceWithDefault()">
         <div v-else  class="uip-flex uip-flex-center uip-flex-middle uip-border uip-background-muted uip-w-200 uip-padding-s uip-ratio-16-10">
            <span class="uip-icon uip-text-xl uip-text-muted">image</span>
         </div>
    `,
};
