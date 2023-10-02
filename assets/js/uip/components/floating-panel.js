export default {
  props: {
    closeRoute: String,
    constrainHeight: Boolean,
    id: String,
  },
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    /**
     * Returns max height if set
     *
     * @since 3.2.13
     */
    returnClass() {
      if (this.constrainHeight) return 'uip-h-100p';
    },
  },
  methods: {
    /**
     * Closes the floating panel
     *
     * @since 3.2.13
     */
    close() {
      this.$router.push(this.closeRoute);
    },
  },

  template: `
	  
	  
	  
	  <div
		ref="offCanvasCover"
		class="uip-position-fixed uip-w-100p uip-top-0 uip-bottom-0 uip-text-normal uip-flex uip-fade-in uip-transition-all"
		style="background:rgba(0,0,0,0.3);z-index:9;top:0;left:0;right:0;max-height:100%;backdrop-filter: blur(1px);"
	  >
	  	<component is="style"> #wpadminbar{z-index:8;}#adminmenuwrap{z-index:7;} </component>
		  
		<!-- MODAL GRID -->
		<div class="uip-flex uip-w-100p uip-h-100p" :class="returnClass">
		  
		  <div class="uip-flex-grow" @click="close()"></div>
		  
		  <div ref="offCanvasBody" class="uip-w-500 uip-border-box uip-offcanvas-panel uip-position-relative uip-padding-s uip-padding-right-remove uip-margin-right-s" style="max-height: 100%;min-height: 100%;height:100%">
	  
			<div :id="id" class="uip-flex uip-slide-in-right uip-background-default uip-overflow-hidden uip-position-relative uip-shadow uip-border uip-border-box uip-h-100p uip-position-relative" style="max-height: 100%;min-height: 100%;height:100%;border-radius:calc(var(--uip-border-radius-large) + var(--uip-padding-xs));">
			  
	  
			  <div class="uip-position-relative uip-h-100p uip-flex uip-w-100p uip-flex uip-max-h-100p uip-flex uip-flex-column uip-h-100p uip-max-h-100p">
				<slot></slot>
			  </div>
			  
			</div>
			
		  </div>
		  
		</div>
		
	  </div>
			  
			  
			  
			  `,
};
