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
        darkToggle: this.returnSetting(),
      };
    },
    inject: ['uipData', 'uipress', 'uiTemplate'],
    watch: {
      'block.settings.block.options.prefersColorScheme.value': {
        handler(newValue, oldValue) {
          this.checkAutoDark();
        },
        deep: true,
      },
      'uipData.userPrefs.darkTheme': {
        handler(newValue, oldValue) {
          this.setTheme();
          this.uipress.saveUserPreference('darkTheme', newValue, false);
        },
        deep: true,
      },
    },
    mounted: function () {
      this.checkAutoDark();
      this.setTheme();
    },
    computed: {},
    methods: {
      returnSetting() {
        if (this.uipData.userPrefs.darkTheme) {
          return true;
        } else {
          return false;
        }
      },
      setTheme() {
        let theme = 'light';
        if (this.uipData.userPrefs.darkTheme) {
          theme = 'dark';
          this.uipData.userPrefs.darkTheme = true;
        } else {
          this.uipData.userPrefs.darkTheme = false;
        }
        document.documentElement.setAttribute('data-theme', theme);
        let frames = document.getElementsByClassName('uip-page-content-frame');
        if (frames[0]) {
          for (const iframe of frames) {
            if (iframe.contentWindow.document.documentElement) {
              iframe.contentWindow.document.documentElement.setAttribute('data-theme', theme);
            }
          }
        }
      },
      checkAutoDark() {
        let userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        let blockSetting = this.block.settings.block.options.prefersColorScheme.value;
        if (userPrefersDark && blockSetting) {
          this.uipData.userPrefs.darkTheme = true;
        } else if (blockSetting) {
          this.uipData.userPrefs.darkTheme = false;
        }
      },
    },
    template: `
          <label class="uip-dark-switch uip-overflow-hidden">
            <input type="checkbox" v-model='uipData.userPrefs.darkTheme' >
            <span class="uip-slider"></span>
          </label>
          `,
  };
}
