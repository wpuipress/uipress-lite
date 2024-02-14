const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data() {
    return {
      darkToggle: this.returnSetting,
    };
  },
  watch: {
    "block.settings.block.options.prefersColorScheme.value": {
      handler(newValue, oldValue) {
        this.checkAutoDark();
      },
      deep: true,
    },
    "uipApp.data.userPrefs.darkTheme": {
      handler(newValue, oldValue) {
        this.setTheme();
        this.saveUserPreference("darkTheme", newValue, false);
      },
      deep: true,
    },
  },
  mounted() {
    this.checkAutoDark();
    this.setTheme();
  },
  computed: {
    /**
     * Returns whether the current pref is dark or light
     *
     * @since 3.2.13
     */
    returnSetting() {
      const userPref = this.uipApp.data.userPrefs.darkTheme;
      if (userPref) return true;
      return false;
    },

    /**
     * Returns whether auto detect color mode is enabled
     *
     * @since 3.2.13
     */
    returnAutoDetect() {
      const auto = this.get_block_option(this.block, "block", "prefersColorScheme", true);
      if (!auto) return;

      if (!this.isObject(auto)) return auto;
      if (auto.value) return auto.value;
    },
  },
  methods: {
    /**
     * Sets theme for iframes
     *
     * @since 3.2.13
     */
    setTheme() {
      const darkTheme = this.uipApp.data.userPrefs.darkTheme;
      const theme = darkTheme ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", theme);
      const frames = document.querySelectorAll("iframe");

      // No iframes to update so bail
      if (!frames) return;

      // Update all iframes with data theme tag
      for (const iframe of frames) {
        const head = iframe.contentWindow.document.documentElement;
        if (!head) continue;
        head.setAttribute("data-theme", theme);
      }
    },

    /**
     * Checks if auto detect 'prefers color scheme' is enabled and sets dark mode
     *
     * @since 3.2.13
     */
    checkAutoDark() {
      const userPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const autoEnabled = this.returnAutoDetect;

      // Feature is disabled so exit
      if (!autoEnabled) return;

      const state = userPrefersDark ? true : false;
      this.uipApp.data.userPrefs.darkTheme = state;
    },
  },
  template: `
    
          <label class="uip-dark-switch uip-overflow-hidden">
            <input type="checkbox" v-model='uipApp.data.userPrefs.darkTheme' >
            <span class="uip-slider"></span>
          </label>
          
          `,
};
