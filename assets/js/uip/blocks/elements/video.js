const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data: function () {
    return {};
  },

  computed: {
    /**
     * Returns video URL
     *
     * @since 3.2.13
     */
    returnVideo() {
      const video = this.get_block_option(this.block, "block", "videoURL");
      if (!video) return;
      return video;
    },

    /**
     * Returns youtube video URL
     *
     * @since 3.2.13
     */
    returnYoutube() {
      const video = this.get_block_option(this.block, "block", "youtube");
      if (!video) return;
      return video;
    },

    /**
     * Returns video tag
     *
     * @since 3.2.0
     */
    returnVideoTag() {
      const url = this.returnVideo ? this.returnVideo : "";
      return url.includes("vimeo") || url.includes("youtu") ? "iframe" : "video";
    },
  },
  template: `
              <component :is="returnVideoTag" v-if="returnVideo" :src="returnVideo" class="uip-video uip-h-100 uip-w-300 uip-display-block" controls playsinline hidden/>
              <div v-else-if="returnYoutube" v-html="returnYoutube" class="uip-video"></div>
            `,
};
