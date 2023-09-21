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
        searchString: '',
        loading: false,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    created: function () {
      let self = this;
      //Mount watcher for page changes
      document.addEventListener(
        'uip_page_change_started',
        (e) => {
          self.loading = true;
        },
        { once: false }
      );
      //Mount watcher for page load
      document.addEventListener(
        'uip_page_change_loaded',
        (e) => {
          self.loading = false;
        },
        { once: false }
      );
    },
    computed: {
      isLoading() {
        if (this.uiTemplate.isPreview || this.uiTemplate.display == 'prod') {
          return this.loading;
        }
        return true;
      },
      getImage() {
        let temp = this.uipress.get_block_option(this.block, 'block', 'loaderImage');
        if (this.uipress.isObject(temp)) {
          if ('url' in temp) {
            return temp.url;
          }
          return false;
        }
        return false;
      },
    },
    methods: {},
    template: `
              <img v-if="getImage && isLoading" :src="getImage">
              <div ref="loader" class="uip-ajax-loader uip-position-relative uip-w-100p" v-else-if="isLoading">
                <div class="uip-loader-bar"></div>
              </div>
              `,
  };
}
