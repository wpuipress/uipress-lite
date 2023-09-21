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
        breadCrumbs: [
          { name: this.uipData.options.site_name, url: this.uipData.options.domain },
          { name: __('Admin', 'uipress-lite'), url: this.uipData.options.adminURL },
        ],
      };
    },
    inject: ['uipress', 'uipData'],
    watch: {},
    mounted: function () {
      let self = this;
      document.addEventListener(
        'uip_breadcrumbs_change',
        (e) => {
          self.breadCrumbs = e.detail.crumbs;
        },
        { once: false }
      );
    },
    computed: {},
    methods: {
      getIcon() {
        let icon = this.uipress.get_block_option(this.block, 'block', 'breadIcon');
        if (!icon) {
          return 'chevron_right';
        }
        if ('value' in icon) {
          return icon.value;
        }
        return icon;
      },
    },
    template: `
        <div class="uip-flex uip-gap-xxxs uip-flex-center">
        
            <template v-for="(item, index) in breadCrumbs">
              <div @click="uipress.updatePage(item.url)" class="uip-link-default uip-crumb" v-html="item.name"></div>
              <div class="uip-icon uip-crumb-icon uip-text-muted" v-if="index < breadCrumbs.length - 1">{{getIcon()}}</div>
            </template>
            
        </div>`,
  };
}
