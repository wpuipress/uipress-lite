const { __, _x, _n, _nx } = wp.i18n;
import { defineAsyncComponent, nextTick } from "../../../libs/vue-esm.js";
export default {
  components: {
    virtualList: defineAsyncComponent(() => import("../utility/virtual-list.min.js?ver=3.3.1")),
  },
  props: {
    value: String,
    returnData: Function,
  },
  data() {
    return {
      search: "",
      icon: this.value,
      icons: [],
      strings: {
        search: __("Search", "seql"),
        viewAllIcons: __("View all icons on the", "seql"),
        materialSite: __("Material site", "seql"),
      },
    };
  },
  watch: {
    /**
     * Watches changes to icons and returns to caller
     *
     * @since 3.2.13
     */
    icon: {
      handler() {
        this.returnData(this.icon);
      },
    },
  },
  mounted() {
    this.setIcons();
  },
  computed: {
    /**
     * Returns icons with search
     *
     * @since 3.2.13
     */
    returnIcons() {
      if (!this.search) return this.icons;
      const st = this.search.toLowerCase();
      return this.icons.filter((element) => element.toLowerCase().includes(st));
    },
  },
  methods: {
    /**
     * Imports icons from icon list
     *
     * @returns {Promise}
     * @since 3.2.13
     */
    async setIcons() {
      const icons = await import("../lists/icons.min.js");
      this.icons = icons.default;
    },
  },

  template: `
  
	  <div class="uip-flex uip-flex-column uip-row-gap-s">
	
		<input class="uip-input" type="text" v-model="search" :placeholder="strings.search" autofocus>
		
		<virtualList :allItems="returnIcons" containerClass="uip-grid-col-3 uip-grid-gap-xs" :startRowHeight="80" :perRow="3">
		  
		  <template #item="{ item }">
		  
			  <div :class="{'uip-background-primary uip-dark-mode uip-text-inverse':icon==item, 'uip-background-muted uip-link-default':icon!=item}"
			  class="uip-border-rounder uip-padding-xxs uip-flex uip-flex-center uip-flex-middle uip-ratio-1-1 uip-transition-all uip-flex uip-fade-in" @click="icon = item">
				
				<div class="uip-flex uip-flex-column uip-row-gap-xs uip-flex-center uip-flex-middle uip-max-w-100p">
				
				  <span class="uip-icon uip-text-xl">{{ item }}</span>
				  <span class="uip-text-muted uip-text-xs uip-max-w-100p uip-overflow-auto uip-no-wrap uip-text-ellipsis">{{ item }}</span>
				
				</div>
				
			  </div>
			  
			
		  </template>
		  
		  
		</virtualList>
		
		<div class="uip-text-muted uip-text-s">{{strings.viewAllIcons}} <a href="https://fonts.google.com/icons" target="_BLANK">{{ strings.materialSite }}</a></div>
	
	  </div>
		`,
};
