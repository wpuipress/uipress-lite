const { __, _x, _n, _nx } = wp.i18n;

export default {
  props: {
    backgroundStyle: String,
    text: String,
    remove: Function,
  },
  data() {
    return {
      strings: {
        add: __("Add", "uipress-lite"),
      },
    };
  },
  template: `
  
	<div class="uip-background-muted uip-border-rounder uip-padding-xxs uip-flex uip-flex-center uip-gap-xs uip-cursor-pointer">
	
	  <div class="uip-background-grey uip-background-checkered uip-border-round">
		<div class="uip-border-round uip-padding-xxxs uip-w-14 uip-ratio-1-1 user-style-area"
		:style="backgroundStyle">
		</div>
	  </div>
	  
	  <div v-if="!text" class="uip-text-muted uip-flex-grow">{{strings.add}}...</div>
	  
	  <div v-else class="uip-no-wrap uip-text-ellipsis uip-overflow-hidden uip-w-80 uip-flex-grow">{{ text }}</div>
	  
	  
	  <a v-if="remove && text" @click.stop.prevent="remove()"
	  class="uip-no-underline uip-border-rounder uip-padding-xxxs uip-link-muted uip-text-s">
		<span class="uip-icon">close</span>
	  </a>
	  
	</div>
		`,
};
