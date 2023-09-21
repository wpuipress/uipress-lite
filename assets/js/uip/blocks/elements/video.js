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
    inject: ['uipress'],
    watch: {},
    computed: {
      returnVideo() {
        let item = this.uipress.get_block_option(this.block, 'block', 'videoURL');
        if (!item) {
          return '';
        } else {
          return item;
        }
      },
      returnYoutube() {
        let item = this.uipress.get_block_option(this.block, 'block', 'youtube');
        if (!item) {
          return false;
        } else {
          return item;
        }
      },
    },
    methods: {},
    template: `
            <div class="uip-flex">\
              <video v-if="returnVideo" :src="returnVideo" class="uip-video uip-w-100p" controls playsinline hidden></video>\
              <div v-if="returnYoutube" v-html="returnYoutube" class="uip-video"></div>
            </div>
            `,
  };
}
