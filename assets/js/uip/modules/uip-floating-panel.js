export function moduleData() {
  return {
    props: {
      closeRoute: String,
      constrainHeight: Boolean,
    },
    data: function () {
      return {
        loading: true,
      };
    },
    mounted: function () {},
    computed: {
      returnClass() {
        if (this.constrainHeight) {
          return 'uip-h-100p';
        }
      },
    },
    methods: {
      closeOffcanvas() {
        let self = this;
        self.$router.push(self.closeRoute);
      },
    },

    template: `
	  
	  <component is="style"> #wpadminbar{z-index:8;}#adminmenuwrap{z-index:7;} </component>
	  
	  <div
		ref="offCanvasCover"
		class="uip-position-fixed uip-w-100p uip-top-0 uip-bottom-0 uip-text-normal uip-flex uip-fade-in uip-transition-all"
		style="background:rgba(0,0,0,0.3);z-index:9;top:0;left:0;right:0;max-height:100%;backdrop-filter: blur(1px);"
	  >
		<!-- MODAL GRID -->
		<div class="uip-flex uip-w-100p uip-h-100p" :class="returnClass">
		  
		  <div class="uip-flex-grow" @click="closeOffcanvas()"></div>
		  <div ref="offCanvasBody" class="uip-w-500 uip-border-box uip-offcanvas-panel uip-position-relative uip-padding-s uip-padding-right-remove uip-margin-right-s" style="max-height: 100%;min-height: 100%;height:100%">
	  
			<div class="uip-flex uip-slide-in-right uip-background-default uip-overflow-hidden uip-border-rounder uip-position-relative uip-shadow uip-border uip-border-box uip-h-100p uip-position-relative" style="max-height: 100%;min-height: 100%;height:100%">
			  
			  <div class="uip-position-absolute uip-top-0 uip-padding-m uip-right-0 uip-z-index-1">
				<span @click="closeOffcanvas()" class="uip-icon uip-padding-xxs uip-border-round hover:uip-background-grey uip-cursor-pointer uip-link-muted uip-text-l"> close </span>
			  </div>
	  
			  <div class="uip-position-relative uip-h-100p uip-flex uip-w-100p uip-flex uip-max-h-100p uip-flex uip-flex-column uip-h-100p uip-max-h-100p">
				<slot></slot>
			  </div>
			  
			</div>
			
		  </div>
		  
		</div>
		
	  </div>
			  
			  
			  
			  `,
  };
  return compData;
}
