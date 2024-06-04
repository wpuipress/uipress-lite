const { __, _x, _n, _nx } = wp.i18n;
export default {
  props: {
    display: String,
    name: String,
    block: Object,
  },
  data: function () {
    return {
      breadCrumbs: [
        { name: this.uipApp.data.options.site_name, url: this.uipApp.data.options.domain },
        { name: __("Admin", "uipress-lite"), url: this.uipApp.data.options.adminURL },
      ],
    };
  },

  mounted() {
    this.mountWatchers();
  },
  beforeUnmount() {
    document.removeEventListener("uipress/app/breadcrumbs/update", this.handleCrumbs, { once: false });
  },
  computed: {
    /**
     * Returns icon separator for crumbs
     *
     * @since 3.2.13
     */
    returnIcon() {
      let icon = this.get_block_option(this.block, "block", "breadIcon");
      if (!icon) return "chevron_right";
      if (!this.isObject(icon)) return icon;
      if (icon.value) return icon.value;
      return "chevron_right";
    },
  },
  methods: {
    /**
     * Mounts event listeners
     *
     * @since 3.2.13
     */
    mountWatchers() {
      document.addEventListener("uipress/app/breadcrumbs/update", this.handleCrumbs, { once: false });
    },
    /**
     * Handles breadcrumb change events
     *
     * @param {Object} e - Crumb change event
     * @since 3.2.13
     */
    handleCrumbs(e) {
      this.breadCrumbs = e.detail.crumbs;
    },
  },
  template: `
    
        <div class="uip-flex uip-gap-xxxs uip-flex-center">
        
            <template v-for="(item, index) in breadCrumbs">
            
              <div @click="updateAppPage(item.url)" class="uip-link-default uip-crumb" v-html="item.name"></div>
              <div class="uip-icon uip-crumb-icon uip-text-muted" v-if="index < breadCrumbs.length - 1">{{returnIcon}}</div>
              
            </template>
            
        </div>
        
        `,
};
