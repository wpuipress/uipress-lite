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
        loading: true,
        dynamics: this.uipData.dynamicOptions,
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {},
    mounted: function () {},
    computed: {
      returnText() {
        let item = this.uipress.get_block_option(this.block, 'block', 'buttonText', true);
        if (!item) {
          return '';
        }
        if (this.uipress.isObject(item)) {
          if ('string' in item) {
            return item.string;
          } else {
            return '';
          }
        }
        return item;
      },
      newTab() {
        let tab = this.uipress.get_block_option(this.block, 'block', 'openInNewTab');
        if (!tab) {
          return false;
        }
        return tab;
      },
      withoutUiPress() {
        let tab = this.uipress.get_block_option(this.block, 'block', 'openWithoutUiPress');
        if (!tab) {
          return false;
        }
        return tab;
      },
      getIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'iconSelect');
        if (!icon) {
          return '';
        }
        if ('value' in icon) {
          return icon.value;
        }
        return icon;
      },
    },
    methods: {
      returnClasses() {
        let classes = '';

        let posis = this.uipress.get_block_option(this.block, 'block', 'iconPosition');
        if (posis) {
          if (posis.value == 'right') {
            classes += 'uip-flex-reverse';
          }
        }
        return classes;
      },
      openFramedContent() {
        let self = this;
        let uid = self.uipress.createUID();
        let openInNewTab = this.newTab;
        let frames = document.getElementsByClassName('uip-page-content-frame');
        let iFrame = false;
        if (frames[0]) {
          iFrame = frames[0];
        }

        if (!iFrame) {
          return;
        }

        let currentURL = iFrame.contentWindow.location.href;
        let url = new URL(currentURL);

        if (!this.withoutUiPress) {
          if (openInNewTab) {
            this.$refs.newTab.href = url.href;
            this.$refs.newTab.click();
            this.$refs.newTab.href = '';
            this.$refs.newTab.blur();
          } else {
            window.location = url.href;
          }
          return;
        }

        url.searchParams.set('uipwf', uid);
        url.searchParams.set('uip-framed-page', '0');

        let formData = new FormData();
        formData.append('action', 'uip_create_frame_switch');
        formData.append('security', uip_ajax.security);
        formData.append('uid', uid);

        self.uipress.callServer(uip_ajax.ajax_url, formData).then((response) => {
          let frames = document.getElementsByClassName('uip-page-content-frame');
          if (frames[0]) {
            if (openInNewTab) {
              this.$refs.newTab.href = url.href;
              this.$refs.newTab.click();
              this.$refs.newTab.href = '';
              this.$refs.newTab.blur();
            } else {
              window.location = url.href;
            }
          }
        });
      },
    },
    template: `
            <button class="uip-button-default uip-flex uip-gap-xxs uip-flex-center"
            :class="returnClasses()" @click="openFramedContent()">
              <span class="uip-icon" v-if="getIcon">{{getIcon}}</span>
              <span class="uip-flex-grow" v-if="returnText != ''">{{returnText}}</span>
              <a ref="newTab" target="_BLANK" class="uip-hidden"></a>
            </button>
            `,
  };
}
