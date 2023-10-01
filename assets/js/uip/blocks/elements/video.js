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
  inject: ['uipress'],
  computed: {
    /**
     * Returns video URL
     *
     * @since 3.2.13
     */
    returnVideo() {
      const video = this.get_block_option(this.block, 'block', 'videoURL');
      if (!video) return;
      return video;
    },

    /**
     * Returns youtube video URL
     *
     * @since 3.2.13
     */
    returnYoutube() {
      const video = this.get_block_option(this.block, 'block', 'youtube');
      if (!video) return;
      return video;
    },
  },
  template: `
            <div class="uip-flex">
              <video v-if="returnVideo" :src="returnVideo" class="uip-video uip-w-100p" controls playsinline hidden></video>
              <div v-if="returnYoutube" v-html="returnYoutube" class="uip-video"></div>
            </div>
            `,
};
