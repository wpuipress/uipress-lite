const { __, _x, _n, _nx } = wp.i18n;
export function moduleData() {
  return {
    props: {
      display: String,
      name: String,
      block: Object,
    },
    data: function () {
      return {
        error: false,
        currentImg: false,
      };
    },
    inject: ['uipress'],
    watch: {
      'block.settings.block.options.userImage.url': {
        handler(newValue, oldValue) {
          if (newValue != this.currentImg) {
            this.error = false;
          }
        },
        deep: true,
      },
    },
    mounted: function () {
      this.currentImg = this.uipress.checkNestedValue(this.block, ['settings', 'block', 'options', 'userImage', 'url']);
    },
    computed: {
      returnImg() {
        if (this.error) {
          return;
        }
        this.error = false;
        let item = this.uipress.get_block_option(this.block, 'block', 'userImage', true);
        if (!item) {
          this.error = true;
          return '';
        }
        if (this.uipress.isObject(item)) {
          if ('url' in item) {
            return item.url;
          } else {
            this.error = true;
            return '';
          }
        }
        return item;
      },
    },
    methods: {
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
}
