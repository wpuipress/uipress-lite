/**
 * Toggle section
 *
 * @since 3.2.13
 */
export default {
  props: {
    title: String,
    startOpen: Boolean,
  },
  data() {
    return {
      open: false,
    };
  },
  mounted() {
    if (this.startOpen) this.open = true;
  },
  computed: {
    /**
     * Returns the icon depending on open status
     *
     * @since 3.2.13
     */
    returnVisibilityIcon() {
      return this.open ? 'expand_more' : 'chevron_left';
    },
  },
  methods: {
    /**
     * Toggles section visibility
     *
     * @since 3.2.13
     */
    toggleVisibility() {
      this.open = !this.open;
    },
  },
  template: `
  
	<div class="uip-flex uip-flex-column uip-row-gap-s">
	
	  <!-- Title -->
	  <div class="uip-flex uip-gap-s uip-flex-center uip-flex-between">
		
	   
		<div class="uip-flex uip-gap-xxs uip-flex-center uip-cursor-pointer uip-flex-between uip-flex-grow"
		@click="toggleVisibility()">
		  
		  
		  <span class="uip-text-bold uip-text-emphasis" v-html="title"></span> 
		  
		  <a class="uip-link-default uip-icon">{{ returnVisibilityIcon }}</a>
		  
		  
		</div>
	  
	  </div>
	  
	  <div v-if="open" class="uip-padding-left-s">
		<slot></slot>
	  </div>
	  
	</div>
  
  `,
};
